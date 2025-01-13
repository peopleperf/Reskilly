'use client'

import { Brain, BarChart2, Lightbulb, Target, Shield, ListChecks } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AnalyzingProcessProps {
  jobData: {
    jobTitle: string;
    industry: string;
    responsibilities?: string;
    skills?: string;
  };
  onComplete?: (data: any) => void;
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
  const [completed, setCompleted] = useState(false)

  const analyzeJob = async () => {
    try {
      // Start with the first step immediately
      setCurrentStep(0);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job');
      }

      // Only store data after successful API call
      localStorage.setItem('JOB_DATA', JSON.stringify(jobData));
      localStorage.setItem('ANALYSIS_RESULTS', JSON.stringify(data));

      // Simulate steps with shorter delays
      for (let i = 1; i < steps.length; i++) {
        setCurrentStep(i);
        // Reduced delay between steps
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setCompleted(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (onComplete) {
        onComplete(data);
      }
      router.push("/results");
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze job. Please try again.');
      // Don't redirect immediately, give user time to read the error
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/analyze');
    }
  };

  useEffect(() => {
    if (jobData) {
      analyzeJob();
    }
  }, [jobData, router, onComplete])

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {error ? (
          <div className="text-center animate-fade-in">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
            <p className="text-gray-600">{error}</p>
            <p className="text-gray-400">Redirecting back to form...</p>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div
                className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"
                style={{
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                }}
              ></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Role</h3>
            <p className="text-gray-600">{jobData.jobTitle} in {jobData.industry}</p>
            <p className="text-lg text-gray-600 mb-8">
              Step {currentStep + 1} of {steps.length}: <span className="text-blue-500 font-medium">{steps[currentStep]?.title}</span>
            </p>
          </div>
        )}

        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-200 animate-fade-in">
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isComplete = index < currentStep

              return (
                <div
                  key={step.title}
                  className={`relative rounded-lg p-6 transition-all duration-300 animate-fade-in ${
                    isActive ? 'bg-blue-500/10 border-2 border-blue-500' : 
                    isComplete ? 'bg-green-500/10 border-2 border-green-500' : 'bg-white/50 border-2 border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-full ${
                    isComplete ? 'bg-green-500' : 
                    isActive ? 'bg-blue-500' : 'bg-gray-200'
                  } flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isActive ? 'text-blue-400' : 
                    isComplete ? 'text-green-400' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  {isComplete && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
