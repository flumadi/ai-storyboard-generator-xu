"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Check, X, Users, Crown, Zap, AlertCircle, CheckCircle, Clock, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "collaboration" | "system" | "billing" | "feature" | "security"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionable: boolean
  priority: "low" | "medium" | "high"
  data?: any
}

interface NotificationCenterProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "collaboration",
    title: "New Comment on Blue Horizon",
    message: "Sarah Miller commented on Frame 3: 'The lighting looks perfect here!'",
    timestamp: "2 minutes ago",
    read: false,
    actionable: true,
    priority: "medium",
    data: { storyboardId: "sb-1", frameId: "frame-3", userId: "user-1" },
  },
  {
    id: "notif-2",
    type: "system",
    title: "Storyboard Export Complete",
    message: "Your 'Product Launch Story' has been exported successfully.",
    timestamp: "1 hour ago",
    read: false,
    actionable: true,
    priority: "low",
    data: { storyboardId: "sb-2", downloadUrl: "https://example.com/download" },
  },
  {
    id: "notif-3",
    type: "billing",
    title: "Usage Limit Warning",
    message: "You've used 8/10 storyboards this month. Consider upgrading to Pro.",
    timestamp: "3 hours ago",
    read: true,
    actionable: true,
    priority: "high",
    data: { usage: 8, limit: 10, plan: "free" },
  },
  {
    id: "notif-4",
    type: "collaboration",
    title: "Team Invitation",
    message: "John Davis invited you to collaborate on 'Customer Journey Map'",
    timestamp: "1 day ago",
    read: false,
    actionable: true,
    priority: "medium",
    data: { inviterId: "user-2", storyboardId: "sb-3" },
  },
  {
    id: "notif-5",
    type: "feature",
    title: "New Feature: AI Voice Narration",
    message: "Generate voice narration for your storyboards with our new AI feature!",
    timestamp: "2 days ago",
    read: true,
    actionable: false,
    priority: "low",
    data: { feature: "ai-voice-narration" },
  },
  {
    id: "notif-6",
    type: "security",
    title: "New Login Detected",
    message: "We detected a new login from Chrome on Windows. Was this you?",
    timestamp: "3 days ago",
    read: true,
    actionable: true,
    priority: "high",
    data: { device: "Chrome on Windows", location: "New York, US" },
  },
]

export function NotificationCenter({ user, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    collaborationNotifications: true,
    systemNotifications: true,
    billingNotifications: true,
    featureNotifications: false,
    securityNotifications: true,
  })
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "Your notification center has been cleared.",
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case "collaboration":
        if (notification.data?.storyboardId) {
          // Navigate to storyboard
          toast({
            title: "Opening Storyboard",
            description: "Navigating to the storyboard...",
          })
        }
        break
      case "system":
        if (notification.data?.downloadUrl) {
          // Download file
          toast({
            title: "Download Started",
            description: "Your file download has started.",
          })
        }
        break
      case "billing":
        // Navigate to subscription page
        toast({
          title: "Opening Subscription",
          description: "Redirecting to subscription management...",
        })
        break
    }
    markAsRead(notification.id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "collaboration":
        return <Users className="h-4 w-4" />
      case "system":
        return <CheckCircle className="h-4 w-4" />
      case "billing":
        return <Crown className="h-4 w-4" />
      case "feature":
        return <Zap className="h-4 w-4" />
      case "security":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
      case "low":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10"
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (simulate real-time updates)
      if (Math.random() > 0.95) {
        // 5% chance every 5 seconds
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: "collaboration",
          title: "Real-time Update",
          message: "Someone just made changes to your storyboard!",
          timestamp: "Just now",
          read: false,
          actionable: true,
          priority: "medium",
          data: {},
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </DialogTitle>
          <DialogDescription>Stay updated with your storyboards and team activity</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-4 w-fit">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 && <Badge className="ml-1 bg-red-500 text-white text-xs">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="collaboration">Team</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-l-4 cursor-pointer transition-all hover:shadow-md ${getPriorityColor(notification.priority)} ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-2">
                      {notification.actionable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNotificationAction(notification)
                          }}
                        >
                          View
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            )}
          </div>
        </Tabs>

        {/* Notification Settings */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Notification Preferences</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifs" className="text-sm">
                Email Notifications
              </Label>
              <Switch
                id="email-notifs"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifs" className="text-sm">
                Push Notifications
              </Label>
              <Switch
                id="push-notifs"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="collab-notifs" className="text-sm">
                Team Updates
              </Label>
              <Switch
                id="collab-notifs"
                checked={settings.collaborationNotifications}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, collaborationNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-notifs" className="text-sm">
                Security Alerts
              </Label>
              <Switch
                id="security-notifs"
                checked={settings.securityNotifications}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, securityNotifications: checked }))}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
