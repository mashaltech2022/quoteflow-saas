import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

// GET - Sirf logged-in user ke customers lao
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const customers = await prisma.customer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    console.error("CUSTOMERS GET ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Naya customer banao (logged-in user ke liye)
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const body = await request.json()
    const { name, companyName, email, phone, address, notes } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Naam zaroor daalo" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        name,
        companyName: companyName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
      }
    })

    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch (error) {
    console.error("CUSTOMERS POST ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}