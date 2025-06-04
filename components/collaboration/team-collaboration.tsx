"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamCollaborationProps {
  storyboardId: string
  currentUser: any
}

const mockCollaborators = [
  {
    id: "user-1",
    name: "Sarah Miller",
    email: "sarah@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SM",
    role: "editor",
    status: "online",
    lastActive: "2 minutes ago",
    permissions: ["view", "edit", "comment"],
  },
  {
    id: "user-2",
    name: "John Davis",
    email: "john@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    role: "viewer",
    status: "offline",
    lastActive: "1 hour ago",
    permissions: ["view", "comment"],
  },
  {
    id: "user-3",
    name: "Emily Wilson",
    email: "emily@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=EW",
    role: "admin",
    status: "online",
    lastActive: "Just now",
    permissions: ["view", "edit", "comment", "manage"],
  },
]

const mockComments = [
  {
    id: "comment-1",
    frameId: "frame-1",
    author: "Sarah Miller",
    avatar: "/placeholder.svg?height=32&width=32&text=SM",
    content: "I think we should adjust the lighting in this scene to make it more dramatic.",
    timestamp: "2 hours ago",
    resolved: false,
  },
  {
    id: "comment-2",
    frameId: "frame-3",
    author: "John Davis",
    avatar: "/placeholder.svg?height=32&width=32&text=JD",
    content: "The transition here feels a bit abrupt. Maybe we can add a smoother fade?",
    timestamp: "1 hour ago",
    resolved: true,
  },
  {
    id: "comment-3",
    frameId: "frame-5",
    author: "Emily Wilson",
    avatar: "/placeholder.svg?height=32&width=32&text=EW",
    content: "Love the composition here! This really captures the emotion we're going for.",
    timestamp: "30 minutes ago",
    resolved: false,
  },
]

export function TeamCollaboration({ storyboardId, currentUser }: TeamCollaborationProps) {
  const [collaborators, setCollaborators] = useState(mockCollaborators)
  const [comments, setComments] = useState(mockComments)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")
  const [newComment, setNewComment] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { toast } = useToast()

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending invitation
    setTimeout(() => {
      const newCollaborator = {
        id: `user-${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        avatar: `/placeholder.svg?height=40&width=40&text=${inviteEmail.charAt(0).toUpperCase()}`,
        role: inviteRole,
        status: "pending",
        lastActive: "Invitation sent",
        permissions:
          inviteRole === "admin"
            ? ["view", "edit", "comment", "manage"]
            : inviteRole === "editor"
              ? ["view", "edit", "comment"]
              : ["view", "comment"],
      }

      setCollaborators([...collaborators, newCollaborator])
      setInviteEmail("")
      setInviteRole("viewer")
      setShowInviteModal(false)

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteEmail} successfully.`,
      })
    }, 1000)
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setCollaborators(
      collaborators.map((collab) =>
        collab.id === userId
          ? {
              ...collab,
              role: newRole,
              permissions:
                newRole === "admin"
                  ? ["view", "edit", "comment", "manage"]
                  : newRole === "editor"
                    ? ["view", "edit", "comment"]
                    : ["view", "comment"],
            }
          : collab,
      ),
    )

    toast({
      title: "Role Updated",
      description: "Collaborator role has been updated successfully.",
    })
  }

  const handleRemoveCollaborator = (userId: string) => {
    setCollaborators(collaborators.filter((collab) => collab.id !== userId))

    toast({
      title: "Collaborator Removed",
      description: "The collaborator has been removed from this project.",
    })
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      frameId: "frame-1", // This would be dynamic based on selected frame
      author: currentUser.name,
      avatar: currentUser.avatar,
      content: newComment,
      timestamp: "Just now",
      resolved: false,
    }

    setComments([comment, ...comments])
    setNewComment("")

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the storyboard.",
    })
  }

  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment)),
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "viewer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Team Collaboration</h2>
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Invite Collaborator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to collaborate on this storyboard</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view and comment</SelectItem>
                    <SelectItem value="editor">Editor - Can view, edit, and comment</SelectItem>
                    <SelectItem value="admin">Admin - Full access including user management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={handleInviteUser}
                >
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="collaborators" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collaborators">
            <Users className="mr-2 h-4 w-4" />
            Collaborators
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators" className="space-y-4">
          <Card className="border-2 border-blue-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({collaborators.length})
              </CardTitle>
              <CardDescription>Manage who has access to this storyboard and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                        <AvatarFallback>
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-medium">{collaborator.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{collaborator.email}</p>
                      <p className="text-xs text-gray-500">{collaborator.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(collaborator.role)}>{collaborator.role}</Badge>
                    {collaborator.status !== "pending" && (
                      <Select
                        value={collaborator.role}
                        onValueChange={(value) => handleRoleChange(collaborator.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleRemoveCollaborator(collaborator.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="border-2 border-blue-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Feedback
              </CardTitle>
              <CardDescription>Collaborate with your team through comments and suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Label htmlFor="new-comment">Add a comment</Label>
                <Textarea
                  id="new-comment"
                  placeholder="Share your thoughts or feedback..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Add Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4 border-t">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-gray-500">{comment.timestamp}</p>
                          <Badge variant="outline" className="text-xs">
                            Frame {comment.frameId.split("-")[1]}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolveComment(comment.id)}
                          className={comment.resolved ? "text-green-600" : "text-gray-400"}
                        >
                          {comment.resolved ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className={`text-sm ${comment.resolved ? "line-through text-gray-500" : ""}`}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-2 border-blue-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Track changes and updates to this storyboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Miller edited Frame 3</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Davis added a comment</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Emily Wilson shared the storyboard</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New collaborator invited</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
