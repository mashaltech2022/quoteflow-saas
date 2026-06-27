import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

// GET - Sirf is user ke invoices lao (items ke saath) + overdue auto-mark
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    // Step 1: is user ke jin invoices ki due date nikal gayi aur Unpaid hain, unhe Overdue karo
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.invoice.updateMany({
      where: {
        userId,
        status: "Unpaid",
        dueDate: { lt: today }
      },
      data: { status: "Overdue" }
    })

    // Step 2: is user ke saare invoices fetch karo
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    })
    return NextResponse.json({ success: true, data: invoices })
  } catch (error) {
    console.error("INVOICES GET ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Global next invoice number nikalo (clash-proof)
async function generateInvoiceNumber(): Promise<string> {
  const last = await prisma.invoice.findFirst({
    orderBy: { createdAt: "desc" }
  })

  let nextNum = 1
  if (last?.number) {
    const parts = last.number.split("-")
    const lastNum = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastNum)) nextNum = lastNum + 1
  }

  return `EFT-${String(nextNum).padStart(4, "0")}`
}

// POST - Naya invoice banao (items ke saath)
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const body = await request.json()
    const { customerId, dueDate, subtotal, tax, total, notes, items } = body

    if (!customerId || !dueDate) {
      return NextResponse.json({ success: false, error: "Customer aur due date zaroor daalo" }, { status: 400 })
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const number = await generateInvoiceNumber()
      try {
        const invoice = await prisma.invoice.create({
          data: {
            userId,
            number,
            customerId,
            dueDate: new Date(dueDate),
            subtotal: subtotal || 0,
            tax: tax || 0,
            total: total || 0,
            amountPaid: 0,
            notes: notes || null,
            status: "Unpaid",
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
        return NextResponse.json({ success: true, data: invoice }, { status: 201 })
      } catch (e: any) {
        if (e?.code === "P2002") {
          continue
        }
        throw e
      }
    }

    return NextResponse.json({ success: false, error: "Number generate nahi hua, dobara try karo" }, { status: 500 })
  } catch (error) {
    console.error("INVOICES POST ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}