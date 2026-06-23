"use client"
import { useState, useEffect } from "react"

interface Customer {
  id: string
  name: string
  companyName: string | null
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
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customerId: "",
    expiryDate: "",
    subtotal: "",
    tax: "",
    notes: ""
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const subtotal = parseFloat(form.subtotal) || 0
    const tax = parseFloat(form.tax) || 0
    const total = subtotal + (subtotal * tax / 100)

    const res = await fetch("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: form.customerId,
        expiryDate: form.expiryDate,
        subtotal,
        tax,
        total,
        notes: form.notes
      })
    })
    const data = await res.json()
    if (data.success) {
      setForm({ customerId: "", expiryDate: "", subtotal: "", tax: "", notes: "" })
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
      case "Draft": return "bg-gray-100 text-gray-600"
      case "Sent": return "bg-blue-100 text-blue-700"
      case "Approved": return "bg-green-100 text-green-700"
      case "Expired": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const getCustomerName = (id: string) => {
    const c = customers.find(c => c.id === id)
    return c ? c.name : "-"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Quote<span className="text-blue-600">Flow</span>
        </h1>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
      </nav>

      <div className="flex">
        <aside className="w-56 min-h-screen bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">📊 Dashboard</a>
            <a href="/customers" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">👥 Customers</a>
            <a href="/quotations" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">📋 Quotations</a>
            <a href="/invoices" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">🧾 Invoices</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">⚙️ Settings</a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quotations</h2>
              <p className="text-sm text-gray-500">{quotations.length} total quotations</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              + New Quotation
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">New Quotation</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                  <select
                    required
                    value={form.customerId}
                    onChange={e => setForm({...form, customerId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Customer select karo</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.companyName ? `- ${c.companyName}` : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input
                    required
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm({...form, expiryDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal (AED)</label>
                  <input
                    type="number"
                    value={form.subtotal}
                    onChange={e => setForm({...form, subtotal: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
                  <input
                    type="number"
                    value={form.tax}
                    onChange={e => setForm({...form, tax: e.target.value})}
                    placeholder="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    placeholder="Koi notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Quotation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : quotations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-lg">No quotations yet</p>
                <p className="text-gray-400 text-sm mt-1">Click "New Quotation" to create your first quote</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
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
                    <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
  <a href={`/quotations/${q.id}`} className="hover:underline">{q.number}</a>
</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{getCustomerName(q.customerId)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.expiryDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {q.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(q.status)}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteQuotation(q.id)}
                          className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}