import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const { id } = await context.params

    // Sirf isi user ka customer delete hoga
    const result = await prisma.customer.deleteMany({
      where: { id, userId }
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Customer nahi mila" }, { status: 404 })
    }

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
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    // Sirf isi user ka customer update hoga
    const result = await prisma.customer.updateMany({
      where: { id, userId },
      data: body
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Customer nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}