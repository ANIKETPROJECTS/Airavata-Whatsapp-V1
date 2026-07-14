import { MOCK_TRANSACTIONS } from '@/data/wapay';
import { CreditCard, IndianRupee, ArrowUpRight, ArrowDownRight, Settings } from 'lucide-react';

export default function WAPay() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Pay</h1>
          <p className="text-sm text-gray-500">Accept payments directly inside WhatsApp chats</p>
        </div>
        <button className="p-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50" title="Payment Settings">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-[#0f6c44] rounded-xl p-6 text-white shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">This Month</span>
          </div>
          <p className="text-primary-foreground/80 text-sm mb-1">Total Collected</p>
          <h2 className="text-3xl font-bold">₹ 1,45,200</h2>
        </div>

        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Successful Transactions</p>
            <div className="flex items-end gap-2">
              <h2 className="text-2xl font-bold text-gray-900">342</h2>
              <span className="text-sm text-green-600 font-medium mb-1">+12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#635BFF]/10 text-[#635BFF] rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stripe Connected</h3>
                <p className="text-xs text-gray-500">Live Mode</p>
              </div>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">Change Provider</button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border overflow-hidden mt-8">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-900">
              {MOCK_TRANSACTIONS.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{tx.id.toUpperCase()}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(tx.date).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{tx.customer}</div>
                    <div className="text-xs text-gray-500">{tx.phone}</div>
                  </td>
                  <td className="px-5 py-4 font-bold">{tx.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'Refunded' ? 'bg-gray-100 text-gray-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
