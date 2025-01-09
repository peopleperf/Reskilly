import OpenAI from "openai"

interface AnalysisResult {
  impactScore: number
  keyFindings: {
    title: string
    description: string
    type: "positive" | "warning" | "opportunity"
  }[]
  skillsAnalysis: {
    skill: string
    relevance: number
    futureImportance: number
  }[]
  recommendations: {
    shortTerm: string[]
    mediumTerm: string[]
    longTerm: string[]
  }
}

interface JobData {
  jobTitle: string
  industry: string
  responsibilities: string[]
  skills: string[]
}

function transformApiResponse(apiResponse: any): AnalysisResult {
  // Ensure we have an object to work with
  const response = apiResponse || {}

  // Transform key findings
  const keyFindings = [
    ...(Array.isArray(response.opportunities) ? response.opportunities.map((opp: any) => ({
      title: String(opp.title || ''),
      description: String(opp.description || ''),
      type: "opportunity" as const
    })) : []),
    ...(Array.isArray(response.threats) ? response.threats.map((threat: any) => ({
      title: String(threat.title || ''),
      description: String(threat.description || ''),
      type: "warning" as const
    })) : [])
  ]

  // Transform skills analysis
  const skillsAnalysis = Array.isArray(response.skills?.current) 
    ? response.skills.current.map((skill: any) => ({
        skill: String(skill.skill || ''),
        relevance: Number(skill.currentRelevance || 0),
        futureImportance: Number(skill.futureRelevance || 0)
      }))
    : []

  // Helper function to extract string array from recommendations
  const extractRecommendations = (recs: any[]): string[] => {
    if (!Array.isArray(recs)) return []
    return recs.map(rec => {
      if (typeof rec === 'string') return rec
      if (typeof rec === 'object' && rec !== null) {
        return String(rec.action || '')
      }
      return ''
    }).filter(Boolean)
  }

  // Transform recommendations
  const recommendations = {
    shortTerm: extractRecommendations(response.recommendations?.shortTerm || []),
    mediumTerm: extractRecommendations(response.recommendations?.immediate || []),
    longTerm: extractRecommendations(response.recommendations?.longTerm || [])
  }

  return {
    impactScore: Number(response.overview?.impactScore || 0),
    keyFindings,
    skillsAnalysis,
    recommendations
  }
}

export async function analyzeJob(jobData: JobData): Promise<AnalysisResult> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze job")
    }

    const apiResult = await response.json()
    return transformApiResponse(apiResult)
  } catch (error) {
    console.error("Error analyzing job:", error)
    throw error
  }
} 