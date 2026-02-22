import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Government Disclaimer',
  description: 'Disclaimer regarding the relationship between this service and the Australian Government',
}

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Government Disclaimer</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="font-semibold text-yellow-800">
              Important: This website is NOT affiliated with, endorsed by, or connected to the Australian Government, Department of Home Affairs, or any official government body.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Official Sources</h2>
          <p className="text-gray-700 mb-4">
            For official information about Australian citizenship, please refer to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li><a href="https://immi.homeaffairs.gov.au/citizenship" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs - Citizenship</a></li>
            <li><a href="https://immi.homeaffairs.gov.au/citizenship-subsite/files/our-common-bond.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Our Common Bond (Official Booklet)</a></li>
            <li><a href="https://immi.homeaffairs.gov.au/citizenship/become-a-citizen" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">How to Become a Citizen</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">About This Service</h2>
          <p className="text-gray-700 mb-4">
            GetCitizenship.com.au is an independent, privately-operated practice tool designed to help individuals prepare for the Australian Citizenship Test. Our questions are based on the official resource "Our Common Bond" but:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Are NOT official test questions</li>
            <li>May not reflect the exact format of the official test</li>
            <li>Should be used as a study aid only</li>
            <li>Do not guarantee passing the official citizenship test</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Guarantee</h2>
          <p className="text-gray-700 mb-4">
            While we strive to provide accurate and helpful practice materials, we cannot guarantee that using this service will result in passing the official Australian Citizenship Test. Success on the official test depends on many factors, including thorough study of "Our Common Bond" and understanding of Australian values, history, and government.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Always Verify</h2>
          <p className="text-gray-700 mb-4">
            We encourage all users to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Read the official "Our Common Bond" booklet multiple times</li>
            <li>Visit the Department of Home Affairs website for the most current information</li>
            <li>Verify any information with official government sources</li>
            <li>Seek official advice if uncertain about any aspect of the citizenship process</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-gray-700">
            For questions about this disclaimer, please contact us at:<br/>
            Email: contact@getcitizenship.com.au
          </p>
        </div>
      </div>
    </main>
  )
}
