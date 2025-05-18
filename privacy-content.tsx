export default function PrivacyContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="lead">
        At Signhey, we take your privacy seriously. This Privacy Policy explains
        how we collect, use, disclose, and safeguard your information when you
        use our website, services, and applications (the "Services").
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect several types of information from and about users:</p>

      <h3>Personal Information</h3>
      <p>
        When you register for an account or use our Services, we may collect:
      </p>
      <ul>
        <li>
          Contact information (name, email address, phone number, business
          address)
        </li>
        <li>Account credentials (username and password)</li>
        <li>
          Payment information (credit card details, billing address) - note that
          payment information is processed by our third-party payment processors
        </li>
        <li>Professional information (job title, company name)</li>
        <li>Profile picture (if provided)</li>
      </ul>

      <h3>Client Information</h3>
      <p>
        When you use our Services to engage with clients, we collect information
        about your clients that you provide to us, including:
      </p>
      <ul>
        <li>Client contact information</li>
        <li>Documents shared with clients</li>
        <li>Electronic signature data</li>
        <li>Payment records</li>
      </ul>

      <h3>Usage Information</h3>
      <p>
        We automatically collect certain information about your device and how
        you interact with our Services, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Device type and operating system</li>
        <li>Browser type</li>
        <li>Pages visited and features used</li>
        <li>Time and date of your visits</li>
        <li>Referring website or application</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our Services</li>
        <li>Process transactions and send related information</li>
        <li>Create and manage your account</li>
        <li>Facilitate electronic signatures and document sharing</li>
        <li>
          Send administrative information, such as updates, security alerts, and
          support messages
        </li>
        <li>
          Respond to your comments, questions, and requests, and provide
          customer service
        </li>
        <li>
          Send promotional communications, such as special offers or other
          marketing content (with your consent where required by law)
        </li>
        <li>Monitor and analyze trends, usage, and activities</li>
        <li>Detect, prevent, and address technical issues</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>We may share your information with:</p>

      <h3>Service Providers</h3>
      <p>
        We share information with third-party vendors, consultants, and other
        service providers who need access to such information to carry out work
        on our behalf, such as:
      </p>
      <ul>
        <li>Cloud storage providers</li>
        <li>Payment processors</li>
        <li>Analytics providers</li>
        <li>Customer support services</li>
      </ul>

      <h3>Legal Requirements</h3>
      <p>
        We may disclose your information if required to do so by law or in
        response to valid requests by public authorities (e.g., a court or
        government agency).
      </p>

      <h3>Business Transfers</h3>
      <p>
        If we are involved in a merger, acquisition, or sale of all or a portion
        of our assets, your information may be transferred as part of that
        transaction.
      </p>

      <h3>With Your Consent</h3>
      <p>
        We may share your information with third parties when we have your
        consent to do so.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to
        protect the security of your personal information. However, please be
        aware that no method of transmission over the Internet or method of
        electronic storage is 100% secure.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill
        the purposes outlined in this Privacy Policy, unless a longer retention
        period is required or permitted by law.
      </p>

      <h2>6. Your Rights and Choices</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Correct inaccurate or incomplete information</li>
        <li>Request deletion of your personal information</li>
        <li>Restrict or object to certain processing of your information</li>
        <li>
          Request transfer of your information to another service provider
        </li>
        <li>Withdraw consent where processing is based on consent</li>
      </ul>
      <p>
        To exercise these rights, please contact us using the information
        provided in the "Contact Us" section below.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Our Services are not intended for children under the age of 16, and we
        do not knowingly collect personal information from children under 16. If
        we learn that we have collected personal information from a child under
        16, we will take steps to delete such information.
      </p>

      <h2>8. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other
        than the country in which you reside. These countries may have data
        protection laws that are different from the laws of your country. We
        take appropriate measures to ensure that your personal information
        remains protected in accordance with this Privacy Policy.
      </p>

      <h2>9. Cookies and Similar Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on
        our Services and to hold certain information. You can instruct your
        browser to refuse all cookies or to indicate when a cookie is being
        sent.
      </p>

      <h2>10. Third-Party Links</h2>
      <p>
        Our Services may contain links to third-party websites or services that
        are not owned or controlled by Signhey. We have no control over and
        assume no responsibility for the content, privacy policies, or practices
        of any third-party websites or services.
      </p>

      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and
        updating the "Last updated" date.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at: <a href="mailto:privacy@signhey.com">privacy@signhey.com</a>
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
