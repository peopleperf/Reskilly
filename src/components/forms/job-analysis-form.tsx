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
  responsibilities: z.string().optional(),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function JobAnalysisForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
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
    setFormData(data)
  }

  if (isAnalyzing && formData) {
    const processData = {
      jobTitle: formData.jobTitle,
      industry: formData.industry,
      responsibilities: formData.responsibilities?.trim(),
      skills: formData.skills?.trim(),
    }
    
    return (
      <div className="fixed inset-0 z-50">
        <AnalyzingProcess 
          jobData={processData} 
          onComplete={() => {
            setIsAnalyzing(false)
            setFormData(null)
          }}
        />
      </div>
    )
  }

  const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-colors duration-200"
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1"
  const errorClasses = "text-red-500 text-sm mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="jobTitle" className={labelClasses}>
          Job Title *
        </label>
        <Input
          id="jobTitle"
          type="text"
          placeholder="e.g., Software Engineer"
          className={inputClasses}
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p className={errorClasses}>{errors.jobTitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="industry" className={labelClasses}>
          Industry *
        </label>
        <Input
          id="industry"
          type="text"
          placeholder="e.g., Technology"
          className={inputClasses}
          {...register("industry")}
        />
        {errors.industry && (
          <p className={errorClasses}>{errors.industry.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="responsibilities" className={labelClasses}>
          Key Responsibilities (Optional)
        </label>
        <textarea
          id="responsibilities"
          placeholder="Enter your key responsibilities..."
          className={inputClasses}
          rows={4}
          {...register("responsibilities")}
        />
        {errors.responsibilities && (
          <p className={errorClasses}>{errors.responsibilities.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="skills" className={labelClasses}>
          Current Skills (Optional)
        </label>
        <textarea
          id="skills"
          placeholder="Enter your current skills..."
          className={inputClasses}
          rows={4}
          {...register("skills")}
        />
        {errors.skills && (
          <p className={errorClasses}>{errors.skills.message}</p>
        )}
      </div>

      {analysisError && (
        <div className="text-red-500 text-sm font-medium">{analysisError}</div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
        disabled={isAnalyzing}
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