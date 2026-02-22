import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Australian Citizenship Practice Test - Rules and guidelines for using our service',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: February 23, 2025</p>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using GetCitizenship.com.au, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use the materials (information and software) on GetCitizenship.com.au for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            THE MATERIALS ON GETCITIZENSHIP.COM.AU ARE PROVIDED ON AN 'AS IS' BASIS. GETCITIZENSHIP.COM.AU MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF RIGHTS.
          </p>
          <p className="text-gray-700 mb-4">
            Further, GetCitizenship.com.au does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Educational Purpose</h2>
          <p className="text-gray-700 mb-4">
            This website is designed to help users prepare for the Australian Citizenship Test. The practice questions are based on the official resource "Our Common Bond" but are not official government questions. We recommend:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Using official Department of Home Affairs resources alongside this practice tool</li>
            <li>Reading "Our Common Bond" booklet thoroughly</li>
            <li>Visiting the official Australian Citizenship website for the most current information</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on GetCitizenship.com.au could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Links to Other Websites</h2>
          <p className="text-gray-700 mb-4">
            GetCitizenship.com.au may contain links to third-party websites. These links are provided for your convenience and do not signify our endorsement of such websites or their content. We have no responsibility for the content or privacy practices of linked websites.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications</h2>
          <p className="text-gray-700 mb-4">
            GetCitizenship.com.au may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service are governed by and construed in accordance with the laws of New South Wales, Australia, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Information</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, please contact us at:<br/>
            Email: contact@getcitizenship.com.au<br/>
            Website: https://www.getcitizenship.com.au
          </p>
        </div>
      </div>
    </main>
  )
}
