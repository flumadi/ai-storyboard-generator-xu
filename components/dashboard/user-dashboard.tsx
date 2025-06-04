"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Crown, Plus, Share2, Download, Eye, TrendingUp, Star, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserDashboardProps {
  user: any
  onCreateNew: () => void
  onOpenStoryboard: (id: string) => void
}

// Mock data for user's storyboards
const mockStoryboards = [
  {
    id: "sb-1",
    title: "Blue Horizon Campaign",
    description: "Data solutions marketing storyboard",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Blue+Horizon",
    frames: 6,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    status: "completed",
    views: 245,
    shares: 12,
    collaborators: 3,
    isPublic: true,
  },
  {
    id: "sb-2",
    title: "Product Launch Story",
    description: "New product introduction sequence",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Product+Launch",
    frames: 8,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-14",
    status: "draft",
    views: 89,
    shares: 3,
    collaborators: 1,
    isPublic: false,
  },
  {
    id: "sb-3",
    title: "Customer Journey Map",
    description: "User experience visualization",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Customer+Journey",
    frames: 12,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    status: "in-review",
    views: 156,
    shares: 8,
    collaborators: 5,
    isPublic: true,
  },
]

const mockAnalytics = {
  totalStoryboards: 15,
  totalViews: 1247,
  totalShares: 89,
  totalCollaborators: 12,
  monthlyGrowth: 23,
  popularStoryboard: "Blue Horizon Campaign",
}

export function UserDashboard({ user, onCreateNew, onOpenStoryboard }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const handleShareStoryboard = (storyboard: any) => {
    const shareLink = `https://storyvision.ai/share/${storyboard.id}`
    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Share Link Copied",
      description: `Link for "${storyboard.title}" copied to clipboard.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "in-review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-4 border-blue-200 dark:border-purple-700">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Ready to create amazing storyboards?</p>
          </div>
        </div>
        <Button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white mt-4 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Storyboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="storyboards">
            <FileText className="mr-2 h-4 w-4" />
            My Storyboards
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Storyboards</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-purple-300">
                  {mockAnalytics.totalStoryboards}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">+3 from last month</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-blue-300">
                  {mockAnalytics.totalViews.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  +{mockAnalytics.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {mockAnalytics.totalCollaborators}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Across all projects</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shares</CardTitle>
                <Share2 className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{mockAnalytics.totalShares}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Blue Horizon Campaign completed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah joined Customer Journey Map</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product Launch Story shared</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storyboards Created</span>
                    <span>3/10</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AI Generations</span>
                    <span>45/100</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Team Members</span>
                    <span>2/5</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <Button variant="outline" className="w-full border-blue-500 hover:bg-blue-50">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Storyboards Tab */}
        <TabsContent value="storyboards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Storyboards</h2>
            <div className="flex space-x-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStoryboards.map((storyboard) => (
              <Card
                key={storyboard.id}
                className="border-2 border-blue-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <img
                    src={storyboard.thumbnail || "/placeholder.svg"}
                    alt={storyboard.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{storyboard.title}</CardTitle>
                      <CardDescription className="text-sm">{storyboard.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(storyboard.status)}>{storyboard.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{storyboard.frames} frames</span>
                    <span>{storyboard.views} views</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{storyboard.collaborators}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">{storyboard.shares}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={() => onOpenStoryboard(storyboard.id)}
                    >
                      Open
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShareStoryboard(storyboard)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Team Collaboration</h2>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Active Collaborations</CardTitle>
                <CardDescription>Projects you're currently working on with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      BH
                    </div>
                    <div>
                      <p className="font-medium">Blue Horizon Campaign</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">3 collaborators</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      CJ
                    </div>
                    <div>
                      <p className="font-medium">Customer Journey Map</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">5 collaborators</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Review</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People you collaborate with regularly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=SM" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Sarah Miller</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Designer</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Davis</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Creative Director</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=EW" />
                      <AvatarFallback>EW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Emily Wilson</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Offline</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Analytics & Insights</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your storyboards' engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Most Viewed</span>
                    <span className="text-sm text-blue-600">{mockAnalytics.popularStoryboard}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Views per Storyboard</span>
                    <span className="text-sm font-bold">83</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <span className="text-sm font-bold text-green-600">7.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Share Rate</span>
                    <span className="text-sm font-bold text-purple-600">3.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-bold text-green-600">+{mockAnalytics.monthlyGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Collaborators</span>
                    <span className="text-sm font-bold">+4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Projects Completed</span>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Generations Used</span>
                    <span className="text-sm font-bold">45/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
