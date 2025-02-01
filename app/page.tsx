import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://sjc.microlink.io/8a4lRlo__eQhBtQZmIo8Zge3cA4epM94pGW36ESEqi7yK8oH38cdadM1SwLZ0ME3MOrf2FaCjtxFpdqYu8r1zg.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-4xl mx-auto">
          Discover Your Future in the AI Era
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Get a personalized analysis of how AI will transform your career and actionable steps to stay ahead
        </p>
        <Link href="/analyze">
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Analyze Your Role
          </Button>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </main>
  )
}

