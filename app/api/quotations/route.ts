import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Sab quotations lao (items ke saath)
export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true }
    })
    return NextResponse.json({ success: true, data: quotations })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Naya quotation banao (items ke saath)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerId, expiryDate, subtotal, tax, total, notes, items } = body

    if (!customerId || !expiryDate) {
      return NextResponse.json({ success: false, error: "Customer aur expiry date zaroor daalo" }, { status: 400 })
    }

    const count = await prisma.quotation.count()
    const number = `QT-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const quotation = await prisma.quotation.create({
      data: {
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
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}