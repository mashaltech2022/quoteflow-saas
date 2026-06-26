"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"

interface Settings {
  id: string
  businessName: string
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  trn: string | null
  currency: string
  logoUrl: string | null
}

const Icon = {
  building: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
  coin: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2a2.5 2 0 0 1-2.5-1.5M12 6v1.5M12 16.5V18"/></svg>,
  image: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    businessName: "", email: "", phone: "", address: "",
    website: "", trn: "", currency: "AED", logoUrl: ""
  })

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const res = await fetch("/api/settings")
    const data = await res.json()
    if (data.success) {
      setSettings(data.data)
      setForm({
        businessName: data.data.businessName || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
        website: data.data.website || "",
        trn: data.data.trn || "",
        currency: data.data.currency || "AED",
        logoUrl: data.data.logoUrl || ""
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      setSettings(data.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .rise { opacity: 0; animation: rise 0.5s ease-out forwards; }
      `}</style>

      <Sidebar />

      {/* Main */}
      <main className="ml-0 md:ml-60">
        {/* Topbar */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 pl-16 pr-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Settings</h2>
            <p className="text-xs text-gray-400">Apni business ki information yahan save karo</p>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-2xl">
          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Business Info */}
              <div className="rise bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon.building className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Business Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                    <input required type="text" value={form.businessName}
                      onChange={e => setForm({...form, businessName: e.target.value})}
                      placeholder="Jaise: Eagle Frozen Transport LLC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="info@business.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+971 56 123 4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea value={form.address}
                      onChange={e => setForm({...form, address: e.target.value})}
                      placeholder="Dubai, UAE" rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input type="text" value={form.website}
                      onChange={e => setForm({...form, website: e.target.value})}
                      placeholder="www.business.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TRN (Tax Registration No.)</label>
                    <input type="text" value={form.trn}
                      onChange={e => setForm({...form, trn: e.target.value})}
                      placeholder="100123456700003"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="rise bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon.coin className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Currency</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select value={form.currency}
                    onChange={e => setForm({...form, currency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="PKR">PKR — Pakistani Rupee</option>
                    <option value="SAR">SAR — Saudi Riyal</option>
                  </select>
                </div>
              </div>

              {/* Logo */}
              <div className="rise bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Icon.image className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Logo</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input type="text" value={form.logoUrl}
                    onChange={e => setForm({...form, logoUrl: e.target.value})}
                    placeholder="https://yoursite.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400 mt-1">Logo ka URL paste karo — invoice aur quotation mein dikhega</p>
                </div>
                {form.logoUrl && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img src={form.logoUrl} alt="Logo preview" className="h-16 object-contain border border-gray-200 rounded-xl p-2" />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4">
                <button type="submit" disabled={saving}
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-sm">
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                {saved && (
                  <span className="text-green-600 text-sm font-medium">✅ Settings saved!</span>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}