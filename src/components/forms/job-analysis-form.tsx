"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { setStorageItem, removeStorageItem } from "@/lib/storage"
import { AnalyzingProcess } from "@/components/analyzing-process"

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  responsibilities: z.string().min(10, "Please provide more details about your responsibilities"),
  skills: z.string().min(10, "Please provide more details about your skills"),
})

type FormData = z.infer<typeof formSchema>

export function JobAnalysisForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isApiComplete, setIsApiComplete] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const router = useRouter()

  // Clear storage only when the form first mounts and we're not already analyzing
  useEffect(() => {
    if (!isAnalyzing) {
      removeStorageItem("JOB_DATA")
      removeStorageItem("ANALYSIS_RESULTS")
      removeStorageItem("ANALYSIS_ERROR")
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const formattedData = {
        ...data,
        responsibilities: data.responsibilities.split(",").map((r) => r.trim()),
        skills: data.skills.split(",").map((s) => s.trim()),
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze job")
      }

      if (result.error) {
        throw new Error(result.error)
      }

      setStorageItem("JOB_DATA", formattedData)
      setStorageItem("ANALYSIS_RESULTS", result)
      setIsApiComplete(true)
      router.push("/results")
    } catch (error: any) {
      console.error("Analysis Error:", error)
      setAnalysisError(error.message || "Failed to analyze job. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50">
        <AnalyzingProcess onComplete={() => {
          if (isApiComplete) {
            router.push("/results")
          }
        }} />
      </div>
    )
  }

  const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-colors duration-200"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1"
  const errorClasses = "text-red-500 text-sm mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {analysisError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{analysisError}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="jobTitle" className={labelClasses}>
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          {...register("jobTitle")}
          placeholder="e.g. Software Engineer"
          className={`${inputClasses} ${errors.jobTitle ? 'border-red-500' : ''}`}
        />
        {errors.jobTitle && (
          <p className={errorClasses}>{errors.jobTitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="industry" className={labelClasses}>
          Industry
        </label>
        <input
          type="text"
          id="industry"
          {...register("industry")}
          placeholder="e.g. Technology"
          className={`${inputClasses} ${errors.industry ? 'border-red-500' : ''}`}
        />
        {errors.industry && (
          <p className={errorClasses}>{errors.industry.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="responsibilities" className={labelClasses}>
          Key Responsibilities
        </label>
        <textarea
          id="responsibilities"
          {...register("responsibilities")}
          placeholder="e.g. Developing web applications, Leading team projects"
          rows={4}
          className={`${inputClasses} resize-none ${errors.responsibilities ? 'border-red-500' : ''}`}
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple responsibilities with commas</p>
        {errors.responsibilities && (
          <p className={errorClasses}>{errors.responsibilities.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="skills" className={labelClasses}>
          Current Skills
        </label>
        <textarea
          id="skills"
          {...register("skills")}
          placeholder="e.g. JavaScript, React, Project Management"
          rows={4}
          className={`${inputClasses} resize-none ${errors.skills ? 'border-red-500' : ''}`}
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
        {errors.skills && (
          <p className={errorClasses}>{errors.skills.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isAnalyzing}
        className="w-full bg-black text-white hover:bg-black/90 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center">
            <Spinner className="mr-2" />
            Analyzing...
          </span>
        ) : (
          "Analyze AI Impact"
        )}
      </Button>
    </form>
  )
}