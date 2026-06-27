import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

// GET - Is user ki settings lao
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    let settings = await prisma.settings.findUnique({
      where: { userId }
    })

    // Agar is user ki settings nahi hain toh default banao
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
          businessName: "My Business",
          currency: "AED"
        }
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("SETTINGS GET ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Is user ki settings update karo (ya banao)
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const body = await request.json()
    const { businessName, email, phone, address, website, trn, currency, logoUrl } = body

    const settings = await prisma.settings.upsert({
      where: { userId },
      update: {
        businessName: businessName || "My Business",
        email: email || null,
        phone: phone || null,
        address: address || null,
        website: website || null,
        trn: trn || null,
        currency: currency || "AED",
        logoUrl: logoUrl || null
      },
      create: {
        userId,
        businessName: businessName || "My Business",
        email: email || null,
        phone: phone || null,
        address: address || null,
        website: website || null,
        trn: trn || null,
        currency: currency || "AED",
        logoUrl: logoUrl || null
      }
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("SETTINGS POST ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}