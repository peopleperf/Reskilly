'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { jobAnalysisSchema } from '@/lib/validation-schemas'
import { supabase } from '@/lib/supabase'
import { ZodError } from 'zod'

interface JobAnalysis {
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
      reasoning?: string;
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
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<JobAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalysis = async () => {
    try {
      const id = searchParams.get('id')
      if (!id) {
        throw new Error('No analysis ID provided')
      }

      const { data: analysisData, error: fetchError } = await supabase
        .from('job_analyses')
        .select('analysis')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error('Failed to fetch analysis')
      }

      if (!analysisData) {
        throw new Error('No analysis found')
      }

      try {
        const validatedData = jobAnalysisSchema.parse(analysisData.analysis)
        setResult(validatedData)
      } catch (validationError) {
        console.error('Validation errors:', validationError)
        if (validationError instanceof ZodError) {
          throw new Error('Invalid analysis data format')
        }
        throw validationError
      }
    } catch (error: any) {
      console.error('Error fetching analysis:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error || 'Failed to load analysis results'}</p>
          <button
            onClick={() => window.location.href = '/analyze'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    )
  }

  const getImpactColor = (score: number) => {
    if (score <= 40) return '#10B981' // Green for low impact
    if (score <= 60) return '#F59E0B' // Yellow for medium impact
    return '#EF4444' // Red for high impact
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Impact Analysis</h2>
              <p className="text-gray-600 mt-1">Expected timeline: {result.overview.timeframe}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="relative w-16 h-16">
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
                      stroke={getImpactColor(result.overview.impactScore)}
                      strokeWidth="3"
                      strokeDasharray={`${result.overview.impactScore}, 100`}
                    />
                    <text
                      x="18"
                      y="20.35"
                      className="fill-gray-900 font-medium text-5"
                      textAnchor="middle"
                    >
                      {result.overview.impactScore}%
                    </text>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Impact Score</p>
                  <p className="text-sm text-gray-500">Overall AI impact on role</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">{result.overview.summary}</p>
        </div>

        {/* Current Responsibilities Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Responsibilities</h3>
          <div className="space-y-6">
            {result.responsibilities.current.map((resp, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Automation Risk:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${resp.automationRisk}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{resp.automationRisk}%</span>
                  </div>
                  <p className="text-gray-600">{resp.reasoning}</p>
                  <p className="text-gray-600"><span className="font-medium">Timeline:</span> {resp.timeline}</p>
                  <p className="text-gray-600"><span className="font-medium">Human Value:</span> {resp.humanValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Responsibilities Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Emerging Responsibilities</h3>
          <div className="space-y-6">
            {result.responsibilities.emerging.map((resp, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{resp.task}</h4>
                <p className="text-gray-600 mt-2">
                  {resp.importance >= 90 ? 'Critical' : 'High'}, {resp.reasoning || 'as this skill will be essential for future role adaptability.'}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-32">Importance:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${resp.importance}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{resp.importance}%</span>
                  </div>
                  <p className="text-gray-600"><span className="font-medium">Timeline:</span> {resp.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Assessment</h3>
          
          {/* Current Skills */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Current Skills</h4>
            <div className="space-y-6">
              {result.skills.current.map((skill, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900">{skill.skill}</h5>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-32">Current Relevance:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${skill.currentRelevance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{skill.currentRelevance}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-32">Future Relevance:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${skill.futureRelevance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{skill.futureRelevance}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-32">Automation Risk:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${skill.automationRisk}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{skill.automationRisk}%</span>
                    </div>
                    <p className="text-gray-600 mt-2">{skill.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Skills */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Recommended Skills</h4>
            <div className="space-y-6">
              {result.skills.recommended.map((skill, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900">{skill.skill}</h5>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-32">Importance:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${skill.importance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{skill.importance}%</span>
                    </div>
                    <p className="text-gray-600"><span className="font-medium">Timeline:</span> {skill.timeline}</p>
                    <div className="mt-2">
                      <h6 className="text-sm font-medium text-gray-900">Learning Resources:</h6>
                      <ul className="mt-1 space-y-1">
                        {skill.resources.map((resource, idx) => (
                          <li key={idx} className="text-sm text-blue-600 hover:text-blue-800">
                            <a href="#">{resource}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Opportunities</h3>
          <div className="space-y-6">
            {result.opportunities.map((opp, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{opp.title}</h4>
                <p className="text-gray-600 mt-2">{opp.description}</p>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Action Items:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {opp.actionItems.map((item, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Timeline: </span>
                    <span className="text-sm text-gray-600">{opp.timeline}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Potential Outcome: </span>
                    <span className="text-sm text-gray-600">{opp.potentialOutcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Potential Risks</h3>
          <div className="space-y-6">
            {result.threats.map((threat, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{threat.title}</h4>
                <p className="text-gray-600 mt-2">{threat.description}</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 w-32">Risk Level:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${threat.riskLevel}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{threat.riskLevel}%</span>
                  </div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Mitigation Steps:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {threat.mitigationSteps.map((step, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-900">Timeline: </span>
                  <span className="text-sm text-gray-600">{threat.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
