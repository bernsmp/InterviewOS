import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InterviewOS</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Components
              </Link>
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Login Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              🚀 5 Day Sprint Framework Installed
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-primary">InterviewOS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your hiring diagnostic tool that prevents $30K wrong hires by forcing uncomfortable clarity through 40+ structured interview questions.
            </p>
          </div>

          {/* Project Overview Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Project Overview
              </CardTitle>
              <CardDescription>
                A diagnostic tool that prevents costly hiring mistakes by transforming vague job requirements into measurable behaviors through structured interviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Core Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 40+ structured interview questions</li>
                    <li>• Custom interview script generation</li>
                    <li>• Psychological &ldquo;nature discovery&rdquo; questions</li>
                    <li>• Energy vs exhaustion assessment</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Benefits</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Prevents $30K+ wrong hires</li>
                    <li>• Forces measurable behavior definitions</li>
                    <li>• Reveals candidate energy alignment</li>
                    <li>• Structured decision-making process</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/interview">
                <Zap className="mr-2 h-5 w-5" />
                Start Interview Builder
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/dashboard">
                <ArrowRight className="mr-2 h-5 w-5" />
                View Component Showcase
              </Link>
            </Button>
          </div>

          {/* Development Workflow */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Development Workflow</CardTitle>
              <CardDescription>
                Built with 5 Day Sprint Framework - Ready for your vision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold">Project Discussion</h4>
                  <p className="text-sm text-muted-foreground">Define requirements and features</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold">Feature Building</h4>
                  <p className="text-sm text-muted-foreground">Build with shadcn/ui components</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold">Local Testing</h4>
                  <p className="text-sm text-muted-foreground">Test on localhost before deployment</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h4 className="font-semibold">Vercel Deployment</h4>
                  <p className="text-sm text-muted-foreground">Deploy to production</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">Next Steps</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Go back to Cursor to discuss your project idea after exploring the dashboard and component showcase. 
              The framework is ready to build your vision systematically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
