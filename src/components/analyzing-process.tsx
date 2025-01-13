'use client'

import { Brain, BarChart2, Lightbulb, Target, Shield, ListChecks, CheckCircle, XCircle, CheckIcon } from 'lucide-react'
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

  const onRetry = () => {
    setError(null);
    analyzeJob();
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col pt-16 sm:pt-20">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {error ? (
            <div className="text-center animate-fade-in py-8">
              <XCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
              <button
                onClick={onRetry}
                className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : completed ? (
            <div className="text-center animate-fade-in py-8">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Analysis Complete!</h3>
              <p className="text-sm sm:text-base text-gray-600">Your results are ready.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div
                  className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"
                  style={{
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                  }}
                ></div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Analyzing Your Job...</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-8">This may take a few moments.</p>
              
              {/* Progress Steps */}
              <div className="space-y-6 mb-8">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className={`relative rounded-lg p-4 sm:p-6 transition-all duration-300 animate-fade-in ${
                        isActive ? 'bg-blue-50 border-2 border-blue-500' : 
                        isComplete ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                          isComplete ? 'bg-green-500' : 
                          isActive ? 'bg-blue-500' : 'bg-gray-200'
                        } flex items-center justify-center`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm sm:text-base font-medium mb-1 ${
                            isActive ? 'text-blue-700' : 
                            isComplete ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">{step.description}</p>
                        </div>
                        {isComplete && (
                          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                            <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
