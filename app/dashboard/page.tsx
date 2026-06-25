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

// ---- Simple inline icons (no library needed) ----
const Icon = {
  dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
  receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  settings: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  bell: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  plus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fetchDashboard()
    const t = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(t)
  }, [])

  async function fetchDashboard() {
    const res = await fetch("/api/dashboard")
    const result = await res.json()
    if (result.success) setData(result.data)
    setLoading(false)
  }

  // ---- Build last 6 months revenue from Paid invoices ----
  const now = new Date()
  const months: { label: string; key: string; value: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ label: d.toLocaleString("default", { month: "short" }), key: `${d.getFullYear()}-${d.getMonth()}`, value: 0 })
  }
  data?.recentInvoices?.forEach((inv: any) => {
    if (inv.status === "Paid") {
      const d = new Date(inv.createdAt)
      const m = months.find((mm) => mm.key === `${d.getFullYear()}-${d.getMonth()}`)
      if (m) m.value += inv.total
    }
  })
  const maxRev = Math.max(...months.map((m) => m.value), 1)

  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Icon.dashboard, active: true },
    { href: "/customers", label: "Customers", icon: Icon.users },
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
          <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Dashboard</h2>
              <p className="text-xs text-gray-400">{greeting}, Mashal 👋</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
                <Icon.bell className="w-[18px] h-[18px]" />
              </button>
              <a href="/quotations" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition shadow-sm">
                <Icon.plus className="w-4 h-4" /> New Quotation
              </a>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-400 py-20">Loading...</div>
            ) : (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Total Customers", value: data?.totalCustomers, sub: "Active clients", color: "blue", icon: Icon.users },
                    { label: "Total Quotes", value: data?.totalQuotations, sub: "All time", color: "green", icon: Icon.file },
                    { label: "Paid Invoices", value: data?.paidCount, sub: `AED ${data?.totalRevenue.toFixed(2)}`, color: "teal", icon: Icon.receipt },
                    { label: "Unpaid", value: data?.unpaidCount, sub: `AED ${data?.unpaidAmount.toFixed(2)}`, color: "red", icon: Icon.receipt },
                  ].map((s, i) => {
                    const I = s.icon
                    const colors: any = {
                      blue: "bg-blue-50 text-blue-600", green: "bg-green-50 text-green-600",
                      teal: "bg-teal-50 text-teal-600", red: "bg-red-50 text-red-500",
                    }
                    const valColor: any = { blue: "text-gray-900", green: "text-gray-900", teal: "text-teal-600", red: "text-red-500" }
                    return (
                      <div key={i} className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[s.color]}`}>
                          <I className="w-5 h-5" />
                        </div>
                        <p className="text-xs text-gray-400">{s.label}</p>
                        <p className={`text-2xl font-bold mt-0.5 ${valColor[s.color]}`}>{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Revenue Chart */}
                <div className="rise bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-5" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
                      <p className="text-xs text-gray-400">Last 6 months (paid invoices)</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">AED {months.reduce((a, m) => a + m.value, 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-end justify-between gap-3 h-44 px-2">
                    {months.map((m, i) => {
                      const pct = (m.value / maxRev) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full flex items-end justify-center" style={{ height: "150px" }}>
                            <div className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 relative"
                              style={{ height: mounted ? `${Math.max(pct, 2)}%` : "0%", transition: `height 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s` }}>
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                {m.value.toFixed(0)}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-gray-400">{m.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm" style={{ animationDelay: "0.4s" }}>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                    {data?.recentInvoices.length === 0 ? (
                      <p className="text-gray-400 text-sm">No invoices yet</p>
                    ) : (
                      <div className="space-y-3">
                        {data?.recentInvoices.map((inv: any) => (
                          <div key={inv.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{inv.number}</p>
                              <p className="text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">AED {inv.total.toFixed(2)}</p>
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                inv.status === "Paid" ? "bg-green-100 text-green-700" :
                                inv.status === "Unpaid" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-600"
                              }`}>{inv.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm" style={{ animationDelay: "0.5s" }}>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Quotations</h3>
                    {data?.recentQuotations.length === 0 ? (
                      <p className="text-gray-400 text-sm">No quotations yet</p>
                    ) : (
                      <div className="space-y-3">
                        {data?.recentQuotations.map((q: any) => (
                          <div key={q.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{q.number}</p>
                              <p className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">AED {q.total.toFixed(2)}</p>
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                q.status === "Draft" ? "bg-blue-100 text-blue-700" :
                                (q.status === "Accepted" || q.status === "Approved") ? "bg-green-100 text-green-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>{q.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rise bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mt-4" style={{ animationDelay: "0.6s" }}>
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex gap-3">
                    <a href="/quotations" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">+ New Quotation</a>
                    <a href="/invoices" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">+ New Invoice</a>
                    <a href="/customers" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">+ Add Customer</a>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}