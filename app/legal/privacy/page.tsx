export const metadata = {
  title: "Privacy Policy | Smart Cart",
  description: "Smart Cart's privacy policy detailing how we collect, use, and protect your information",
};

export default function PrivacyPage() {
  const lastUpdated = "May 24, 2023";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          At Smart Cart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect information about you in a variety of ways including:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Voluntarily provided information which may include your name, email address, shipping address, billing information, and payment details.
          </li>
          <li>
            <strong>Shopping Preferences:</strong> Information about your shopping habits, product preferences, and purchase history.
          </li>
          <li>
            <strong>Device Data:</strong> Information about your device, including IP address, browser type, and operating system.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website and application, including pages visited, time spent, and actions taken.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We may use the information we collect about you to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Process payments and complete transactions</li>
          <li>Provide customer support</li>
          <li>Personalize your shopping experience</li>
          <li>Send you marketing and promotional communications</li>
          <li>Improve our website, products, and services</li>
          <li>Respond to legal requests and prevent harm</li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track the activity on our website and store certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
        </p>

        <h2>Third-Party Service Providers</h2>
        <p>
          We may share your information with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
        </p>

        <h2>Data Security</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>

        <h2>Your Data Protection Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>The right to access personal data we hold about you</li>
          <li>The right to request correction of your personal data</li>
          <li>The right to request deletion of your personal data</li>
          <li>The right to withdraw consent where we rely on consent to process your information</li>
          <li>The right to object to processing of your personal data</li>
          <li>The right to data portability</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          Our service is not directed to anyone under the age of 18. We do not knowingly collect personal information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:hello@smartcart.lol" className="text-primary hover:underline">hello@smartcart.lol</a><br />
          Address: SmartCart Inc., 1831 McAlpin rd., Midlothian, TX 76065
        </p>
      </div>
    </div>
  );
} 