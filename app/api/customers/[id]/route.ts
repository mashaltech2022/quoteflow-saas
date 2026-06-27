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

    const result = await prisma.customer.deleteMany({
      where: { id, userId }
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Customer nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CUSTOMER DELETE ERROR:", error)
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

    const result = await prisma.customer.updateMany({
      where: { id, userId },
      data: body
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Customer nahi mila" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CUSTOMER PATCH ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}