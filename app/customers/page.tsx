export default function CustomersPage() {
  const customers = [
    { id: 1, name: "Ahmed Al Mansouri", company: "Al Fajer HVAC", email: "ahmed@alfajer.ae", phone: "+971 55 234 5678", status: "Active" },
    { id: 2, name: "Khalid Rahman", company: "Gulf Cool Solutions", email: "khalid@gulfcool.ae", phone: "+971 50 123 4567", status: "Active" },
    { id: 3, name: "Sara Al Hashimi", company: "Dubai Chill Tech", email: "sara@chilltech.ae", phone: "+971 52 987 6543", status: "Active" },
    { id: 4, name: "Mohammed Farooq", company: "Ice King Trading", email: "mfarooq@iceking.ae", phone: "+971 55 456 7890", status: "Inactive" },
  ];

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
            <a href="/customers" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
              👥 Customers
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
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
              <h2 className="text-xl font-bold text-gray-900">Customers</h2>
              <p className="text-sm text-gray-500">4 total customers</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              + Add Customer
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Delete</button>
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