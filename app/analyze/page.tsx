"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { AnalyzingProcess } from "@/components/AnalyzingProcess"

// Define the form schema with strict validation
const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }).max(100, {
    message: "Job title must not exceed 100 characters.",
  }).regex(/^[a-zA-Z0-9\s\-&()]+$/, {
    message: "Job title can only contain letters, numbers, spaces, and basic punctuation.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }).max(100, {
    message: "Industry must not exceed 100 characters.",
  }).regex(/^[a-zA-Z0-9\s\-&()]+$/, {
    message: "Industry can only contain letters, numbers, spaces, and basic punctuation.",
  }),
  responsibilities: z.string().max(2000, {
    message: "Responsibilities must not exceed 2000 characters.",
  }).optional(),
  skills: z.string().max(2000, {
    message: "Skills must not exceed 2000 characters.",
  }).optional(),
})

type JobData = z.infer<typeof formSchema>

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<JobData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      industry: "",
      responsibilities: "",
      skills: "",
    },
  })

  async function onSubmit(values: JobData) {
    try {
      setError(null)
      setIsAnalyzing(true)
      setJobData(values)
    } catch (error) {
      setError("Failed to start analysis. Please try again.")
      setIsAnalyzing(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => setError(null)}>Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (isAnalyzing && jobData) {
    return (
      <AnalyzingProcess
        jobData={jobData}
        onComplete={() => setIsAnalyzing(false)}
        onError={(error) => {
          setError(error.message)
          setIsAnalyzing(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analyze Your Job's AI Impact</h1>
            <p className="text-gray-600">
              Fill in your job details below to receive a personalized analysis of how AI might affect your role.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Responsibilities (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your key job responsibilities..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Skills (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your current skills..." 
                        className="min-h-[100px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Impact"
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}

