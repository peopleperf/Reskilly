"use client"

import { Brain, BarChart2, Lightbulb, Target, Shield, ListChecks, CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface JobData {
  jobTitle: string
  industry: string
  responsibilities?: string
  skills?: string
}

interface AnalyzingProcessProps {
  jobData: JobData
  onComplete?: (data: any) => void
  onError?: (error: Error) => void
}

interface AnalysisResponse {
  id: string;
  analysis: {
    overview: {
      impactScore: number;
      summary: string;
      timeframe: string;
    };
    responsibilities: {
      current: Array<{
        task: string;
        automationRisk: number;
        reasoning: string;
        timeline: string;
        humanValue: string;
      }>;
      emerging: Array<{
        task: string;
        importance: number;
        timeline: string;
        reasoning: string;
      }>;
    };
    skills: {
      current: Array<{
        skill: string;
        currentRelevance: number;
        futureRelevance: number;
        automationRisk: number;
        reasoning: string;
      }>;
      recommended: Array<{
        skill: string;
        importance: number;
        timeline: string;
        resources: string[];
      }>;
    };
    opportunities: Array<{
      title: string;
      description: string;
      actionItems: string[];
      timeline: string;
      potentialOutcome: string;
    }>;
    threats: Array<{
      title: string;
      description: string;
      riskLevel: number;
      mitigationSteps: string[];
      timeline: string;
    }>;
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
  status?: number;
}

const steps = [
  {
    icon: Brain,
    title: "Scanning Job Profile",
    description: "Analyzing job responsibilities and requirements",
    color: "bg-blue-500",
  },
  {
    icon: BarChart2,
    title: "Evaluating Skills",
    description: "Assessing current and future skill relevance",
    color: "bg-purple-500",
  },
  {
    icon: Target,
    title: "Measuring Impact",
    description: "Calculating AI impact on role components",
    color: "bg-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Identifying Opportunities",
    description: "Discovering growth and adaptation possibilities",
    color: "bg-green-500",
  },
  {
    icon: Shield,
    title: "Assessing Risks",
    description: "Evaluating potential challenges and threats",
    color: "bg-red-500",
  },
  {
    icon: ListChecks,
    title: "Creating Action Plan",
    description: "Generating personalized recommendations",
    color: "bg-indigo-500",
  },
]

function validateAnalysisResponse(data: any): data is AnalysisResponse {
  try {
    if (!data.id || typeof data.id !== 'string') return false;
    if (!data.analysis) return false;

    const { analysis } = data;
    
    if (!analysis.overview?.impactScore || typeof analysis.overview.impactScore !== 'number') return false;
    if (!analysis.overview?.summary || typeof analysis.overview.summary !== 'string') return false;
    if (!analysis.overview?.timeframe || typeof analysis.overview.timeframe !== 'string') return false;
    
    if (!Array.isArray(analysis.responsibilities?.current)) return false;
    if (!Array.isArray(analysis.responsibilities?.emerging)) return false;
    if (!Array.isArray(analysis.skills?.current)) return false;
    if (!Array.isArray(analysis.skills?.recommended)) return false;
    if (!Array.isArray(analysis.opportunities)) return false;
    if (!Array.isArray(analysis.threats)) return false;
    
    if (!Array.isArray(analysis.recommendations?.immediate)) return false;
    if (!Array.isArray(analysis.recommendations?.shortTerm)) return false;
    if (!Array.isArray(analysis.recommendations?.longTerm)) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

export function AnalyzingProcess({ jobData, onComplete, onError }: AnalyzingProcessProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeJob = useCallback(async () => {
    if (isAnalyzing) return // Prevent multiple simultaneous requests
    
    try {
      setIsAnalyzing(true)
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!validateAnalysisResponse(data)) {
        throw new Error('Invalid response format from server');
      }

      setCompleted(true);

      if (onComplete) {
        onComplete(data);
      }

      // Wait a moment to ensure data is stored before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(
        `/results?id=${data.id}&jobTitle=${encodeURIComponent(jobData.jobTitle)}&industry=${encodeURIComponent(jobData.industry)}`,
      );
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
      setCompleted(false);
      if (onError) {
        onError(error instanceof Error ? error : new Error(error.message || 'Unknown error'));
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobData, onComplete, onError, router, isAnalyzing])

  useEffect(() => {
    analyzeJob();
    const interval = setInterval(() => {
      if (!completed && !error) {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [analyzeJob, completed, error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Analysis Failed</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setCurrentStep(0);
              setCompleted(false);
              analyzeJob();
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col pt-16 sm:pt-20">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {completed ? (
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
                    borderRightColor: "transparent",
                    borderBottomColor: "transparent",
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
                      className={`flex items-center space-x-4 ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? step.color : "bg-gray-200"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

