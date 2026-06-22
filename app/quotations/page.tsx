export default function QuotationsPage() {
  const quotations = [
    { id: 1, number: "QT-2024-0047", customer: "Al Fajer HVAC", date: "15 Jun 2024", expiry: "15 Jul 2024", amount: "AED 10,416", status: "Sent" },
    { id: 2, number: "QT-2024-0046", customer: "Gulf Cool Solutions", date: "10 Jun 2024", expiry: "10 Jul 2024", amount: "AED 8,750", status: "Approved" },
    { id: 3, number: "QT-2024-0045", customer: "Dubai Chill Tech", date: "5 Jun 2024", expiry: "5 Jul 2024", amount: "AED 3,200", status: "Draft" },
    { id: 4, number: "QT-2024-0044", customer: "Ice King Trading", date: "1 Jun 2024", expiry: "1 Jul 2024", amount: "AED 6,800", status: "Expired" },
    { id: 5, number: "QT-2024-0043", customer: "Al Fajer HVAC", date: "25 May 2024", expiry: "25 Jun 2024", amount: "AED 12,500", status: "Converted" },
  ];

  const statusStyle = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-600";
      case "Sent": return "bg-blue-100 text-blue-700";
      case "Approved": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-600";
      case "Converted": return "bg-purple-100 text-purple-700";
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
            <a href="/quotations" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
              📋 Quotations
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
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
              <h2 className="text-xl font-bold text-gray-900">Quotations</h2>
              <p className="text-sm text-gray-500">5 total quotations</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              + New Quotation
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {["All", "Draft", "Sent", "Approved", "Expired", "Converted"].map((tab) => (
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

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search quotations..."
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Quote #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{q.number}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{q.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{q.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{q.expiry}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{q.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">View</button>
                        <button className="text-xs text-gray-500 hover:underline">PDF</button>
                        <button className="text-xs text-green-600 hover:underline">Send</button>
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