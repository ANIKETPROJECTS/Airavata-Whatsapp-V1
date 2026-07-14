/**
 * Module 8: Create Campaign — wired to real templates, groups, and campaign API.
 */

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, ChevronRight, Users, Megaphone, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  category: string;
  body: string;
  status: string;
  language: string;
}

interface Group {
  id: string;
  name: string;
  memberCount?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract variable indices {{1}}, {{2}} … from a template body string */
function extractVarIndices(text: string): number[] {
  const matches = [...text.matchAll(/\{\{(\d+)\}\}/g)];
  return [...new Set(matches.map(m => parseInt(m[1]!, 10)))].sort((a, b) => a - b);
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CreateCampaign() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Load approved templates
  const { data: tmplData, isLoading: tmplLoading } = useQuery<{ templates: Template[] }>({
    queryKey: ['templates'],
    queryFn: () => api.get('/templates'),
  });
  const approvedTemplates = (tmplData?.templates ?? []).filter(
    t => String(t.status).toUpperCase() === 'APPROVED',
  );
  const selectedTemplate = approvedTemplates.find(t => t.id === selectedTemplateId) ?? null;
  const varIndices = useMemo(
    () => (selectedTemplate ? extractVarIndices(selectedTemplate.body) : []),
    [selectedTemplate],
  );

  // Load groups
  const { data: groupsData, isLoading: groupsLoading } = useQuery<{ groups: Group[] }>({
    queryKey: ['groups'],
    queryFn: () => api.get('/groups'),
  });
  const groups = groupsData?.groups ?? [];

  // Launch campaign
  const launchMutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        name: campaignName,
        templateId: selectedTemplateId,
        groupIds: selectedGroupIds,
        variableValues,
      };
      if (scheduleMode === 'later' && scheduledDate && scheduledTime) {
        payload.scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }
      return api.post('/campaigns', payload);
    },
    onSuccess: () => {
      toast.success('Campaign launched successfully!');
      setTimeout(() => navigate('/campaigns-report'), 1500);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleLaunch = () => {
    if (!campaignName.trim()) return toast.error('Please enter a campaign name');
    if (!selectedTemplateId) return toast.error('Please select a template');
    if (selectedGroupIds.length === 0) return toast.error('Please select at least one group');
    launchMutation.mutate();
  };

  const toggleGroup = (id: string) =>
    setSelectedGroupIds(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id],
    );

  const steps = [
    { num: 1, title: 'Basics', icon: Megaphone },
    { num: 2, title: 'Audience', icon: Users },
    { num: 3, title: 'Variables', icon: CheckCircle2 },
    { num: 4, title: 'Schedule', icon: Calendar },
    { num: 5, title: 'Review', icon: CheckCircle2 },
  ];

  // Live preview of template body with variable substitution
  const previewBody = useMemo(() => {
    if (!selectedTemplate) return '';
    let body = selectedTemplate.body;
    varIndices.forEach(i => {
      body = body.replace(new RegExp(`\\{\\{${i}\\}\\}`, 'g'), variableValues[String(i)] || `{{${i}}}`);
    });
    return body;
  }, [selectedTemplate, variableValues, varIndices]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header & Stepper */}
      <div className="bg-white border-b px-6 py-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Campaign</h1>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center relative z-10 w-24">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-2 bg-white transition-colors ${
                  step > s.num
                    ? 'border-primary bg-primary text-white'
                    : step === s.num
                    ? 'border-primary text-primary'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 h-[2px] -z-10 ${step > s.num ? 'bg-primary' : 'bg-gray-200'}`}
                  style={{ width: 'calc(100% + 40px)', left: '50%' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border shadow-sm p-8">

          {/* Step 1: Name + Template */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Campaign Details</h2>
                <p className="text-sm text-gray-500">Name your campaign and pick an approved template.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Sale 2024"
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Template (Approved only)</label>
                {tmplLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading templates…
                  </div>
                ) : approvedTemplates.length === 0 ? (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    No approved templates found. Create and submit a template for approval first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {approvedTemplates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTemplateId(t.id); setVariableValues({}); }}
                        className={`text-left border rounded-lg p-4 transition-all ${
                          selectedTemplateId === t.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900 text-sm">{t.name}</span>
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 ml-2 ${
                            selectedTemplateId === t.id ? 'border-primary bg-primary' : 'border-gray-300'
                          }`} />
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{t.body}</p>
                        <span className="text-xs mt-2 inline-block text-gray-400">{t.language} · {t.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Audience */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Audience</h2>
                <p className="text-sm text-gray-500">Choose one or more contact groups to send this campaign to.</p>
              </div>

              {groupsLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading groups…
                </div>
              ) : groups.length === 0 ? (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  No groups found. Create groups and add contacts first.
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map(g => (
                    <label
                      key={g.id}
                      className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedGroupIds.includes(g.id) ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroupIds.includes(g.id)}
                        onChange={() => toggleGroup(g.id)}
                        className="accent-primary w-4 h-4"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{g.name}</h3>
                        {g.memberCount !== undefined && (
                          <p className="text-sm text-gray-500">{g.memberCount} contacts</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedGroupIds.length > 0 && (
                <p className="text-sm text-primary font-medium">
                  {selectedGroupIds.length} group{selectedGroupIds.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {/* Step 3: Variable values */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Map Variables</h2>
                <p className="text-sm text-gray-500">
                  Fill in each template variable. Use <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code> to
                  insert the contact's name dynamically.
                </p>
              </div>

              {varIndices.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                  This template has no variables — it will be sent exactly as written.
                </div>
              ) : (
                <div className="space-y-4">
                  {varIndices.map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 shrink-0 text-sm font-mono font-medium text-gray-700 bg-gray-100 rounded px-2 py-1 text-center">{`{{${i}}}`}</div>
                      <input
                        type="text"
                        placeholder={`Value for {{${i}}} — or use {{name}}, {{phone}}`}
                        value={variableValues[String(i)] ?? ''}
                        onChange={e =>
                          setVariableValues(prev => ({ ...prev, [String(i)]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {selectedTemplate && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Live Preview</p>
                  <div className="bg-[#efeae2] rounded-xl p-4">
                    <div className="bg-white rounded-lg rounded-tl-none shadow-sm p-3 max-w-xs">
                      <p className="text-sm whitespace-pre-wrap text-gray-900">{previewBody}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Schedule</h2>
                <p className="text-sm text-gray-500">When should this campaign be sent?</p>
              </div>

              <div className="space-y-4">
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${scheduleMode === 'now' ? 'border-primary bg-primary/5' : ''}`}>
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'now'}
                    onChange={() => setScheduleMode('now')}
                  />
                  <span className="font-medium text-gray-900">Send Immediately</span>
                </label>

                <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${scheduleMode === 'later' ? 'border-primary bg-primary/5' : ''}`}>
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleMode === 'later'}
                    onChange={() => setScheduleMode('later')}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900 block mb-3">Schedule for later</span>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                        className="p-2 border rounded text-sm bg-white"
                        disabled={scheduleMode !== 'later'}
                      />
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={e => setScheduledTime(e.target.value)}
                        className="p-2 border rounded text-sm bg-white"
                        disabled={scheduleMode !== 'later'}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Review & Confirm</h2>
                <p className="text-sm text-gray-500">Check your details before launching.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border space-y-4 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Campaign Name</span>
                  <span className="font-medium text-gray-900">{campaignName || '(untitled)'}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Template</span>
                  <span className="font-medium text-gray-900">{selectedTemplate?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Audience</span>
                  <span className="font-medium text-gray-900">
                    {selectedGroupIds.length} group{selectedGroupIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Schedule</span>
                  <span className="font-medium text-gray-900">
                    {scheduleMode === 'now'
                      ? 'Send immediately'
                      : scheduledDate
                      ? `${scheduledDate} at ${scheduledTime}`
                      : 'Scheduled (date not set)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Your credit balance</span>
                  <span className="font-medium text-primary">{user?.creditBalance?.toLocaleString() ?? 0} credits</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                1 credit is deducted per recipient. The campaign will fail if you have insufficient credits.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="bg-white border-t px-6 py-4 flex justify-between shrink-0">
        <button
          onClick={() => setStep(s => Math.max(s - 1, 1))}
          disabled={step === 1}
          className="px-6 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        {step < 5 ? (
          <button
            onClick={() => setStep(s => Math.min(s + 1, 5))}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={launchMutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-sm flex items-center gap-2"
          >
            {launchMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {launchMutation.isPending ? 'Launching…' : 'Launch Campaign'}
          </button>
        )}
      </div>
    </div>
  );
}
