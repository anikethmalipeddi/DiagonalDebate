import Link from "next/link"
import { Scale, Lightbulb } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white-800 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">DiagonalDebate</span>
            </div>
            <p className="text-red-700 font-semibold mb-2 text-lg">DiagonalDebate: Smarter Angles. Shorter Paths.</p>
            <p className="text-black-300 mb-4">
              Empowering high school congressional debate students with AI-powered legislation tools and educational
              resources.
            </p>
            <p className="text-sm text-black-400">Version 1.0.0</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-black-100">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legislation-checker" className="text-black-300 hover:text-white transition-colors">
                  Legislation Checker
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-black-300 hover:text-white transition-colors">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/contention-ideas" className="text-black-300 hover:text-white transition-colors">
                  Contention Ideas
                </Link>
              </li>
              <li>
                <Link href="/event-board" className="text-black-300 hover:text-white transition-colors">
                  Event Board
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-black-100">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-black-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-black-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-black-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-black-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-black-100 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Suggestions
            </h3>
            <p className="text-black-300 mb-3 text-sm">
              Have an idea for a new feature? We'd love to hear it!
            </p>
            <Link 
              href="/contact#suggestions" 
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Submit Suggestion
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <p className="text-black-300">© 2025 DiagonalDebate. Built for the team, by Aniketh Malipeddi.</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-black-300 mb-2">Questions? Contact us:</p>
              <p className="text-sm text-black-400">
                <a href="mailto:diagonaldebate@gmail.com" className="hover:text-white transition-colors">
                  diagonaldebate@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
