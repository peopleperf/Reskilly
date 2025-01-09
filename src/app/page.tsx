"use client"

import Link from "next/link"
import Image from "next/image"
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="absolute inset-0 flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/images/ai-background.jpg"
          alt="AI Technology Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        
        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Your Future in the AI Era
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Get a personalized analysis of how AI will transform your career and actionable steps to stay ahead
          </p>
          <Link 
            href="/analyze"
            className="inline-block bg-white text-black px-8 py-4 rounded-md text-lg font-semibold 
                     hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
          >
            Analyze Your Role
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </section>
    </div>
  )
}
