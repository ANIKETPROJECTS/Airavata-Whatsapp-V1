import { MOCK_PRODUCTS } from '@/data/catalog';
import { ShoppingBag, Plus, Search, Tag, Image as ImageIcon } from 'lucide-react';
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
            onClick={() => toast.success('Catalogue visibility toggled')}
            className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Visibility
          </button>
          <button 
            onClick={() => toast('Add product modal opened')}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {MOCK_PRODUCTS.map(p => (
          <div key={p.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-100 relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50">Edit</button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 truncate pr-2">{p.name}</h3>
                <span className="font-bold text-primary shrink-0">{p.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{p.sku} • {p.category}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            </div>
          </div>
        ))}
        
        {/* Add New Placeholder */}
        <div 
          onClick={() => toast('Add product modal opened')}
          className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer min-h-[300px]"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <span className="font-medium text-sm">Add New Product</span>
        </div>
      </div>
    </div>
  );
}
