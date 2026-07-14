import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersRound, Plus, Users, Loader2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface Group {
  id: string;
  name: string;
  description?: string | null;
  memberCount: number;
  createdAt: string;
}

export default function Group() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery<{ groups: Group[] }>({
    queryKey: ['groups'],
    queryFn: () => api.get('/groups'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/groups/${id}`),
    onSuccess: () => {
      toast.success('Group deleted');
      qc.invalidateQueries({ queryKey: ['groups'] });
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error('Group name is required'); return; }
    setCreating(true);
    try {
      await api.post('/groups', { name: newName.trim(), description: newDesc.trim() || undefined });
      toast.success('Group created!');
      qc.invalidateQueries({ queryKey: ['groups'] });
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const groups = data?.groups ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Groups</h1>
          <p className="text-sm text-gray-500">Organize your audience for targeted campaigns</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white p-6 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">New Group</h3>
            <button onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Group name, e.g. VIP Customers"
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2 sm:items-start">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60 text-sm">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading groups…
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <UsersRound className="w-12 h-12 opacity-30" />
          <p className="text-sm font-medium">No groups yet</p>
          <button onClick={() => setShowCreate(true)}
            className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
            Create your first group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(g => (
            <div key={g.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UsersRound className="w-6 h-6" />
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Delete group "${g.name}"? Contacts in this group will be unassigned.`)) {
                      deleteMutation.mutate(g.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1">{g.name}</h3>
              {g.description && <p className="text-sm text-gray-500 mb-2">{g.description}</p>}

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4" />
                {g.memberCount.toLocaleString()} member{g.memberCount !== 1 ? 's' : ''}
              </div>

              <div className="border-t pt-4 flex justify-between items-center text-sm">
                <span className="text-gray-400">Created {new Date(g.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
