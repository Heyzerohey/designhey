// backend/services/packageService.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
// Ensure these are set in your .env for the backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Using anon key for server-side can be okay if RLS is strong for these operations.
                                                    // Consider service role key if more privileged access is needed.

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for packageService. Please check your .env file.');
  // This service might not load correctly if Supabase isn't configured.
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Checks all related records (agreement status, document uploads, payments) for a package
 * and updates its overall status in the 'packages' table.
 * @param {string} packageId - The ID of the package to update.
 * @returns {Promise<object>} The updated package object or throws an error.
 */
const updatePackageOverallStatus = async (packageId) => {
  if (!packageId) {
    throw new Error('packageId is required to update overall status.');
  }

  try {
    // 1. Fetch current package details, its agreement, payment, and document request status
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select(`
        *,
        agreements (status),
        payments (status),
        uploaded_documents (id) 
      `) // Assuming one agreement, one payment for simplicity in status logic
      .eq('id', packageId)
      .single();

    if (pkgError) {
      console.error(`Error fetching package ${packageId} for status update:`, pkgError);
      throw pkgError;
    }
    if (!pkg) {
      throw new Error(`Package ${packageId} not found.`);
    }

    // Current statuses from related tables
    const agreement = pkg.agreements && pkg.agreements.length > 0 ? pkg.agreements[0] : null;
    const payment = pkg.payments && pkg.payments.length > 0 ? pkg.payments[0] : null; // Assumes one payment record for the package
    
    let isSigned = agreement && agreement.status === 'Completed'; // BoldSign 'Completed' means fully signed
    let isPaid = !pkg.payment_request_details?.requested || (payment && payment.status === 'succeeded');
    let documentsUploaded = !pkg.document_request_details?.requested || (pkg.uploaded_documents && pkg.uploaded_documents.length > 0); // Simple check: at least one doc uploaded if requested. Could be more specific.
    
    let newOverallStatus = pkg.status; // Default to current status

    // Determine new overall status based on components
    // This logic can be quite complex depending on the exact flow and definitions of "completed"
    // For MVP, let's use a simplified progression.
    
    if (pkg.status === 'draft' || pkg.status === 'sent' || pkg.status === 'viewed' || pkg.status === 'documents_pending_review' || pkg.status === 'payment_pending') {
        // If any part is declined or revoked, the package is too.
        if (agreement && (agreement.status === 'Declined by Signer' || agreement.status === 'Revoked by Sender')) {
            newOverallStatus = agreement.status.startsWith('Declined') ? 'declined' : 'revoked';
        } else if (isSigned && isPaid && documentsUploaded) {
            newOverallStatus = 'completed';
        } else if (isSigned && pkg.payment_request_details?.requested && !isPaid) {
            newOverallStatus = 'payment_pending'; // Signed, payment is next
        } else if (isSigned && !pkg.payment_request_details?.requested && pkg.document_request_details?.requested && !documentsUploaded) {
            newOverallStatus = 'documents_pending_upload'; // Signed, no payment, but docs needed
        } else if (agreement && agreement.status === 'Viewed by Signer' && newOverallStatus !== 'viewed') {
             // Only update to 'viewed' if it's a progression from 'sent'
            if (pkg.status === 'sent') newOverallStatus = 'viewed';
        }
        // Other intermediate statuses can be added here.
        // e.g., if payment is made first, then signing.
    }
    // No changes if package is already 'completed', 'declined', 'revoked', 'failed', etc. unless explicitly allowed.

    if (newOverallStatus !== pkg.status) {
      const { data: updatedPackage, error: updateError } = await supabase
        .from('packages')
        .update({ status: newOverallStatus, updated_at: new Date() })
        .eq('id', packageId)
        .select()
        .single();

      if (updateError) {
        console.error(`Error updating package ${packageId} status to ${newOverallStatus}:`, updateError);
        throw updateError;
      }
      console.log(`Package ${packageId} status updated from ${pkg.status} to ${newOverallStatus}.`);
      return updatedPackage;
    } else {
      console.log(`Package ${packageId} status (${pkg.status}) remains unchanged.`);
      return pkg; // Return current package if no status change
    }

  } catch (error) {
    console.error(`Failed to update overall package status for ${packageId}:`, error.message);
    throw error;
  }
};

module.exports = {
  updatePackageOverallStatus,
};
