"use client"

import Image from "next/image"
import Navigation from '@/components/Navigation'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Select from 'react-select'
import { jobTitles, industries } from "@/data/jobData"
import { JobAnalysisForm } from "@/components/forms/job-analysis-form"

export default function AnalyzePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null)
  const [customJob, setCustomJob] = useState("")
  const [customIndustry, setCustomIndustry] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [skills, setSkills] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate required fields
    const jobTitle = selectedJob?.value === 'other' ? customJob : selectedJob?.label
    const industry = selectedIndustry?.value === 'other' ? customIndustry : selectedIndustry?.label

    if (!jobTitle || !industry) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          industry,
          responsibilities: responsibilities.trim(),
          skills: skills.trim(),
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      localStorage.setItem("ANALYSIS_RESULTS", JSON.stringify(data))
      router.push("/results")
    } catch (err) {
      setError("Failed to analyze job. Please try again.")
      setIsLoading(false)
    }
  }

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <Select
                      options={jobTitles}
                      value={selectedJob}
                      onChange={setSelectedJob}
                      className="mb-2"
                      placeholder="Select or type your job title..."
                      isSearchable
                    />
                    {selectedJob?.value === 'other' && (
                      <input
                        type="text"
                        value={customJob}
                        onChange={(e) => setCustomJob(e.target.value)}
                        placeholder="Enter your job title"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <Select
                      options={industries}
                      value={selectedIndustry}
                      onChange={setSelectedIndustry}
                      className="mb-2"
                      placeholder="Select or type your industry..."
                      isSearchable
                    />
                    {selectedIndustry?.value === 'other' && (
                      <input
                        type="text"
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="Enter your industry"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Responsibilities (Optional)
                    </label>
                    <textarea
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      rows={4}
                      placeholder="Enter your key job responsibilities..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Adding responsibilities will help provide more accurate analysis
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Skills (Optional)
                    </label>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      rows={4}
                      placeholder="Enter your current skills..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Adding skills will help provide more accurate analysis
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm font-medium">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? "Analyzing..." : "Analyze Impact"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}