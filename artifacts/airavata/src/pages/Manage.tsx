import { useState } from 'react';
import { MOCK_PHONE_NUMBERS, MOCK_API_KEYS, MOCK_TEAM, MOCK_TAGS } from '@/data/manage';
import { Phone, Key, Users, Tag, CreditCard, CheckCircle2, Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Manage() {
  const [activeTab, setActiveTab] = useState('phone');

  const tabs = [
    { id: 'phone', label: 'Phone Numbers', icon: Phone },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Workspace</h1>
        <p className="text-sm text-gray-500">Configure your business settings and workspace resources</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm min-h-[400px]">
          
          {activeTab === 'phone' && (
            <div className="p-6 space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Connected Numbers</h2>
                <button className="text-sm font-medium text-primary hover:underline">+ Add Number</button>
              </div>
              <div className="space-y-4">
                {MOCK_PHONE_NUMBERS.map(pn => (
                  <div key={pn.id} className="border rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{pn.number}</h3>
                        {pn.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex gap-3 text-sm text-gray-500">
                        <span>Quality: <span className="font-medium text-green-600">{pn.quality}</span></span>
                        <span>•</span>
                        <span>{pn.messagingTier}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                      {pn.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                Ensure your Facebook Business Manager is verified to upgrade your messaging limits.
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-6 space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
                <button className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800">Generate New Key</button>
              </div>
              <div className="space-y-4">
                {MOCK_API_KEYS.map(key => (
                  <div key={key.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{key.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                        <button onClick={() => toast.success('Key copied')} className="p-1 hover:text-gray-900"><Copy className="w-4 h-4" /></button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Last used: {new Date(key.lastUsed).toLocaleDateString()}</p>
                    </div>
                    <button className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded">Revoke</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="p-6 space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90">Invite Member</button>
              </div>
              <div className="divide-y">
                {MOCK_TEAM.map(member => (
                  <div key={member.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 capitalize">{member.role}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="p-6 space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Custom Tags</h2>
                <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Create Tag</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_TAGS.map(tag => (
                  <div key={tag.id} className="group border rounded-full px-3 py-1.5 flex items-center gap-2 text-sm bg-gray-50">
                    <span className="font-medium text-gray-700">{tag.name}</span>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-6 space-y-6 animate-in fade-in">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Billing & Credits</h2>
              </div>
              
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
                <div>
                  <p className="text-gray-300 text-sm mb-1">Available Credits</p>
                  <h2 className="text-3xl font-bold">14,250</h2>
                  <p className="text-xs text-gray-400 mt-2">Will expire on Dec 31, 2024</p>
                </div>
                <button className="px-5 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 shadow-sm">
                  Buy Credits
                </button>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="font-medium text-gray-900">Current Plan</h3>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">Pro Tier</h4>
                    <p className="text-sm text-gray-500">₹4,999 / month</p>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">Manage Plan</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
