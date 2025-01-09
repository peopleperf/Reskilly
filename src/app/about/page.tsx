"use client"

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Lightbulb, BarChart, Rocket, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12 mt-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Reskilly</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Reskilly was created to empower professionals to thrive in an AI-driven world. 
                Our mission is to provide actionable insights and personalized recommendations that 
                equip individuals to navigate the challenges and seize the opportunities of the future workplace. 
                Together, we aim to shape a workforce that's prepared to lead in the age of AI.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Impact Analysis</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Gain detailed insights into how AI will shape your specific job role and industry over the next 5-10 years.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BarChart className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Skill Development</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Discover and master the most in-demand skills that will keep you competitive in an AI-enhanced workplace.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Rocket className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Career Adaptation</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Get personalized recommendations to successfully transition or excel in your evolving career path.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Growth Timeline</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Follow actionable, step-by-step plans designed to help you achieve your professional development goals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Creator</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0">
                    OI
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Omoniyi Ipaye</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      As a People Developer with close to a decade of experience in HR and a passion for technology, 
                      I have dedicated my career to helping professionals adapt to the changing nature of work. 
                      My focus on AI stems from witnessing its transformative impact on various industries and 
                      a deep belief that when understood and leveraged effectively, technology can unlock new 
                      opportunities for everyone. Through AI Job Impact, I'm committed to helping you navigate 
                      and thrive in the future of work.
                    </p>
                    <Link 
                      href="https://www.linkedin.com/in/omoniyiipaye" 
                      target="_blank"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S15.302.4 10 .4zM7.65 13.979H5.706V7.723H7.65v6.256zm-.984-7.024c-.614 0-1.011-.435-1.011-.973 0-.549.409-.971 1.036-.971s1.011.422 1.023.971c0 .538-.396.973-1.048.973zm8.084 7.024h-1.944v-3.467c0-.807-.282-1.355-.985-1.355-.537 0-.856.371-.997.728-.052.127-.065.307-.065.486v3.607H8.814v-4.26c0-.781-.025-1.434-.051-1.996h1.689l.089.869h.039c.256-.408.883-1.01 1.932-1.01 1.279 0 2.238.857 2.238 2.699v3.699z"/>
                      </svg>
                      <span>Let's explore the future of work together on LinkedIn</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 