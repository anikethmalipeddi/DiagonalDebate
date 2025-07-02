"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  className?: string
  delay?: number
}

export function AnimatedIcon({ icon: Icon, className = "", delay = 0 }: AnimatedIconProps) {
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
        threshold: 0.5,
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
    >
      <Icon className={className} />
    </div>
  )
} 