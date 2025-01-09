import OpenAI from "openai"
import { NextResponse } from "next/server"

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error('DEEPSEEK_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
})

function generateAnalysisPrompt(jobData: any): string {
  return `Analyze the role of "${jobData.jobTitle}" ${jobData.industry ? `in the ${jobData.industry} industry` : ''}.`
}

const systemPrompt = `You are an expert AI job impact analyst. Provide analysis in this exact JSON format:
{
  "overview": {
    "impactScore": 75,
    "summary": "Brief summary of AI impact",
    "timeframe": "1-2 years"
  },
  "responsibilities": {
    "current": ["list", "of", "current", "responsibilities"],
    "future": ["list", "of", "future", "responsibilities"],
    "automated": ["list", "of", "automated", "tasks"]
  },
  "skills": {
    "technical": ["list", "of", "technical", "skills"],
    "soft": ["list", "of", "soft", "skills"],
    "emerging": ["list", "of", "emerging", "skills"]
  }
}`

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    const data = await request.json()
    
    if (!data.jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: generateAnalysisPrompt(data) }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    try {
      const jsonResponse = JSON.parse(responseText)
      return NextResponse.json(jsonResponse)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      return NextResponse.json(
        { error: 'Invalid response format' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}