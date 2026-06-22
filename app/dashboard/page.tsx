export default function DashboardPage() {
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
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
              📊 Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl text-sm">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Total Quotes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">47</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% this month</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">31</p>
              <p className="text-xs text-green-600 mt-1">↑ 8% this month</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Paid Invoices</p>
              <p className="text-3xl font-bold text-green-600 mt-1">22</p>
              <p className="text-xs text-gray-400 mt-1">AED 84,500</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-3xl font-bold text-red-500 mt-1">3</p>
              <p className="text-xs text-red-400 mt-1">AED 12,200 at risk</p>
            </div>
          </div>

          {/* Revenue Chart + Recent Activity */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {/* Chart */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue (AED)</h3>
              <div className="flex items-end gap-3 h-32">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{height: '45%'}}></div>
                  <span className="text-xs text-gray-400">Jan</span>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{height: '60%'}}></div>
                  <span className="text-xs text-gray-400">Feb</span>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{height: '40%'}}></div>
                  <span className="text-xs text-gray-400">Mar</span>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{height: '75%'}}></div>
                  <span className="text-xs text-gray-400">Apr</span>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-100 rounded-t-lg" style={{height: '55%'}}></div>
                  <span className="text-xs text-gray-400">May</span>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-blue-600 rounded-t-lg" style={{height: '90%'}}></div>
                  <span className="text-xs text-blue-600 font-semibold">Jun</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm border-b border-gray-100 pb-2">
                  <p className="text-gray-800">🧾 INV-2024-0031 paid</p>
                  <p className="text-green-600 text-xs">AED 4,200</p>
                </div>
                <div className="text-sm border-b border-gray-100 pb-2">
                  <p className="text-gray-800">📋 QT-2024-0047 sent</p>
                  <p className="text-gray-400 text-xs">Al Fajer HVAC</p>
                </div>
                <div className="text-sm border-b border-gray-100 pb-2">
                  <p className="text-gray-800">👥 New customer added</p>
                  <p className="text-gray-400 text-xs">Gulf Cool Solutions</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-800">📋 QT-2024-0046 approved</p>
                  <p className="text-green-600 text-xs">AED 8,750</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                + New Quotation
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                + New Invoice
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                + Add Customer
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}