import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

// GET - Sirf is user ke quotations lao (items ke saath)
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const quotations = await prisma.quotation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    })
    return NextResponse.json({ success: true, data: quotations })
  } catch (error) {
    console.error("QUOTATIONS GET ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Global next quote number nikalo (clash-proof)
async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const last = await prisma.quotation.findFirst({
    orderBy: { createdAt: "desc" }
  })

  let nextNum = 1
  if (last?.number) {
    const parts = last.number.split("-")
    const lastNum = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastNum)) nextNum = lastNum + 1
  }

  return `QT-${year}-${String(nextNum).padStart(4, "0")}`
}

// POST - Naya quotation banao (items ke saath)
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const body = await request.json()
    const { customerId, expiryDate, subtotal, tax, total, notes, items } = body

    if (!customerId || !expiryDate) {
      return NextResponse.json({ success: false, error: "Customer aur expiry date zaroor daalo" }, { status: 400 })
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const number = await generateQuoteNumber()
      try {
        const quotation = await prisma.quotation.create({
          data: {
            userId,
            number,
            customerId,
            expiryDate: new Date(expiryDate),
            subtotal: subtotal || 0,
            tax: tax || 0,
            total: total || 0,
            notes: notes || null,
            status: "Draft",
            items: {
              create: (items || []).map((item: { description: string; quantity: number; rate: number; amount: number }) => ({
                description: item.description,
                quantity: item.quantity || 1,
                rate: item.rate || 0,
                amount: item.amount || 0
              }))
            }
          },
          include: { items: true }
        })
        return NextResponse.json({ success: true, data: quotation }, { status: 201 })
      } catch (e: any) {
        if (e?.code === "P2002") {
          continue
        }
        throw e
      }
    }

    return NextResponse.json({ success: false, error: "Number generate nahi hua, dobara try karo" }, { status: 500 })
  } catch (error) {
    console.error("QUOTATIONS POST ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}