import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Australian Citizenship Practice Test - How we collect, use, and protect your data',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: February 23, 2025</p>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            GetCitizenship.com.au ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our Australian Citizenship Practice Test services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Usage data (test scores, practice history)</li>
            <li>Contact information (if you contact us)</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Device and browser information</li>
            <li>IP address (anonymized)</li>
            <li>Pages visited and time spent on site</li>
            <li>Referring website addresses</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>To provide and maintain our practice test services</li>
            <li>To improve user experience and website functionality</li>
            <li>To analyze usage patterns and trends</li>
            <li>To respond to your inquiries and support requests</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect anonymous data about website traffic and user behavior. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.
          </p>
          <p className="text-gray-700 mb-4">
            Your test scores and progress are stored locally in your browser's storage and are not transmitted to our servers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><strong>Google Analytics:</strong> For website analytics</li>
            <li><strong>Vercel:</strong> For website hosting</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of analytics tracking</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: contact@getcitizenship.com.au<br/>
            Website: https://www.getcitizenship.com.au
          </p>
        </div>
      </div>
    </main>
  )
}
