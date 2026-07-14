import { useState } from 'react';
import { MessageSquare, Image as ImageIcon, FileText, Video, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTemplate() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState('None');
  const [bodyText, setBodyText] = useState('Hi {{1}}, welcome to our service!');
  const [footerText, setFooterText] = useState('');
  
  const insertVariable = () => {
    const match = bodyText.match(/\{\{(\d+)\}\}/g);
    const nextNum = match ? match.length + 1 : 1;
    setBodyText(prev => prev + ` {{${nextNum}}}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bodyText) {
      toast.error('Name and body are required');
      return;
    }
    toast.success('Template submitted for approval');
    setTimeout(() => window.location.href='/manage-templates', 1000);
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
                <option value="Marketing">Marketing</option>
                <option value="Utility">Utility</option>
                <option value="Authentication">Authentication</option>
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
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Header <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="flex flex-wrap gap-3">
                {['None', 'Text', 'Image', 'Video', 'Document'].map(type => (
                  <label key={type} className={`
                    px-4 py-2 border rounded-lg text-sm cursor-pointer transition-colors
                    ${headerType === type ? 'bg-primary/10 border-primary text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}
                  `}>
                    <input 
                      type="radio" 
                      name="headerType" 
                      value={type} 
                      checked={headerType === type}
                      onChange={() => setHeaderType(type)}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

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
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Footer <span className="text-gray-400 font-normal">(Optional)</span></label>
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
              <p>Meta requires approval for all templates. This usually takes 1-2 hours but can take up to 24 hours.</p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button type="button" className="px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50">
              Save Draft
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-sm">
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
              <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
              <div className="text-white">
                <div className="font-medium text-sm">Your Business</div>
                <div className="text-[10px] opacity-80">Official Business Account</div>
              </div>
            </div>
            
            <div className="pt-16 pb-4 h-full overflow-y-auto flex flex-col">
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-sm text-gray-800 max-w-[85%] self-start relative">
                
                {headerType !== 'None' && (
                  <div className="mb-2 w-full aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    {headerType === 'Image' && <ImageIcon className="w-6 h-6" />}
                    {headerType === 'Video' && <Video className="w-6 h-6" />}
                    {headerType === 'Document' && <FileText className="w-6 h-6" />}
                    {headerType === 'Text' && <span className="font-bold text-gray-800 p-2">HEADER TEXT</span>}
                  </div>
                )}
                
                <div className="whitespace-pre-wrap leading-relaxed">
                  {bodyText.replace(/\{\{(\d+)\}\}/g, '[Var $1]')}
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
        </div>
      </div>
    </div>
  );
}
