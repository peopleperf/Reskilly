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
    console.log('API Key status:', process.env.DEEPSEEK_API_KEY ? 'Present' : 'Missing');

    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API configuration missing. Please check environment variables.' },
        { status: 500 }
      )
    }

    const data = await request.json()
    
    if (!data.jobTitle) {
      console.error('Job title missing in request');
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    console.log('Making API request for job:', data.jobTitle);

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an AI job impact analyst. Analyze the given job and provide insights. 
            Return ONLY a JSON object without any markdown formatting or code blocks. 
            The response should be a valid JSON object with this structure:
            {
              "overview": {
                "impactScore": number,
                "summary": string,
                "timeframe": string
              },
              "responsibilities": {
                "current": string[],
                "future": string[],
                "automated": string[]
              },
              "skills": {
                "technical": string[],
                "soft": string[],
                "emerging": string[]
              }
            }`
          },
          {
            role: "user",
            content: `Analyze the role of "${data.jobTitle}" ${data.industry ? `in the ${data.industry} industry` : ''}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const responseText = completion.choices[0]?.message?.content
      
      if (!responseText) {
        console.error('Empty response from API');
        throw new Error('Empty response from API')
      }

      console.log('API response received:', responseText.substring(0, 100) + '...');

      try {
        // Remove any markdown formatting if present
        const jsonString = responseText
          .replace(/```json\n?/g, '')  // Remove ```json
          .replace(/```\n?/g, '')      // Remove closing ```
          .trim()                      // Remove extra whitespace

        const jsonResponse = JSON.parse(jsonString)
        return NextResponse.json(jsonResponse)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, '\nResponse:', responseText);
        return NextResponse.json(
          { error: 'Invalid response format from AI' },
          { status: 500 }
        )
      }

    } catch (apiError: any) {
      console.error('API Error:', apiError.message);
      return NextResponse.json(
        { error: `API Error: ${apiError.message}` },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('General Error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}