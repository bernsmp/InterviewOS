"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileSearch, Filter, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FBFD] via-white to-[#F7FBFD]">
      {/* Header */}
      <header className="border-b-2 border-[#E5E7EB] bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image 
                src="/THD Logo.png" 
                alt="The Hiring Diagnostic" 
                width={300}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroHighlight containerClassName="h-auto py-20">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#295B74] leading-tight tracking-tight px-4" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 700 }}>
            The Hiring Diagnostic
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-[#4A5568] max-w-4xl mx-auto leading-relaxed font-medium px-4">
            Transform vague job requirements into behavioral interview questions that reveal{" "}
            <Highlight className="text-white whitespace-nowrap">
              what candidates can actually do.
            </Highlight>
          </h2>
        </motion.div>
      </HeroHighlight>

      {/* What It Does Section */}
      <section className="bg-white py-20 border-y-2 border-[#E5E7EB]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-r from-[#CBE1EA] to-[#B8D4E0] px-10 py-8">
                <h2 className="text-4xl font-bold text-[#295B74]" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 700 }}>
                  What It Does
                </h2>
              </div>
              <CardContent className="p-10 bg-white">
                <p className="text-xl text-[#4A5568] leading-relaxed">
                  The Hiring Diagnostic helps you conduct better interviews by forcing you to define what you actually need, 
                  then generates behavioral questions based on those specific requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-[#F7FBFD] to-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-[#295B74] mb-16 text-center" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 700 }}>
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Step 1 */}
              <Card className="relative shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-white">
                <div className="absolute top-6 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#FC8A46] to-[#ff6b2b] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <CardContent className="pt-24 px-10 pb-10">
                  <h3 className="text-2xl font-bold text-[#295B74] mb-4" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <FileSearch className="inline-block h-6 w-6 mr-2 text-[#6794A7]" />
                    Paste Your Job Description
                  </h3>
                  <p className="text-[#4A5568] text-lg">
                    The system extracts all requirements from your job posting.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-white">
                <div className="absolute top-6 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#FC8A46] to-[#ff6b2b] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <CardContent className="pt-24 px-10 pb-10">
                  <h3 className="text-2xl font-bold text-[#295B74] mb-4" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <CheckCircle className="inline-block h-6 w-6 mr-2 text-[#6794A7]" />
                    Define Vague Requirements
                  </h3>
                  <p className="text-[#4A5568] text-lg">
                    &ldquo;Customer service experience&rdquo; becomes &ldquo;Handle 30+ calls daily with 90% satisfaction rate&rdquo;
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-white">
                <div className="absolute top-6 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#FC8A46] to-[#ff6b2b] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <CardContent className="pt-24 px-10 pb-10">
                  <h3 className="text-2xl font-bold text-[#295B74] mb-4" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <Filter className="inline-block h-6 w-6 mr-2 text-[#6794A7]" />
                    Classify What&apos;s Truly Mandatory
                  </h3>
                  <p className="text-[#4A5568] text-lg">
                    Determine what candidates must have vs. what you&apos;re willing to train.
                  </p>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="relative shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-white">
                <div className="absolute top-6 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#FC8A46] to-[#ff6b2b] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  4
                </div>
                <CardContent className="pt-24 px-10 pb-10">
                  <h3 className="text-2xl font-bold text-[#295B74] mb-4" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}>
                    <Star className="inline-block h-6 w-6 mr-2 text-[#6794A7]" />
                    Get Behavioral Interview Questions
                  </h3>
                  <p className="text-[#4A5568] text-lg">
                    Receive STAR-format questions with follow-ups that require specific examples, not yes/no answers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="bg-gradient-to-r from-[#295B74] to-[#1e4358] py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold text-[#295B74] mb-12 text-center" style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 700 }}>
                  See The Difference
                </h2>
                
                <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                  {/* Before */}
                  <div className="bg-gray-50 rounded-2xl p-10 border-3 border-gray-300 relative">
                    <div className="absolute -top-4 left-8 bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                      TYPICAL INTERVIEW
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-2xl">❌</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-600">Before:</h3>
                    </div>
                    <p className="text-xl text-gray-700 italic font-medium">
                      &ldquo;Do you have healthcare experience?&rdquo;
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Yes/No answer tells you nothing about actual ability
                    </p>
                  </div>

                  {/* After */}
                  <div className="bg-[#F0F8FA] rounded-2xl p-10 border-3 border-[#6794A7] relative shadow-lg">
                    <div className="absolute -top-4 left-8 bg-[#295B74] text-white px-4 py-1 rounded-full text-sm font-bold">
                      WITH HIRING DIAGNOSTIC
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-full bg-[#295B74] flex items-center justify-center shadow-md">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#295B74]">After:</h3>
                    </div>
                    <p className="text-xl text-[#295B74] font-medium">
                      &ldquo;Describe a time you processed 30+ insurance claims in a day while maintaining 98% accuracy. Walk me through your approach.&rdquo;
                    </p>
                    <p className="text-sm text-[#6794A7] mt-4 font-medium">
                      Forces specific examples that reveal real capabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-white to-[#F7FBFD] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Button 
              asChild 
              size="lg" 
              className="text-xl px-14 py-8 rounded-full bg-gradient-to-r from-[#FC8A46] to-[#ff6b2b] hover:from-[#e87d3d] hover:to-[#ff5a1a] text-white font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
              style={{ fontFamily: 'Work Sans, sans-serif', fontWeight: 600 }}
            >
              <Link href="/interview">
                Start Building Your Interview
                <ArrowRight className="ml-3 h-7 w-7 animate-pulse" />
              </Link>
            </Button>
            <p className="mt-6 text-[#6794A7] text-lg">
              No signup required • Generate interviews in minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}