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
    
    // Validate required fields
    if (!data.jobTitle) {
      console.error('Job title missing in request');
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    console.log('Making API request for job:', data.jobTitle);

    let prompt = `Analyze the AI impact for a ${data.jobTitle} ${data.industry ? `in the ${data.industry} industry` : ''}.`

    if (data.responsibilities?.trim()) {
      prompt += `\n\nKey responsibilities: ${data.responsibilities}`
    }

    if (data.skills?.trim()) {
      prompt += `\n\nCurrent skills: ${data.skills}`
    }

    prompt += `\n\nProvide a comprehensive analysis including:
    1. Overview with impact score (0-100) and timeline
    2. Current responsibilities and their automation risk
    3. Emerging responsibilities
    4. Current skills assessment
    5. Recommended skills
    6. Opportunities
    7. Threats
    8. Immediate, short-term, and long-term recommendations`

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
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    try {
      // Parse and validate the response
      const rawResponse = completion.choices[0]?.message?.content;
      if (!rawResponse) {
        throw new Error('Empty response from API');
      }
      
      console.log('Raw API response:', rawResponse);
      
      let cleanedResponse = rawResponse;
      // If the response is truncated, try to fix the JSON
      if (!isValidJSON(cleanedResponse)) {
        console.log('Invalid JSON detected, attempting to clean...');
        cleanedResponse = cleanJSON(cleanedResponse);
      }
      
      console.log('Cleaned Response:', cleanedResponse);
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Add job title to the response
      parsedResponse.jobTitle = data.jobTitle;

      // Initialize arrays if they don't exist
      if (!parsedResponse.opportunities) {
        parsedResponse.opportunities = []
      }
      if (!parsedResponse.threats) {
        parsedResponse.threats = []
      }

      // Validate the response structure
      if (!parsedResponse.jobTitle ||
          !parsedResponse.overview?.impactScore || 
          !Array.isArray(parsedResponse.responsibilities?.current) ||
          !Array.isArray(parsedResponse.responsibilities?.emerging) ||
          !Array.isArray(parsedResponse.skills?.current) ||
          !Array.isArray(parsedResponse.skills?.recommended) ||
          !Array.isArray(parsedResponse.opportunities) ||
          !Array.isArray(parsedResponse.threats) ||
          !parsedResponse.recommendations?.immediate ||
          !parsedResponse.recommendations?.shortTerm ||
          !parsedResponse.recommendations?.longTerm) {
        throw new Error('Invalid response structure')
      }

      return NextResponse.json(parsedResponse);
    } catch (error) {
      console.error('Error processing API response:', error);
      return NextResponse.json(
        { error: 'Failed to process AI response. Please try again.' },
        { status: 500 }
      );
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

// Helper functions
function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function cleanJSON(str: string) {
  // Remove any trailing incomplete objects
  const lastBrace = str.lastIndexOf('}');
  if (lastBrace !== -1) {
    return str.substring(0, lastBrace + 1);
  }
  return str;
}