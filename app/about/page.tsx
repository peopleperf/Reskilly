import Link from "next/link"
import { Lightbulb, TrendingUp, Rocket, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-28">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-12 md:space-y-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center">About Reskilly</h1>

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Our Mission</h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Reskilly was created to empower professionals to thrive in an AI-driven world. Our mission is to provide
              actionable insights and personalized recommendations that equip individuals to navigate the challenges and
              seize the opportunities of the future workplace. Together, we aim to shape a workforce that's prepared to
              lead in the age of AI.
            </p>
          </section>

          {/* What We Offer Section */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">AI Impact Analysis</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Gain detailed insights into how AI will shape your specific job role and industry over the next
                      5-10 years.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Skill Development</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Discover and master the most in-demand skills that will keep you competitive in an AI-enhanced
                      workplace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Career Adaptation</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Get personalized recommendations to successfully transition or excel in your evolving career path.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Growth Timeline</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Follow actionable, step-by-step plans designed to help you achieve your professional development
                      goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creator Section */}
          <section className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Creator</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">OI</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Omoniyi Ipaye</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  As a People Developer with close to a decade of experience in HR and a passion for technology, I have
                  dedicated my career to helping professionals adapt to the changing nature of work. My focus on AI
                  stems from witnessing its transformative impact on various industries and a deep belief that when
                  understood and leveraged effectively, technology can unlock new opportunities for everyone. Through AI
                  Job Impact, I'm committed to helping you navigate and thrive in the future of work.
                </p>
                <Link
                  href="https://www.linkedin.com/in/omoniyiipaye/"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm md:text-base"
                >
                  Let's explore the future of work together on LinkedIn
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

