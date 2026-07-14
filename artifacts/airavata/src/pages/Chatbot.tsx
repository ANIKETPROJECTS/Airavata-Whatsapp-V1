import { useState } from 'react';
import { MOCK_BOTS } from '@/data/chatbot';
import { Bot, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Chatbot() {
  const [bots, setBots] = useState(MOCK_BOTS);
  const [showCreate, setShowCreate] = useState(false);

  const toggleBot = (id: string) => {
    setBots(bots.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast('Bot status updated');
  };

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

      <div className="grid grid-cols-1 gap-4">
        {bots.map(bot => (
          <div key={bot.id} className="bg-white p-5 rounded-xl border flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{bot.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${bot.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {bot.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {bot.triggerWords.map(w => (
                    <span key={w} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">"{w}"</span>
                  ))}
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border inline-block w-full max-w-2xl">
                  <MessageSquare className="w-4 h-4 inline mr-2 text-gray-400" />
                  "{bot.welcomeMessage}"
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center w-full md:w-auto justify-end border-t md:border-none pt-4 md:pt-0 mt-4 md:mt-0">
              <button 
                onClick={() => toggleBot(bot.id)}
                className={`flex items-center gap-1 text-sm font-medium ${bot.active ? 'text-green-600' : 'text-gray-500'}`}
              >
                {bot.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
