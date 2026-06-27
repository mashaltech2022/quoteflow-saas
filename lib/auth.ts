import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

// Logged-in user ki ID nikalo (Next.js 16 compatible)
export async function getCurrentUserId(req: NextRequest): Promise<string | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })
  return (token?.id as string) || null
}