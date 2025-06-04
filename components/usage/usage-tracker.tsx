"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, AlertTriangle, TrendingUp, Users, Zap, FileText } from "lucide-react"

interface UsageTrackerProps {
  user: any
  onUpgrade: () => void
}

interface UsageLimits {
  storyboards: { used: number; limit: number }
  aiGenerations: { used: number; limit: number }
  teamMembers: { used: number; limit: number }
  exports: { used: number; limit: number }
  storage: { used: number; limit: number } // in MB
}

const planLimits = {
  free: {
    storyboards: { used: 3, limit: 5 },
    aiGenerations: { used: 45, limit: 50 },
    teamMembers: { used: 1, limit: 1 },
    exports: { used: 8, limit: 10 },
    storage: { used: 125, limit: 500 },
  },
  pro: {
    storyboards: { used: 23, limit: -1 }, // -1 means unlimited
    aiGenerations: { used: 234, limit: 500 },
    teamMembers: { used: 3, limit: 5 },
    exports: { used: 45, limit: -1 },
    storage: { used: 2340, limit: 10000 },
  },
  enterprise: {
    storyboards: { used: 156, limit: -1 },
    aiGenerations: { used: 1234, limit: -1 },
    teamMembers: { used: 12, limit: -1 },
    exports: { used: 234, limit: -1 },
    storage: { used: 15600, limit: 100000 },
  },
}

export function UsageTracker({ user, onUpgrade }: UsageTrackerProps) {
  const [usage, setUsage] = useState<UsageLimits>(planLimits[user?.plan as keyof typeof planLimits] || planLimits.free)
  const [showWarnings, setShowWarnings] = useState(true)

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getUsageStatus = (used: number, limit: number) => {
    if (limit === -1) return "unlimited"
    const percentage = getUsagePercentage(used, limit)
    if (percentage >= 100) return "exceeded"
    if (percentage >= 90) return "critical"
    if (percentage >= 75) return "warning"
    return "normal"
  }

  const formatStorage = (mb: number) => {
    if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`
    return `${mb} MB`
  }

  const usageItems = [
    {
      key: "storyboards",
      label: "Storyboards Created",
      icon: FileText,
      description: "Monthly storyboard creation limit",
    },
    {
      key: "aiGenerations",
      label: "AI Generations",
      icon: Zap,
      description: "AI-powered content generations",
    },
    {
      key: "teamMembers",
      label: "Team Members",
      icon: Users,
      description: "Collaborative team size",
    },
    {
      key: "exports",
      label: "Exports",
      icon: TrendingUp,
      description: "Monthly export downloads",
    },
  ]

  // Simulate real-time usage updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update usage (simulate real activity)
      if (Math.random() > 0.9) {
        setUsage((prev) => ({
          ...prev,
          aiGenerations: {
            ...prev.aiGenerations,
            used: Math.min(
              prev.aiGenerations.used + 1,
              prev.aiGenerations.limit === -1 ? prev.aiGenerations.used + 1 : prev.aiGenerations.limit,
            ),
          },
        }))
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const criticalUsage = usageItems.filter((item) => {
    const itemUsage = usage[item.key as keyof UsageLimits]
    return getUsageStatus(itemUsage.used, itemUsage.limit) === "critical"
  })

  const exceededUsage = usageItems.filter((item) => {
    const itemUsage = usage[item.key as keyof UsageLimits]
    return getUsageStatus(itemUsage.used, itemUsage.limit) === "exceeded"
  })

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {showWarnings && (exceededUsage.length > 0 || criticalUsage.length > 0) && (
        <div className="space-y-3">
          {exceededUsage.length > 0 && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Usage Limit Exceeded:</strong> You've reached your monthly limit for{" "}
                {exceededUsage.map((item) => item.label).join(", ")}.
                <Button variant="link" className="p-0 ml-1 text-red-600" onClick={onUpgrade}>
                  Upgrade now
                </Button>{" "}
                to continue.
              </AlertDescription>
            </Alert>
          )}

          {criticalUsage.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Approaching Limit:</strong> You're close to your monthly limit for{" "}
                {criticalUsage.map((item) => item.label).join(", ")}.
                <Button variant="link" className="p-0 ml-1 text-yellow-600" onClick={onUpgrade}>
                  Consider upgrading
                </Button>{" "}
                to avoid interruptions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Usage Overview */}
      <Card className="border-2 border-blue-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Usage Overview
              </CardTitle>
              <CardDescription>Track your monthly usage and plan limits</CardDescription>
            </div>
            <Badge
              className={`${
                user?.plan === "free"
                  ? "bg-gray-100 text-gray-800"
                  : user?.plan === "pro"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {user?.plan?.charAt(0)?.toUpperCase() + user?.plan?.slice(1)} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {usageItems.map((item) => {
            const Icon = item.icon
            const itemUsage = usage[item.key as keyof UsageLimits]
            const percentage = getUsagePercentage(itemUsage.used, itemUsage.limit)
            const status = getUsageStatus(itemUsage.used, itemUsage.limit)
            const isUnlimited = itemUsage.limit === -1

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {itemUsage.used}
                      {isUnlimited ? "" : ` / ${itemUsage.limit}`}
                    </span>
                    {isUnlimited && <Badge className="bg-green-100 text-green-800 text-xs">Unlimited</Badge>}
                    {status === "exceeded" && <Badge className="bg-red-100 text-red-800 text-xs">Exceeded</Badge>}
                    {status === "critical" && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Critical</Badge>}
                  </div>
                </div>

                {!isUnlimited && (
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                )}

                {isUnlimited && <p className="text-xs text-gray-500">{item.description} - No limits</p>}
              </div>
            )
          })}

          {/* Storage Usage */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Storage Used</span>
              </div>
              <span className="text-sm text-gray-600">
                {formatStorage(usage.storage.used)} / {formatStorage(usage.storage.limit)}
              </span>
            </div>
            <Progress value={getUsagePercentage(usage.storage.used, usage.storage.limit)} className="h-2" />
            <p className="text-xs text-gray-500">Cloud storage for your storyboards and assets</p>
          </div>

          {/* Upgrade CTA */}
          {user?.plan === "free" && (
            <div className="pt-4 border-t">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Need more resources?</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Upgrade to Pro for unlimited storyboards and advanced features
                    </p>
                  </div>
                  <Button
                    onClick={onUpgrade}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
