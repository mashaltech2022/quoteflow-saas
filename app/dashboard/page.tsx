"use client"
import { useState, useEffect } from "react"

interface DashboardData {
  totalCustomers: number
  totalQuotations: number
  totalInvoices: number
  paidCount: number
  unpaidCount: number
  totalRevenue: number
  unpaidAmount: number
  recentInvoices: any[]
  recentQuotations: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    const res = await fetch("/api/dashboard")
    const result = await res.json()
    if (result.success) setData(result.data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Quote<span className="text-blue-600">Flow</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Good afternoon 👋</span>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-56 min-h-screen bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">📊 Dashboard</a>
            <a href="/customers" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">👥 Customers</a>
            <a href="/quotations" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">📋 Quotations</a>
            <a href="/invoices" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">🧾 Invoices</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">⚙️ Settings</a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome to QuoteFlow</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalCustomers}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">Total Quotes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{data?.totalQuotations}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">Paid Invoices</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{data?.paidCount}</p>
                  <p className="text-xs text-gray-400 mt-1">AED {data?.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500">Unpaid</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{data?.unpaidCount}</p>
                  <p className="text-xs text-red-400 mt-1">AED {data?.unpaidAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-2 gap-4">
                {/* Recent Invoices */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                  {data?.recentInvoices.length === 0 ? (
                    <p className="text-gray-400 text-sm">No invoices yet</p>
                  ) : (
                    <div className="space-y-3">
                      {data?.recentInvoices.map((inv: any) => (
                        <div key={inv.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{inv.number}</p>
                            <p className="text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">AED {inv.total.toFixed(2)}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              inv.status === "Paid" ? "bg-green-100 text-green-700" :
                              inv.status === "Unpaid" ? "bg-gray-100 text-gray-600" :
                              "bg-red-100 text-red-600"
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Quotations */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Quotations</h3>
                  {data?.recentQuotations.length === 0 ? (
                    <p className="text-gray-400 text-sm">No quotations yet</p>
                  ) : (
                    <div className="space-y-3">
                      {data?.recentQuotations.map((q: any) => (
                        <div key={q.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{q.number}</p>
                            <p className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">AED {q.total.toFixed(2)}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              q.status === "Draft" ? "bg-gray-100 text-gray-600" :
                              q.status === "Approved" ? "bg-green-100 text-green-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>{q.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex gap-3">
                  <a href="/quotations" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                    + New Quotation
                  </a>
                  <a href="/invoices" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                    + New Invoice
                  </a>
                  <a href="/customers" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                    + Add Customer
                  </a>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}