const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const authenticateUser = require('../middleware/authenticateUser');
const { createClient } = require('@supabase/supabase-js');
const { uploadDocument, sendDocumentForSignature } = require('../services/boldsignService'); // Assuming this path

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Or service role for privileged operations

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for packages routes.');
  // Consider halting server start if Supabase isn't configured.
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Multer setup for file uploads (similar to boldsign.js route)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for agreement documents.'), false);
    }
  },
});

// POST /api/packages - Create a new package
router.post('/', authenticateUser, upload.single('agreementDocument'), async (req, res) => {
  const proUserId = req.user.id;
  const {
    packageName,
    signerName,
    signerEmail,
    documentRequestDetails, // JSON string, parse if needed: JSON.parse(documentRequestDetails)
    paymentRequestDetails,  // JSON string, parse if needed: JSON.parse(paymentRequestDetails)
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Agreement document file (agreementDocument) is required.' });
  }
  if (!packageName || !signerName || !signerEmail) {
    return res.status(400).json({ error: 'Package name, signer name, and signer email are required.' });
  }

  try {
    // 1. Authorization & Credit Check
    // a. Check for active "Pro" subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', proUserId)
      .eq('status', 'active') // Assuming 'active' is the status for a current Pro plan
      .maybeSingle(); // Use maybeSingle if user might not have a subscription record

    if (subError) {
      console.error('Supabase error checking subscription:', subError);
      return res.status(500).json({ error: 'Error verifying user subscription.' });
    }
    if (!subscription) {
      return res.status(403).json({ error: 'No active "Pro" subscription found. Please subscribe to create packages.' });
    }

    // b. Check signature credits (original check)
    const { data: credits, error: creditError } = await supabase
      .from('signature_credits')
      .select('balance') // Balance is NUMERIC(10,2)
      .eq('user_id', proUserId)
      .single();

    if (creditError) {
      console.error('Supabase error fetching credits:', creditError);
      return res.status(500).json({ error: 'Error fetching signature credits.' });
    }
    // Initial check for any balance can be deferred until cost is known, or kept as a preliminary check.
    // if (!credits || parseFloat(credits.balance) <= 0) { // Ensure comparison is numeric
    //   return res.status(403).json({ error: 'No signature credits available. Please purchase more credits.' });
    // }

    // 1b. NEW: Fetch subscription details for tiered pricing
    const { data: activeSubscription, error: activeSubError } = await supabase
      .from('subscriptions')
      .select('id, status, current_period_start, current_period_end, current_billing_cycle_signature_count')
      .eq('user_id', proUserId)
      .eq('status', 'active') // Only consider active subscriptions
      .order('created_at', { ascending: false }) 
      .maybeSingle();

    if (activeSubError) {
      console.error('Supabase error fetching active subscription for tiered pricing:', activeSubError);
      return res.status(500).json({ error: 'Error fetching subscription details for pricing.' });
    }

    if (!activeSubscription) {
      return res.status(403).json({ error: 'An active "Pro" subscription is required to send packages.' });
    }
    
    // Optional: Validate current date is within billing cycle. For MVP, we'll trust the active status and count.
    // const now = new Date();
    // if (now < new Date(activeSubscription.current_period_start) || now > new Date(activeSubscription.current_period_end)) {
    //   return res.status(403).json({ error: 'Current date is outside the active billing cycle of your subscription.' });
    // }

    // 1c. Determine signature cost based on tier
    const signatureCost = (activeSubscription.current_billing_cycle_signature_count || 0) >= 100 ? 1.00 : 1.25;

    // 1d. Check signature_credits.balance against determined cost
    if (!credits || parseFloat(credits.balance) < signatureCost) {
      return res.status(403).json({ error: `Insufficient signature credits. Current balance: ${credits ? parseFloat(credits.balance).toFixed(2) : '0.00'}, Required: ${signatureCost.toFixed(2)}.` });
    }


    // 2. Generate Signer Link ID
    const signerLinkId = `sl_${uuidv4().replace(/-/g, '')}`; // Unique, hard-to-guess

    // 3. Create Package Record (initial)
    const parsedDocReqDetails = documentRequestDetails ? JSON.parse(documentRequestDetails) : null;
    const parsedPayReqDetails = paymentRequestDetails ? JSON.parse(paymentRequestDetails) : null;

    const { data: newPackage, error: newPackageError } = await supabase
      .from('packages')
      .insert({
        pro_user_id: proUserId,
        name: packageName,
        agreement_details: {}, // Will be populated by BoldSign info if applicable, or general agreement info
        document_request_details: parsedDocReqDetails,
        payment_request_details: parsedPayReqDetails,
        status: 'draft', // Initial status before BoldSign interaction
        signer_link_id: signerLinkId,
      })
      .select()
      .single();

    if (newPackageError) {
      console.error('Supabase error creating package:', newPackageError);
      return res.status(500).json({ error: `Failed to create package: ${newPackageError.message}` });
    }
    const signheyPackageId = newPackage.id;

    // 4. BoldSign Interaction
    //    (Leveraging boldsignService.js logic, similar to /api/boldsign/send-document)
    
    // 4a. Upload document to BoldSign
    const boldsignUploadResponse = await uploadDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    const boldsignUploadedDocId = boldsignUploadResponse.documentId;
    if (!boldsignUploadedDocId) {
      // Rollback or mark package as failed if critical
      await supabase.from('packages').update({ status: 'upload_failed' }).eq('id', signheyPackageId);
      console.error('BoldSign upload response missing documentId:', boldsignUploadResponse);
      return res.status(500).json({ error: 'Failed to get document ID from BoldSign after upload.' });
    }

    // 4b. Create "agreement" record in Signhey DB
    const { data: agreementData, error: agreementError } = await supabase
      .from('agreements')
      .insert({
        package_id: signheyPackageId,
        boldsign_document_id: boldsignUploadedDocId,
        original_file_name: req.file.originalname,
        status: 'Pending Send', // Status before sending for signature
      })
      .select()
      .single();

    if (agreementError) {
      await supabase.from('packages').update({ status: 'agreement_creation_failed' }).eq('id', signheyPackageId);
      console.error('Supabase error creating agreement record:', agreementError);
      return res.status(500).json({ error: `Failed to create agreement record: ${agreementError.message}` });
    }
    const signheyAgreementId = agreementData.id;

    // 4c. Send document for signature via BoldSign
    const signers = [{ name: signerName, emailAddress: signerEmail, signerOrder: 1 }];
    const signatureRequestTitle = `Signature Request for: ${packageName}`;
    const signatureRequestMessage = `Please sign the document: ${packageName}.`;
    
    const boldsignSendResponse = await sendDocumentForSignature(
      boldsignUploadedDocId,
      signers,
      signatureRequestTitle,
      signatureRequestMessage
    );
    const finalBoldSignDocumentId = boldsignSendResponse.documentId || boldsignUploadedDocId;
    const boldsignStatus = boldsignSendResponse.status || 'Sent';

    // Update agreement with final BoldSign ID and status
    await supabase
      .from('agreements')
      .update({ boldsign_document_id: finalBoldSignDocumentId, status: boldsignStatus })
      .eq('id', signheyAgreementId);

    // 5. Deduct Signature Credit (using determined cost) and Increment Usage Count
    // These two operations should ideally be in a transaction.
    // Supabase Edge Functions (RPC) can achieve this. For now, sequential with error handling.

    const newBalanceValue = (parseFloat(credits.balance) - signatureCost).toFixed(2);
    const { error: creditUpdateError } = await supabase
      .from('signature_credits')
      .update({ balance: newBalanceValue })
      .eq('user_id', proUserId);

    if (creditUpdateError) {
      console.error(`CRITICAL: Failed to deduct credit for user ${proUserId}. Error: ${creditUpdateError.message}`);
      await supabase.from('packages').update({ status: 'credit_deduction_failed' }).eq('id', signheyPackageId);
      return res.status(500).json({ error: 'Failed to deduct credits. Please contact support.' });
    }

    // Increment usage count for the current subscription period
    const newSignatureCount = (activeSubscription.current_billing_cycle_signature_count || 0) + 1;
    const { error: subUsageUpdateError } = await supabase
      .from('subscriptions')
      .update({ current_billing_cycle_signature_count: newSignatureCount })
      .eq('id', activeSubscription.id); 

    if (subUsageUpdateError) {
      console.error(`CRITICAL: Failed to increment signature usage count for user ${proUserId} on subscription ${activeSubscription.id}. Error: ${subUsageUpdateError.message}`);
      // Log for reconciliation. Credits were deducted. Package is sent.
      // This part is non-blocking for the package sending itself but needs monitoring.
    }

    // 6. Update Package Status
    const { data: updatedPackage, error: finalPackageUpdateError } = await supabase
      .from('packages')
      .update({ status: 'sent' }) // Or map from boldsignStatus if more granular
      .eq('id', signheyPackageId)
      .select()
      .single();
      
    if (finalPackageUpdateError) {
        console.error('Supabase error updating package to sent:', finalPackageUpdateError);
        // Less critical than credit deduction failure, but still important to log.
    }


    // 7. Return created package info
    res.status(201).json({
      message: 'Package created and document sent for signature successfully!',
      package: updatedPackage, // Contains the final package state including signer_link_id
      agreementId: signheyAgreementId,
      boldsignDocumentId: finalBoldSignDocumentId,
      boldsignStatus: boldsignStatus,
      creditsRemaining: parseFloat(newBalanceValue),
      signatureCostApplied: signatureCost,
      currentCycleSignatureCount: newSignatureCount, // For client feedback if needed
    });

  } catch (error) {
    console.error('Error in POST /api/packages endpoint:', error);
    // Check if a package was partially created and needs cleanup or status update
    if (signheyPackageId && !res.headersSent) { // Avoid sending response if already sent
        await supabase.from('packages').update({ status: 'creation_failed_error' }).eq('id', signheyPackageId).catch(e => console.error("Failed to update package status on error cleanup:", e));
    }
    if (!res.headersSent) {
        res.status(500).json({ error: `Failed to create package: ${error.message}` });
    }
  }
});


// GET /api/packages - Retrieve all packages for the authenticated Pro user
router.get('/', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const statusFilter = req.query.status; // e.g., ?status=sent

  if (page < 1) return res.status(400).json({ error: 'Page number must be 1 or greater.' });
  if (limit < 1 || limit > 100) return res.status(400).json({ error: 'Limit must be between 1 and 100.' });

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('packages')
      .select(`
        id,
        name,
        status,
        created_at,
        updated_at,
        signer_link_id, 
        pro_user_id, 
        agreements (
          original_file_name,
          status,
          boldsign_document_id 
        )
      `, { count: 'exact' }) // Request total count for pagination metadata
      .eq('pro_user_id', proUserId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: packages, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching packages:', error);
      return res.status(500).json({ error: `Failed to retrieve packages: ${error.message}` });
    }
    
    // Extracting primary signer info if available in agreements (assuming one agreement for dashboard list simplicity)
    // Note: The `packages` table itself doesn't directly store signer name/email based on current schema.
    // This information is primarily used when sending to BoldSign.
    // If this data is needed directly in the package list, schema modification or more complex query is needed.
    // For now, we'll rely on what's easily joinable. `agreements` has `boldsign_document_id`.
    // True signer details might be in BoldSign or need to be fetched from a related `signers` table if we had one.

    const response = {
      data: packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        status: pkg.status,
        createdAt: pkg.created_at,
        updatedAt: pkg.updated_at,
        // Assuming the first agreement contains relevant info for dashboard list
        agreementFileName: pkg.agreements && pkg.agreements.length > 0 ? pkg.agreements[0].original_file_name : null,
        agreementStatus: pkg.agreements && pkg.agreements.length > 0 ? pkg.agreements[0].status : null,
        // Signer name/email are not directly on package or simple agreement join.
        // This would require either denormalization or a more specific query if needed for dashboard list.
      })),
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        itemsPerPage: limit,
      },
    };

    res.status(200).json(response);

  } catch (err) {
    console.error('Unexpected error retrieving packages:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


// GET /api/packages/:packageId - Retrieve details for a specific package
router.get('/:packageId', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;
  const { packageId } = req.params;

  if (!packageId) {
    return res.status(400).json({ error: 'Package ID is required.' });
  }

  try {
    const { data: pkg, error } = await supabase
      .from('packages')
      .select(`
        *,
        agreements (*),
        uploaded_documents (*),
        payments (*)
      `) // Comprehensive join
      .eq('id', packageId)
      .eq('pro_user_id', proUserId) // Ensure user owns the package
      .single();

    if (error) {
      console.error(`Supabase error fetching package ${packageId}:`, error);
      if (error.code === 'PGRST116') { // Not found or user doesn't own it
        return res.status(404).json({ error: 'Package not found or access denied.' });
      }
      return res.status(500).json({ error: `Failed to retrieve package: ${error.message}` });
    }
    
    if (!pkg) {
        return res.status(404).json({ error: 'Package not found or access denied.' });
    }

    res.status(200).json(pkg);

  } catch (err) {
    console.error(`Unexpected error retrieving package ${packageId}:`, err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


module.exports = router;
