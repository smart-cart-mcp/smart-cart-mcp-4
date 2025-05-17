export const metadata = {
  title: "Terms of Service | Smart Cart",
  description: "Smart Cart's terms of service outlining the rules, conditions, and guidelines for using our services",
};

export default function TermsPage() {
  const lastUpdated = "May 24, 2023";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to Smart Cart. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using Smart Cart, you agree to comply with and be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our website, mobile application, or any Smart Cart services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
        </p>

        <h2>2. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of our services after such modifications constitutes your acceptance of the modified Terms.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You may need to create an account to use certain features of our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use our services for any illegal purpose or in violation of any local, state, national, or international law</li>
          <li>Violate or infringe other people's intellectual property, privacy, or other rights</li>
          <li>Interfere with or disrupt the operation of our services</li>
          <li>Transmit viruses, malware, or other harmful code</li>
          <li>Attempt to gain unauthorized access to our systems or user accounts</li>
          <li>Impersonate another person or entity</li>
          <li>Engage in any activity that could disable, overburden, or impair the proper functioning of our services</li>
        </ul>

        <h2>5. Purchases and Payments</h2>
        <p>
          All purchases through our services are subject to our Payments Terms. By making a purchase, you represent and warrant that:
        </p>
        <ul>
          <li>The credit card, debit card, or other payment information you supply is true, correct, and complete</li>
          <li>You are duly authorized to use such payment method</li>
          <li>Charges incurred by you will be honored by your credit/debit card company or bank</li>
        </ul>
        <p>
          We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
        </p>

        <h2>6. Shipping and Delivery</h2>
        <p>
          We will make reasonable efforts to ensure the products are delivered in a timely manner. However, we are not responsible for delays beyond our control, such as shipping carrier delays or force majeure events.
        </p>

        <h2>7. Returns and Refunds</h2>
        <p>
          Our Return and Refund Policy is incorporated into these Terms by reference. Please review our policy for information on returns, refunds, and product exchanges.
        </p>

        <h2>8. Intellectual Property</h2>
        <p>
          Our services and all content, features, and functionality, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the property of Smart Cart or our licensors and are protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Smart Cart and its affiliates, officers, directors, employees, agents, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul>
          <li>Your access to or use of or inability to access or use the services</li>
          <li>Any conduct or content of any third party on the services</li>
          <li>Any content obtained from the services</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content</li>
        </ul>

        <h2>10. Dispute Resolution</h2>
        <p>
          Any disputes arising out of or relating to these Terms or our services shall be resolved through binding arbitration, except where prohibited by law. The arbitration will be conducted in Midlothian, Texas, under the Commercial Arbitration Rules of the American Arbitration Association.
        </p>

        <h2>11. Termination</h2>
        <p>
          We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:hello@smartcart.lol" className="text-primary hover:underline">hello@smartcart.lol</a><br />
          Address: SmartCart Inc., 1831 McAlpin rd., Midlothian, TX 76065
        </p>
      </div>
    </div>
  );
} 