"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SocialLoginButtons } from "./social-login-buttons"
import { PasswordResetForm } from "./password-reset-form"

interface LoginFormProps {
  onLogin: (user: any) => void
  onSwitchToSignup: () => void
}

export function LoginForm({ onLogin, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      const user = {
        id: "user-123",
        name: "Creative User",
        email: email,
        avatar: "/placeholder.svg?height=40&width=40&text=CU",
        preferences: {
          theme: "light",
          defaultStyle: "cinematic",
          autoSave: true,
          notifications: true,
        },
        createdAt: new Date().toISOString(),
      }

      onLogin(user)
      setIsLoading(false)

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to StoryVision AI.",
      })
    }, 1500)
  }

  if (showResetForm) {
    return <PasswordResetForm onBackToLogin={() => setShowResetForm(false)} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 p-4">
      <Card className="w-full max-w-md border-2 border-blue-200 dark:border-purple-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Sign in to continue creating amazing storyboards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 dark:border-purple-700 dark:focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-600 hover:text-purple-600 dark:text-purple-400"
                  onClick={() => setShowResetForm(true)}
                >
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-blue-200 focus:border-blue-500 dark:border-purple-700 dark:focus:border-purple-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <SocialLoginButtons onLogin={onLogin} />

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Don't have an account? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-blue-600 hover:text-purple-600 dark:text-purple-400"
              onClick={onSwitchToSignup}
            >
              Sign up here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
