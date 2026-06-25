import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Sab invoices lao (items ke saath)
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true }
    })
    return NextResponse.json({ success: true, data: invoices })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Naya invoice banao (items ke saath)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerId, dueDate, subtotal, tax, total, notes, items } = body

    if (!customerId || !dueDate) {
      return NextResponse.json({ success: false, error: "Customer aur due date zaroor daalo" }, { status: 400 })
    }

    const count = await prisma.invoice.count()
    const number = `EFT-${String(count + 1).padStart(4, "0")}`

    const invoice = await prisma.invoice.create({
      data: {
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
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}