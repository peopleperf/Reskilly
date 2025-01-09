import OpenAI from "openai"
import { NextResponse } from "next/server"

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error('DEEPSEEK_API_KEY is not set in environment variables')
}

const maxDuration = 300 // Set max duration to 300 seconds (5 minutes)

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  timeout: 180000, // 3 minutes timeout
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
            content: `You are an AI job impact analyst. Your task is to analyze the given job and provide insights about its future in the age of AI. 
          
          IMPORTANT: Return your response as a plain JSON object WITHOUT any markdown formatting or code blocks.
          
          Required response format:
          {
            "overview": {
              "impactScore": <number between 1-10>,
              "summary": "<brief overview of AI impact>",
              "timeframe": "<estimated timeframe for significant changes>"
            },
            "responsibilities": {
              "current": ["<list of current key responsibilities>"],
              "future": ["<list of expected future responsibilities>"],
              "automated": ["<list of responsibilities likely to be automated>"]
            },
            "skills": {
              "technical": ["<list of important technical skills>"],
              "soft": ["<list of important soft skills>"],
              "emerging": ["<list of emerging skills to develop>"]
            }
          }`
          },
          {
            role: "user",
            content: `Analyze the role of "${data.jobTitle}" ${data.industry ? `in the ${data.industry} industry` : ''} and provide insights about its future in the age of AI.`
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

      console.log('Raw API response:', responseText);

      try {
        // Clean the response text
        let cleanedResponse = responseText
          .replace(/```json\s*/g, '') // Remove ```json and any whitespace after it
          .replace(/```\s*/g, '')     // Remove ``` and any whitespace after it
          .replace(/^\s*{\s*/, '{')   // Clean up starting whitespace
          .replace(/\s*}\s*$/, '}')   // Clean up ending whitespace
          .trim()

        // Verify it starts with { and ends with }
        if (!cleanedResponse.startsWith('{') || !cleanedResponse.endsWith('}')) {
          throw new Error('Invalid JSON structure')
        }

        const jsonResponse = JSON.parse(cleanedResponse)

        // Validate the response structure
        if (!jsonResponse.overview || !jsonResponse.responsibilities || !jsonResponse.skills) {
          throw new Error('Invalid response structure')
        }

        return NextResponse.json(jsonResponse)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, '\nCleaned Response:', cleanedResponse);
        return NextResponse.json(
          { error: 'Failed to parse AI response. Please try again.' },
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
      { 
        error: error.message || 'Analysis failed',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    )
  }
}