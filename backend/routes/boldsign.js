const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument, sendDocumentForSignature } = require('../services/boldsignService');
const { createClient } = require('@supabase/supabase-js');

// Supabase client (ensure these are set in your .env for the backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Or service role key

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for boldsign routes. Please check your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Multer setup for file uploads (in-memory storage for this example)
// For production, consider disk storage or streaming directly to BoldSign if possible.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit, adjust as needed
  fileFilter: (req, file, cb) => {
    // Example: Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
});

// Middleware to simulate user authentication (replace with actual auth middleware)
const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id']; // This should come from a verified JWT
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated. Missing x-user-id header.' });
  }
  req.user = { id: userId };
  next();
};

// Endpoint to upload a document and send it for signature
// This endpoint assumes it's called as part of creating a "package" in Signhey
router.post('/send-document', authenticateUser, upload.single('agreementDocument'), async (req, res) => {
  const proUserId = req.user.id; // User creating the package and sending the document
  const {
    packageName, // Name of the package in Signhey
    signerName,
    signerEmail,
    // fieldMappingInfo, // For future advanced field placement
    // packageId, // If package is created first, then document added. Or create package here.
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Agreement document file is required.' });
  }
  if (!packageName || !signerName || !signerEmail) {
    return res.status(400).json({ error: 'Package name, signer name, and signer email are required.' });
  }

  try {
    // 1. Create a "package" entry in Signhey's database first (if not already created)
    // This is important to get a package_id to link with the agreement.
    // For this example, we'll create a simple package.
    // In a real app, this might be more complex, including other package details.
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        pro_user_id: proUserId,
        name: packageName,
        status: 'draft', // Initial status
        signer_link_id: `bs_link_${Date.now()}${Math.random().toString(36).substring(2, 15)}` // Placeholder, BoldSign might provide its own
      })
      .select()
      .single();

    if (packageError) {
      console.error('Supabase error creating package:', packageError);
      throw new Error(`Failed to create package: ${packageError.message}`);
    }
    const signheyPackageId = packageData.id;

    // 2. Upload the document to BoldSign
    const boldsignUploadResponse = await uploadDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Ensure boldsignUploadResponse has the expected document ID format.
    // This depends on the actual BoldSign API response structure.
    // Assuming it's { message: "success", documentId: "...", ... } or similar
    const boldsignUploadedDocId = boldsignUploadResponse.documentId; 
    if (!boldsignUploadedDocId) {
        console.error('BoldSign upload response missing documentId:', boldsignUploadResponse);
        throw new Error('Failed to get document ID from BoldSign after upload.');
    }


    // 3. Create an "agreement" entry in Signhey's database
    const { data: agreementData, error: agreementError } = await supabase
      .from('agreements')
      .insert({
        package_id: signheyPackageId,
        boldsign_document_id: boldsignUploadedDocId, // This is the ID from BoldSign's upload
        original_file_name: req.file.originalname,
        status: 'Pending Upload Confirmation', // Initial status before sending
      })
      .select()
      .single();

    if (agreementError) {
      console.error('Supabase error creating agreement:', agreementError);
      // Potentially delete the package if agreement creation fails? Or mark package as failed.
      throw new Error(`Failed to create agreement record: ${agreementError.message}`);
    }
    const signheyAgreementId = agreementData.id;


    // 4. Send the document for signature via BoldSign
    const signers = [{ name: signerName, emailAddress: signerEmail, signerOrder: 1 }];
    const signatureRequestTitle = `Signature Request for ${packageName}`;
    const signatureRequestMessage = `Please sign the document for package: ${packageName}.`;
    
    const boldsignSendResponse = await sendDocumentForSignature(
      boldsignUploadedDocId, // Use the ID of the document *uploaded* to BoldSign
      signers,
      signatureRequestTitle,
      signatureRequestMessage
    );

    // boldsignSendResponse should contain the final BoldSign document/request ID and status.
    // This might be the same as boldsignUploadedDocId or a new one.
    // Let's assume it returns a `documentId` for the signature request and a `status`.
    const finalBoldSignDocumentId = boldsignSendResponse.documentId || boldsignUploadedDocId;
    const boldsignStatus = boldsignSendResponse.status || 'Sent'; // e.g. 'Sent', 'Pending'

    // 5. Update the agreement in Signhey's database with the final BoldSign ID and status
    const { error: updateAgreementError } = await supabase
      .from('agreements')
      .update({
        boldsign_document_id: finalBoldSignDocumentId, // Update if it changed upon sending
        status: boldsignStatus, // Status from BoldSign after sending
      })
      .eq('id', signheyAgreementId);

    if (updateAgreementError) {
      console.error('Supabase error updating agreement after sending:', updateAgreementError);
      // This is not ideal, as document is sent but our DB isn't perfectly synced.
      // Implement retry or reconciliation logic for production.
    }
    
    // Also update the package status
     await supabase
      .from('packages')
      .update({ status: 'sent' }) // Or based on boldsignStatus
      .eq('id', signheyPackageId);


    res.status(201).json({
      message: 'Document sent for signature successfully!',
      signheyPackageId: signheyPackageId,
      signheyAgreementId: signheyAgreementId,
      boldsignDocumentId: finalBoldSignDocumentId,
      boldsignStatus: boldsignStatus,
    });

  } catch (error) {
    console.error('Error in /send-document endpoint:', error);
    res.status(500).json({ error: `Failed to send document: ${error.message}` });
  }
});


// BoldSign Webhook Handler
// This endpoint will receive events from BoldSign regarding document status changes.
// Ensure BoldSign webhook requests are not parsed by a global express.json() middleware
// if they send payloads in a different format or if raw body is needed for signature verification.
// For BoldSign, they typically send JSON payloads. If signature verification requires raw body,
// then this route needs to be configured before global JSON parsing, similar to Stripe webhooks.
// Assuming JSON payload for now, and basic secret verification if provided.
router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
  const eventData = req.body;
  const webhookSecret = process.env.BOLDSIGN_WEBHOOK_SECRET; // For verifying webhook authenticity

  // TODO: Implement actual webhook signature verification if BoldSign provides it.
  // This often involves comparing a signature from headers with a calculated signature.
  // For example:
  // const signature = req.headers['x-boldsign-signature']; // Or similar header
  // if (webhookSecret && !verifyBoldSignSignature(req.rawBody || JSON.stringify(eventData), signature, webhookSecret)) {
  //   console.warn('BoldSign Webhook: Invalid signature.');
  //   return res.status(401).send('Invalid webhook signature.');
  // }

  console.log('BoldSign Webhook Received:', JSON.stringify(eventData, null, 2));

  const { eventCode, documentId, status } = eventData; // Adjust based on actual BoldSign webhook payload structure

  if (!documentId || !eventCode) {
    console.warn('BoldSign Webhook: Missing documentId or eventCode in payload.');
    return res.status(400).json({ error: 'Missing documentId or eventCode.' });
  }

  try {
    let newAgreementStatus = ''; // Map BoldSign status/event to our internal status

    // Mapping BoldSign event codes/statuses to Signhey agreement statuses
    // This is highly dependent on BoldSign's specific webhook event structure and values.
    // Example mapping:
    switch (eventCode.toLowerCase()) {
      case 'documentsent': // Or a status like 'Sent'
        newAgreementStatus = 'Sent';
        break;
      case 'documentviewed': // Or 'Viewed'
        newAgreementStatus = 'Viewed by Signer';
        break;
      case 'documentsigned': // Or 'Signed' (by one signer if multiple)
        newAgreementStatus = 'Partially Signed'; // Or 'Signed' if only one signer
        // If multiple signers, you might need more logic to determine if all signed.
        break;
      case 'documentcompleted': // Or 'Completed' (all signers completed action)
        newAgreementStatus = 'Completed'; // All parties have signed.
        
        // Optionally, download the signed document here
        // const { downloadSignedDocument } = require('../services/boldsignService');
        // const signedDocumentBuffer = await downloadSignedDocument(documentId);
        // TODO: Store this buffer in Supabase Storage and update agreements.signed_document_url
        // e.g., const { data: storageData, error: storageError } = await supabase.storage
        //           .from('signed-documents') // Your bucket name
        //           .upload(`${documentId}-signed.pdf`, signedDocumentBuffer, { contentType: 'application/pdf' });
        // if (storageError) console.error('Error uploading signed doc to Supabase Storage:', storageError);
        // else signedDocumentUrl = storageData.path; (or public URL)

        break;
      case 'documentdeclined': // Or 'Declined'
        newAgreementStatus = 'Declined by Signer';
        break;
      case 'documentrevoked': // Or 'Revoked' / 'Cancelled'
        newAgreementStatus = 'Revoked by Sender';
        break;
      default:
        console.log(`BoldSign Webhook: Unhandled eventCode '${eventCode}' for document ${documentId}.`);
        return res.status(200).json({ message: 'Event received, but no action taken for this event type.' });
    }

    if (newAgreementStatus) {
      const { error: updateError } = await supabase
        .from('agreements')
        .update({
          status: newAgreementStatus,
          // signed_document_url: signedDocumentUrl, // If downloaded and stored
          updated_at: new Date(), // Explicitly set, though trigger should also work
        })
        .eq('boldsign_document_id', documentId);

      if (updateError) {
        console.error(`BoldSign Webhook: Supabase error updating agreement ${documentId} to status ${newAgreementStatus}:`, updateError);
        // Don't send 500 to BoldSign if it's a DB issue, they might retry. Log and monitor.
      } else {
        console.log(`BoldSign Webhook: Agreement ${documentId} updated to status ${newAgreementStatus}.`);
        
        // Additionally, update the parent package status if the agreement is completed or declined
        if (newAgreementStatus === 'Completed' || newAgreementStatus === 'Declined by Signer') {
            const {data: agreement, error: fetchAgrError} = await supabase
                .from('agreements')
                .select('package_id')
                .eq('boldsign_document_id', documentId)
                .single();
            
            if (fetchAgrError) {
                console.error('BoldSign Webhook: Error fetching package_id for agreement:', fetchAgrError);
            } else if (agreement && agreement.package_id) {
                // Let updatePackageOverallStatus handle the package status logic
                // let packageStatus = newAgreementStatus === 'Completed' ? 'completed' : 'declined';
                // await supabase.from('packages').update({ status: packageStatus }).eq('id', agreement.package_id);
                // console.log(`BoldSign Webhook: Package ${agreement.package_id} status updated to ${packageStatus}.`);
                
                const { updatePackageOverallStatus } = require('../services/packageService');
                try {
                    await updatePackageOverallStatus(agreement.package_id);
                } catch (statusUpdateError) {
                    console.error(`Error updating overall package status after BoldSign event for package ${agreement.package_id}:`, statusUpdateError);
                }
            }
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully.' });

  } catch (error) {
    console.error(`BoldSign Webhook: Error processing event for document ${documentId}:`, error);
    res.status(500).json({ error: 'Internal server error processing webhook.' });
  }
});

module.exports = router;
