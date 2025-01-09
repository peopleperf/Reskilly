"use client"

import { motion } from 'framer-motion'

interface TimelineItem {
  title: string
  description: string
  timeline: string
  type: 'immediate' | 'short-term' | 'long-term'
}

interface TimelineProps {
  items: TimelineItem[]
}

type MotionDivProps = {
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

const MotionDiv = motion.div as React.FC<MotionDivProps>

export function Timeline({ items }: TimelineProps) {
  const getTypeColor = (type: TimelineItem['type']) => {
    switch (type) {
      case 'immediate':
        return 'bg-blue-500'
      case 'short-term':
        return 'bg-purple-500'
      case 'long-term':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: TimelineItem['type']) => {
    switch (type) {
      case 'immediate':
        return 'Immediate'
      case 'short-term':
        return '3-6 Months'
      case 'long-term':
        return '6-12 Months'
      default:
        return ''
    }
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Timeline items */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start space-x-4 ml-8"
          >
            {/* Timeline dot */}
            <div className="absolute -left-8 mt-1">
              <div className={`w-4 h-4 rounded-full ${getTypeColor(item.type)} ring-4 ring-white`} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${getTypeColor(item.type)} bg-opacity-10 text-gray-700
                  `}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Timeline: {item.timeline}
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center space-x-6">
        {(['immediate', 'short-term', 'long-term'] as const).map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
            <span className="text-sm text-gray-600">{getTypeLabel(type)}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 