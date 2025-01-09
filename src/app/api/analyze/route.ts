import OpenAI from "openai"
import { NextResponse } from "next/server"

export const maxDuration = 300 // Set max duration to 300 seconds (5 minutes)

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API configuration missing. Please check environment variables.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      timeout: 180000, // 3 minutes timeout
    })

    const data = await request.json()
    
    if (!data.jobTitle) {
      console.error('Job title missing in request');
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    console.log('Making API request for job:', data.jobTitle);

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an AI job impact analyst. Your task is to provide a realistic and practical analysis of how AI will impact the given job role. 
          
          IMPORTANT GUIDELINES:
          1. Be realistic and specific about AI capabilities - avoid general statements about AI not being able to replace "human creativity" or "problem-solving"
          2. Focus on concrete tasks that AI can and cannot do, with specific examples
          3. For software roles, acknowledge that AI can handle many programming tasks including debugging, testing, and even architecture design
          4. Impact scores should reflect the significant disruption AI will bring:
             - Scores 80-100: Jobs highly vulnerable to AI automation (e.g., data entry, basic coding)
             - Scores 50-70: Jobs partially automatable but requiring human oversight
             - Scores 10-40: Jobs where AI primarily augments rather than replaces
          5. Provide specific, actionable recommendations rather than general advice
          6. Learning resources must include actual course names, platforms, and real links
          
          IMPORTANT: Return your response as a plain JSON object WITHOUT any markdown formatting or code blocks.
          
          Required response format:
          {
            "overview": {
              "impactScore": <number between 10-100>,
              "summary": "<realistic assessment of AI impact>",
              "timeframe": "<specific timeline for changes>"
            },
            "responsibilities": {
              "current": [
                {
                  "task": "<specific task description>",
                  "automationRisk": <realistic percentage 0-100>,
                  "reasoning": "<concrete explanation with examples>",
                  "timeline": "<specific timeline>",
                  "humanValue": "<specific aspects that still need human input>"
                }
              ],
              "emerging": [
                {
                  "task": "<specific new task>",
                  "importance": "<clear importance level with reasoning>",
                  "timeline": "<specific timeline>"
                }
              ]
            },
            "skills": {
              "current": [
                {
                  "skill": "<specific skill>",
                  "currentRelevance": <number 0-100>,
                  "futureRelevance": <number 0-100>,
                  "automationRisk": <number 0-100>,
                  "reasoning": "<specific explanation of how AI will impact this skill>"
                }
              ],
              "recommended": [
                {
                  "skill": "<specific skill>",
                  "importance": "<clear importance level>",
                  "timeline": "<specific timeline>",
                  "resources": [
                    {
                      "name": "<actual course/resource name>",
                      "type": "<specific type>",
                      "link": "<actual URL>",
                      "duration": "<specific duration>",
                      "cost": "<actual cost>"
                    }
                  ]
                }
              ]
            },
            "opportunities": [
              {
                "title": "<specific opportunity>",
                "description": "<detailed description with examples>",
                "actionItems": ["<specific action 1>", "<specific action 2>"],
                "timeline": "<specific timeline>",
                "potentialOutcome": "<concrete expected outcome>"
              }
            ],
            "threats": [
              {
                "title": "<specific threat>",
                "description": "<detailed description with examples>",
                "riskLevel": "<high/medium/low with clear reasoning>",
                "mitigationSteps": ["<specific step 1>", "<specific step 2>"],
                "timeline": "<specific timeline>"
              }
            ],
            "recommendations": {
              "immediate": [
                {
                  "action": "<specific action>",
                  "reasoning": "<concrete reasoning>",
                  "resources": ["<specific resource 1>", "<specific resource 2>"],
                  "expectedOutcome": "<specific outcome>"
                }
              ],
              "shortTerm": [
                {
                  "action": "<specific action>",
                  "reasoning": "<concrete reasoning>",
                  "resources": ["<specific resource 1>", "<specific resource 2>"],
                  "expectedOutcome": "<specific outcome>"
                }
              ],
              "longTerm": [
                {
                  "action": "<specific action>",
                  "reasoning": "<concrete reasoning>",
                  "resources": ["<specific resource 1>", "<specific resource 2>"],
                  "expectedOutcome": "<specific outcome>"
                }
              ]
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

    const cleanedResponse = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*{\s*/, '{')
      .replace(/\s*}\s*$/, '}')
      .trim();

    try {
      if (!cleanedResponse.startsWith('{') || !cleanedResponse.endsWith('}')) {
        throw new Error('Invalid JSON structure')
      }

      const jsonResponse = JSON.parse(cleanedResponse)

      // Initialize arrays if they don't exist
      if (!jsonResponse.opportunities) {
        jsonResponse.opportunities = []
      }
      if (!jsonResponse.threats) {
        jsonResponse.threats = []
      }

      // Validate the response structure
      if (!jsonResponse.overview?.impactScore || 
          !Array.isArray(jsonResponse.responsibilities?.current) ||
          !Array.isArray(jsonResponse.responsibilities?.emerging) ||
          !Array.isArray(jsonResponse.skills?.current) ||
          !Array.isArray(jsonResponse.skills?.recommended) ||
          !Array.isArray(jsonResponse.opportunities) ||
          !Array.isArray(jsonResponse.threats) ||
          !jsonResponse.recommendations?.immediate ||
          !jsonResponse.recommendations?.shortTerm ||
          !jsonResponse.recommendations?.longTerm) {
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