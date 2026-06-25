"use client"
import { useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

const Icon = {
  dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
  receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  settings: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", companyName: "", email: "", phone: "", address: "" })

  useEffect(() => { fetchCustomers() }, [])

  async function fetchCustomers() {
    const res = await fetch("/api/customers")
    const data = await res.json()
    if (data.success) setCustomers(data.data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      setForm({ name: "", companyName: "", email: "", phone: "", address: "" })
      setShowForm(false)
      fetchCustomers()
    }
    setSaving(false)
  }

  async function deleteCustomer(id: string) {
    if (!confirm("Yeh customer delete karna chahte ho?")) return
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) fetchCustomers()
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
          <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Customers</h2>
              <p className="text-xs text-gray-400">{customers.length} total customers</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
              + Add Customer
            </button>
          </div>

          <div className="p-6">
            {/* Add Customer Form */}
            {showForm && (
              <div className="rise bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">New Customer</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Ahmed Ali"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})}
                      placeholder="Al Fajer HVAC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="ahmed@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+971 55 123 4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                      placeholder="Dubai, UAE"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button type="submit" disabled={saving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                      {saving ? "Saving..." : "Save Customer"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Customers Table */}
            <div className="rise bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" style={{ animationDelay: "0.1s" }}>
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : customers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon.users className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No customers yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "Add Customer" to add your first customer</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                              {c.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.companyName || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.email || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.phone || "-"}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => deleteCustomer(c.id)}
                            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition font-medium">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}