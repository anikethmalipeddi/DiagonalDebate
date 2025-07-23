"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Mail, Lock, User as UserIcon, Scale } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"
  const [activeTab, setActiveTab] = useState(mode)

  useEffect(() => {
    setActiveTab(mode)
  }, [mode])

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [nameError, setNameError] = useState("")

  // Helper to validate name: must be two words, both capitalized
  function validateName(name: string) {
    const parts = name.trim().split(" ")
    if (parts.length < 2) return "Please enter both your first and last name."
    if (!parts.every(p => /^[A-Z][a-zA-Z]+$/.test(p))) return "Both first and last name must start with a capital letter and contain only letters."
    return ""
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
      if (!response.ok) {
        let message = `Error: ${response.statusText}`
        try {
          const errorData = await response.json()
          message = errorData.error || message
        } catch {
          // Ignore if no JSON body
        }
        throw new Error(message)
      }
      toast.success("Login successful! Redirecting...")
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    const nameValidation = validateName(registerData.name)
    if (nameValidation) {
      setNameError(nameValidation)
      return
    } else {
      setNameError("")
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      })
      if (!response.ok) {
        let message = `Error: ${response.statusText}`
        try {
          const errorData = await response.json()
          message = errorData.error || message
        } catch {
          // Ignore if no JSON body
        }
        throw new Error(message)
      }
      toast.success("Registration successful! Redirecting...")
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, form: "login" | "register") => {
    const { name, value } = e.target
    if (form === 'login') {
        setLoginData(prev => ({...prev, [name]: value}))
    } else {
        setRegisterData(prev => ({...prev, [name]: value}))
        if (name === "name") {
          setNameError(validateName(value))
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-red-600">
            <Scale size={48}/>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to DiagonalDebate</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account or create a new one to get started.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs value={activeTab} onValueChange={v => router.push(`/auth?mode=${v}`)} className="w-full">
            <TabsList className="w-full gap-0">
              <TabsTrigger className="flex-1" value="login">Login</TabsTrigger>
              <TabsTrigger className="flex-1" value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-1">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="login-email" name="email" type="email" placeholder="you@example.com" className="pl-10" value={loginData.email} onChange={e => handleInputChange(e, 'login')} disabled={isLoading} required />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="login-password" name="password" type="password" placeholder="Your Password" className="pl-10" value={loginData.password} onChange={e => handleInputChange(e, 'login')} disabled={isLoading} required />
                    </div>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Name Input */}
                <div>
                    <Label htmlFor="register-name">First and Last Name</Label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="register-name" name="name" type="text" placeholder="e.g. John Doe" className="pl-10" value={registerData.name} onChange={e => handleInputChange(e, 'register')} disabled={isLoading} required aria-describedby="register-name-error" />
                    </div>

                    {nameError && (
                      <p
                        id="register-name-error"
                        className="text-xs text-red-600 mt-2 mb-0"
                      >
                        {nameError}
                      </p>
                    )}
                </div>

                {/* Email Input */}
                <div className="space-y-0.5">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="register-email" name="email" type="email" placeholder="you@example.com" className="pl-10" value={registerData.email} onChange={e => handleInputChange(e, 'register')} disabled={isLoading} required />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-0.5">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="register-password" name="password" type="password" placeholder="Create a Password" className="pl-10" value={registerData.password} onChange={e => handleInputChange(e, 'register')} disabled={isLoading} required />
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-0.5">
                    <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input id="register-confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Your Password" className="pl-10" value={registerData.confirmPassword} onChange={e => handleInputChange(e, 'register')} disabled={isLoading} required />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} disabled={isLoading} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none text-gray-700"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-red-600 hover:text-red-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-red-600 hover:text-red-700">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
