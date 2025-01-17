import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ApiResponse {
  id: string
  raw_response: string
  validated_response?: any
  validation_errors?: string[]
  status: 'pending' | 'validated' | 'failed'
  created_at: string
}

export interface JobAnalysis {
  id: string
  job_title: string
  industry: string
  responsibilities?: string
  skills?: string
  analysis_result: any
  status: string
  created_at: string
}

export async function storeApiResponse(rawResponse: string) {
  const { data, error } = await supabase
    .from('api_responses')
    .insert({
      raw_response: rawResponse,
      status: 'pending'
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error storing API response:', error)
    throw error
  }

  return data.id
}

export async function updateValidationStatus(
  id: string,
  validatedResponse: any | null = null,
  validationErrors: string[] = []
) {
  const { error } = await supabase
    .from('api_responses')
    .update({
      validated_response: validatedResponse,
      validation_errors: validationErrors,
      status: validatedResponse ? 'validated' : 'failed'
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating validation status:', error)
    throw error
  }
}

export async function storeJobAnalysis(
  jobData: {
    jobTitle: string
    industry: string
    responsibilities?: string
    skills?: string
  },
  analysisResult: any
) {
  const { data, error } = await supabase
    .from('job_analyses')
    .insert({
      job_title: jobData.jobTitle,
      industry: jobData.industry,
      responsibilities: jobData.responsibilities || '',
      skills: jobData.skills || '',
      analysis_result: analysisResult,
      status: 'completed'
    })
    .select()
    .single()

  if (error) {
    console.error('Error storing job analysis:', error)
    throw error
  }

  return data
}

export async function getLatestJobAnalysis() {
  const { data, error } = await supabase
    .from('job_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching job analysis:', error)
    throw error
  }

  return data as JobAnalysis
}
