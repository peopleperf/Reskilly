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
          
          CRITICAL JSON FORMATTING RULES:
          1. Return ONLY a valid JSON object - no markdown, no code blocks, no extra text
          2. Do not use trailing commas
          3. Always close all arrays and objects properly
          4. Use double quotes for all strings
          5. Keep string values concise to avoid truncation
          6. Ensure all arrays have at least one element
          7. All required fields must be present and non-null
          
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
      validateResponseStructure(parsedResponse);

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
  // First attempt: Try to parse as is
  try {
    JSON.parse(str);
    return str;
  } catch (e) {
    console.log('Initial JSON parse failed, attempting to clean...');
  }

  // Remove any trailing commas followed by closing braces/brackets
  str = str.replace(/,(\s*[}\]])/g, '$1');
  
  // Remove any duplicate commas
  str = str.replace(/,\s*,/g, ',');
  
  // Remove trailing commas in arrays
  str = str.replace(/,(\s*])/g, '$1');
  
  // Fix common formatting issues
  str = str.replace(/}\s*{/g, '},{');
  str = str.replace(/]\s*{/g, '],{');
  str = str.replace(/}\s*]/g, '}]');
  
  // Attempt to find and fix truncated JSON
  try {
    let depth = 0;
    let inString = false;
    let escape = false;
    let lastValidIndex = -1;
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      
      if (escape) {
        escape = false;
        continue;
      }
      
      if (char === '\\' && !escape) {
        escape = true;
        continue;
      }
      
      if (char === '"' && !escape) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{' || char === '[') {
          depth++;
        } else if (char === '}' || char === ']') {
          depth--;
          if (depth === 0) {
            lastValidIndex = i;
          }
        }
      }
    }
    
    // If we have unmatched braces/brackets, truncate to last valid position
    if (depth !== 0 && lastValidIndex !== -1) {
      str = str.substring(0, lastValidIndex + 1);
    }
  } catch (e) {
    console.error('Error during JSON cleaning:', e);
  }

  // Final validation
  try {
    JSON.parse(str);
    return str;
  } catch (e) {
    console.error('Failed to clean JSON:', e);
    throw new Error('Unable to clean malformed JSON response');
  }
}

function validateResponseStructure(response: any) {
  const requiredFields = {
    overview: ['impactScore', 'summary', 'timeframe'],
    responsibilities: {
      current: ['task', 'automationRisk', 'reasoning', 'timeline', 'humanValue'],
      emerging: ['task', 'importance', 'timeline']
    },
    skills: {
      current: ['skill', 'currentRelevance', 'futureRelevance', 'automationRisk', 'reasoning'],
      recommended: ['skill', 'importance', 'timeline', 'resources']
    },
    opportunities: ['title', 'description', 'actionItems', 'timeline', 'potentialOutcome'],
    threats: ['title', 'description', 'riskLevel', 'mitigationSteps', 'timeline'],
    recommendations: ['immediate', 'shortTerm', 'longTerm']
  };

  // Validate overview
  if (!response.overview || typeof response.overview !== 'object') {
    throw new Error('Missing or invalid overview section');
  }

  for (const field of requiredFields.overview) {
    if (!response.overview[field]) {
      throw new Error(`Missing required field: overview.${field}`);
    }
  }

  // Validate responsibilities
  if (!response.responsibilities?.current?.length || !response.responsibilities?.emerging?.length) {
    throw new Error('Missing or empty responsibilities sections');
  }

  // Validate skills
  if (!response.skills?.current?.length || !response.skills?.recommended?.length) {
    throw new Error('Missing or empty skills sections');
  }

  // Validate opportunities and threats
  if (!Array.isArray(response.opportunities) || !Array.isArray(response.threats)) {
    throw new Error('Opportunities and threats must be arrays');
  }

  // Validate recommendations
  if (!response.recommendations?.immediate?.length || 
      !response.recommendations?.shortTerm?.length || 
      !response.recommendations?.longTerm?.length) {
    throw new Error('Missing or empty recommendations sections');
  }

  return true;
}
