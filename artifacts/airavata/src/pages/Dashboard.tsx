import { useState } from 'react';
import { 
  Users, MessageSquare, Send, XCircle, Download, CheckCircle2, 
  ArrowRight, PlayCircle, BarChart2
} from 'lucide-react';
import { useCampaigns } from '@/hooks/use-mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function Dashboard() {
  const { campaigns, chartData } = useCampaigns();
  const [showChecklist, setShowChecklist] = useState(true);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back, Acme Corp</h1>
          <p className="text-gray-600">Your WhatsApp Business API is connected and ready to send messages.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border shadow-sm hover:bg-gray-50">
            Schedule Demo
          </button>
          <button className="px-4 py-2 bg-[#1877F2] text-white font-medium rounded-lg shadow-sm hover:bg-[#1877F2]/90 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Connect Facebook
          </button>
        </div>
      </div>

      {/* Onboarding Checklist */}
      {showChecklist && (
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
            <button onClick={() => setShowChecklist(false)} className="text-sm text-gray-500 hover:text-gray-700">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Connect Number</h3>
              <p className="text-sm text-gray-600 mt-1">WhatsApp API linked</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mb-2"></div>
              <h3 className="font-medium text-gray-900">Create Template</h3>
              <p className="text-sm text-gray-600 mt-1">Get your first template approved</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mb-2"></div>
              <h3 className="font-medium text-gray-900">Add Contacts</h3>
              <p className="text-sm text-gray-600 mt-1">Import your audience</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mb-2"></div>
              <h3 className="font-medium text-gray-900">Launch Campaign</h3>
              <p className="text-sm text-gray-600 mt-1">Send your first message</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: '12,450', icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Delivered', value: '12,100', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Read', value: '8,430', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Failed', value: '350', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Message Distribution</h2>
            <select className="text-sm border rounded-md px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={3} dot={false} name="Sent" />
                <Line type="monotone" dataKey="delivered" stroke="#16a34a" strokeWidth={3} dot={false} name="Delivered" />
                <Line type="monotone" dataKey="read" stroke="#059669" strokeWidth={3} dot={false} name="Read" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Promo/Tools Card */}
        <div className="bg-white rounded-xl border overflow-hidden flex flex-col">
          <div className="h-32 bg-gray-100 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
            <PlayCircle className="w-12 h-12 text-primary relative z-10 opacity-80" />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Download Mobile App</h3>
              <p className="text-sm text-gray-600 mb-4">Manage conversations on the go. Get push notifications for new messages.</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Real-time chat</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Quick replies</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Contact management</li>
              </ul>
            </div>
            <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download APK
            </button>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
          <button 
            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            onClick={() => window.location.href='/campaigns-report'}
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-5 py-3 font-medium">Campaign Name</th>
                <th className="px-5 py-3 font-medium">Template</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total Sent</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-900">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{camp.name}</td>
                  <td className="px-5 py-4 text-gray-600">{camp.templateName}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${camp.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        camp.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{camp.sent > 0 ? camp.sent.toLocaleString() : '-'}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(camp.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
