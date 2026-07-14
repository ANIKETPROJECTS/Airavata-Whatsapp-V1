import { useState } from 'react';
import { Bot, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Chatbot() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot Auto-Replies</h1>
          <p className="text-sm text-gray-500">Manage automated responses and keyword triggers</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {showCreate ? 'Cancel' : <><Plus className="w-4 h-4" /> Create Bot</>}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Auto-Reply Rule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Bot Name</label>
                <input type="text" placeholder="e.g. Sales Inquiry" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Trigger Keywords (comma separated)</label>
                <input type="text" placeholder="pricing, quote, buy" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700 font-medium">Trigger only during Business Hours</span>
              </label>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Welcome Message</label>
                <textarea rows={3} placeholder="What should the bot say first?" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Test Bot</button>
                <button
                  onClick={() => { setShowCreate(false); toast.success('Bot created successfully!'); }}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90"
                >
                  Save & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state — no bots exist yet */}
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Bot className="w-8 h-8 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-600">No bots configured yet</p>
          <p className="text-sm mt-1">Create your first auto-reply rule to handle common customer queries automatically.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create your first bot
        </button>
      </div>
    </div>
  );
}
