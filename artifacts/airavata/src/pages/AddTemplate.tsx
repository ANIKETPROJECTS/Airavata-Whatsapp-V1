import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Image as ImageIcon, FileText, Video, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api';

/** Returns sorted unique variable numbers found in a string, e.g. "Hi {{1}} ... {{2}}" → [1, 2] */
function extractVars(text: string): number[] {
  const matches = [...text.matchAll(/\{\{(\d+)\}\}/g)];
  return [...new Set(matches.map(m => parseInt(m[1]!, 10)))].sort((a, b) => a - b);
}

/** Replace {{N}} with sample value (or [Var N] fallback) for the live preview */
function applysamples(text: string, samples: Record<number, string>): string {
  return text.replace(/\{\{(\d+)\}\}/g, (_, n) => samples[parseInt(n, 10)] || `[Var ${n}]`);
}

export default function AddTemplate() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('MARKETING');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState('NONE');
  const [headerContent, setHeaderContent] = useState('');
  const [bodyText, setBodyText] = useState('Hi {{1}}, welcome to our service!');
  const [footerText, setFooterText] = useState('');

  // Sample values keyed by variable index (1-based)
  const [samples, setSamples] = useState<Record<number, string>>({});

  const insertVariable = () => {
    const match = bodyText.match(/\{\{(\d+)\}\}/g);
    const nextNum = match ? match.length + 1 : 1;
    setBodyText(prev => prev + ` {{${nextNum}}}`);
  };

  // Detect all variables across body + text header
  const bodyVars = useMemo(() => extractVars(bodyText), [bodyText]);
  const headerVars = useMemo(
    () => (headerType === 'TEXT' ? extractVars(headerContent) : []),
    [headerType, headerContent],
  );
  const allVars = useMemo(
    () => [...new Set([...bodyVars, ...headerVars])].sort((a, b) => a - b),
    [bodyVars, headerVars],
  );

  const setSample = (idx: number, value: string) =>
    setSamples(prev => ({ ...prev, [idx]: value }));

  const submitMutation = useMutation({
    mutationFn: () => {
      // Build ordered sample arrays
      const bodySamples = bodyVars.map(i => samples[i] ?? '');
      const headerSample = headerVars.length > 0 ? (samples[headerVars[0]!] ?? '') : undefined;

      return api.post('/templates', {
        name,
        category,
        language,
        headerType,
        headerContent: headerType === 'TEXT' ? headerContent : undefined,
        body: bodyText,
        footer: footerText || undefined,
        bodySamples: bodySamples.length > 0 ? bodySamples : undefined,
        headerSample: headerSample || undefined,
      });
    },
    onSuccess: () => {
      toast.success('Template submitted to Meta for approval');
      qc.invalidateQueries({ queryKey: ['templates'] });
      navigate('/manage-templates');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bodyText.trim()) {
      toast.error('Name and body are required');
      return;
    }
    // Validate all detected variables have sample values
    for (const idx of allVars) {
      if (!samples[idx]?.trim()) {
        toast.error(`Please provide a sample value for {{${idx}}}`);
        return;
      }
    }
    submitMutation.mutate();
  };

  const headerOptions = [
    { value: 'NONE', label: 'None' },
    { value: 'TEXT', label: 'Text' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'DOCUMENT', label: 'Document' },
  ];

  const PLACEHOLDERS: Record<number, string> = {
    1: 'e.g. Rahul',
    2: 'e.g. ORDER123',
    3: 'e.g. 3 Jan 2025',
    4: 'e.g. 10:00 AM',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Form Area */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
          <p className="text-sm text-gray-500">Design your message template for WhatsApp approval</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. welcome_offer_v2"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                required
              />
              <p className="text-xs text-gray-500">Lowercase and underscores only</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none"
              >
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border rounded-lg text-sm bg-white outline-none"
            >
              <option value="en_US">English (US)</option>
              <option value="en_GB">English (UK)</option>
              <option value="hi_IN">Hindi</option>
              <option value="es_ES">Spanish</option>
            </select>
          </div>

          <div className="border-t pt-6 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Header <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {headerOptions.map(opt => (
                  <label
                    key={opt.value}
                    className={`
                      px-4 py-2 border rounded-lg text-sm cursor-pointer transition-colors
                      ${headerType === opt.value
                        ? 'bg-primary/10 border-primary text-primary font-medium'
                        : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <input
                      type="radio"
                      name="headerType"
                      value={opt.value}
                      checked={headerType === opt.value}
                      onChange={() => setHeaderType(opt.value)}
                      className="hidden"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {headerType === 'TEXT' && (
                <input
                  type="text"
                  value={headerContent}
                  onChange={e => setHeaderContent(e.target.value)}
                  placeholder="Header text (no emojis or special characters)"
                  maxLength={60}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                />
              )}
              {headerType !== 'NONE' && headerType !== 'TEXT' && (
                <p className="text-xs text-gray-500">
                  Media URL will be provided when sending the campaign.
                </p>
              )}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Body</label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="text-xs font-medium text-primary hover:bg-primary/5 px-2 py-1 rounded"
                >
                  + Add Variable
                </button>
              </div>
              <textarea
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary focus:border-primary outline-none resize-y"
                placeholder="Type your message here..."
                required
              />
              <p className="text-xs text-gray-400">
                Use <code className="bg-gray-100 px-1 rounded">{'{{1}}'}</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">{'{{2}}'}</code> for personalisation variables.
              </p>
            </div>

            {/* Sample Values — only shown when variables are detected */}
            {allVars.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Sample Values Required</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Meta requires an example value for every variable to review and approve your template.
                  </p>
                </div>
                <div className="space-y-2">
                  {allVars.map(idx => (
                    <div key={idx} className="flex items-center gap-3">
                      <code className="text-xs font-mono bg-amber-100 border border-amber-300 text-amber-800 px-2 py-1 rounded w-14 text-center shrink-0">
                        {`{{${idx}}}`}
                      </code>
                      <input
                        type="text"
                        value={samples[idx] ?? ''}
                        onChange={e => setSample(idx, e.target.value)}
                        placeholder={PLACEHOLDERS[idx] ?? `e.g. value_${idx}`}
                        className={`flex-1 px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white ${
                          !samples[idx]?.trim() ? 'border-amber-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Footer <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                placeholder="e.g. Reply STOP to opt out"
                maxLength={60}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
              <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />
              <p>Meta requires approval for all templates. This usually takes a few minutes but can take up to 24 hours.</p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/manage-templates')}
              className="px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              disabled={submitMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-sm flex items-center gap-2 disabled:opacity-60"
            >
              {submitMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit for Approval
            </button>
          </div>
        </form>
      </div>

      {/* Preview Area */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="sticky top-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Preview</h3>

          <div className="bg-[#efeae2] rounded-3xl p-4 h-[500px] border-8 border-gray-900 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-14 bg-[#075e54] flex items-center px-4 shadow-sm z-10">
              <div className="w-8 h-8 rounded-full bg-white/20 mr-3" />
              <div className="text-white">
                <div className="font-medium text-sm">Your Business</div>
                <div className="text-[10px] opacity-80">Official Business Account</div>
              </div>
            </div>

            <div className="pt-16 pb-4 h-full overflow-y-auto flex flex-col">
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-sm text-gray-800 max-w-[85%] self-start">
                {headerType !== 'NONE' && (
                  <div className="mb-2 w-full aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    {headerType === 'IMAGE' && <ImageIcon className="w-6 h-6" />}
                    {headerType === 'VIDEO' && <Video className="w-6 h-6" />}
                    {headerType === 'DOCUMENT' && <FileText className="w-6 h-6" />}
                    {headerType === 'TEXT' && (
                      <span className="font-bold text-gray-800 p-2 text-center">
                        {applysamples(headerContent || 'HEADER TEXT', samples)}
                      </span>
                    )}
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {applysamples(bodyText, samples)}
                </div>
                {footerText && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                    {footerText}
                  </div>
                )}
                <div className="text-[10px] text-gray-400 text-right mt-1">12:00 PM</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-800">
            <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <span>Preview is approximate. Final rendering depends on the recipient's WhatsApp version.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
