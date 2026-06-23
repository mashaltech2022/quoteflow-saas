import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const totalCustomers = await prisma.customer.count()
    const totalQuotations = await prisma.quotation.count()
    const totalInvoices = await prisma.invoice.count()
    
    const paidInvoices = await prisma.invoice.findMany({
      where: { status: "Paid" }
    })
    
    const unpaidInvoices = await prisma.invoice.findMany({
      where: { status: "Unpaid" }
    })

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const recentInvoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    })

    const recentQuotations = await prisma.quotation.findMany({
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
    return NextResponse.json({ success: false, error: "Kuch masla ho gaya" }, { status: 500 })
  }
}