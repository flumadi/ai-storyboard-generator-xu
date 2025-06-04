"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Crown, Zap, Star, Infinity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionPlansProps {
  currentPlan?: string
  onPlanSelect: (plan: string) => void
}

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: { monthly: 0, yearly: 0 },
    icon: Star,
    color: "from-gray-500 to-gray-600",
    features: [
      "5 storyboards per month",
      "Basic AI generation",
      "Standard templates",
      "Export to PDF",
      "Community support",
    ],
    limitations: [
      "Limited to 5 frames per storyboard",
      "Basic export options only",
      "No team collaboration",
      "No priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For creative professionals",
    price: { monthly: 19, yearly: 190 },
    icon: Crown,
    color: "from-blue-500 to-purple-500",
    popular: true,
    features: [
      "Unlimited storyboards",
      "Advanced AI generation",
      "Premium templates",
      "All export formats",
      "Team collaboration (up to 5 members)",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
    limitations: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams and organizations",
    price: { monthly: 49, yearly: 490 },
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced integrations",
      "Custom AI training",
      "White-label solution",
      "Dedicated account manager",
      "SLA guarantee",
      "Advanced security",
      "API access",
    ],
    limitations: [],
  },
]

export function SubscriptionPlans({ currentPlan = "free", onPlanSelect }: SubscriptionPlansProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")
  const { toast } = useToast()

  const handlePlanSelection = (planId: string) => {
    if (planId === currentPlan) return

    setSelectedPlan(planId)
    setShowUpgradeModal(true)
  }

  const handleUpgrade = () => {
    // Simulate payment processing
    setTimeout(() => {
      onPlanSelect(selectedPlan)
      setShowUpgradeModal(false)

      toast({
        title: "Plan Updated!",
        description: `You've successfully upgraded to the ${plans.find((p) => p.id === selectedPlan)?.name} plan.`,
      })
    }, 2000)
  }

  const getDiscountPercentage = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Unlock the full potential of StoryVision AI</p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : ""}>
            Monthly
          </Label>
          <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
          <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : ""}>
            Yearly
          </Label>
          {isYearly && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Save up to 20%</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const price = isYearly ? plan.price.yearly : plan.price.monthly
          const isCurrentPlan = plan.id === currentPlan
          const discount = getDiscountPercentage(plan.price.monthly, plan.price.yearly)

          return (
            <Card
              key={plan.id}
              className={`relative border-2 transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-blue-500 dark:border-purple-500 shadow-lg scale-105"
                  : "border-blue-200 dark:border-purple-800"
              } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mb-4`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-500 ml-1">/{isYearly ? "year" : "month"}</span>
                  </div>
                  {isYearly && plan.price.monthly > 0 && discount > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save {discount}% with yearly billing
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <div className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <p key={index} className="text-xs text-gray-400">
                          • {limitation}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      : isCurrentPlan
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "border-blue-500 hover:bg-blue-50 dark:border-purple-500 dark:hover:bg-purple-900"
                  }`}
                  variant={plan.popular ? "default" : isCurrentPlan ? "default" : "outline"}
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.id === "free" ? "Get Started" : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 p-4 text-left">Feature</th>
                <th className="border border-gray-200 dark:border-gray-700 p-4 text-center">Free</th>
                <th className="border border-gray-200 dark:border-gray-700 p-4 text-center">Pro</th>
                <th className="border border-gray-200 dark:border-gray-700 p-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-4">Storyboards per month</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">5</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Infinity className="h-4 w-4 mx-auto" />
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Infinity className="h-4 w-4 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-4">Team members</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">1</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">5</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Infinity className="h-4 w-4 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-4">AI generations</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">50/month</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">500/month</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Infinity className="h-4 w-4 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-4">Priority support</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">-</td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Check className="h-4 w-4 mx-auto text-green-500" />
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <Check className="h-4 w-4 mx-auto text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Upgrade to {plans.find((p) => p.id === selectedPlan)?.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              You're about to upgrade your subscription plan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-lg font-semibold">
                $
                {isYearly
                  ? plans.find((p) => p.id === selectedPlan)?.price.yearly
                  : plans.find((p) => p.id === selectedPlan)?.price.monthly}
                <span className="text-sm font-normal text-gray-500">/{isYearly ? "year" : "month"}</span>
              </p>
              {isYearly && <p className="text-sm text-green-600 dark:text-green-400">Save 20% with yearly billing</p>}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={handleUpgrade}
              >
                Confirm Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
