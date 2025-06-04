"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Settings, Bell, Palette, Camera, Save, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfileModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
  onUpdateUser: (user: any) => void
}

export function UserProfileModal({ user, isOpen, onClose, onUpdateUser }: UserProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    preferences: { ...user.preferences },
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("preferences.")) {
      const prefField = field.replace("preferences.", "")
      setFormData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [prefField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = () => {
    setIsLoading(true)

    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        preferences: formData.preferences,
      }

      onUpdateUser(updatedUser)
      setIsLoading(false)
      onClose()

      toast({
        title: "Profile Updated",
        description: "Your profile and preferences have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Profile & Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and customize your StoryVision AI experience.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="account">
              <Crown className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-4 border-blue-200 dark:border-purple-700">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF (max. 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Account Status</h4>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-purple-900 dark:text-purple-100">
                      Free Plan
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Creative Preferences
                </CardTitle>
                <CardDescription>Customize your default settings for storyboard creation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultStyle">Default Visual Style</Label>
                  <Select
                    value={formData.preferences.defaultStyle}
                    onValueChange={(value) => handleInputChange("preferences.defaultStyle", value)}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="comic">Comic</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="noir">Noir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <Select
                    value={formData.preferences.theme}
                    onValueChange={(value) => handleInputChange("preferences.theme", value)}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoSave">Auto-save Projects</Label>
                    <p className="text-sm text-gray-500">Automatically save your work as you create</p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={formData.preferences.autoSave}
                    onCheckedChange={(checked) => handleInputChange("preferences.autoSave", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates about new features and tips</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formData.preferences.notifications}
                    onCheckedChange={(checked) => handleInputChange("preferences.notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-dashed border-blue-200 dark:border-purple-700 rounded-lg text-center">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Upgrade to StoryVision Pro</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Unlock unlimited storyboards, advanced AI features, and premium templates.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    Upgrade Now
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Plan</h4>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Free Plan</p>
                      <p className="text-sm text-gray-500">5 storyboards per month</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
