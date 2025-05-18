export default function TermsContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p className="lead">
        These Terms of Service ("Terms") govern your access to and use of
        Signhey's website, services, and applications (the "Services"). Please
        read these Terms carefully before using our Services.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our Services, you agree to be bound by these
        Terms. If you do not agree to these Terms, you may not access or use the
        Services.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        Signhey provides a platform for professionals to streamline client
        onboarding through electronic signatures, document collection, and
        payment processing. Our Services include:
      </p>
      <ul>
        <li>Electronic signature capabilities</li>
        <li>Document upload and storage</li>
        <li>Payment processing</li>
        <li>Client management tools</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>
        To use certain features of our Services, you must register for an
        account. When you register, you agree to provide accurate, current, and
        complete information about yourself. You are responsible for maintaining
        the confidentiality of your account credentials and for all activities
        that occur under your account.
      </p>

      <h2>4. Electronic Signatures</h2>
      <p>
        Our electronic signature service complies with applicable electronic
        signature laws, including the Electronic Signatures in Global and
        National Commerce Act (ESIGN), the Uniform Electronic Transactions Act
        (UETA), and where applicable, the eIDAS Regulation in the European
        Union.
      </p>
      <p>
        By using our electronic signature features, you acknowledge and agree
        that:
      </p>
      <ul>
        <li>
          Electronic signatures created through our Services are legally binding
        </li>
        <li>
          You consent to conducting business electronically through our platform
        </li>
        <li>
          You have the authority to sign documents on behalf of yourself or any
          entity you represent
        </li>
      </ul>

      <h2>5. Payment Processing</h2>
      <p>
        When you use our payment processing features, you agree to comply with
        all applicable payment terms. We use third-party payment processors, and
        your use of these services is subject to their terms and conditions.
      </p>

      <h2>6. Subscription and Fees</h2>
      <p>
        Certain features of our Services require a paid subscription. You agree
        to pay all fees associated with your subscription plan. Fees are
        non-refundable except as required by law or as explicitly stated in
        these Terms.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Our Privacy Policy explains how we collect, use, and protect your
        personal information. By using our Services, you consent to our
        collection and use of information as described in our Privacy Policy.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        Our Services and all content and materials included on our Services,
        including but not limited to text, graphics, logos, button icons,
        images, audio clips, and software, are the property of Signhey or our
        licensors and are protected by copyright, trademark, and other
        intellectual property laws.
      </p>

      <h2>9. User Content</h2>
      <p>
        You retain ownership of any content you upload, submit, or create
        through our Services ("User Content"). By uploading User Content, you
        grant us a worldwide, non-exclusive, royalty-free license to use,
        reproduce, modify, adapt, publish, and display such User Content solely
        for the purpose of providing our Services.
      </p>

      <h2>10. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our Services for any illegal purpose</li>
        <li>
          Upload or transmit any content that infringes intellectual property
          rights
        </li>
        <li>
          Attempt to gain unauthorized access to our Services or other users'
          accounts
        </li>
        <li>
          Use our Services in any manner that could damage, disable, overburden,
          or impair our systems
        </li>
        <li>
          Use automated scripts to collect information from or interact with our
          Services
        </li>
      </ul>

      <h2>11. Termination</h2>
      <p>
        We may terminate or suspend your access to our Services at any time,
        with or without cause, and without prior notice or liability. Upon
        termination, your right to use our Services will immediately cease.
      </p>

      <h2>12. Disclaimer of Warranties</h2>
      <p>
        OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
        OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        AND NON-INFRINGEMENT.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        IN NO EVENT SHALL SIGNHEY BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO
        YOUR USE OF OUR SERVICES.
      </p>

      <h2>14. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. If we make material changes, we
        will notify you through our Services or by other means. Your continued
        use of our Services after such notification constitutes your acceptance
        of the modified Terms.
      </p>

      <h2>15. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of [Jurisdiction], without regard to its conflict of law
        provisions.
      </p>

      <h2>16. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:support@signhey.com">support@signhey.com</a>.
      </p>

      <p className="text-sm text-muted-foreground mt-8">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
