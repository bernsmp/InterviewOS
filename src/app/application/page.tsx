import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Users, FileText, Brain, Target, Zap, Copy } from "lucide-react";
import { NavigationHeader } from "@/components/navigation-header";

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <NavigationHeader 
        backButtonText="Back to Home"
        backButtonHref="/"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to The Hiring Diagnostic - Your Starter Kit
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience the power of structured hiring diagnostics with this interactive demo
            </p>
          </div>

          {/* Demo Feature - Interview Question Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Interview Question Generator
              </CardTitle>
              <CardDescription>
                Generate custom interview questions based on role requirements and candidate assessment needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Software Developer</SelectItem>
                        <SelectItem value="manager">Project Manager</SelectItem>
                        <SelectItem value="designer">UX Designer</SelectItem>
                        <SelectItem value="marketer">Marketing Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Key Requirements</Label>
                    <Textarea 
                      placeholder="e.g., Strong communication skills, leadership experience, technical expertise..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assessment-type">Assessment Focus</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Skills</SelectItem>
                        <SelectItem value="behavioral">Behavioral Patterns</SelectItem>
                        <SelectItem value="energy">Energy Alignment</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button className="w-full">
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Questions
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">5DS</span>
                        </div>
                        <span className="font-semibold">Install Feature</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect this feature to OpenAI API for intelligent question generation based on role requirements.
                      </p>
                      <div className="bg-muted p-3 rounded-md text-xs font-mono">
                        Add your OpenAI API key to .env.local as OPENAI_API_KEY=your_key_here and update this component to generate custom interview questions using GPT-4. Replace the demo data with actual API calls to create personalized question sets for each role and assessment type.
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        <Copy className="mr-2 h-3 w-3" />
                        Copy Instructions
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="space-y-4">
                  <Label>Generated Questions Preview</Label>
                  <div className="space-y-3">
                    <Card className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge variant="outline">Behavioral</Badge>
                          <p className="text-sm font-medium">
                            &ldquo;Describe a time when you had to communicate a complex technical concept to a non-technical stakeholder. What was your approach?&rdquo;
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge variant="outline">Energy Discovery</Badge>
                          <p className="text-sm font-medium">
                            &ldquo;What type of work environment energizes you most? Give me a specific example of when you felt most productive.&rdquo;
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge variant="outline">Technical</Badge>
                          <p className="text-sm font-medium">
                            &ldquo;Walk me through your process for debugging a complex issue. How do you approach problem-solving?&rdquo;
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Showcase */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  40+ Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive question library covering technical skills, behavioral patterns, and energy alignment assessments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Custom Scripts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate personalized interview scripts based on specific role requirements and company culture.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Nature Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Psychological questions designed to reveal what energizes vs exhausts candidates in their work.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Ready to Build Your Vision?</CardTitle>
              <CardDescription>
                This starter kit demonstrates the core functionality. Let&apos;s build the complete Hiring Diagnostic together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Explore Components
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
