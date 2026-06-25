"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  number: string
  customerId: string
  status: string
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  notes: string | null
  items: InvoiceItem[]
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

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [remindering, setRemindering] = useState(false)
  const [reminded, setReminded] = useState(false)

  useEffect(() => {
    fetchInvoice()
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const res = await fetch("/api/settings")
    const data = await res.json()
    if (data.success) setSettings(data.data)
  }

  async function fetchInvoice() {
    const res = await fetch("/api/invoices")
    const data = await res.json()
    if (data.success) {
      const inv = data.data.find((i: Invoice) => i.id === params.id)
      setInvoice(inv)
      if (inv) {
        const cRes = await fetch("/api/customers")
        const cData = await cRes.json()
        if (cData.success) {
          const cust = cData.data.find((c: Customer) => c.id === inv.customerId)
          setCustomer(cust)
        }
      }
    }
    setLoading(false)
  }

  async function sendEmail() {
    if (!invoice || !customer) return
    if (!customer.email) {
      alert("Customer ka email nahi hai!")
      return
    }
    setSending(true)
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: customer.email,
        type: "invoice",
        number: invoice.number,
        customerName: customer.name,
        total: invoice.total.toFixed(2),
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        items: invoice.items,
        businessName: settings?.businessName,
        businessEmail: settings?.email,
        businessPhone: settings?.phone
      })
    })
    const data = await res.json()
    if (data.success) {
      setSent(true)
      alert(`Email ${customer.email} pe bhej diya gaya!`)
      setTimeout(() => setSent(false), 5000)
    } else {
      alert("Email send nahi hua — dobara try karo")
    }
    setSending(false)
  }

  async function sendReminder() {
    if (!invoice || !customer) return
    if (!customer.email) {
      alert("Customer ka email nahi hai!")
      return
    }
    if (!confirm(`${customer.name} ko payment reminder bhejein?`)) return
    setRemindering(true)
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: customer.email,
        type: "reminder",
        number: invoice.number,
        customerName: customer.name,
        total: invoice.total.toFixed(2),
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        businessName: settings?.businessName,
        businessEmail: settings?.email,
        businessPhone: settings?.phone
      })
    })
    const data = await res.json()
    if (data.success) {
      setReminded(true)
      alert(`Reminder ${customer.email} pe bhej diya gaya!`)
      setTimeout(() => setReminded(false), 5000)
    } else {
      alert("Reminder send nahi hua — dobara try karo")
    }
    setRemindering(false)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>
  if (!invoice) return <div className="p-8 text-center text-gray-500">Invoice not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .invoice-sheet { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Top action bar (hidden in print) */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/invoices" className="text-blue-600 hover:underline text-sm">← Back to Invoices</a>
          <h1 className="text-xl font-bold text-gray-900">Invoice {invoice.number}</h1>
        </div>
        <div className="flex gap-3">
          {invoice.status !== "Paid" && (
            <button onClick={sendReminder} disabled={remindering || !customer?.email}
              className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
              {remindering ? "Sending..." : reminded ? "✅ Reminded!" : "🔔 Send Reminder"}
            </button>
          )}
          <button onClick={sendEmail} disabled={sending || !customer?.email}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50">
            {sending ? "Sending..." : sent ? "✅ Sent!" : "📧 Send Email"}
          </button>
          <button onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <div className="invoice-sheet bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">

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
              <p className="text-gray-400 text-sm">TAX INVOICE</p>
              <p className="text-2xl font-bold mt-1">{invoice.number}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 inline-block ${
                invoice.status === "Paid" ? "bg-green-500 text-white" :
                invoice.status === "Unpaid" ? "bg-gray-500 text-white" :
                "bg-red-500 text-white"
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-100 px-8 py-4 flex gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase">Issue Date</p>
              <p className="font-semibold text-gray-800">{new Date(invoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Due Date</p>
              <p className="font-semibold text-red-600">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-white px-8 py-6 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase mb-2">Bill To</p>
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
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item) => (
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
                    <td className="py-3 text-right text-gray-600">AED {invoice.subtotal.toFixed(2)}</td>
                    <td className="py-3 text-right text-gray-800">AED {invoice.subtotal.toFixed(2)}</td>
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
                  <span>AED {invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Tax ({invoice.tax}%)</span>
                  <span>AED {(invoice.total - invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-900 mt-2 text-gray-900">
                  <span>Total</span>
                  <span>AED {invoice.total.toFixed(2)}</span>
                </div>
                {invoice.status === "Paid" && (
                  <div className="flex justify-between py-2 text-green-600 font-semibold">
                    <span>Amount Paid</span>
                    <span>AED {invoice.amountPaid.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-2">Notes</p>
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-900 text-white px-8 py-4 text-center">
            <p className="text-gray-400 text-sm">Thank you for your business!</p>
            {settings?.website && <p className="text-gray-500 text-xs mt-1">{settings.website}</p>}
            {settings?.email && <p className="text-gray-500 text-xs">{settings.email}</p>}
            {settings?.phone && <p className="text-gray-500 text-xs">{settings.phone}</p>}
          </div>

        </div>
      </div>
    </div>
  )
}