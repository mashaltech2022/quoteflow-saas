import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.quotation.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const quotation = await prisma.quotation.update({
      where: { id },
      data: body
    })
    return NextResponse.json({ success: true, data: quotation })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// Full edit — quotation fields + line items
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

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
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}