"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4">{error.message}</p>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
} 