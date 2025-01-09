import { motion } from 'framer-motion'
import { Brain, BarChart2, Lightbulb, Target, Shield, ListChecks } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AnalyzingProcessProps {
  onComplete: () => void
}

type MotionDivProps = {
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

const MotionDiv = motion.div as React.FC<MotionDivProps>
const MotionH1 = motion.h1 as React.FC<MotionDivProps>
const MotionP = motion.p as React.FC<MotionDivProps>

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

export function AnalyzingProcess({ onComplete }: AnalyzingProcessProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        // If we've reached the end, start over unless onComplete has been called
        if (prev === steps.length - 1) {
          setHasCompletedOnce(true)
          return 0 // Start over from the beginning
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  // Call onComplete only when hasCompletedOnce is true
  useEffect(() => {
    if (hasCompletedOnce) {
      onComplete()
    }
  }, [hasCompletedOnce, onComplete])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <MotionH1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Analyzing Your Role
          </MotionH1>
          <MotionP 
            className="text-base sm:text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Our AI is performing a comprehensive analysis of your role
          </MotionP>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep

            return (
              <MotionDiv
                key={step.title}
                className={`relative flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg ${
                  isActive ? 'bg-white shadow-lg' : 'bg-white/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${step.color} flex items-center justify-center`}>
                  {isComplete ? (
                    <MotionDiv
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </MotionDiv>
                  ) : (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-1">{step.description}</p>
                </div>

                {isActive && (
                  <MotionDiv
                    className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                )}
              </MotionDiv>
            )
          })}
        </div>
      </div>
    </div>
  )
} 