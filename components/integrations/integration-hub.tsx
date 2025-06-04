"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Cloud,
  Share2,
  Zap,
  ImageIcon,
  Video,
  FileText,
  Settings,
  Check,
  ExternalLink,
  Webhook,
  Key,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  category: string
  isConnected: boolean
  isPremium: boolean
  features: string[]
  setupRequired: boolean
}

const integrations: Integration[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and sync your storyboards with Google Drive",
    icon: Cloud,
    category: "storage",
    isConnected: false,
    isPremium: false,
    features: ["Auto-sync", "Backup", "File sharing"],
    setupRequired: true,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Backup and share storyboards via Dropbox",
    icon: Cloud,
    category: "storage",
    isConnected: true,
    isPremium: false,
    features: ["Cloud storage", "Team folders", "Version history"],
    setupRequired: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Share storyboards and get notifications in Slack",
    icon: Share2,
    category: "communication",
    isConnected: false,
    isPremium: false,
    features: ["Instant sharing", "Team notifications", "Progress updates"],
    setupRequired: true,
  },
  {
    id: "figma",
    name: "Figma",
    description: "Import designs and export storyboards to Figma",
    icon: ImageIcon,
    category: "design",
    isConnected: false,
    isPremium: true,
    features: ["Design import", "Asset sync", "Collaborative editing"],
    setupRequired: true,
  },
  {
    id: "adobe-creative",
    name: "Adobe Creative Suite",
    description: "Seamless integration with Photoshop, Illustrator, and After Effects",
    icon: ImageIcon,
    category: "design",
    isConnected: false,
    isPremium: true,
    features: ["Asset import", "Layer sync", "Creative Cloud libraries"],
    setupRequired: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Export storyboards as video content for YouTube",
    icon: Video,
    category: "video",
    isConnected: false,
    isPremium: false,
    features: ["Video export", "Thumbnail generation", "Direct upload"],
    setupRequired: true,
  },
  {
    id: "vimeo",
    name: "Vimeo",
    description: "Professional video hosting and sharing",
    icon: Video,
    category: "video",
    isConnected: false,
    isPremium: true,
    features: ["HD export", "Privacy controls", "Analytics"],
    setupRequired: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Embed storyboards in your Notion workspace",
    icon: FileText,
    category: "productivity",
    isConnected: true,
    isPremium: false,
    features: ["Embed widgets", "Database sync", "Team collaboration"],
    setupRequired: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 5000+ apps",
    icon: Zap,
    category: "automation",
    isConnected: false,
    isPremium: true,
    features: ["Custom workflows", "Trigger actions", "Multi-app automation"],
    setupRequired: true,
  },
  {
    id: "webhooks",
    name: "Custom Webhooks",
    description: "Build custom integrations with webhooks",
    icon: Webhook,
    category: "developer",
    isConnected: false,
    isPremium: true,
    features: ["Real-time events", "Custom endpoints", "API access"],
    setupRequired: true,
  },
]

export function IntegrationHub() {
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    integrations.filter((integration) => integration.isConnected),
  )
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const { toast } = useToast()

  const categories = [
    { id: "all", name: "All Integrations", icon: Settings },
    { id: "storage", name: "Cloud Storage", icon: Cloud },
    { id: "communication", name: "Communication", icon: Share2 },
    { id: "design", name: "Design Tools", icon: ImageIcon },
    { id: "video", name: "Video Platforms", icon: Video },
    { id: "productivity", name: "Productivity", icon: FileText },
    { id: "automation", name: "Automation", icon: Zap },
    { id: "developer", name: "Developer Tools", icon: Key },
  ]

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((integration) => integration.category === selectedCategory)

  const handleConnect = (integration: Integration) => {
    if (integration.isPremium) {
      toast({
        title: "Premium Feature",
        description: "This integration requires a Pro or Enterprise plan.",
        variant: "destructive",
      })
      return
    }

    if (integration.setupRequired) {
      setSelectedIntegration(integration)
      setShowSetupModal(true)
    } else {
      // Simulate connection
      setTimeout(() => {
        setConnectedIntegrations([...connectedIntegrations, integration])
        toast({
          title: "Integration Connected",
          description: `${integration.name} has been successfully connected.`,
        })
      }, 1000)
    }
  }

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(connectedIntegrations.filter((int) => int.id !== integrationId))
    toast({
      title: "Integration Disconnected",
      description: "The integration has been disconnected successfully.",
    })
  }

  const handleSetupComplete = () => {
    if (selectedIntegration) {
      setConnectedIntegrations([...connectedIntegrations, selectedIntegration])
      setShowSetupModal(false)
      setSelectedIntegration(null)

      toast({
        title: "Setup Complete",
        description: `${selectedIntegration.name} has been successfully configured.`,
      })
    }
  }

  const isConnected = (integrationId: string) => {
    return connectedIntegrations.some((int) => int.id === integrationId)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
          Integration Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Connect StoryVision AI with your favorite tools and services
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const Icon = integration.icon
                const connected = isConnected(integration.id)

                return (
                  <Card
                    key={integration.id}
                    className="border-2 border-blue-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            {integration.isPremium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                        {connected && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {connected ? (
                          <>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleDisconnect(integration.id)}
                            >
                              Disconnect
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            onClick={() => handleConnect(integration)}
                            disabled={integration.isPremium}
                          >
                            {integration.isPremium ? "Upgrade Required" : "Connect"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Setup Modal */}
      <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Setup {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>Configure your {selectedIntegration?.name} integration</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedIntegration?.id === "google-drive" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll be redirected to Google to authorize access to your Drive.
                </p>
                <Button className="w-full" onClick={handleSetupComplete}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Authorize with Google
                </Button>
              </div>
            )}

            {selectedIntegration?.id === "slack" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="slack-workspace">Slack Workspace URL</Label>
                  <Input id="slack-workspace" placeholder="your-workspace.slack.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-channel">Default Channel</Label>
                  <Input id="slack-channel" placeholder="#storyboards" />
                </div>
                <Button className="w-full" onClick={handleSetupComplete}>
                  Connect to Slack
                </Button>
              </div>
            )}

            {selectedIntegration?.id === "webhooks" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" placeholder="https://your-app.com/webhook" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
                  <Input id="webhook-secret" type="password" placeholder="Enter secret key" />
                </div>
                <Button className="w-full" onClick={handleSetupComplete}>
                  Save Webhook
                </Button>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => setShowSetupModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
