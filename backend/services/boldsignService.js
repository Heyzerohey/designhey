const axios = require('axios');
require('dotenv').config();

const BOLDSIGN_API_KEY = process.env.BOLDSIGN_API_KEY;
const BOLDSIGN_API_URL = process.env.BOLDSIGN_API_URL || 'https://api.boldsign.com/v1'; // Default or from .env

if (!BOLDSIGN_API_KEY) {
  console.error('BoldSign API Key is missing. Please check your .env file for BOLDSIGN_API_KEY.');
  // throw new Error('BoldSign API Key is missing.'); // Optional: halt server start
}

const boldsignClient = axios.create({
  baseURL: BOLDSIGN_API_URL,
  headers: {
    'X-API-KEY': BOLDSIGN_API_KEY,
    'Content-Type': 'application/json',
  },
});

/**
 * Uploads a document to BoldSign.
 * @param {Buffer} fileBuffer - The document file buffer.
 * @param {string} fileName - The name of the file.
 * @param {string} contentType - The content type of the file (e.g., 'application/pdf').
 * @returns {Promise<object>} The BoldSign API response for document upload.
 *                            Typically includes a document ID from BoldSign.
 * Example BoldSign API might return: { documentId: 'bs_doc_xxxx' }
 */
const uploadDocument = async (fileBuffer, fileName, contentType = 'application/pdf') => {
  // BoldSign's API for file upload might expect multipart/form-data.
  // Axios can handle this with FormData.
  const FormData = require('form-data');
  const form = new FormData();
  form.append('file', fileBuffer, { filename: fileName, contentType });
  // Add other parameters as required by BoldSign API like 'Title', 'Description' etc.
  // form.append('Title', `Agreement ${Date.now()}`);

  try {
    const response = await boldsignClient.post('/document/upload', form, {
      headers: {
        ...form.getHeaders(), // Important for multipart/form-data
      },
    });
    return response.data; // This should contain BoldSign's document ID
  } catch (error) {
    console.error('BoldSign API Error - Uploading Document:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
};


/**
 * Sends a document for signature using BoldSign.
 * @param {string} boldsignDocumentId - The ID of the document already uploaded to BoldSign.
 * @param {Array<object>} signers - Array of signer objects, e.g., [{ name: 'John Doe', emailAddress: 'john.doe@example.com', signerOrder: 1 }]
 * @param {string} message - Message to the signers.
 * @param {string} title - Title of the signature request.
 * @param {object} [options] - Additional options like 'brandId', 'redirectUrl', 'enableSigningReminders' etc.
 * @returns {Promise<object>} The BoldSign API response for sending the document.
 *                            This response usually contains details about the signature request,
 *                            including a document ID (which might be different from uploaded ID, or the same confirmed)
 *                            and status.
 * Example BoldSign API response: { documentId: 'bs_req_yyyy', status: 'Sent', ... }
 */
const sendDocumentForSignature = async (boldsignUploadedDocId, signers, title = 'Sign Document', message = 'Please sign this document.') => {
  // Construct the payload as per BoldSign's API documentation for creating a signature request
  // This often involves specifying document IDs, signer details, email subjects/messages,
  // signature field placements (if not using templates), callback URLs, etc.

  const payload = {
    // Assuming BoldSign uses the previously uploaded document ID.
    // Some APIs might require a list of document objects, each with an ID.
    documentIds: [boldsignUploadedDocId], // Or could be part of a more complex documents array
    signers: signers.map(s => ({
      name: s.name,
      emailAddress: s.emailAddress,
      signerOrder: s.signerOrder || 1, // Default order if not specified
      // Add other signer options as needed, e.g., authentication, private messages
    })),
    title: title,
    message: message,
    // redirectUrl: `${process.env.FRONTEND_URL}/packages/signed`, // Optional: URL after signing
    // disableEmails: false, // Send emails by default
    // enableSigningReminders: true,
    // reminderSettings: { reminderCount: 3, reminderInterval: 2 }, // Example
    // brandId: process.env.BOLDSIGN_BRAND_ID, // Optional
    // webhookUrls: {
    //   action: `${process.env.BACKEND_API_URL}/boldsign/webhook` // Your webhook endpoint
    // }
  };

  try {
    // The endpoint might be something like '/document/send' or '/signatureRequest'
    const response = await boldsignClient.post('/signatureRequest/send', payload); 
    return response.data; // Contains details of the sent document/signature request
  } catch (error) {
    console.error('BoldSign API Error - Sending Document for Signature:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
};

/**
 * Retrieves details of a specific BoldSign document.
 * @param {string} boldsignDocumentId - The BoldSign document ID.
 * @returns {Promise<object>} Document details from BoldSign.
 */
const getDocumentDetails = async (boldsignDocumentId) => {
  try {
    const response = await boldsignClient.get(`/document/properties?documentId=${boldsignDocumentId}`); // Or similar endpoint
    return response.data;
  } catch (error) {
    console.error(`BoldSign API Error - Getting Document ${boldsignDocumentId} Details:`, error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
};

/**
 * Downloads a signed document from BoldSign.
 * @param {string} boldsignDocumentId - The BoldSign document ID.
 * @returns {Promise<Buffer>} The signed document file as a Buffer.
 */
const downloadSignedDocument = async (boldsignDocumentId) => {
    try {
        // The endpoint for downloading might be different, e.g., /document/download?documentId=...
        // Or it might be part of the document details response (e.g., a downloadLink).
        const response = await boldsignClient.get(`/document/download?documentId=${boldsignDocumentId}`, {
            responseType: 'arraybuffer', // Crucial for getting the file as a buffer
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error(`BoldSign API Error - Downloading Document ${boldsignDocumentId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
    }
};


module.exports = {
  boldsignClient,
  uploadDocument,
  sendDocumentForSignature,
  getDocumentDetails,
  downloadSignedDocument,
  // Add other specific functions as needed, e.g., for templates, embedded signing, etc.
};
