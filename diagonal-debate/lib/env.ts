function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is required but is not configured`)
  }

  return value
}

export function getJwtSecret(): Uint8Array {
  const secret = requireEnvironmentVariable("JWT_SECRET")

  if (secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters")
  }

  return new TextEncoder().encode(secret)
}
