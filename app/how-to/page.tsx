'use client'

import { Search, FileText, Target } from "lucide-react"

export default function HowToPage(): JSX.Element {
  return (
    <main className="min-h-screen pt-24 md:pt-28">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 md:space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">How to Get the Most Out of Reskilly</h1>
            <p className="text-gray-600 text-lg">Transform insights into action and future-proof your career</p>
          </div>

          <div className="bg-blue-50/50 p-4 md:p-8 rounded-xl">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Follow these simple steps to understand how AI will impact your career and get actionable recommendations
              to stay ahead of the curve. You'll receive a personalized analysis and development plan tailored to your
              role.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Step 1 */}
            <div className="bg-white shadow-sm border border-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  1
                </div>
                <h3 className="font-semibold text-lg">Enter Your Job Title</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm md:text-base">
                Start by entering your current job title or the role you're interested in analyzing.
              </p>
              <p className="text-blue-600 text-sm">Example: "Marketing Manager" or "Data Analyst"</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white shadow-sm border border-green-100 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  2
                </div>
                <h3 className="font-semibold text-lg">Review the Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Examine your comprehensive AI impact analysis, including:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm md:text-base pl-4">
                <li>• Overall AI Impact score and timeline</li>
                <li>• Current and emerging responsibilities</li>
                <li>• Skills assessment and recommendations</li>
                <li>• Opportunities and potential challenges</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white shadow-sm border border-purple-100 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  3
                </div>
                <h3 className="font-semibold text-lg">Take Action</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Follow your personalized action plan designed to help you thrive:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm md:text-base pl-4">
                <li>• Immediate steps to future-proof your role</li>
                <li>• Short-term skill development goals</li>
                <li>• Long-term career advancement strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

