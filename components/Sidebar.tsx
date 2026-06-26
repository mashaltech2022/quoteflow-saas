"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"

const Icon = {
  dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
  receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  settings: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  menu: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  close: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Icon.dashboard },
  { href: "/customers", label: "Customers", icon: Icon.users },
  { href: "/quotations", label: "Quotations", icon: Icon.file },
  { href: "/invoices", label: "Invoices", icon: Icon.receipt },
  { href: "/settings", label: "Settings", icon: Icon.settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // active check — current page se match
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const SidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Quote<span className="text-blue-600">Flow</span></h1>
        <p className="text-[11px] text-gray-400 mt-0.5">Business Management</p>
      </div>
      <nav className="p-3 flex-1 space-y-1">
        {navItems.map((item) => {
          const I = item.icon
          return (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item.href) ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
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
    </>
  )

  return (
    <>
      {/* Mobile hamburger button — sirf mobile pe dikhega */}
      <button onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-30 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 shadow-sm">
        <Icon.menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar — sirf desktop pe dikhega */}
      <aside className="hidden md:flex w-60 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 flex-col fixed">
        {SidebarContent}
      </aside>

      {/* Mobile overlay + slide-in sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Dark background */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          {/* Sidebar panel */}
          <aside className="absolute left-0 top-0 w-64 h-full bg-white flex flex-col shadow-xl">
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <Icon.close className="w-5 h-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}