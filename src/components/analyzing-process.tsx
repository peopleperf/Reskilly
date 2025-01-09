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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '40rem', width: '100%' }}>
        {error ? (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fcd2d2', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <m.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: '#dc2626' }}
            >
              {error}
            </m.p>
          </div>
        ) : (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              Analyzing {jobData.jobTitle} in {jobData.industry}
            </h1>
          </m.div>
        )}

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{ color: '#6b7280' }}>
            Please wait while we analyze the AI impact on your role...
          </p>
        </m.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1.5rem' }}>
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
                style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  border: isActive ? '2px solid #3b82f6' : 'none'
                }}
              >
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: step.color, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'semibold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#6b7280' }}>{step.description}</p>
                {(isActive || isComplete) && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '0.5rem'
                    }}
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