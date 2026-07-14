import { useState } from 'react';
import { useContacts } from '@/hooks/use-mock-data';
import { UsersRound, Plus, Users, Search, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function Group() {
  const { groups } = useContacts();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Groups</h1>
          <p className="text-sm text-gray-500">Organize your audience for targeted campaigns</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 flex gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Group Name</label>
            <input type="text" placeholder="e.g. VIP Customers" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={() => { setShowCreate(false); toast.success('Group created!'); }} className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <UsersRound className="w-6 h-6" />
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg mb-1">{g.name}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Users className="w-4 h-4" />
              {g.memberCount.toLocaleString()} members
            </div>
            
            <div className="border-t pt-4 mt-auto flex justify-between items-center text-sm">
              <span className="text-gray-400">Created {new Date(g.createdDate).toLocaleDateString()}</span>
              <span className="text-primary font-medium hover:underline">View Contacts &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
