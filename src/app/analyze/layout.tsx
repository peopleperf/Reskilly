import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analyze Your Job | AI Job Impact Analyzer",
  description: "Analyze how AI might impact your job and get personalized recommendations.",
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 