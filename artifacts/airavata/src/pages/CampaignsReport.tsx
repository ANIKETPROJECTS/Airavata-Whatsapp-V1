import { useState } from 'react';
import { useCampaigns } from '@/hooks/use-mock-data';
import { BarChart3, Users, CheckCircle2, MessageSquare, Download, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignsReport() {
  const { campaigns } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const stats = {
    total: campaigns.length,
    sent: campaigns.reduce((acc, c) => acc + c.sent, 0),
    avgDelivery: '98.5%',
    avgRead: '72.4%'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns Report</h1>
          <p className="text-sm text-gray-500">Track the performance of your broadcast messages</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => toast.success('Exporting report as CSV...')}
            className="px-4 py-2 border bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Campaigns</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sent</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.sent.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg. Delivery Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.avgDelivery}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg. Read Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.avgRead}</h3>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-5 py-3 font-medium">Campaign Name</th>
                <th className="px-5 py-3 font-medium">Template Used</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Sent</th>
                <th className="px-5 py-3 font-medium">Delivered</th>
                <th className="px-5 py-3 font-medium">Read</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-900">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCampaign(camp)}>
                  <td className="px-5 py-4 font-medium">{camp.name}</td>
                  <td className="px-5 py-4 text-gray-600">{camp.templateName}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(camp.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4">{camp.sent > 0 ? camp.sent.toLocaleString() : '-'}</td>
                  <td className="px-5 py-4">{camp.delivered > 0 ? camp.delivered.toLocaleString() : '-'}</td>
                  <td className="px-5 py-4">{camp.read > 0 ? camp.read.toLocaleString() : '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${camp.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        camp.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer / Modal for Campaign Detail */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end animate-in fade-in" onClick={() => setSelectedCampaign(null)}>
          <div className="bg-white w-full max-w-md h-full shadow-xl animate-in slide-in-from-right overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b sticky top-0 bg-white/90 backdrop-blur z-10 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedCampaign.name}</h2>
                <p className="text-sm text-gray-500">Details & Performance</p>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="text-sm text-gray-500 hover:text-gray-900">Close</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Funnel</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-bold text-gray-900">{selectedCampaign.sent.toLocaleString()}</span>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex justify-between items-center ml-4 relative">
                    <div className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300"></div>
                    <span className="text-sm text-green-700">Delivered</span>
                    <span className="font-bold text-green-900">{selectedCampaign.delivered.toLocaleString()}</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex justify-between items-center ml-8 relative">
                    <div className="absolute -left-8 top-1/2 w-8 h-px bg-gray-300"></div>
                    <span className="text-sm text-emerald-700">Read</span>
                    <span className="font-bold text-emerald-900">{selectedCampaign.read.toLocaleString()}</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center ml-4 relative">
                    <div className="absolute -left-4 top-1/2 w-4 h-px bg-gray-300"></div>
                    <span className="text-sm text-red-700">Failed</span>
                    <span className="font-bold text-red-900">{selectedCampaign.failed.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Information</h3>
                <div className="text-sm space-y-2 text-gray-600">
                  <div className="flex justify-between border-b pb-2"><span>Template</span> <span className="font-medium text-gray-900">{selectedCampaign.templateName}</span></div>
                  <div className="flex justify-between border-b pb-2"><span>Date Sent</span> <span className="font-medium text-gray-900">{new Date(selectedCampaign.date).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Status</span> <span className="font-medium text-gray-900">{selectedCampaign.status}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
