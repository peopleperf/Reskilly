"use client"

import Image from "next/image"
import Navigation from '@/components/Navigation'
import { JobAnalysisForm } from "@/components/forms/job-analysis-form"

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-16 sm:mt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            {/* Image Section */}
            <div className="relative h-[300px] sm:h-[400px] md:min-h-[600px] order-2 md:order-1">
              <Image
                src="/images/analyze-background.jpg"
                alt="Professional team analyzing data"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
                <div className="p-6 sm:p-8 relative z-10 h-full flex flex-col justify-center text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Prepare for the Future</h2>
                  <p className="text-base sm:text-lg text-gray-200">
                    Get insights into how AI will impact your career and discover opportunities for growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8 md:p-12 order-1 md:order-2 bg-white">
              <div className="max-w-lg mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Analyze Your Job's AI Impact
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                  Fill in your job details below to receive a personalized analysis of how AI might affect your role.
                </p>
                <JobAnalysisForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}