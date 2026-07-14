import { Blocks, Link as LinkIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Static catalog of available integrations — none are connected until the user sets them up
const AVAILABLE_INTEGRATIONS = [
  { id: 'i1', name: 'Shopify', description: 'Sync products and order status updates.', icon: 'S' },
  { id: 'i2', name: 'WooCommerce', description: 'Send abandoned cart reminders.', icon: 'W' },
  { id: 'i3', name: 'Zapier', description: 'Connect with 3000+ apps.', icon: 'Z' },
  { id: 'i4', name: 'Google Sheets', description: 'Export contacts automatically.', icon: 'G' },
  { id: 'i5', name: 'HubSpot', description: 'Sync leads to your CRM.', icon: 'H' },
  { id: 'i6', name: 'Salesforce', description: 'Enterprise CRM integration.', icon: 'Sf' },
];

export default function Integration() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500">Connect Airavata to your favorite tools and platforms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_INTEGRATIONS.map(int => (
          <div key={int.id} className="bg-white rounded-xl border p-5 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border text-gray-500 font-bold text-lg">
                {int.icon}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{int.name}</h3>
            <p className="text-sm text-gray-500 flex-1 mb-6">{int.description}</p>
            <button
              onClick={() => toast(`${int.name} integration coming soon`)}
              className="w-full py-2 rounded-lg font-medium text-sm transition-colors bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              Connect
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
          <button
            onClick={() => toast('Webhook creation coming soon')}
            className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Webhook
          </button>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
          <LinkIcon className="w-8 h-8 opacity-30" />
          <p className="text-sm font-medium text-gray-500">No webhooks configured</p>
          <p className="text-xs text-gray-400">Add a webhook URL to receive real-time event notifications.</p>
        </div>
      </div>
    </div>
  );
}
