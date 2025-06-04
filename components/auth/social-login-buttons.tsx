"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialLoginButtonsProps {
  onLogin: (user: any) => void
}

export function SocialLoginButtons({ onLogin }: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingUser, setPendingUser] = useState<any>(null)
  const { toast } = useToast()

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setLoadingProvider(provider)

    try {
      // Simulate OAuth flow - in real app, this would redirect to OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate OAuth callback with user data
      const mockAuthResponse = {
        google: {
          id: `google_${Date.now()}`,
          email: "user@gmail.com",
          name: "Google User",
          avatar: "/placeholder.svg?height=40&width=40&text=GU",
          provider: "google",
          verified: true,
        },
        github: {
          id: `github_${Date.now()}`,
          email: "user@github.com",
          name: "GitHub User",
          avatar: "/placeholder.svg?height=40&width=40&text=GH",
          provider: "github",
          verified: true,
        },
        twitter: {
          id: `twitter_${Date.now()}`,
          email: "user@twitter.com",
          name: "Twitter User",
          avatar: "/placeholder.svg?height=40&width=40&text=TU",
          provider: "twitter",
          verified: true,
        },
        apple: {
          id: `apple_${Date.now()}`,
          email: "user@icloud.com",
          name: "Apple User",
          avatar: "/placeholder.svg?height=40&width=40&text=AU",
          provider: "apple",
          verified: true,
        },
      }

      const authUser = mockAuthResponse[provider as keyof typeof mockAuthResponse]

      if (!authUser) {
        throw new Error("Authentication failed")
      }

      // Check if user exists in our system (simulate database check)
      const existingUser = localStorage.getItem(`user_${authUser.email}`)

      if (existingUser) {
        // Existing user - show biometric auth
        const userData = JSON.parse(existingUser)
        setPendingUser({
          ...userData,
          lastLogin: new Date().toISOString(),
        })
        setShowAuthModal(true)
      } else {
        // New user - create account
        const newUser = {
          ...authUser,
          preferences: {
            theme: "light",
            defaultStyle: "cinematic",
            autoSave: true,
            notifications: true,
            biometricEnabled: false,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          plan: "free",
          usage: {
            storyboards: 0,
            aiGenerations: 0,
            teamMembers: 0,
          },
        }

        // Save to localStorage (simulate database)
        localStorage.setItem(`user_${newUser.email}`, JSON.stringify(newUser))

        onLogin(newUser)

        toast({
          title: "Account Created!",
          description: `Welcome! Your account has been created with ${provider}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: `Failed to authenticate with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingProvider("")
    }
  }

  const handleBiometricAuth = async () => {
    try {
      // Simulate biometric authentication
      if ("credentials" in navigator) {
        // In a real app, you'd use WebAuthn API
        const credential = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate successful biometric auth
            if (Math.random() > 0.1) {
              // 90% success rate
              resolve({ success: true })
            } else {
              reject(new Error("Biometric authentication failed"))
            }
          }, 1500)
        })

        if (credential) {
          onLogin(pendingUser)
          setShowAuthModal(false)
          setPendingUser(null)

          toast({
            title: "Welcome back!",
            description: "Successfully authenticated with biometrics.",
          })
        }
      } else {
        // Fallback to passcode
        handlePasscodeAuth()
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Biometric authentication failed. Please try passcode.",
        variant: "destructive",
      })
    }
  }

  const handlePasscodeAuth = () => {
    // Simulate passcode entry
    const passcode = prompt("Enter your 6-digit passcode:")

    if (passcode && passcode.length === 6) {
      onLogin(pendingUser)
      setShowAuthModal(false)
      setPendingUser(null)

      toast({
        title: "Welcome back!",
        description: "Successfully authenticated with passcode.",
      })
    } else {
      toast({
        title: "Invalid Passcode",
        description: "Please enter a valid 6-digit passcode.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Separator className="my-4" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-xs text-gray-500">
            OR CONTINUE WITH
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 dark:border-purple-700 dark:hover:bg-purple-900"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            {isLoading && loadingProvider === "google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Google
          </Button>

          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 dark:border-purple-700 dark:hover:bg-purple-900"
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
          >
            {isLoading && loadingProvider === "github" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                  fill="currentColor"
                />
              </svg>
            )}
            GitHub
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 dark:border-purple-700 dark:hover:bg-purple-900"
            onClick={() => handleSocialLogin("twitter")}
            disabled={isLoading}
          >
            {isLoading && loadingProvider === "twitter" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  fill="#1DA1F2"
                />
              </svg>
            )}
            Twitter
          </Button>

          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 dark:border-purple-700 dark:hover:bg-purple-900"
            onClick={() => handleSocialLogin("apple")}
            disabled={isLoading}
          >
            {isLoading && loadingProvider === "apple" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                  fill="currentColor"
                />
              </svg>
            )}
            Apple
          </Button>
        </div>
      </div>

      {/* Biometric Authentication Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome Back!</DialogTitle>
            <DialogDescription className="text-center">
              Use your biometric authentication or passcode to continue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">{pendingUser?.name?.charAt(0) || "U"}</span>
              </div>
              <p className="font-medium">{pendingUser?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{pendingUser?.email}</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={handleBiometricAuth}
              >
                🔒 Use Biometric Authentication
              </Button>

              <Button variant="outline" className="w-full" onClick={handlePasscodeAuth}>
                🔢 Use Passcode Instead
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setShowAuthModal(false)
                  setPendingUser(null)
                }}
              >
                Use Different Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
