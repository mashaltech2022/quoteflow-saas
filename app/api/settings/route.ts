import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Settings lao
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()

    // Agar settings nahi hain toh default banao
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          businessName: "My Business",
          currency: "AED"
        }
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}

// POST - Settings update karo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, email, phone, address, website, trn, currency, logoUrl } = body

    let settings = await prisma.settings.findFirst()

    if (settings) {
      // Update karo
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          businessName: businessName || "My Business",
          email: email || null,
          phone: phone || null,
          address: address || null,
          website: website || null,
          trn: trn || null,
          currency: currency || "AED",
          logoUrl: logoUrl || null
        }
      })
    } else {
      // Naya banao
      settings = await prisma.settings.create({
        data: {
          businessName: businessName || "My Business",
          email: email || null,
          phone: phone || null,
          address: address || null,
          website: website || null,
          trn: trn || null,
          currency: currency || "AED",
          logoUrl: logoUrl || null
        }
      })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}