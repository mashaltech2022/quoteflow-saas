"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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
  createdAt: string
  expiryDate: string
  subtotal: number
  tax: number
  total: number
  notes: string | null
  items: QuotationItem[]
}

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

interface Settings {
  businessName: string
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  trn: string | null
  logoUrl: string | null
}

export default function QuotationDetailPage() {
  const params = useParams()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    fetchQuotation()
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const res = await fetch("/api/settings")
    const data = await res.json()
    if (data.success) setSettings(data.data)
  }

  async function fetchQuotation() {
    const res = await fetch("/api/quotations")
    const data = await res.json()
    if (data.success) {
      const qt = data.data.find((q: Quotation) => q.id === params.id)
      setQuotation(qt)
      if (qt) {
        const cRes = await fetch("/api/customers")
        const cData = await cRes.json()
        if (cData.success) {
          const cust = cData.data.find((c: Customer) => c.id === qt.customerId)
          setCustomer(cust)
        }
      }
    }
    setLoading(false)
  }

  async function convertToInvoice() {
    if (!quotation) return
    if (!confirm("Is quotation ko invoice mein convert karna chahte ho?")) return
    setConverting(true)

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: quotation.customerId,
        dueDate: dueDate.toISOString(),
        subtotal: quotation.subtotal,
        tax: quotation.tax,
        total: quotation.total,
        notes: quotation.notes,
        items: (quotation.items || []).map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      })
    })

    const data = await res.json()
    if (data.success) {
      await fetch(`/api/quotations/${quotation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Accepted" })
      })
      alert("Invoice ban gaya! Invoices page pe dekho.")
      window.location.href = `/invoices/${data.data.id}`
    } else {
      alert("Kuch masla ho gaya — dobara try karo")
    }
    setConverting(false)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>
  if (!quotation) return <div className="p-8 text-center text-gray-500">Quotation not found</div>

  const statusColor = () => {
    switch (quotation.status) {
      case "Accepted": return "bg-green-500 text-white"
      case "Draft": return "bg-gray-500 text-white"
      case "Sent": return "bg-blue-500 text-white"
      case "Rejected": return "bg-red-500 text-white"
      case "Expired": return "bg-orange-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const isExpired = new Date(quotation.expiryDate) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .quote-sheet { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Top action bar (hidden in print) */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/quotations" className="text-blue-600 hover:underline text-sm">← Back to Quotations</a>
          <h1 className="text-xl font-bold text-gray-900">Quotation {quotation.number}</h1>
        </div>
        <div className="flex gap-3">
          {quotation.status !== "Accepted" && (
            <button onClick={convertToInvoice} disabled={converting}
              className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
              {converting ? "Converting..." : "🔄 Convert to Invoice"}
            </button>
          )}
          <button onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <div className="quote-sheet bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">

          {/* Header — business logo + name */}
          <div className="bg-gray-900 text-white p-8 flex justify-between items-start gap-6">
            <div className="flex items-start gap-4">
              {settings?.logoUrl && (
                <img src={settings.logoUrl} alt="Logo" className="h-16 w-16 object-contain bg-white rounded-lg p-1" />
              )}
              <div>
                <h1 className="text-2xl font-bold">{settings?.businessName || "QuoteFlow"}</h1>
                {settings?.address && <p className="text-gray-400 text-sm mt-1 whitespace-pre-line">{settings.address}</p>}
                {settings?.phone && <p className="text-gray-400 text-sm">{settings.phone}</p>}
                {settings?.email && <p className="text-gray-400 text-sm">{settings.email}</p>}
                {settings?.trn && <p className="text-gray-400 text-sm mt-1">TRN: {settings.trn}</p>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-gray-400 text-sm">QUOTATION</p>
              <p className="text-2xl font-bold mt-1">{quotation.number}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 inline-block ${statusColor()}`}>
                {quotation.status}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-100 px-8 py-4 flex gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase">Issue Date</p>
              <p className="font-semibold text-gray-800">{new Date(quotation.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Expiry Date</p>
              <p className={`font-semibold ${isExpired ? "text-red-600" : "text-gray-800"}`}>
                {new Date(quotation.expiryDate).toLocaleDateString()}
                {isExpired && <span className="text-xs ml-2 text-red-500">(Expired)</span>}
              </p>
            </div>
          </div>

          {/* Quote To */}
          <div className="bg-white px-8 py-6 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase mb-2">Quote To</p>
            {customer ? (
              <div>
                <p className="font-bold text-gray-900 text-lg">{customer.name}</p>
                {customer.companyName && <p className="text-gray-600">{customer.companyName}</p>}
                {customer.email && <p className="text-gray-600">{customer.email}</p>}
                {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
                {customer.address && <p className="text-gray-600">{customer.address}</p>}
              </div>
            ) : (
              <p className="text-gray-500">Customer not found</p>
            )}
          </div>

          {/* Items */}
          <div className="bg-white px-8 py-6 border-b border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Qty</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Rate</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items && quotation.items.length > 0 ? (
                  quotation.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-800">{item.description}</td>
                      <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-600">AED {item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-800">AED {item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-800">Services</td>
                    <td className="py-3 text-right text-gray-600">1</td>
                    <td className="py-3 text-right text-gray-600">AED {quotation.subtotal.toFixed(2)}</td>
                    <td className="py-3 text-right text-gray-800">AED {quotation.subtotal.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-white px-8 py-6 border-b border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>AED {quotation.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Tax ({quotation.tax}%)</span>
                  <span>AED {(quotation.total - quotation.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-900 mt-2 text-gray-900">
                  <span>Total</span>
                  <span>AED {quotation.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-2">Notes</p>
              <p className="text-gray-700">{quotation.notes}</p>
            </div>
          )}

          {/* Validity note */}
          <div className="bg-white px-8 py-4 border-b border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              This quotation is valid until {new Date(quotation.expiryDate).toLocaleDateString()}. Prices are subject to change after expiry.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 text-white px-8 py-4 text-center">
            <p className="text-gray-400 text-sm">Thank you for considering our services!</p>
            {settings?.website && <p className="text-gray-500 text-xs mt-1">{settings.website}</p>}
            {settings?.email && <p className="text-gray-500 text-xs">{settings.email}</p>}
            {settings?.phone && <p className="text-gray-500 text-xs">{settings.phone}</p>}
          </div>

        </div>
      </div>
    </div>
  )
}