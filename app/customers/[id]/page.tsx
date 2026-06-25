"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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

const Icon = {
  dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
  receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  settings: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
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
    // Customer
    const cRes = await fetch("/api/customers")
    const cData = await cRes.json()
    if (cData.success) {
      const cust = cData.data.find((c: Customer) => c.id === params.id)
      setCustomer(cust)
    }

    // Invoices for this customer
    const iRes = await fetch("/api/invoices")
    const iData = await iRes.json()
    if (iData.success) {
      setInvoices(iData.data.filter((i: Invoice) => i.customerId === params.id))
    }

    // Quotations for this customer
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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Icon.dashboard },
    { href: "/customers", label: "Customers", icon: Icon.users, active: true },
    { href: "/quotations", label: "Quotations", icon: Icon.file },
    { href: "/invoices", label: "Invoices", icon: Icon.receipt },
    { href: "/settings", label: "Settings", icon: Icon.settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rise { opacity: 0; animation: rise 0.5s ease-out forwards; }
      `}</style>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col fixed">
          <div className="px-5 py-5 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">Quote<span className="text-blue-600">Flow</span></h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Business Management</p>
          </div>
          <nav className="p-3 flex-1 space-y-1">
            {navItems.map((item) => {
              const I = item.icon
              return (
                <a key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    item.active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <I className="w-[18px] h-[18px]" />
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="p-3 border-t border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">M</div>
            <div>
              <p className="text-xs font-medium text-gray-800">Mashal</p>
              <p className="text-[11px] text-gray-400">Eagle Frozen</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-60">
          {/* Topbar */}
          <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 px-6 py-3.5 flex items-center gap-4 sticky top-0 z-10">
            <a href="/customers" className="text-blue-600 hover:underline text-sm">← Back</a>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Customer Details</h2>
              <p className="text-xs text-gray-400">History aur summary</p>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-400 py-20">Loading...</div>
            ) : !customer ? (
              <div className="text-center text-gray-500 py-20">Customer not found</div>
            ) : (
              <>
                {/* Customer Info */}
                <div className="rise bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                      {customer.companyName && <p className="text-sm text-gray-500">{customer.companyName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-gray-800">{customer.email || "-"}</p>
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
                <div className="grid grid-cols-3 gap-4 mb-5">
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
                    <table className="w-full">
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
                    <table className="w-full">
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
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}