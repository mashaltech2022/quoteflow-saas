import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Sab customers lao
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Naya customer banao
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, companyName, email, phone, address, notes } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Naam zaroor daalo" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        companyName: companyName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
      }
    })

    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}