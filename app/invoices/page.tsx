export default function InvoicesPage() {
  const invoices = [
    { id: 1, number: "INV-2024-0031", customer: "Al Fajer HVAC", date: "18 Jun 2024", due: "3 Jul 2024", amount: "AED 10,416", paid: "AED 4,200", status: "Partially Paid" },
    { id: 2, number: "INV-2024-0030", customer: "Gulf Cool Solutions", date: "10 Jun 2024", due: "25 Jun 2024", amount: "AED 8,750", paid: "AED 8,750", status: "Paid" },
    { id: 3, number: "INV-2024-0029", customer: "Dubai Chill Tech", date: "1 Jun 2024", due: "16 Jun 2024", amount: "AED 3,200", paid: "AED 0", status: "Overdue" },
    { id: 4, number: "INV-2024-0028", customer: "Ice King Trading", date: "25 May 2024", due: "9 Jun 2024", amount: "AED 6,800", paid: "AED 0", status: "Unpaid" },
    { id: 5, number: "INV-2024-0027", customer: "Al Fajer HVAC", date: "15 May 2024", due: "30 May 2024", amount: "AED 12,500", paid: "AED 12,500", status: "Paid" },
  ];

  const statusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Unpaid": return "bg-gray-100 text-gray-600";
      case "Partially Paid": return "bg-yellow-100 text-yellow-700";
      case "Overdue": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Quote<span className="text-blue-600">Flow</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Good afternoon, Ahmed 👋</span>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      </nav>

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
              📊 Dashboard
            </a>
            <a href="/customers" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
              👥 Customers
            </a>
            <a href="/quotations" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
              📋 Quotations
            </a>
            <a href="/invoices" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
              🧾 Invoices
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
              ⚙️ Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invoices</h2>
              <p className="text-sm text-gray-500">5 total invoices</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              + New Invoice
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">2</p>
              <p className="text-xs text-gray-400">AED 21,250</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Unpaid</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">1</p>
              <p className="text-xs text-gray-400">AED 6,800</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-500 mt-1">1</p>
              <p className="text-xs text-red-400">AED 3,200</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {["All", "Paid", "Unpaid", "Partially Paid", "Overdue"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${
                  tab === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{inv.number}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{inv.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inv.date}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${inv.status === "Overdue" ? "text-red-500" : "text-gray-600"}`}>
                      {inv.due}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">View</button>
                        <button className="text-xs text-gray-500 hover:underline">PDF</button>
                        <button className="text-xs text-green-600 hover:underline">Pay</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}