import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary">StudyBuddy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered study companion that helps junior high school students
            build better study habits through personalized guidance and insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Mentor</CardTitle>
              <CardDescription>
                Chat with an AI that understands your study challenges
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your study habits and see your improvement over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Personalized Reports</CardTitle>
              <CardDescription>
                Get weekly insights and recommendations tailored to you
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Safe & Private</CardTitle>
              <CardDescription>
                Age-appropriate content with your privacy protected
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Chat with StudyBuddy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share your study challenges, questions, or goals. StudyBuddy listens
                  and provides helpful, age-appropriate advice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Track Your Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The AI automatically identifies patterns in your study habits like
                  focus, motivation, and stress levels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Get Personalized Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive weekly reports with actionable recommendations to help you
                  improve your study habits and academic performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 StudyBuddy. Built with AI to support student success.</p>
        </div>
      </footer>
    </div>
  );
}
