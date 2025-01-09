"use client"

import { motion, HTMLMotionProps } from "framer-motion"

interface ProgressStepsProps {
  currentStep: number
  steps: {
    label: string
    description?: string
  }[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              backgroundColor: 'black'
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            
            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: isCompleted || isCurrent ? '#000' : '#fff',
                    color: isCompleted || isCurrent ? '#fff' : '#9ca3af',
                    border: isCompleted || isCurrent ? 'none' : '2px solid #e5e7eb'
                  }}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {index + 1}
                </motion.div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${isCurrent ? "text-black" : "text-gray-500"}`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
