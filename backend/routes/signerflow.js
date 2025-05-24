const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Public endpoint, so anon key is appropriate here

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for signerflow routes.');
  // Consider halting server start if Supabase isn't configured.
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/signerflow/:signerLinkID - Retrieve package details for the signer
router.get('/:signerLinkID', async (req, res) => {
  const { signerLinkID } = req.params;

  if (!signerLinkID) {
    return res.status(400).json({ error: 'Signer Link ID is required.' });
  }

  try {
    // Fetch the package details using signer_link_id
    // Join with profiles to get Pro's business name/logo
    // Join with agreements to get BoldSign document ID and status
    const { data: packageDetails, error: packageError } = await supabase
      .from('packages')
      .select(`
        id,
        name,
        status,
        document_request_details,
        payment_request_details,
        signer_link_id,
        pro_user_id,
        created_at,
        profiles (
          business_name,
          logo_url,
          contact_info 
        ),
        agreements (
          boldsign_document_id,
          status,
          original_file_name
        )
      `)
      .eq('signer_link_id', signerLinkID)
      .maybeSingle(); // Use maybeSingle as signerLinkID should be unique

    if (packageError) {
      console.error(`Error fetching package for signerLinkID ${signerLinkID}:`, packageError);
      return res.status(500).json({ error: `Failed to retrieve package details: ${packageError.message}` });
    }

    if (!packageDetails) {
      return res.status(404).json({ error: 'Package not found. The link may be invalid or expired.' });
    }

    // Structure the response for the signer's view
    // The 'profiles' join will return an object if pro_user_id matches an entry in profiles.
    // The 'agreements' join will return an array of agreements associated with the package.
    // Typically, for simple e-signature, there's one main agreement.
    
    const proProfile = packageDetails.profiles; // This will be an object or null
    const agreements = packageDetails.agreements; // This will be an array

    // Assuming one primary agreement document for now for simplicity in this response structure
    const primaryAgreement = agreements && agreements.length > 0 ? agreements[0] : null;

    const responsePayload = {
      packageName: packageDetails.name,
      packageStatus: packageDetails.status,
      proBusinessName: proProfile ? proProfile.business_name : 'N/A',
      proLogoUrl: proProfile ? proProfile.logo_url : null,
      proContactInfo: proProfile ? proProfile.contact_info : 'N/A', // Consider if this should be exposed
      
      // E-Signature details
      signatureRequired: !!primaryAgreement,
      boldsignDocumentId: primaryAgreement ? primaryAgreement.boldsign_document_id : null,
      agreementStatus: primaryAgreement ? primaryAgreement.status : null,
      originalFileName: primaryAgreement ? primaryAgreement.original_file_name : null,

      // Document Request details
      documentRequest: packageDetails.document_request_details, // e.g., { requested: true, document_name: "Proof of ID", description: "..." }
      
      // Payment Request details
      paymentRequest: packageDetails.payment_request_details, // e.g., { requested: true, amount: 50000, currency: "USD", description: "..." }

      // Other necessary IDs for frontend actions
      packageId: packageDetails.id, // Internal package ID for other API calls
      signerLinkID: packageDetails.signer_link_id, // For convenience
    };

    res.status(200).json(responsePayload);

  } catch (err) {
    console.error(`Unexpected error retrieving package for signerLinkID ${signerLinkID}:`, err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

// Multer setup for signer document uploads
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory to pass to Supabase Storage
const signerDocumentUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit, adjust as needed
  // Add fileFilter if specific file types are required for signer uploads
});

// POST /api/signerflow/:signerLinkID/upload-document - Signer uploads a requested document
router.post('/:signerLinkID/upload-document', signerDocumentUpload.single('requestedDocument'), async (req, res) => {
  const { signerLinkID } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Document file (requestedDocument) is required.' });
  }
  if (!signerLinkID) {
    return res.status(400).json({ error: 'Signer Link ID is required.' });
  }

  try {
    // 1. Verify signerLinkID and that document upload is expected
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('id, document_request_details, status')
      .eq('signer_link_id', signerLinkID)
      .single();

    if (pkgError || !pkg) {
      console.error(`Package not found for signerLinkID ${signerLinkID} during document upload:`, pkgError);
      return res.status(404).json({ error: 'Package not found or link is invalid.' });
    }

    if (pkg.status === 'completed' || pkg.status === 'declined' || pkg.status === 'revoked') {
        return res.status(403).json({ error: `Cannot upload documents for a package that is already ${pkg.status}.`});
    }

    const docRequestDetails = pkg.document_request_details;
    if (!docRequestDetails || !docRequestDetails.requested) {
      return res.status(400).json({ error: 'This package does not require document uploads or the request is improperly configured.' });
    }

    const packageId = pkg.id;

    // 2. Upload file to Supabase Storage
    const fileName = req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_'); // Sanitize filename
    const filePath = `packages/${packageId}/signer_uploads/${Date.now()}_${fileName}`;

    const { error: storageError } = await supabase.storage
      .from('package_documents') // Assuming a bucket named 'package_documents' or similar
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false, // Do not overwrite if file with same path exists (should be rare with timestamp)
      });

    if (storageError) {
      console.error(`Supabase Storage error uploading document for package ${packageId}:`, storageError);
      return res.status(500).json({ error: `Failed to upload document to storage: ${storageError.message}` });
    }

    // 3. Create record in uploaded_documents table
    const { data: uploadedDocRecord, error: dbError } = await supabase
      .from('uploaded_documents')
      .insert({
        package_id: packageId,
        // uploader_user_id: null, // Signer might not be a registered user
        file_name: req.file.originalname, // Store original filename for display
        storage_path: filePath,
        file_type: req.file.mimetype,
        // uploaded_at is handled by DB default
      })
      .select()
      .single();

    if (dbError) {
      console.error(`Supabase DB error creating uploaded_document record for package ${packageId}:`, dbError);
      // Attempt to delete the file from storage if DB record fails? (Compensating transaction)
      // await supabase.storage.from('package_documents').remove([filePath]);
      return res.status(500).json({ error: `Failed to record document upload: ${dbError.message}` });
    }
    
    // 4. Update package status (simplified: assumes one doc upload completes this step)
    // More complex logic if multiple specific documents are requested.
    // For now, let's assume a generic status update.
    // A more robust approach would be to check if all *expected* documents are uploaded.
    // This might involve storing details of requested documents and tracking their upload.
    // For this MVP, we'll update a general package status.
    
    let newPackageStatus = 'documents_uploaded'; // Custom status

    // Check if other steps (signing, payment) are also done to mark as 'completed'
    // This logic will be centralized in Part 5.
    // For now, just update based on this action.
    // const { data: updatedPackage, error: updatePkgError } = await updatePackageOverallStatus(packageId, supabase);
    // if (updatePkgError) {
    //   console.error(`Error updating package ${packageId} overall status after doc upload:`, updatePkgError);
    // } else {
    //   newPackageStatus = updatedPackage.status;
    // }
    
    // For now, a direct update. This will be refined by the overall status update logic.
    //  const { error: pkgStatError } = await supabase
    //     .from('packages')
    //     .update({ status: 'documents_pending_review' }) // Or a more specific status
    //     .eq('id', packageId);

    // if (pkgStatError) {
    //     console.error(`Error updating package status for ${packageId} after doc upload:`, pkgStatError.message);
    //     // Non-fatal for the upload itself, but needs monitoring.
    // }

    // Update overall package status
    const { updatePackageOverallStatus } = require('../services/packageService');
    let currentPackageStatus = pkg.status; // Default to original status before this upload
    try {
      const updatedPkg = await updatePackageOverallStatus(packageId);
      currentPackageStatus = updatedPkg.status;
    } catch (statusUpdateError) {
      console.error(`Error updating overall package status after document upload for ${packageId}:`, statusUpdateError);
    }


    res.status(201).json({
      message: 'Document uploaded successfully.',
      uploadedDocument: uploadedDocRecord,
      currentPackageStatus: currentPackageStatus // Reflect the potentially updated package status
    });

  } catch (err) {
    console.error(`Unexpected error during signer document upload for ${signerLinkID}:`, err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

// POST /api/signerflow/:signerLinkID/create-payment-session - Signer initiates a payment
router.post('/:signerLinkID/create-payment-session', async (req, res) => {
  const { signerLinkID } = req.params;
  // const { signerEmail } = req.body; // Optional: if you want to prefill email for Stripe customer

  if (!signerLinkID) {
    return res.status(400).json({ error: 'Signer Link ID is required.' });
  }

  try {
    // 1. Verify signerLinkID and that payment is expected
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('id, payment_request_details, status, name, pro_user_id') // Added pro_user_id for potential Stripe Connect usage later
      .eq('signer_link_id', signerLinkID)
      .single();

    if (pkgError || !pkg) {
      console.error(`Package not found for signerLinkID ${signerLinkID} during payment session creation:`, pkgError);
      return res.status(404).json({ error: 'Package not found or link is invalid.' });
    }
    
    if (pkg.status === 'completed' || pkg.status === 'declined' || pkg.status === 'revoked' || pkg.status === 'payment_complete') { // Assuming 'payment_complete' is a status
        return res.status(403).json({ error: `Payment cannot be processed for a package that is already ${pkg.status}.`});
    }

    const payReqDetails = pkg.payment_request_details;
    if (!payReqDetails || !payReqDetails.requested || !payReqDetails.amount || !payReqDetails.currency) {
      return res.status(400).json({ error: 'This package does not require payment or payment details are improperly configured.' });
    }

    const packageId = pkg.id;
    const { stripe } = require('../services/stripeService'); // Assuming stripe is exported from stripeService

    // 2. Create Stripe Checkout Session
    // For MVP, platform processes payment. No Stripe Connect for direct Pro payout yet.
    // Customer can be created on the fly by Stripe Checkout or you can create one if email is available.
    
    const lineItems = [{
        price_data: {
            currency: payReqDetails.currency.toLowerCase(), // Stripe expects lowercase currency
            product_data: {
                name: `Payment for: ${pkg.name}`,
                description: payReqDetails.description || `Package Payment: ${pkg.name}`,
                // images: [], // Optional product images
            },
            unit_amount: payReqDetails.amount, // Amount in cents
        },
        quantity: 1,
    }];

    const checkoutSessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // customer_email: signerEmail, // Optional: Pre-fill email on Stripe page
      metadata: {
        package_id: packageId,
        signer_link_id: signerLinkID,
        // pro_user_id: pkg.pro_user_id, // Useful for reconciliation or future direct payouts
        purchase_type: 'package_payment_by_signer', // Differentiate from other payments
      },
      success_url: `${process.env.FRONTEND_URL}/signer-package/${signerLinkID}?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/signer-package/${signerLinkID}?payment_status=cancelled`,
    };
    
    // If you want to create a Stripe customer for the signer first (e.g., if you have their email)
    // you could do that here and pass `customer: stripeCustomerId` to `checkoutSessionParams`.
    // For guest checkout, `customer_email` is often sufficient.

    const session = await stripe.checkout.sessions.create(checkoutSessionParams);

    res.status(200).json({ sessionId: session.id });

  } catch (err) {
    console.error(`Unexpected error creating payment session for ${signerLinkID}:`, err);
    // Check if it's a Stripe error and format it
    if (err.type && err.type.startsWith('Stripe')) {
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


module.exports = router;
