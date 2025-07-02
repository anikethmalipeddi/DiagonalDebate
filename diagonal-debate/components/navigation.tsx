"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Scale, Menu, X, LogOut, User } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [pathname])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        setUser(null)
        toast.success('Logged out successfully')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/contention-ideas", label: "Contention Ideas" },
    { href: "/event-board", label: "Event Board" },
    { href: "/legislation-checker", label: "Legislation Checker" },
  ]

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DiagonalDebate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/auth">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth?mode=register">
                      <Button variant="primary" size="sm">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isLoading && (
                <div className="flex space-x-3 px-4 pt-2">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-gray-700 px-4 py-2">
                        <User className="h-4 w-4" />
                        <span>{user.name}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth?mode=register" className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
