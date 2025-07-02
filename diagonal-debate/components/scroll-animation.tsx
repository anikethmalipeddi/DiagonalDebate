"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "fade"
  delay?: number
}

export function ScrollAnimation({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
            if (ref.current) {
              observer.unobserve(ref.current)
            }
          }, delay)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return "translate-y-16"
      case "down":
        return "-translate-y-16"
      case "left":
        return "translate-x-16"
      case "right":
        return "-translate-x-16"
      case "fade":
      default:
        return ""
    }
  }

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${getDirectionClasses()}`
      }`}
    >
      {children}
    </div>
  )
} 