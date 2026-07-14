import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone, Key, Users, Tag, CreditCard, CheckCircle2, Copy, Plus, Trash2, Loader2, RefreshCw, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ApiKeyRecord {
  id: string;
  label: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

interface GeneratedKey extends ApiKeyRecord {
  rawKey: string;
}

// ── API Keys Tab ───────────────────────────────────────────────────────────────
function ApiKeysTab() {
  const qc = useQueryClient();
  const [labelInput, setLabelInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState<GeneratedKey | null>(null);
  const [revealed, setRevealed] = useState(false);

  const { data, isLoading } = useQuery<{ keys: ApiKeyRecord[] }>({
    queryKey: ['apikeys'],
    queryFn: () => api.get('/apikeys'),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/apikeys/${id}`),
    onSuccess: () => {
      toast.success('API key revoked');
      qc.invalidateQueries({ queryKey: ['apikeys'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const label = labelInput.trim() || 'Default Key';
      const res = await api.post<{ key: GeneratedKey }>('/apikeys', { label });
      setNewKey(res.key);
      setRevealed(true);
      setLabelInput('');
      qc.invalidateQueries({ queryKey: ['apikeys'] });
      toast.success('New API key generated — save it now, it won\'t be shown again.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate key');
    } finally {
      setGenerating(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
          <p className="text-xs text-gray-500 mt-0.5">Keys are hashed and stored securely — the full key is shown only once.</p>
        </div>
      </div>

      {/* Generate new key */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Generate New Key</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
            placeholder="Key label (e.g. Production)"
            className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-60"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </div>

      {/* One-time reveal panel */}
      {newKey && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-amber-800">⚠ Copy this key now — it will never be shown again</p>
            <button onClick={() => setNewKey(null)} className="text-xs text-amber-600 hover:underline">Dismiss</button>
          </div>
          <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-md px-3 py-2">
            <code className="flex-1 text-sm font-mono text-gray-800 break-all">
              {revealed ? newKey.rawKey : newKey.rawKey.replace(/./g, '•')}
            </code>
            <button onClick={() => setRevealed(v => !v)} className="p-1 text-gray-400 hover:text-gray-700 shrink-0">
              {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => copy(newKey.rawKey)} className="p-1 text-gray-400 hover:text-gray-700 shrink-0">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-amber-700">Label: <span className="font-medium">{newKey.label}</span></p>
        </div>
      )}

      {/* Keys list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading keys…
        </div>
      ) : data?.keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
          <Key className="w-10 h-10 opacity-30" />
          <p className="text-sm">No API keys yet. Generate one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.keys.map(key => (
            <div key={key.id} className="border rounded-lg p-4 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">{key.label}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                    {key.keyPrefix}••••••••••••••••••••••••••••••••
                  </code>
                  <button
                    onClick={() => copy(key.keyPrefix)}
                    className="p-1 hover:text-gray-900"
                    title="Copy prefix"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsedAt && ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Revoke key "${key.label}"? This cannot be undone.`)) {
                    revokeMutation.mutate(key.id);
                  }
                }}
                disabled={revokeMutation.isPending}
                className="shrink-0 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded disabled:opacity-50"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Phone Numbers Tab ─────────────────────────────────────────────────────────
interface PhoneNumber {
  id: string;
  number: string;
  verifiedName: string;
  quality: string;
  messagingTier: string;
  status: string;
  verified: boolean;
}

function PhoneNumbersTab() {
  const { data, isLoading } = useQuery<{ numbers: PhoneNumber[] }>({
    queryKey: ['phonenumbers'],
    queryFn: () => api.get('/phonenumbers'),
  });

  const numbers = data?.numbers ?? [];

  const qualityColor = (q: string) => {
    if (q === 'GREEN') return 'text-green-600';
    if (q === 'YELLOW') return 'text-yellow-600';
    if (q === 'RED') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected Numbers</h2>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
        </div>
      ) : numbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
          <Phone className="w-8 h-8 opacity-30" />
          <p className="text-sm font-medium text-gray-500">No phone numbers found</p>
          <p className="text-xs">Add a phone number in your Meta WhatsApp Manager to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {numbers.map(pn => (
            <div key={pn.id} className="border rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{pn.number}</h3>
                  {pn.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </div>
                {pn.verifiedName && (
                  <p className="text-sm text-gray-700 font-medium mb-1">{pn.verifiedName}</p>
                )}
                <div className="flex gap-3 text-sm text-gray-500">
                  <span>Quality: <span className={`font-medium ${qualityColor(pn.quality)}`}>{pn.quality}</span></span>
                  {pn.messagingTier && pn.messagingTier !== '—' && (
                    <><span>•</span><span>{pn.messagingTier}</span></>
                  )}
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                {pn.status}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        Ensure your Facebook Business Manager is verified to upgrade your messaging limits.
      </div>
    </div>
  );
}

// ── Team Tab ──────────────────────────────────────────────────────────────────
function TeamTab() {
  const { user } = useAuth();

  const displayName = user?.businessName ?? user?.email ?? 'Admin';
  const email = user?.email ?? '';

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <button
          onClick={() => alert('Team invite coming soon')}
          className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
        >
          Invite Member
        </button>
      </div>
      <div className="divide-y">
        {/* Show only the real logged-in user */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin</span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
              Active
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Multi-user team management is coming soon. You can invite agents and managers to collaborate on conversations.
      </p>
    </div>
  );
}

// ── Tags Tab ───────────────────────────────────────────────────────────────────
const TAG_COLORS = [
  '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ef4444',
  '#06b6d4', '#eab308', '#ec4899', '#14b8a6', '#6366f1',
];

function TagsTab() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TAG_COLORS[0]!);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<{ tags: { id: string; name: string; color: string }[] }>({
    queryKey: ['tags'],
    queryFn: () => api.get('/tags'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => { toast.success('Tag deleted'); qc.invalidateQueries({ queryKey: ['tags'] }); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error('Tag name is required'); return; }
    setAdding(true);
    try {
      await api.post('/tags', { name: newName.trim(), color: newColor });
      toast.success('Tag created');
      qc.invalidateQueries({ queryKey: ['tags'] });
      setNewName('');
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create tag');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Custom Tags</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Tag
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-lg p-4 space-y-3 border animate-in fade-in">
          <div className="flex gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Tag name, e.g. VIP"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              autoFocus />
            <button type="button" onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-200 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Color:</span>
            {TAG_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${newColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
            <button type="submit" disabled={adding}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60">
              {adding && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex items-center text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…</div>
      ) : (data?.tags.length ?? 0) === 0 ? (
        <p className="text-sm text-gray-400">No tags yet. Create one above.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {data!.tags.map(tag => (
            <div key={tag.id} className="group border rounded-full px-3 py-1.5 flex items-center gap-2 text-sm"
              style={{ backgroundColor: tag.color + '18', borderColor: tag.color + '50' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
              <span className="font-medium" style={{ color: tag.color }}>{tag.name}</span>
              <button onClick={() => {
                if (confirm(`Delete tag "${tag.name}"? It will be removed from all contacts.`)) {
                  deleteMutation.mutate(tag.id);
                }
              }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity ml-0.5">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Billing Tab ───────────────────────────────────────────────────────────────

interface BillingTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

function BillingTab() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [addAmount, setAddAmount] = useState('');
  const [adding, setAdding] = useState(false);

  const { data, isLoading } = useQuery<{ balance: number; transactions: BillingTransaction[] }>({
    queryKey: ['billing'],
    queryFn: () => api.get('/billing'),
  });

  const handleAddCredits = async () => {
    const amount = parseInt(addAmount, 10);
    if (!amount || amount <= 0) return toast.error('Enter a valid credit amount');
    setAdding(true);
    try {
      await api.post('/billing/add-credits', { amount, description: 'Manual top-up' });
      toast.success(`${amount} credits added`);
      setAddAmount('');
      qc.invalidateQueries({ queryKey: ['billing'] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add credits');
    } finally {
      setAdding(false);
    }
  };

  const txColor = (type: string) => {
    switch (type) {
      case 'PURCHASE': return 'text-green-600';
      case 'DEDUCTION': return 'text-red-600';
      case 'REFUND': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">Billing & Credits</h2>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
        <div>
          <p className="text-gray-300 text-sm mb-1">Available Credits</p>
          <h2 className="text-3xl font-bold">
            {isLoading ? '…' : (data?.balance ?? user?.creditBalance ?? 0).toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400 mt-2">1 credit per message recipient</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            max="100000"
            placeholder="Amount"
            value={addAmount}
            onChange={e => setAddAmount(e.target.value)}
            className="w-24 px-2 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 outline-none focus:bg-white/20"
          />
          <button
            onClick={handleAddCredits}
            disabled={adding}
            className="px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 shadow-sm text-sm disabled:opacity-60 flex items-center gap-1"
          >
            {adding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Add Credits
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Transaction History</h3>
        {isLoading ? (
          <div className="flex items-center text-gray-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
          </div>
        ) : (data?.transactions.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No transactions yet.</p>
        ) : (
          <div className="divide-y border rounded-lg overflow-hidden">
            {data!.transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{tx.description ?? tx.type}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${txColor(tx.type)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Balance: {tx.balanceAfter.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Manage() {
  const [activeTab, setActiveTab] = useState('phone');
  const { user } = useAuth();

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

          {activeTab === 'phone' && <PhoneNumbersTab />}

          {activeTab === 'api' && <ApiKeysTab />}

          {activeTab === 'team' && <TeamTab />}

          {activeTab === 'tags' && <TagsTab />}

          {activeTab === 'billing' && <BillingTab />}

        </div>
      </div>
    </div>
  );
}
