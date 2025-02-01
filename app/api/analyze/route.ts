import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { DeepSeekClient } from "@/lib/deepseek"

export const maxDuration = 300 // 5 minutes

interface AnalysisResponse {
  overview: {
    impactScore: number
    summary: string
    timeframe: string
  }
  responsibilities: {
    current: Array<{
      task: string
      automationRisk: number
      reasoning: string
      timeline: string
      humanValue: string
    }>
    emerging: Array<{
      task: string
      importance: number
      timeline: string
      reasoning: string
    }>
  }
  skills: {
    current: Array<{
      skill: string
      currentRelevance: number
      futureRelevance: number
      automationRisk: number
      reasoning: string
    }>
    recommended: Array<{
      skill: string
      importance: number
      timeline: string
      resources: string[]
    }>
  }
  opportunities: Array<{
    title: string
    description: string
    actionItems: string[]
    timeline: string
    potentialOutcome: string
  }>
  threats: Array<{
    title: string
    description: string
    riskLevel: number
    mitigationSteps: string[]
    timeline: string
  }>
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

function validateAnalysisResponse(data: any): data is AnalysisResponse {
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

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const client = new DeepSeekClient(process.env.DEEPSEEK_API_KEY)

    let jobTitle, industry, responsibilities, skills;
    try {
      const body = await req.json();
      ({ jobTitle, industry, responsibilities, skills } = body);
    } catch (error) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Validate required fields
    if (!jobTitle || !industry) {
      return NextResponse.json(
        { error: "Job title and industry are required fields" },
        { status: 400 }
      )
    }

    let prompt = `Analyze the AI impact for a ${jobTitle} ${industry ? `in the ${industry} industry` : ""}. 
    Return a detailed JSON object with this exact structure, ensuring all numeric values are actual numbers (not strings):`

    // Add the example structure with proper JSON formatting
    const exampleStructure = {
      overview: {
        impactScore: 75,
        summary: "A concise summary of AI's impact on the role",
        timeframe: "Expected timeline for major changes"
      },
      responsibilities: {
        current: [{
          task: "Description of current job task",
          automationRisk: 65,
          reasoning: "Explanation of automation risk",
          timeline: "Expected timeline for automation",
          humanValue: "Why human input remains valuable"
        }],
        emerging: [{
          task: "Description of new responsibility",
          importance: 85,
          timeline: "When this becomes critical",
          reasoning: "Why this is important"
        }]
      },
      skills: {
        current: [{
          skill: "Name of skill",
          currentRelevance: 90,
          futureRelevance: 70,
          automationRisk: 45,
          reasoning: "Explanation of skill evolution"
        }],
        recommended: [{
          skill: "Name of recommended skill",
          importance: 95,
          timeline: "When to acquire this skill",
          resources: ["List of learning resources and links"]
        }]
      },
      opportunities: [{
        title: "Title of opportunity",
        description: "Detailed description",
        actionItems: ["List of specific actions to take"],
        timeline: "When to act on this",
        potentialOutcome: "Expected benefits"
      }],
      threats: [{
        title: "Title of threat",
        description: "Detailed description",
        riskLevel: 80,
        mitigationSteps: ["List of steps to mitigate"],
        timeline: "When this becomes critical"
      }],
      recommendations: {
        immediate: ["List of immediate actions"],
        shortTerm: ["List of 3-6 month actions"],
        longTerm: ["List of 6-12 month actions"]
      }
    }

    prompt += "\n" + JSON.stringify(exampleStructure, null, 2)

    if (responsibilities) {
      prompt += `\n\nConsider these specific responsibilities: ${responsibilities}`
    }

    if (skills) {
      prompt += `\n\nConsider these current skills: ${skills}`
    }

    let response;
    try {
      response = await client.analyze(prompt);
    } catch (error: any) {
      console.error("API analysis failed:", error);
      return NextResponse.json(
        { error: "Failed to generate analysis", details: error.message },
        { status: 500 }
      );
    }
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
      
      if (!validateAnalysisResponse(parsedResponse)) {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      console.error("Failed to parse or validate response:", error);
      return NextResponse.json(
        { error: "Invalid analysis results", details: error.message },
        { status: 500 }
      );
    }

    try {
      const { data: dbData, error: dbError } = await supabase
        .from("job_analyses")
        .insert({
          job_title: jobTitle,
          industry: industry,
          responsibilities: responsibilities || "",
          skills: skills || "",
          analysis_result: parsedResponse,
          status: "completed",
        })
        .select()

      if (dbError) {
        console.error("Database error:", dbError)
        return NextResponse.json(
          { error: "Failed to save analysis", details: dbError.message },
          { status: 500 }
        )
      }

      if (!dbData?.[0]?.id) {
        throw new Error("No database ID returned");
      }

      return NextResponse.json({
        id: dbData[0].id,
        analysis: parsedResponse
      })
    } catch (error: any) {
      console.error("Database operation failed:", error);
      return NextResponse.json(
        { error: "Failed to save analysis", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error.message },
      { status: 500 }
    )
  }
}

