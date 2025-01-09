'use client'

import { m } from 'framer-motion'
import { Brain, BarChart2, Lightbulb, Target, Shield, ListChecks } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AnalyzingProcessProps {
  jobData: {
    jobTitle: string;
    industry: string;
    responsibilities?: string;
    skills?: string;
  };
  onComplete?: () => void;
}

const steps = [
  {
    icon: Brain,
    title: 'Scanning Job Profile',
    description: 'Analyzing job responsibilities and requirements',
    color: 'bg-blue-500'
  },
  {
    icon: BarChart2,
    title: 'Evaluating Skills',
    description: 'Assessing current and future skill relevance',
    color: 'bg-purple-500'
  },
  {
    icon: Target,
    title: 'Measuring Impact',
    description: 'Calculating AI impact on role components',
    color: 'bg-orange-500'
  },
  {
    icon: Lightbulb,
    title: 'Identifying Opportunities',
    description: 'Discovering growth and adaptation possibilities',
    color: 'bg-green-500'
  },
  {
    icon: Shield,
    title: 'Assessing Risks',
    description: 'Evaluating potential challenges and threats',
    color: 'bg-red-500'
  },
  {
    icon: ListChecks,
    title: 'Creating Action Plan',
    description: 'Generating personalized recommendations',
    color: 'bg-indigo-500'
  }
]

export function AnalyzingProcess({ jobData, onComplete }: AnalyzingProcessProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const analyzeJob = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze job')
        }

        const result = await response.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Simulate steps with delays
        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          setCurrentStep(i + 1)
        }

        // Store results
        localStorage.setItem("JOB_DATA", JSON.stringify(jobData))
        localStorage.setItem("ANALYSIS_RESULTS", JSON.stringify(result))
        
        // Navigate to results
        router.push("/results")
        onComplete?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze job')
        setTimeout(() => router.push("/analyze"), 3000) // Redirect back after error
      }
    }

    analyzeJob()
  }, [jobData, router, onComplete])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-600"
            >
              {error}
            </m.div>
          </div>
        ) : (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-8">
              Analyzing {jobData.jobTitle} in {jobData.industry}
            </h1>
          </m.div>
        )}

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <p className="text-gray-600">
            Please wait while we analyze the AI impact on your role...
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep

            return (
              <m.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-lg p-6 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                {(isActive || isComplete) && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-lg"
                  />
                )}
              </m.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}