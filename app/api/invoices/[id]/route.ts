import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status, amountPaid } = body

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: status || undefined,
        amountPaid: amountPaid !== undefined ? amountPaid : undefined,
      }
    })

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.invoice.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Full edit — invoice fields + line items
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

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
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}