"use client"
import { useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  companyName: string | null
}

interface QuotationItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Quotation {
  id: string
  number: string
  customerId: string
  status: string
  issueDate: string
  expiryDate: string
  total: number
  notes: string | null
  items: QuotationItem[]
}

interface LineItem {
  description: string
  quantity: string
  rate: string
  amount: number
}

const Icon = {
  dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
  receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  settings: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ customerId: "", expiryDate: "", tax: "", notes: "" })
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: "1", rate: "", amount: 0 }])

  useEffect(() => {
    fetchQuotations()
    fetchCustomers()
  }, [])

  async function fetchQuotations() {
    const res = await fetch("/api/quotations")
    const data = await res.json()
    if (data.success) setQuotations(data.data)
    setLoading(false)
  }

  async function fetchCustomers() {
    const res = await fetch("/api/customers")
    const data = await res.json()
    if (data.success) setCustomers(data.data)
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(field === "quantity" ? value : updated[index].quantity) || 0
      const rate = parseFloat(field === "rate" ? value : updated[index].rate) || 0
      updated[index].amount = qty * rate
    }
    setItems(updated)
  }

  function addItem() {
    setItems([...items, { description: "", quantity: "1", rate: "", amount: 0 }])
  }

  function removeItem(index: number) {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxPercent = parseFloat(form.tax) || 0
  const taxAmount = subtotal * taxPercent / 100
  const total = subtotal + taxAmount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: form.customerId,
        expiryDate: form.expiryDate,
        subtotal,
        tax: taxPercent,
        total,
        notes: form.notes,
        items: items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          rate: parseFloat(item.rate) || 0,
          amount: item.amount
        }))
      })
    })
    const data = await res.json()
    if (data.success) {
      setForm({ customerId: "", expiryDate: "", tax: "", notes: "" })
      setItems([{ description: "", quantity: "1", rate: "", amount: 0 }])
      setShowForm(false)
      fetchQuotations()
    }
    setSaving(false)
  }

  async function deleteQuotation(id: string) {
    if (!confirm("Yeh quotation delete karna chahte ho?")) return
    const res = await fetch(`/api/quotations/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) fetchQuotations()
  }

  const statusStyle = (status: string) => {
    switch (status) {
      case "Draft": return "bg-blue-100 text-blue-700"
      case "Sent": return "bg-blue-100 text-blue-700"
      case "Accepted":
      case "Approved": return "bg-green-100 text-green-700"
      case "Expired": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const getCustomerName = (id: string) => {
    const c = customers.find(c => c.id === id)
    return c ? c.name : "-"
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Icon.dashboard },
    { href: "/customers", label: "Customers", icon: Icon.users },
    { href: "/quotations", label: "Quotations", icon: Icon.file, active: true },
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
              <h2 className="text-base font-semibold text-gray-900">Quotations</h2>
              <p className="text-xs text-gray-400">{quotations.length} total quotations</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
              + New Quotation
            </button>
          </div>

          <div className="p-6">
            {showForm && (
              <div className="rise bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">New Quotation</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                      <select required value={form.customerId}
                        onChange={e => setForm({...form, customerId: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Customer select karo</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} {c.companyName ? `- ${c.companyName}` : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <input required type="date" value={form.expiryDate}
                        onChange={e => setForm({...form, expiryDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  {/* Line Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items / Services</label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Description</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-20">Qty</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-28">Rate (AED)</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-28">Amount</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="px-4 py-2">
                                <input type="text" value={item.description}
                                  onChange={e => updateItem(index, "description", e.target.value)}
                                  placeholder="Service ya product ka naam"
                                  className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              </td>
                              <td className="px-4 py-2">
                               <input type="number" value={item.quantity}
                                  onChange={e => updateItem(index, "quantity", e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              </td>
                              <td className="px-4 py-2">
                                <input type="number" value={item.rate}
                                  onChange={e => updateItem(index, "rate", e.target.value)}
                                  placeholder="0.00"
                                  className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">AED {item.amount.toFixed(2)}</td>
                              <td className="px-2 py-2">
                                <button type="button" onClick={() => removeItem(index)}
                                  className="text-red-400 hover:text-red-600 text-lg font-bold">×</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-2">
                        <button type="button" onClick={addItem}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add Item</button>
                      </div>
                    </div>
                  </div>

                  {/* Tax + Totals */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
                      <input type="number" value={form.tax}
                        onChange={e => setForm({...form, tax: e.target.value})}
                        placeholder="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Subtotal:</span>
                        <span>AED {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Tax ({taxPercent}%):</span>
                        <span>AED {taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1 mt-1">
                        <span>Total:</span>
                        <span>AED {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}
                      placeholder="Koi notes..." rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" disabled={saving}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                      {saving ? "Saving..." : "Save Quotation"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rise bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" style={{ animationDelay: "0.1s" }}>
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : quotations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon.file className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No quotations yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "New Quotation" to create your first quote</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Quote #</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((q) => (
                      <tr key={q.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          <a href={`/quotations/${q.id}`} className="hover:underline">{q.number}</a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">{getCustomerName(q.customerId)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {q.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle(q.status)}`}>{q.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => deleteQuotation(q.id)}
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