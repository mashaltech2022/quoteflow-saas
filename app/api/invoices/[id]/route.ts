import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

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
    const { status, amountPaid } = body

    const result = await prisma.invoice.updateMany({
      where: { id, userId },
      data: {
        status: status || undefined,
        amountPaid: amountPaid !== undefined ? amountPaid : undefined,
      }
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Invoice nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("INVOICE PATCH ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

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

    const result = await prisma.invoice.deleteMany({
      where: { id, userId }
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Invoice nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("INVOICE DELETE ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Full edit — invoice fields + line items
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

    // Pehle confirm karo ke yeh invoice isi user ka hai
    const existing = await prisma.invoice.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: "Invoice nahi mila" }, { status: 404 })
    }

    // Step 1: purane items delete karo
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    })

    // Step 2: invoice fields update karo + naye items create karo
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        customerId: body.customerId,
        dueDate: new Date(body.dueDate),
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

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    console.error("INVOICE PUT ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}