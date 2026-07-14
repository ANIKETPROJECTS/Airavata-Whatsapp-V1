import { CreditCard, IndianRupee, Settings, Receipt } from 'lucide-react';
import { toast } from 'sonner';

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

      {/* Setup prompt */}
      <div className="bg-white rounded-xl border p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#635BFF]/10 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-[#635BFF]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Connect a payment provider</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Link Stripe, Razorpay, or another payment gateway to start accepting payments directly in WhatsApp conversations.
          </p>
        </div>
        <button
          onClick={() => toast('Payment provider setup coming soon')}
          className="px-5 py-2.5 bg-[#635BFF] text-white font-medium rounded-lg hover:bg-[#635BFF]/90 text-sm"
        >
          Connect Payment Provider
        </button>
      </div>

      {/* Transactions Table — empty state */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <Receipt className="w-10 h-10 opacity-30" />
          <p className="text-sm font-medium text-gray-500">No transactions yet</p>
          <p className="text-xs text-gray-400">Transactions will appear here once you connect a payment provider and customers start paying.</p>
        </div>
      </div>
    </div>
  );
}
