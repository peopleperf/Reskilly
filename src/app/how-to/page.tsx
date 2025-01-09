"use client"

import Navigation from '@/components/Navigation'
import { Search, FileText, Target, Download, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function HowToPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12 mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Get the Most Out of Reskilly</h1>
            <p className="text-xl text-gray-600">Transform insights into action and future-proof your career</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-12">
            {/* Introduction */}
            <div className="text-gray-600 leading-relaxed border-l-4 border-blue-600 pl-6 py-2">
              Follow these simple steps to understand how AI will impact your career and get actionable recommendations 
              to stay ahead of the curve. You'll receive a personalized analysis and development plan tailored to your role.
            </div>

            {/* Steps Section */}
            <section className="space-y-8">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-12">
                  {/* Step 1 */}
                  <div className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-8">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold relative z-10">
                        1
                      </div>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <Search className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Enter Your Job Title</h3>
                          <p className="text-gray-600 mt-2">
                            Start by entering your current job title or the role you're interested in analyzing.
                            <span className="block mt-2 text-sm text-blue-600">
                              Example: "Marketing Manager" or "Data Analyst"
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-8">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold relative z-10">
                        2
                      </div>
                    </div>
                    <div className="flex-1 bg-green-50 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <FileText className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Review the Analysis</h3>
                          <p className="text-gray-600 mt-2">
                            Examine your comprehensive AI impact analysis, including:
                          </p>
                          <ul className="mt-3 space-y-2">
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                              Overall AI impact score and timeline
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                              Current and emerging responsibilities
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                              Skills assessment and recommendations
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                              Opportunities and potential challenges
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-8">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold relative z-10">
                        3
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <Target className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Take Action</h3>
                          <p className="text-gray-600 mt-2">
                            Follow your personalized action plan designed to help you thrive:
                          </p>
                          <ul className="mt-3 space-y-2">
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                              Immediate steps to future-proof your role
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                              Short-term skill development goals
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                              Long-term career advancement strategies
                            </li>
                            <li className="flex items-center text-gray-600">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                              Curated learning resources and opportunities
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start space-x-6">
                    <div className="flex-shrink-0 w-8">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold relative z-10">
                        4
                      </div>
                    </div>
                    <div className="flex-1 bg-orange-50 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <Download className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Export Your Results</h3>
                          <p className="text-gray-600 mt-2">
                            Download a detailed PDF report of your analysis to reference later or share with your manager and mentors.
                            Your roadmap to success, always at your fingertips.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section className="bg-gray-50 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for Best Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Be specific with your job title for more accurate analysis</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Review all sections of the analysis thoroughly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Focus on both immediate and long-term recommendations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Regularly reassess as the AI landscape evolves</p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center pt-4">
              <Link 
                href="/analyze" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Start Now: Analyze Your Job's Future with AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 