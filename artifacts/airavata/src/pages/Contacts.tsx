import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, Plus, Download, Upload, Trash2, Tag,
  FolderPlus, Loader2, Users, MoreHorizontal, X, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

// ── Types ──────────────────────────────────────────────────────────────────────
interface TagObj { id: string; name: string; color: string }
interface GroupObj { id: string; name: string }
interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  status: 'active' | 'blocked' | 'unsubscribed';
  tags: TagObj[];
  group: GroupObj | null;
  lastContactedAt?: string | null;
  createdAt: string;
}

// ── Add Contact Modal ──────────────────────────────────────────────────────────
function AddContactModal({
  groups, tags, onClose, onSaved,
}: {
  groups: GroupObj[];
  tags: TagObj[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', groupId: '', tagIds: [] as string[] });
  const [saving, setSaving] = useState(false);

  const toggleTag = (id: string) =>
    setForm(f => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter(t => t !== id) : [...f.tagIds, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    setSaving(true);
    try {
      await api.post('/contacts', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        groupId: form.groupId || undefined,
        tags: form.tagIds,
      });
      toast.success('Contact added');
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Contact</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Aarav Sharma"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="aarav@example.com"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Group <span className="text-gray-400 font-normal">(optional)</span></label>
              <select value={form.groupId} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                <option value="">No group</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            {tags.length > 0 && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        form.tagIds.includes(t.id)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}>
                      {form.tagIds.includes(t.id) && <Check className="w-3 h-3" />}
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60 text-sm">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Import CSV Modal ───────────────────────────────────────────────────────────
function ImportModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const csv = await file.text();
      const res = await api.post<{ imported: number; total: number }>('/contacts/import', { csv });
      toast.success(`Imported ${res.imported} of ${res.total} contacts`);
      onImported();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = () => {
    const csv = 'name,phone,email\nAarav Sharma,+919876543210,aarav@example.com\nPriya Patel,+919988776655,';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'contacts-sample.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Import Contacts</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Upload a CSV file with <code className="bg-gray-100 px-1 rounded">name</code>, <code className="bg-gray-100 px-1 rounded">phone</code>, and optional <code className="bg-gray-100 px-1 rounded">email</code> columns.</p>
          <button onClick={downloadSample} className="text-sm text-primary hover:underline">Download sample template →</button>
          <label className={`block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
            {importing ? (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm">Importing…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="w-8 h-8 opacity-40" />
                <span className="text-sm font-medium">Click to upload CSV</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Contacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const params = new URLSearchParams({ search, page: String(page), limit: '50', ...(groupFilter ? { groupId: groupFilter } : {}) });

  const { data, isLoading } = useQuery<{ contacts: Contact[]; total: number; pages: number }>({
    queryKey: ['contacts', search, groupFilter, page],
    queryFn: () => api.get(`/contacts?${params}`),
    placeholderData: prev => prev,
  });

  const { data: groupsData } = useQuery<{ groups: GroupObj[] }>({
    queryKey: ['groups'],
    queryFn: () => api.get('/groups'),
  });

  const { data: tagsData } = useQuery<{ tags: TagObj[] }>({
    queryKey: ['tags'],
    queryFn: () => api.get('/tags'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contacts/${id}`),
    onSuccess: () => { toast.success('Contact deleted'); qc.invalidateQueries({ queryKey: ['contacts'] }); },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => api.post('/contacts/bulk-delete', { ids }),
    onSuccess: (res: { deleted: number }) => {
      toast.success(`${res.deleted} contacts deleted`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const contacts = data?.contacts ?? [];
  const groups = groupsData?.groups ?? [];
  const tags = tagsData?.tags ?? [];

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === contacts.length && contacts.length > 0
      ? new Set()
      : new Set(contacts.map(c => c.id)));
  };

  const handleExport = () => {
    window.open('/api/contacts/export', '_blank');
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} contacts? This cannot be undone.`)) return;
    bulkDeleteMutation.mutate([...selected]);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['contacts'] });
    qc.invalidateQueries({ queryKey: ['groups'] });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {showAdd && (
        <AddContactModal groups={groups} tags={tags} onClose={() => setShowAdd(false)} onSaved={invalidate} />
      )}
      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImported={invalidate} />
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : `${data?.total ?? 0} contacts in your account`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowImport(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors text-sm">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b bg-gray-50/50 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or phone…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white" />
        </div>
        <select value={groupFilter} onChange={e => { setGroupFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm bg-white outline-none">
          <option value="">All Groups</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="px-6 py-2.5 bg-primary/5 border-b flex items-center justify-between animate-in fade-in">
          <span className="text-sm font-medium text-primary">{selected.size} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-white border shadow-sm rounded-md hover:bg-gray-50 flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1.5 disabled:opacity-50">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading contacts…
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Users className="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">{search ? 'No contacts match your search' : 'No contacts yet'}</p>
            {!search && (
              <button onClick={() => setShowAdd(true)}
                className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 border-b">
              <tr>
                <th className="px-6 py-3 font-medium w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selected.size === contacts.length && contacts.length > 0}
                    onChange={toggleAll} />
                </th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Tags</th>
                <th className="px-6 py-3 font-medium">Group</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-900">
              {contacts.map(contact => (
                <tr key={contact.id}
                  className={`hover:bg-gray-50 transition-colors ${selected.has(contact.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selected.has(contact.id)} onChange={() => toggleSelect(contact.id)} />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div>{contact.name}</div>
                        {contact.email && <div className="text-xs text-gray-400">{contact.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map(tag => (
                        <span key={tag.id} className="px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{contact.group?.name ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                      ${contact.status === 'active' ? 'bg-green-100 text-green-700' :
                        contact.status === 'blocked' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        contact.status === 'active' ? 'bg-green-600' :
                        contact.status === 'blocked' ? 'bg-red-500' : 'bg-gray-400'}`} />
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => {
                      if (confirm(`Delete ${contact.name}?`)) deleteMutation.mutate(contact.id);
                    }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {(data?.pages ?? 0) > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between bg-white text-sm text-gray-500">
          <div>Showing page {page} of {data?.pages}</div>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(p => Math.min(data?.pages ?? 1, p + 1))} disabled={page === (data?.pages ?? 1)}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
