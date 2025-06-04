"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { LayoutDashboard, Wand2, Users, Crown, Bell, Zap, User, LogOut, Palette, HelpCircle } from "lucide-react"

interface AppNavigationProps {
  user: any
  currentView: string
  onViewChange: (view: string) => void
  onLogout: () => void
  onUpdateUser: (user: any) => void
  unreadNotifications?: number
}

export function AppNavigation({
  user,
  currentView,
  onViewChange,
  onLogout,
  onUpdateUser,
  unreadNotifications = 3,
}: AppNavigationProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview and analytics",
    },
    {
      id: "generator",
      label: "Create",
      icon: Wand2,
      description: "Generate new storyboards",
    },
    {
      id: "collaboration",
      label: "Collaborate",
      icon: Users,
      description: "Team collaboration",
      badge: user?.plan === "free" ? "Pro" : null,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Zap,
      description: "Connect your tools",
    },
    {
      id: "subscription",
      label: "Upgrade",
      icon: Crown,
      description: "Manage subscription",
      highlight: user?.plan === "free",
    },
  ]

  const isActive = (viewId: string) => currentView === viewId

  const canAccess = (item: any) => {
    if (item.id === "collaboration" && user?.plan === "free") {
      return false
    }
    return true
  }

  const handleNavigation = (viewId: string) => {
    const item = navigationItems.find((nav) => nav.id === viewId)
    if (item && !canAccess(item)) {
      onViewChange("subscription")
      return
    }
    onViewChange(viewId)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-blue-200 dark:border-purple-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  StoryVision AI
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.id)
                const accessible = canAccess(item)

                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "ghost"}
                    className={`relative ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : accessible
                          ? "hover:bg-blue-50 dark:hover:bg-purple-900/20"
                          : "opacity-60 cursor-not-allowed"
                    } ${item.highlight ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}
                    onClick={() => handleNavigation(item.id)}
                    disabled={!accessible}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && <Badge className="ml-2 bg-yellow-500 text-black text-xs">{item.badge}</Badge>}
                    {item.highlight && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </Button>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative" onClick={() => setShowNotifications(true)}>
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-purple-700">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 dark:bg-purple-900 dark:text-purple-100">
                        {user?.plan?.charAt(0)?.toUpperCase() + user?.plan?.slice(1)} Plan
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => onViewChange("dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onViewChange("settings")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onViewChange("subscription")} className="cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Palette className="mr-2 h-4 w-4" />
                    <span>My Storyboards</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-blue-200 dark:border-purple-800">
          <div className="flex overflow-x-auto px-4 py-2 space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.id)
              const accessible = canAccess(item)

              return (
                <Button
                  key={item.id}
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className={`flex-shrink-0 ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : accessible
                        ? "hover:bg-blue-50 dark:hover:bg-purple-900/20"
                        : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() => handleNavigation(item.id)}
                  disabled={!accessible}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.label}
                  {item.badge && <Badge className="ml-1 bg-yellow-500 text-black text-xs">{item.badge}</Badge>}
                </Button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter user={user} isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
