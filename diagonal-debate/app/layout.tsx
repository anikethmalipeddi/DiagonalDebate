import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "DiagonalDebate - Congressional Debate Legislation Assistant",
  description: "Empowering high school congressional debate students with AI-powered legislation tools",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full antialiased font-sans" suppressHydrationWarning={true}>
        <Navigation />
        <main className="flex-grow bg-white">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
