import OpenAI from "openai"
import { NextResponse } from "next/server"
import { jobAnalysisSchema } from '@/lib/validation-schemas'
import { storeApiResponse, updateValidationStatus } from '@/lib/supabase'
import { ZodError } from 'zod'

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
      dangerouslyAllowBrowser: true,
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
    3. Emerging responsibilities with reasoning
    4. Current skills assessment
    5. Recommended skills with resources
    6. Opportunities
    7. Threats with risk levels`

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
          6. Learning resources must include actual course names and links
          
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
                  "importance": <number 0-100>,
                  "timeline": "<specific timeline>",
                  "reasoning": "<optional reasoning for importance>"
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
                  "importance": <number 0-100>,
                  "timeline": "<specific timeline>",
                  "resources": ["<specific resource with link>"]
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
                "riskLevel": <number 0-100>,
                "mitigationSteps": ["<specific step 1>", "<specific step 2>"],
                "timeline": "<specific timeline>"
              }
            ]
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

    const rawResponse = completion.choices[0].message.content;
    if (!rawResponse) {
      throw new Error('Empty response from API');
    }

    // Store raw response first
    const responseId = await storeApiResponse(rawResponse);

    try {
      // Parse and validate the response
      const parsedResponse = JSON.parse(rawResponse);
      
      // Validate against schema
      const validatedResponse = jobAnalysisSchema.parse(parsedResponse);
      
      // Update validation status
      await updateValidationStatus(responseId, validatedResponse);
      
      return NextResponse.json(validatedResponse);
    } catch (error) {
      console.error('Error processing API response:', error);
      
      if (error instanceof ZodError) {
        console.error('Validation errors:', error.errors);
        await updateValidationStatus(
          responseId,
          null,
          error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        );
        return NextResponse.json(
          { error: 'Invalid response format', details: error.errors },
          { status: 500 }
        );
      }
      
      if (error instanceof SyntaxError) {
        console.error('JSON parsing error:', error);
        return NextResponse.json(
          { error: 'Invalid JSON response from API' },
          { status: 500 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
