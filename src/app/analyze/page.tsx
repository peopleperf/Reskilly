"use client"

import Image from "next/image"
import Navigation from '@/components/Navigation'
import { JobAnalysisForm } from "@/components/forms/job-analysis-form"

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12 mt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            {/* Image Section */}
            <div className="relative h-full min-h-[400px] md:min-h-[600px] order-2 md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                alt="Professional team analyzing data"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
                <div className="p-8 relative z-10 h-full flex flex-col justify-center text-white">
                  <h2 className="text-3xl font-bold mb-4">Prepare for the Future</h2>
                  <p className="text-lg text-gray-200">
                    Get insights into how AI will impact your career and discover opportunities for growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8 md:p-12 order-1 md:order-2 bg-white">
              <div className="max-w-lg mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Analyze Your Job's AI Impact
                </h1>
                <p className="text-lg text-gray-600 mb-8">
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