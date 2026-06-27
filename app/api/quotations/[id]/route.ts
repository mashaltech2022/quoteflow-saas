import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const { id } = await context.params

    const result = await prisma.quotation.deleteMany({
      where: { id, userId }
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Quotation nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("QUOTATION DELETE ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const result = await prisma.quotation.updateMany({
      where: { id, userId },
      data: body
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Quotation nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("QUOTATION PATCH ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Full edit — quotation fields + line items
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    // Pehle confirm karo ke yeh quotation isi user ka hai
    const existing = await prisma.quotation.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Quotation nahi mila" }, { status: 404 })
    }

    // Step 1: purane items delete karo
    await prisma.quotationItem.deleteMany({
      where: { quotationId: id }
    })

    // Step 2: quotation fields update karo + naye items create karo
    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        customerId: body.customerId,
        expiryDate: new Date(body.expiryDate),
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        notes: body.notes,
        items: {
          create: (body.items || []).map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
          }))
        }
      },
      include: { items: true }
    })

    return NextResponse.json({ success: true, data: quotation })
  } catch (error) {
    console.error("QUOTATION PUT ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}