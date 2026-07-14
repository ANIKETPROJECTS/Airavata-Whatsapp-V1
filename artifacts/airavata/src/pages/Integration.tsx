import { MOCK_INTEGRATIONS, MOCK_WEBHOOKS } from '@/data/integrations';
import { Blocks, Link as LinkIcon, CheckCircle2, Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Integration() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500">Connect Airavata to your favorite tools and platforms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INTEGRATIONS.map(int => (
          <div key={int.id} className="bg-white rounded-xl border p-5 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border text-gray-400 font-bold text-lg">
                {int.name.charAt(0)}
              </div>
              {int.connected && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{int.name}</h3>
            <p className="text-sm text-gray-500 flex-1 mb-6">{int.description}</p>
            
            <button 
              onClick={() => toast(int.connected ? 'Settings opened' : 'Connection modal opened')}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-colors
                ${int.connected 
                  ? 'border bg-white text-gray-700 hover:bg-gray-50' 
                  : 'bg-primary text-white hover:bg-primary/90 shadow-sm'}`}
            >
              {int.connected ? 'Manage Settings' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Webhooks</h2>
            <p className="text-sm text-gray-500">Receive real-time HTTP requests for events</p>
          </div>
          <button className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Webhook
          </button>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          {MOCK_WEBHOOKS.map(hook => (
            <div key={hook.id} className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{hook.url}</span>
                </div>
                <div className="flex gap-2">
                  {hook.events.map(e => (
                    <span key={e} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => toast.success('URL Copied!')}
                  className="px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button className="px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100">
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
