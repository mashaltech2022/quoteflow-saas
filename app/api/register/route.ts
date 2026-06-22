import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Sab fields zaroor bharo" },
        { status: 400 }
      )
    }

    // Check karo kya email pehle se hai
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Yeh email pehle se registered hai" },
        { status: 400 }
      )
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 12)

    // User banao
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: "Account ban gaya!", userId: user.id },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: "Kuch masla ho gaya" },
      { status: 500 }
    )
  }
}