"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getStorageItem, removeStorageItem } from "@/lib/storage"
import { Tab } from '@headlessui/react'
import { createRoot } from 'react-dom/client'
import Navigation from '@/components/Navigation'
import { ChevronUp, Menu, Share2, Download, Filter, AlertTriangle, RefreshCw } from 'lucide-react'
import { SkillsRadar } from '@/components/visualizations/skills-radar'
import { Timeline } from '@/components/visualizations/timeline'
import { motion } from 'framer-motion'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { useClearStorageOnNavigation } from '@/hooks/useClearStorageOnNavigation'

interface AnalysisResult {
  overview: {
    impactScore: number
    summary: string
    timeframe: string
  }
  responsibilities: {
    current: {
      task: string
      automationRisk: number
      reasoning: string
      timeline: string
      humanValue: string
    }[]
    emerging: {
      task: string
      importance: string
      timeline: string
    }[]
  }
  skills: {
    current: {
      skill: string
      currentRelevance: number
      futureRelevance: number
      automationRisk: number
      reasoning: string
    }[]
    recommended: {
      skill: string
      importance: string
      timeline: string
      resources: {
        name: string
        type: string
        link: string
        duration: string
        cost: string
      }[]
    }[]
  }
  opportunities: {
    title: string
    description: string
    actionItems: string[]
    timeline: string
    potentialOutcome: string
  }[]
  threats: {
    title: string
    description: string
    riskLevel: string
    mitigationSteps: string[]
    timeline: string
  }[]
  recommendations: {
    immediate: {
      action: string
      reasoning: string
      resources: string[]
      expectedOutcome: string
    }[]
    shortTerm: {
      action: string
      reasoning: string
      resources: string[]
      expectedOutcome: string
    }[]
    longTerm: {
      action: string
      reasoning: string
      resources: string[]
      expectedOutcome: string
    }[]
  }
}

// Helper function to get impact score color
const getImpactScoreColor = (score: number) => {
  if (score <= 50) return '#10B981' // Green
  if (score <= 65) return '#F59E0B' // Yellow
  return '#EF4444' // Red
}

// Helper function to get impact score text color
const getImpactScoreTextColor = (score: number) => {
  if (score <= 50) return '#065F46' // Green text
  if (score <= 65) return '#92400E' // Yellow text
  return '#991B1B' // Red text
}

// Add this new component for PDF content
const PDFContent = ({ results }: { results: AnalysisResult | null }) => {
  if (!results) return null

  return (
    <div className="min-h-screen bg-white" id="pdf-content">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Reskilly Analysis Report</h1>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">{results.overview.summary}</p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Timeline: </span>
                    {results.overview.timeframe}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Impact Score</h2>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-4xl font-bold"
                        style={{ color: getImpactScoreTextColor(results.overview.impactScore) }}
                      >
                        {results.overview.impactScore}%
                      </span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={getImpactScoreColor(results.overview.impactScore)}
                        strokeWidth="3"
                        strokeDasharray={`${results.overview.impactScore}, 100`}
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsibilities Analysis</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Responsibilities</h3>
                <div className="space-y-4">
                  {results.responsibilities.current.map((resp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-32">Automation Risk:</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${resp.automationRisk}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{resp.automationRisk}%</span>
                        </div>
                        <p className="text-gray-600"><span className="font-medium">Timeline:</span> {resp.timeline}</p>
                        <p className="text-gray-600"><span className="font-medium">Reasoning:</span> {resp.reasoning}</p>
                        <p className="text-gray-600"><span className="font-medium">Human Value:</span> {resp.humanValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Emerging Responsibilities</h3>
                <div className="space-y-4">
                  {results.responsibilities.emerging.map((resp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                      <p className="text-gray-600 mt-2">{resp.importance}</p>
                      <p className="text-gray-500 mt-1">Timeline: {resp.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Assessment</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Skills</h3>
                <div className="space-y-4">
                  {results.skills.current.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-32">Current Relevance:</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${skill.currentRelevance}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{skill.currentRelevance}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-32">Future Relevance:</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${skill.futureRelevance}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{skill.futureRelevance}%</span>
                        </div>
                        <p className="text-gray-600 mt-2">{skill.reasoning}</p>
                      </div>
                    </div>
                  ))}<div className="min-h-screen bg-gray-50 mt-8"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Skills</h3>
                <div className="space-y-4">
                  {results.skills.recommended.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <p className="text-gray-600 mt-2">{skill.importance}</p>
                      <p className="text-gray-500">Timeline: {skill.timeline}</p>
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-900">Learning Resources:</h5>
                        <div className="mt-2 space-y-2">
                          {skill.resources.map((resource, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between">
                                <a 
                                  href={resource.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {resource.name}
                                </a>
                                <span className="text-gray-500">{resource.type}</span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                <span>{resource.duration}</span>
                                <span className="mx-2">•</span>
                                <span>{resource.cost}</span>
                              </div>
                              <div className="text-sm text-blue-600 mt-1">{resource.link}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Impact Analysis Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Analysis</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Opportunities</h3>
                <div className="space-y-4">
                  {results.opportunities.map((opp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{opp.title}</h4>
                      <p className="text-gray-600 mt-2">{opp.description}</p>
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-900">Action Items:</h5>
                        <ul className="mt-2 space-y-1">
                          {opp.actionItems.map((item, idx) => (
                            <li key={idx} className="text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3 text-gray-500">
                        <p><span className="font-medium">Timeline:</span> {opp.timeline}</p>
                        <p><span className="font-medium">Potential Outcome:</span> {opp.potentialOutcome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Threats</h3>
                <div className="space-y-4">
                  {results.threats.map((threat, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">{threat.title}</h4>
                        <span className={`px-2 py-1 rounded text-sm ${
                          threat.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          threat.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {threat.riskLevel} risk
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{threat.description}</p>
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-900">Mitigation Steps:</h5>
                        <ul className="mt-2 space-y-1">
                          {threat.mitigationSteps.map((step, idx) => (
                            <li key={idx} className="text-gray-600">• {step}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-3 text-gray-500"><span className="font-medium">Timeline:</span> {threat.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Plan Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Action Plan</h2>
            <div className="space-y-6">
              {[
                { title: "Immediate Actions", data: results.recommendations.immediate },
                { title: "Short-Term Actions (3-6 months)", data: results.recommendations.shortTerm },
                { title: "Long-Term Actions (6-12 months)", data: results.recommendations.longTerm }
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.data.map((rec, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{rec.action}</h4>
                        <p className="text-gray-600 mt-2">{rec.reasoning}</p>
                        <div className="mt-3">
                          <h5 className="font-medium text-gray-900">Resources:</h5>
                          <ul className="mt-2 space-y-1">
                            {rec.resources.map((resource, resourceIdx) => (
                              <li key={resourceIdx} className="text-gray-600">• {resource}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="mt-3 text-gray-600">
                          <span className="font-medium">Expected Outcome:</span> {rec.expectedOutcome}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'responsibilities', label: 'Responsibilities' },
  { id: 'skills', label: 'Skills Assessment' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'threats', label: 'Threats' },
  { id: 'recommendations', label: 'Recommendations' }
]

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const router = useRouter()
  
  // Add the hook to handle storage clearing on navigation
  useClearStorageOnNavigation()

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // LinkedIn share handler
  const handleShare = () => {
    const shareText = `I just analyzed my job's AI impact using Reskilly! Check out how AI might affect your career: `
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`
    window.open(shareUrl, '_blank')
  }

  // PDF generation handler
  const handleExportPDF = async () => {
    if (!results) {
      console.error('No results available for PDF generation')
      return
    }

    setIsGeneratingPDF(true)
    try {
      // Create a temporary div for PDF content
      const tempDiv = document.createElement('div')
      document.body.appendChild(tempDiv)

      // Render PDF content
      const root = createRoot(tempDiv)
      await new Promise<void>(resolve => {
        root.render(<PDFContent results={results} />)
        setTimeout(resolve, 1000)
      })

      // Get styles
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n')
          } catch {
            return ''
          }
        })
        .join('\n')

      // Create HTML content
      const html = `
        <html>
          <head>
            <style>${styles}</style>
          </head>
          <body>
            ${tempDiv.innerHTML}
          </body>
        </html>
      `

      // Clean up
      root.unmount()
      document.body.removeChild(tempDiv)

      // Generate PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html })
      })

      if (!response.ok) throw new Error('Failed to generate PDF')

      // Download PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ai-impact-analysis.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Filter recommendations
  const getFilteredRecommendations = () => {
    if (!selectedFilters.length) return results?.recommendations

    return {
      immediate: results?.recommendations.immediate.filter(rec => 
        selectedFilters.some(filter => rec.action.toLowerCase().includes(filter.toLowerCase()))
      ) || [],
      shortTerm: results?.recommendations.shortTerm.filter(rec => 
        selectedFilters.some(filter => rec.action.toLowerCase().includes(filter.toLowerCase()))
      ) || [],
      longTerm: results?.recommendations.longTerm.filter(rec => 
        selectedFilters.some(filter => rec.action.toLowerCase().includes(filter.toLowerCase()))
      ) || []
    }
  }

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true)
        const storedResults = getStorageItem<AnalysisResult>("ANALYSIS_RESULTS")
        if (!storedResults) {
          router.push("/analyze")
          return
        }
        // Initialize opportunities and threats arrays if they don't exist
        const resultsWithDefaults = {
          ...storedResults,
          opportunities: storedResults.opportunities || [],
          threats: storedResults.threats || []
        }
        setResults(resultsWithDefaults)
      } catch (err) {
        // Clear storage only on error
        removeStorageItem("JOB_DATA")
        removeStorageItem("ANALYSIS_RESULTS")
        setError(err instanceof Error ? err : new Error('Failed to load results'))
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [router])

  // Scroll observer effect
  useEffect(() => {
    if (!results) return

    // Scroll observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    // Back to top visibility
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [results])

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' })
    setIsTocOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <button
                  onClick={() => router.push("/analyze")}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Start New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!results) return null

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Table of Contents Sidebar */}
        <div className={`
          fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50
          ${isTocOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contents</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm
                    ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header with Share/Export buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">Reskilly Analysis Report</h1>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Download className="w-5 h-5" />
                  <span>{isGeneratingPDF ? 'Generating...' : 'Export PDF'}</span>
                </button>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="order-2 md:order-1">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Impact Summary</h3>
                      <p className="text-gray-600 leading-relaxed">{results.overview.summary}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                      <p className="text-gray-600">{results.overview.timeframe}</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-32 sm:w-40 h-32 sm:h-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span 
                            className="text-4xl sm:text-5xl font-bold block"
                            style={{ color: getImpactScoreTextColor(results.overview.impactScore) }}
                          >
                            {results.overview.impactScore}%
                          </span>
                          <span className="text-sm text-gray-500 mt-1 block">Impact Score</span>
                        </div>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={getImpactScoreColor(results.overview.impactScore)}
                          strokeWidth="3"
                          strokeDasharray={`${results.overview.impactScore}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Sections */}
            <Tab.Group>
              <Tab.List className="flex flex-wrap sm:flex-nowrap gap-2 rounded-xl bg-gray-100 p-2">
                {sections.slice(1).map((section) => (
                  <Tab
                    key={section.id}
                    className={({ selected }) =>
                      `flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
                      ${
                        selected
                          ? 'bg-white shadow text-blue-700'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'
                      }`
                    }
                  >
                    {section.label}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="mt-4">
                {/* Responsibilities Panel */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Responsibilities Analysis</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Current Responsibilities</h3>
                        <div className="space-y-4">
                          {results.responsibilities.current.map((resp, index) => (
                            <div key={index} className="border rounded-lg p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm text-gray-500 sm:w-32">Automation Risk:</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ width: `${resp.automationRisk}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-500">{resp.automationRisk}%</span>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-gray-600 text-sm sm:text-base">
                                    <span className="font-medium">Timeline:</span> {resp.timeline}
                                  </p>
                                  <p className="text-gray-600 text-sm sm:text-base">
                                    <span className="font-medium">Reasoning:</span> {resp.reasoning}
                                  </p>
                                  <p className="text-gray-600 text-sm sm:text-base">
                                    <span className="font-medium">Human Value:</span> {resp.humanValue}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Emerging Responsibilities</h3>
                        <div className="space-y-4">
                          {results.responsibilities.emerging.map((resp, index) => (
                            <div key={index} className="border rounded-lg p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                              <p className="text-gray-600 mt-2 text-sm sm:text-base">{resp.importance}</p>
                              <p className="text-gray-500 mt-1 text-sm sm:text-base">Timeline: {resp.timeline}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Skills Assessment Panel */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Skills Assessment</h2>
                    {/* Radar Chart with Explanation */}
                    <div className="mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding the Skills Radar</h3>
                        <p className="text-gray-600">
                          This radar chart visualizes your current skill levels (blue) against projected future importance (green).
                          The further a point is from the center, the higher the relevance/importance.
                          Areas where green extends beyond blue indicate skills that need development.
                        </p>
                      </div>
                      <SkillsRadar 
                        skills={results.skills.current.map(skill => ({
                          skill: skill.skill,
                          currentRelevance: skill.currentRelevance,
                          futureRelevance: skill.futureRelevance
                        }))}
                      />
                    </div>

                    {/* Skills Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Current Skills</h3>
                        <div className="space-y-4">
                          {results.skills.current.map((skill, index) => (
                            <div key={index} className="border rounded-lg p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm text-gray-500 sm:w-32">Current Relevance:</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${skill.currentRelevance}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-500">{skill.currentRelevance}%</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm text-gray-500 sm:w-32">Future Relevance:</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${skill.futureRelevance}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-500">{skill.futureRelevance}%</span>
                                </div>
                                <p className="text-gray-600 mt-2">{skill.reasoning}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recommended Skills</h3>
                        <div className="space-y-4">
                          {results.skills.recommended.map((skill, index) => (
                            <div key={index} className="border rounded-lg p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                              <p className="text-gray-600 mt-2 text-sm sm:text-base">{skill.importance}</p>
                              <p className="text-gray-500 mt-1 text-sm sm:text-base">Timeline: {skill.timeline}</p>
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-900">Learning Resources:</h5>
                                <div className="mt-2 space-y-2">
                                  {skill.resources.map((resource, idx) => (
                                    <div key={idx} className="bg-gray-50 p-3 rounded">
                                      <div className="flex justify-between">
                                        <a 
                                          href={resource.link} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          {resource.name}
                                        </a>
                                        <span className="text-gray-500">{resource.type}</span>
                                      </div>
                                      <div className="text-sm text-gray-500 mt-1">
                                        <span>{resource.duration}</span>
                                        <span className="mx-2">•</span>
                                        <span>{resource.cost}</span>
                                      </div>
                                      <div className="text-sm text-blue-600 mt-1">{resource.link}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Opportunities Panel */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Opportunities</h2>
                    <div className="space-y-4">
                      {results.opportunities.map((opp, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold text-gray-900">{opp.title}</h4>
                          <p className="text-gray-600 mt-2">{opp.description}</p>
                          <div className="mt-3">
                            <h5 className="font-medium text-gray-900">Action Items:</h5>
                            <ul className="mt-2 space-y-1">
                              {opp.actionItems.map((item, idx) => (
                                <li key={idx} className="text-gray-600">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 text-gray-500">
                            <p><span className="font-medium">Timeline:</span> {opp.timeline}</p>
                            <p><span className="font-medium">Potential Outcome:</span> {opp.potentialOutcome}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Threats Panel */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Threats</h2>
                    <div className="space-y-4">
                      {results.threats.map((threat, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">{threat.title}</h4>
                            <span className={`px-2 py-1 rounded text-sm ${
                              threat.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                              threat.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {threat.riskLevel} risk
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">{threat.description}</p>
                          <div className="mt-3">
                            <h5 className="font-medium text-gray-900">Mitigation Steps:</h5>
                            <ul className="mt-2 space-y-1">
                              {threat.mitigationSteps.map((step, idx) => (
                                <li key={idx} className="text-gray-600">• {step}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="mt-3 text-gray-500"><span className="font-medium">Timeline:</span> {threat.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Panel>

                {/* Action Plan Panel */}
                <Tab.Panel>
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Action Plan</h2>
                    <Timeline 
                      items={[
                        ...results.recommendations.immediate.map(rec => ({
                          title: rec.action,
                          description: rec.reasoning,
                          timeline: 'Immediate',
                          type: 'immediate' as const
                        })),
                        ...results.recommendations.shortTerm.map(rec => ({
                          title: rec.action,
                          description: rec.reasoning,
                          timeline: '3-6 months',
                          type: 'short-term' as const
                        })),
                        ...results.recommendations.longTerm.map(rec => ({
                          title: rec.action,
                          description: rec.reasoning,
                          timeline: '6-12 months',
                          type: 'long-term' as const
                        }))
                      ]}
                    />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg
            hover:bg-blue-700 transition-all transform
            ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
          `}
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ 
              width: `${(sections.findIndex(s => s.id === activeSection) + 1) * (100 / sections.length)}%` 
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
} 