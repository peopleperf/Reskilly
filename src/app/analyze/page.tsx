'use client'

import { useState } from "react"
import Select from 'react-select'
import { jobTitles, industries } from "@/data/jobData"
import { AnalyzingProcess } from "@/components/analyzing-process"

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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

    setIsAnalyzing(true)
  }

  if (isAnalyzing) {
    return (
      <AnalyzingProcess
        jobData={{
          jobTitle: selectedJob?.value === 'other' ? customJob : selectedJob?.label,
          industry: selectedIndustry?.value === 'other' ? customIndustry : selectedIndustry?.label,
          responsibilities: responsibilities.trim(),
          skills: skills.trim(),
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Column - Image */}
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
                  <div className="h-full flex flex-col justify-center p-8 text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      Prepare for the Future
                    </h2>
                    <p className="text-lg sm:text-xl text-blue-100">
                      Get insights into how AI will impact your career and discover opportunities for growth.
                    </p>
                  </div>
                </div>
                <img
                  src="/images/analyze-background.jpg"
                  alt="AI Analysis"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>

              {/* Right Column - Form */}
              <div className="p-8">
                <div className="max-w-xl">
                  <h1 className="text-3xl font-bold mb-6">
                    Analyze Your Job's AI Impact
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Fill in your job details below to receive a personalized analysis of how AI might affect your role.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <Select
                        key="job-select"
                        instanceId="job-select"
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
                        key="industry-select"
                        instanceId="industry-select"
                        options={industries}
                        value={selectedIndustry}
                        onChange={setSelectedIndustry}
                        className="mb-2"
                        placeholder="Select your industry..."
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
                      <div className="text-red-500 text-sm mt-2">
                        {error}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Impact'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
