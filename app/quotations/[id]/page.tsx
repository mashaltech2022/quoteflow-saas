"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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
}

interface Customer {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
}

export default function QuotationDetailPage() {
  const params = useParams()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotation()
  }, [])

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

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!quotation) return <div className="p-8 text-center">Quotation not found</div>

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

      {/* Top Bar - print mein hide hoga */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/quotations" className="text-blue-600 hover:underline text-sm">← Back to Quotations</a>
          <h1 className="text-xl font-bold text-gray-900">Quotation {quotation.number}</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Quotation Content */}
      <div className="max-w-3xl mx-auto p-8">

        {/* Header */}
        <div className="bg-gray-900 text-white p-8 rounded-t-2xl flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">QuoteFlow</h1>
            <p className="text-gray-400 mt-1">Professional Quotation</p>
          </div>
          <div className="text-right">
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
            <p className="font-semibold">{new Date(quotation.createdAt).toLocaleDateString()}</p>
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
                <td className="py-3 text-right text-gray-800">AED {quotation.subtotal.toFixed(2)}</td>
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
                <span>AED {quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Tax ({quotation.tax}%)</span>
                <span>AED {(quotation.total - quotation.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-900 mt-2">
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

        {/* Validity Notice */}
        <div className="bg-white px-8 py-4 border-b border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            This quotation is valid until {new Date(quotation.expiryDate).toLocaleDateString()}. Prices are subject to change after expiry.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white px-8 py-4 rounded-b-2xl text-center">
          <p className="text-gray-400 text-sm">Thank you for considering our services!</p>
          <p className="text-gray-500 text-xs mt-1">Generated by QuoteFlow</p>
        </div>

      </div>
    </div>
  )
}