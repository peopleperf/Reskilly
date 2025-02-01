"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Brain, BarChart2, Lightbulb, Target, Shield, ListChecks, ArrowLeft, Share2, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Dynamically import the SkillsRadar component
const SkillsRadar = dynamic(() => import("@/components/SkillsRadar"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px]" />,
})

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
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

function getAutomationRiskColor(risk: number) {
  if (risk >= 70) return 'bg-red-500'
  if (risk >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getAutomationRiskTextColor(risk: number) {
  if (risk >= 70) return 'text-red-600'
  if (risk >= 40) return 'text-yellow-600'
  return 'text-green-600'
}

function validateAnalysisResult(data: any): data is JobAnalysis {
  try {
    if (!data.overview?.impactScore || typeof data.overview.impactScore !== 'number') return false;
    if (!data.overview?.summary || typeof data.overview.summary !== 'string') return false;
    if (!data.overview?.timeframe || typeof data.overview.timeframe !== 'string') return false;
    
    if (!Array.isArray(data.responsibilities?.current)) return false;
    if (!Array.isArray(data.responsibilities?.emerging)) return false;
    if (!Array.isArray(data.skills?.current)) return false;
    if (!Array.isArray(data.skills?.recommended)) return false;
    if (!Array.isArray(data.opportunities)) return false;
    if (!Array.isArray(data.threats)) return false;
    
    if (!Array.isArray(data.recommendations?.immediate)) return false;
    if (!Array.isArray(data.recommendations?.shortTerm)) return false;
    if (!Array.isArray(data.recommendations?.longTerm)) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<JobAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('responsibilities')

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const jobTitle = searchParams.get('jobTitle')
        const industry = searchParams.get('industry')

        if (!jobTitle) {
          throw new Error('No job title provided')
        }

        const { data: analyses, error: fetchError } = await supabase
          .from('job_analyses')
          .select('analysis_result')
          .eq('job_title', jobTitle)
          .eq('industry', industry || '')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (fetchError) throw new Error('Failed to fetch analysis')
        if (!analyses?.analysis_result) throw new Error('No analysis found')

        const analysisResult = analyses.analysis_result;
        if (!validateAnalysisResult(analysisResult)) {
          throw new Error('Invalid analysis data structure');
        }

        setResult(analysisResult)
      } catch (error: any) {
        console.error('Error fetching analysis:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-lg p-6 text-center">
          <div className="text-red-500 text-xl mb-4">Error Loading Analysis</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/analyze">Try Another Analysis</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (!result) return null

  const getImpactScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/analyze"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Link>
          </div>

          {/* Overview Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Impact Analysis</CardTitle>
              <CardDescription>
                Comprehensive analysis of AI's impact on your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Impact Score</h3>
                  <p className={`text-3xl font-bold ${getImpactScoreColor(result.overview.impactScore)}`}>
                    {result.overview.impactScore}%
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Summary</h3>
                  <p className="text-gray-700">{result.overview.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="responsibilities" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="recommendations">Action Plan</TabsTrigger>
            </TabsList>

            {/* Responsibilities Tab */}
            <TabsContent value="responsibilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Responsibilities</CardTitle>
                  <CardDescription>Analysis of your current job tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.responsibilities.current.map((task, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{task.task}</h4>
                        <Badge
                          variant="outline"
                          className={getAutomationRiskTextColor(task.automationRisk)}
                        >
                          {task.automationRisk}% Risk
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{task.reasoning}</p>
                      <div className="mt-2">
                        <Progress
                          value={task.automationRisk}
                          className={`h-2 ${getAutomationRiskColor(task.automationRisk)}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emerging Responsibilities</CardTitle>
                  <CardDescription>New tasks and responsibilities to prepare for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.responsibilities.emerging.map((task, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{task.task}</h4>
                        <Badge variant="outline" className="text-blue-600">
                          {task.importance}% Important
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{task.reasoning}</p>
                      <p className="text-sm text-blue-600 mt-2">{task.timeline}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                  <CardDescription>Analysis of your current and future skill requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <SkillsRadar skills={result.skills.current} />
                  </div>
                  <div className="space-y-6">
                    {result.skills.current.map((skill, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{skill.skill}</h4>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-blue-600">
                              Current: {skill.currentRelevance}%
                            </Badge>
                            <Badge variant="outline" className="text-purple-600">
                              Future: {skill.futureRelevance}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{skill.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Skills</CardTitle>
                  <CardDescription>Skills to develop for future success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.skills.recommended.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <Badge variant="outline" className="text-green-600">
                          {skill.importance}% Important
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{skill.timeline}</p>
                      <div className="space-y-1">
                        {skill.resources.map((resource, idx) => (
                          <p key={idx} className="text-sm text-blue-600">
                            • {resource}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                  <CardDescription>Potential areas for career advancement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.opportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{opportunity.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Action Items:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {opportunity.actionItems.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-blue-600">{opportunity.timeline}</p>
                        <p className="text-sm text-green-600 mt-1">{opportunity.potentialOutcome}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Potential Threats</CardTitle>
                  <CardDescription>Challenges to prepare for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.threats.map((threat, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{threat.title}</h4>
                        <Badge
                          variant="outline"
                          className={getAutomationRiskTextColor(threat.riskLevel)}
                        >
                          {threat.riskLevel}% Risk
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{threat.description}</p>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Mitigation Steps:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {threat.mitigationSteps.map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-red-600 mt-4">{threat.timeline}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Action Plan</CardTitle>
                  <CardDescription>Steps to future-proof your career</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Immediate Actions</h3>
                    <ul className="space-y-2">
                      {result.recommendations.immediate.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-gray-700"
                        >
                          <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Short-term Goals (3-6 months)</h3>
                    <ul className="space-y-2">
                      {result.recommendations.shortTerm.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-gray-700"
                        >
                          <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Long-term Goals (6-12 months)</h3>
                    <ul className="space-y-2">
                      {result.recommendations.longTerm.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-gray-700"
                        >
                          <ChevronRight className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

