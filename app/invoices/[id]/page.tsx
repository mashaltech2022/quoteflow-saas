"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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
}

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [])

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

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!invoice) return <div className="p-8 text-center">Invoice not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print hide hoga yeh bar */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/invoices" className="text-blue-600 hover:underline text-sm">← Back to Invoices</a>
          <h1 className="text-xl font-bold text-gray-900">Invoice {invoice.number}</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Invoice Content - Print mein yeh dikhega */}
      <div className="max-w-3xl mx-auto p-8">

        {/* Header */}
        <div className="bg-gray-900 text-white p-8 rounded-t-2xl flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">QuoteFlow</h1>
            <p className="text-gray-400 mt-1">Professional Invoice</p>
          </div>
          <div className="text-right">
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
            <p className="font-semibold">{new Date(invoice.issueDate).toLocaleDateString()}</p>
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

        {/* Items Table */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="text-left py-2 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-right py-2 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-800">Services</td>
                <td className="py-3 text-right text-gray-800">AED {invoice.subtotal.toFixed(2)}</td>
              </tr>
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
              <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-900 mt-2">
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
        <div className="bg-gray-900 text-white px-8 py-4 rounded-b-2xl text-center">
          <p className="text-gray-400 text-sm">Thank you for your business!</p>
          <p className="text-gray-500 text-xs mt-1">Generated by QuoteFlow</p>
        </div>

      </div>
    </div>
  )
}