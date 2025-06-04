"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Download, Share2, Plus, Trash2, Sparkles, Wand2, ImagePlus, Settings, RefreshCw, Loader2 } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { TeamCollaboration } from "@/components/collaboration/team-collaboration"
import { IntegrationHub } from "@/components/integrations/integration-hub"
import { AppNavigation } from "@/components/navigation/app-navigation"
import { UsageTracker } from "@/components/usage/usage-tracker"
import { UserProfileModal } from "@/components/user/user-profile-modal"

// Mock data for storyboard frames - Blue Horizon example
const initialFrames = [
  {
    id: "frame-1",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Ocean+Horizon",
    caption:
      "Soft waves roll under a cool blue sky. The camera slowly zooms toward the horizon. Calm, quiet, and full of promise.",
  },
  {
    id: "frame-2",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Water+Droplet",
    caption:
      "A single blue droplet falls into a pool, creating smooth ripples. Light dances across the surface. Small actions create wide change.",
  },
  {
    id: "frame-3",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Connected+City",
    caption:
      "A modern blue-toned city pulses with energy. Lights flicker, data flows, and life moves forward. Everything is connected.",
  },
  {
    id: "frame-4",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Innovation+Energy",
    caption:
      "Blue energy swirls around, transforming objects, ideas, and moments. Barriers dissolve, pathways open. Innovation in motion.",
  },
  {
    id: "frame-5",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Professional+Portrait",
    caption:
      "A character steps forward, framed in a soft glow of blue. Determined eyes, steady pace. Ready to make a difference.",
  },
  {
    id: "frame-6",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Think+Forward",
    caption:
      "The screen fades into a vibrant blue background. A clean logo appears with a subtle pulse. 'Think Forward. Live Blue.'",
  },
]

export default function StoryboardGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [frames, setFrames] = useState(initialFrames)
  const [activeTab, setActiveTab] = useState("create")
  const [stylePreset, setStylePreset] = useState("cinematic")
  const [frameCount, setFrameCount] = useState(3)
  const [autoCaption, setAutoCaption] = useState(true)
  const { toast } = useToast()

  const [user, setUser] = useState<any>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [userPlan, setUserPlan] = useState("free")
  const [showProfile, setShowProfile] = useState(false)

  // Role-based access control
  const hasAccess = (feature: string) => {
    const rolePermissions = {
      free: ["dashboard", "generator", "integrations", "subscription"],
      pro: ["dashboard", "generator", "collaboration", "integrations", "subscription", "usage"],
      enterprise: ["dashboard", "generator", "collaboration", "integrations", "subscription", "usage", "admin"],
    }

    return rolePermissions[userPlan as keyof typeof rolePermissions]?.includes(feature) || false
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    setUserPlan(userData.plan || "free")
  }

  const handleSignup = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    setUserPlan(userData.plan || "free")
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setFrames([])
    setCurrentView("dashboard")
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    })
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
    setUserPlan(updatedUser.plan || "free")
  }

  const handlePlanSelect = (plan: string) => {
    setUserPlan(plan)
    setUser((prev) => ({ ...prev, plan }))
    setCurrentView("dashboard")
  }

  const handleViewChange = (view: string) => {
    // Check access permissions
    if (!hasAccess(view) && view !== "subscription") {
      toast({
        title: "Premium Feature",
        description: "This feature requires a Pro or Enterprise plan.",
        variant: "destructive",
      })
      setCurrentView("subscription")
      return
    }
    setCurrentView(view)
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(frames)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFrames(items)
  }

  // Simulate generating storyboard from prompt
  const generateStoryboard = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a story prompt to generate a storyboard.",
        variant: "destructive",
      })
      return
    }

    // Check usage limits for free plan
    if (userPlan === "free") {
      // Simulate usage check
      const currentUsage = 8 // This would come from actual usage tracking
      if (currentUsage >= 10) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your monthly limit. Upgrade to continue creating.",
          variant: "destructive",
        })
        setCurrentView("subscription")
        return
      }
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate new frames based on the prompt
      const newFrames = Array.from({ length: frameCount }, (_, i) => ({
        id: `frame-${Date.now()}-${i}`,
        imageUrl: `/placeholder.svg?height=300&width=400&text=Frame ${i + 1}`,
        caption: `Generated scene ${i + 1} based on "${prompt}"`,
      }))

      setFrames(newFrames)
      setIsGenerating(false)
      setActiveTab("edit")

      toast({
        title: "Storyboard Generated!",
        description: `Created ${frameCount} frames based on your prompt.`,
      })
    }, 2000)
  }

  // Add a new empty frame
  const addFrame = () => {
    const newFrame = {
      id: `frame-${Date.now()}`,
      imageUrl: "/placeholder.svg?height=300&width=400&text=New Frame",
      caption: "Add a caption for this scene",
    }
    setFrames([...frames, newFrame])
  }

  // Remove a frame
  const removeFrame = (id: string) => {
    setFrames(frames.filter((frame) => frame.id !== id))
  }

  // Update frame caption
  const updateCaption = (id: string, caption: string) => {
    setFrames(frames.map((frame) => (frame.id === id ? { ...frame, caption } : frame)))
  }

  // Simulate exporting storyboard
  const exportStoryboard = () => {
    toast({
      title: "Exporting Storyboard",
      description: "Your storyboard is being prepared for download.",
    })

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your storyboard has been exported successfully!",
      })
    }, 1500)
  }

  // Simulate sharing storyboard
  const shareStoryboard = () => {
    // Generate a fake share link
    const shareLink = `https://storyboard.ai/share/${Math.random().toString(36).substring(2, 10)}`

    // Copy to clipboard
    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Share Link Created",
      description: "Link copied to clipboard: " + shareLink,
    })
  }

  // Regenerate a specific frame
  const regenerateFrame = (id: string) => {
    setFrames(
      frames.map((frame) =>
        frame.id === id
          ? {
              ...frame,
              imageUrl: `/placeholder.svg?height=300&width=400&text=Regenerated ${Date.now()}`,
            }
          : frame,
      ),
    )

    toast({
      title: "Frame Regenerated",
      description: "The selected frame has been regenerated.",
    })
  }

  // Show authentication forms if not logged in
  if (!isAuthenticated) {
    if (authMode === "login") {
      return <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setAuthMode("signup")} />
    } else {
      return <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setAuthMode("login")} />
    }
  }

  // Main app layout with navigation
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-purple-950">
      <AppNavigation
        user={user}
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        unreadNotifications={3}
      />

      <main className="container mx-auto py-8 px-4">
        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <UserDashboard
            user={user}
            onCreateNew={() => setCurrentView("generator")}
            onOpenStoryboard={(id) => {
              setCurrentView("generator")
              // Load specific storyboard logic here
            }}
          />
        )}

        {/* Subscription View */}
        {currentView === "subscription" && <SubscriptionPlans currentPlan={userPlan} onPlanSelect={handlePlanSelect} />}

        {/* Collaboration View */}
        {currentView === "collaboration" && <TeamCollaboration storyboardId="current-storyboard" currentUser={user} />}

        {/* Integrations View */}
        {currentView === "integrations" && <IntegrationHub />}

        {/* Usage Tracking View */}
        {currentView === "usage" && <UsageTracker user={user} onUpgrade={() => setCurrentView("subscription")} />}

        {/* Settings View */}
        {currentView === "settings" && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Account Settings
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UsageTracker user={user} onUpgrade={() => setCurrentView("subscription")} />
              </div>
              <div>
                <Card className="border-2 border-blue-200 dark:border-purple-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setShowProfile(true)}>
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setCurrentView("subscription")}
                      >
                        Manage Subscription
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setCurrentView("integrations")}
                      >
                        Manage Integrations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Generator View */}
        {currentView === "generator" && (
          <div className="space-y-8">
            {/* Sample Projects Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Featured Example</h2>
              <Card
                className="border-2 border-blue-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setFrames(initialFrames)
                  setActiveTab("edit")
                  toast({
                    title: "Blue Horizon Loaded",
                    description: "Professional data solutions storyboard loaded as example.",
                  })
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/images/blue-horizon-storyboard.jpg"
                      alt="Blue Horizon Storyboard"
                      className="w-24 h-16 object-cover rounded-md border-2 border-blue-300"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-blue-700 dark:text-purple-300">Blue Horizon</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Data Solutions Storyboard</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-purple-900 dark:text-purple-100">
                        6 Frames • Professional
                      </Badge>
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        Load Example
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="create" className="text-lg">
                  <Wand2 className="mr-2 h-4 w-4" /> Create
                </TabsTrigger>
                <TabsTrigger value="edit" className="text-lg">
                  <Settings className="mr-2 h-4 w-4" /> Edit & Arrange
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <Card className="border-2 border-blue-200 dark:border-purple-800 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="prompt" className="text-lg font-medium">
                          Your Story Prompt
                        </Label>
                        <Textarea
                          id="prompt"
                          placeholder="Describe your story... (e.g., 'A young explorer discovers a magical artifact in an ancient forest that opens a portal to another dimension')"
                          className="mt-2 h-32 resize-none"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="style" className="text-sm font-medium">
                              Visual Style
                            </Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {["cinematic", "anime", "comic", "realistic", "fantasy", "noir"].map((style) => (
                                <Badge
                                  key={style}
                                  variant={stylePreset === style ? "default" : "outline"}
                                  className={`cursor-pointer py-2 px-3 capitalize ${
                                    stylePreset === style
                                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                      : "hover:bg-blue-100 dark:hover:bg-purple-900"
                                  }`}
                                  onClick={() => setStylePreset(style)}
                                >
                                  {style}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch id="auto-caption" checked={autoCaption} onCheckedChange={setAutoCaption} />
                            <Label htmlFor="auto-caption">Auto-generate captions</Label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between">
                              <Label htmlFor="frame-count" className="text-sm font-medium">
                                Number of Frames: {frameCount}
                              </Label>
                            </div>
                            <Slider
                              id="frame-count"
                              min={1}
                              max={userPlan === "free" ? 5 : 15}
                              step={1}
                              value={[frameCount]}
                              onValueChange={(value) => setFrameCount(value[0])}
                              className="mt-2"
                            />
                            {userPlan === "free" && (
                              <p className="text-xs text-gray-500 mt-1">
                                Free plan limited to 5 frames.{" "}
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-xs"
                                  onClick={() => setCurrentView("subscription")}
                                >
                                  Upgrade for more
                                </Button>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={generateStoryboard}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-6 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" /> Generate Storyboard
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="edit" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-purple-300">Your Storyboard</h2>
                  <div className="flex space-x-2">
                    <Button onClick={addFrame} variant="outline" className="border-dashed border-2">
                      <Plus className="mr-2 h-4 w-4" /> Add Frame
                    </Button>
                    {hasAccess("collaboration") && (
                      <Button variant="outline" onClick={() => setCurrentView("collaboration")}>
                        Collaborate
                      </Button>
                    )}
                  </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="storyboard" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-nowrap overflow-x-auto pb-6 gap-4 min-h-[400px]"
                      >
                        {frames.map((frame, index) => (
                          <Draggable key={frame.id} draggableId={frame.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex-shrink-0 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-100 dark:border-purple-900 overflow-hidden"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 cursor-grab active:cursor-grabbing"
                                />
                                <div className="p-3">
                                  <div className="relative group">
                                    <img
                                      src={frame.imageUrl || "/placeholder.svg"}
                                      alt={`Frame ${index + 1}`}
                                      className="w-full h-[200px] object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="mr-2"
                                        onClick={() => regenerateFrame(frame.id)}
                                      >
                                        <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => removeFrame(frame.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Badge className="mb-2 bg-blue-100 text-blue-800 dark:bg-purple-900 dark:text-purple-100">
                                      Frame {index + 1}
                                    </Badge>
                                    <Textarea
                                      value={frame.caption}
                                      onChange={(e) => updateCaption(frame.id, e.target.value)}
                                      className="w-full h-20 text-sm resize-none"
                                      placeholder="Add caption..."
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {frames.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <ImagePlus className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      No frames yet. Generate a storyboard or add frames manually.
                    </p>
                    <Button onClick={() => setActiveTab("create")} className="mt-4">
                      <Wand2 className="mr-2 h-4 w-4" /> Create Storyboard
                    </Button>
                  </div>
                )}

                {frames.length > 0 && (
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={exportStoryboard}
                      className="border-blue-500 hover:bg-blue-500 hover:text-white dark:border-purple-400 dark:hover:bg-purple-400"
                    >
                      <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button
                      onClick={shareStoryboard}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      <UserProfileModal
        user={user}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  )
}
