import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserId } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Login zaroori hai" }, { status: 401 })
    }

    const totalCustomers = await prisma.customer.count({ where: { userId } })
    const totalQuotations = await prisma.quotation.count({ where: { userId } })
    const totalInvoices = await prisma.invoice.count({ where: { userId } })

    const paidInvoices = await prisma.invoice.findMany({
      where: { userId, status: "Paid" }
    })

    const unpaidInvoices = await prisma.invoice.findMany({
      where: { userId, status: "Unpaid" }
    })

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const recentInvoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5
    })

    const recentQuotations = await prisma.quotation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5
    })

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers,
        totalQuotations,
        totalInvoices,
        paidCount: paidInvoices.length,
        unpaidCount: unpaidInvoices.length,
        totalRevenue,
        unpaidAmount,
        recentInvoices,
        recentQuotations,
      }
    })
  } catch (error) {
    console.error("DASHBOARD ERROR:", error)
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}