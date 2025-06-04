import StoryboardGenerator from "@/components/storyboard-generator"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="storyboard-theme">
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-purple-950">
        <StoryboardGenerator />
      </div>
    </ThemeProvider>
  )
}
