"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Sparkles, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordResetFormProps {
  onBackToLogin: () => void
}

export function PasswordResetForm({ onBackToLogin }: PasswordResetFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)

      toast({
        title: "Reset Link Sent",
        description: "Check your email for instructions to reset your password.",
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 p-4">
        <Card className="w-full max-w-md border-2 border-blue-200 dark:border-purple-800 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              If you don't see the email in your inbox, please check your spam folder or request another reset link.
            </p>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 dark:border-purple-700 dark:hover:bg-purple-900"
              >
                Didn't receive the email? Try again
              </Button>
              <Button
                onClick={onBackToLogin}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 p-4">
      <Card className="w-full max-w-md border-2 border-blue-200 dark:border-purple-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter your email and we'll send you a link to reset your password
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6"
            >
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </form>

          <Button
            variant="link"
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center text-blue-600 hover:text-purple-600 dark:text-purple-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
