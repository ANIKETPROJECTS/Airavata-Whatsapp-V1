import { ShoppingBag, Plus, Search, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function Catalogue() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogue</h1>
          <p className="text-sm text-gray-500">Manage products to share in WhatsApp chats</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => toast('Coming soon')}
            className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Visibility
          </button>
          <button
            onClick={() => toast('Coming soon')}
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <button className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Categories
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-600">No products yet</p>
          <p className="text-sm mt-1">Add products to your catalogue so customers can browse and order via WhatsApp.</p>
        </div>
        <button
          onClick={() => toast('Coming soon')}
          className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add your first product
        </button>
      </div>
    </div>
  );
}
