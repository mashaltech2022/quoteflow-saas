"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

interface Invoice {
  id: string
  number: string
  customerId: string
  status: string
  dueDate: string
  total: number
  amountPaid: number
}

interface Quotation {
  id: string
  number: string
  customerId: string
  status: string
  expiryDate: string
  total: number
}

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const cRes = await fetch("/api/customers")
    const cData = await cRes.json()
    if (cData.success) {
      const cust = cData.data.find((c: Customer) => c.id === params.id)
      setCustomer(cust)
    }

    const iRes = await fetch("/api/invoices")
    const iData = await iRes.json()
    if (iData.success) {
      setInvoices(iData.data.filter((i: Invoice) => i.customerId === params.id))
    }

    const qRes = await fetch("/api/quotations")
    const qData = await qRes.json()
    if (qData.success) {
      setQuotations(qData.data.filter((q: Quotation) => q.customerId === params.id))
    }

    setLoading(false)
  }

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0)
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.total, 0)
  const totalPending = totalInvoiced - totalPaid

  const invStatusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700"
      case "Unpaid": return "bg-gray-100 text-gray-600"
      case "Overdue": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const qtStatusStyle = (status: string) => {
    switch (status) {
      case "Accepted":
      case "Approved": return "bg-green-100 text-green-700"
      case "Draft":
      case "Sent": return "bg-blue-100 text-blue-700"
      case "Expired": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rise { opacity: 0; animation: rise 0.5s ease-out forwards; }
      `}</style>

      <Sidebar />

      {/* Main */}
      <main className="ml-0 md:ml-60">
        {/* Topbar */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 pl-16 pr-4 md:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-20">
          <a href="/customers" className="text-blue-600 hover:underline text-sm whitespace-nowrap">← Back</a>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Customer Details</h2>
            <p className="text-xs text-gray-400">History aur summary</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading...</div>
          ) : !customer ? (
            <div className="text-center text-gray-500 py-20">Customer not found</div>
          ) : (
            <>
              {/* Customer Info */}
              <div className="rise bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                    {customer.companyName && <p className="text-sm text-gray-500">{customer.companyName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-800 break-words">{customer.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-gray-800">{customer.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-gray-800">{customer.address || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
                <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm" style={{ animationDelay: "0.05s" }}>
                  <p className="text-xs text-gray-400">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">AED {totalInvoiced.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{invoices.length} invoices</p>
                </div>
                <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm" style={{ animationDelay: "0.1s" }}>
                  <p className="text-xs text-gray-400">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-0.5">AED {totalPaid.toFixed(2)}</p>
                </div>
                <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm" style={{ animationDelay: "0.15s" }}>
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-red-500 mt-0.5">AED {totalPending.toFixed(2)}</p>
                </div>
              </div>

              {/* Invoices */}
              <div className="rise bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-5" style={{ animationDelay: "0.2s" }}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Invoices ({invoices.length})</h3>
                </div>
                {invoices.length === 0 ? (
                  <p className="px-6 py-6 text-sm text-gray-400">Is customer ke koi invoices nahi hain</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/70">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">
                              <a href={`/invoices/${inv.id}`} className="hover:underline">{inv.number}</a>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {inv.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${invStatusStyle(inv.status)}`}>{inv.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quotations */}
              <div className="rise bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" style={{ animationDelay: "0.25s" }}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Quotations ({quotations.length})</h3>
                </div>
                {quotations.length === 0 ? (
                  <p className="px-6 py-6 text-sm text-gray-400">Is customer ke koi quotations nahi hain</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/70">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Quote #</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotations.map((q) => (
                          <tr key={q.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">
                              <a href={`/quotations/${q.id}`} className="hover:underline">{q.number}</a>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.expiryDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {q.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${qtStatusStyle(q.status)}`}>{q.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}