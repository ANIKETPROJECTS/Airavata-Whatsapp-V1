import { useState } from 'react';
import { CheckCircle2, ChevronRight, Upload, Users, Megaphone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateCampaign() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  
  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleLaunch = () => {
    toast.success('Campaign scheduled successfully!');
    setTimeout(() => window.location.href='/campaigns-report', 1500);
  };

  const steps = [
    { num: 1, title: 'Basics', icon: Megaphone },
    { num: 2, title: 'Audience', icon: Users },
    { num: 3, title: 'Content', icon: CheckCircle2 },
    { num: 4, title: 'Schedule', icon: Calendar },
    { num: 5, title: 'Review', icon: CheckCircle2 }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header & Stepper */}
      <div className="bg-white border-b px-6 py-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Campaign</h1>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center relative z-10 w-24">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-2 bg-white transition-colors ${
                step > s.num ? 'border-primary bg-primary text-white' : 
                step === s.num ? 'border-primary text-primary' : 
                'border-gray-200 text-gray-400'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.title}
              </span>
              
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${
                  step > s.num ? 'bg-primary' : 'bg-gray-200'
                }`} style={{ width: 'calc(100% + 40px)', left: '50%' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border shadow-sm p-8">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Campaign Details</h2>
                <p className="text-sm text-gray-500">Name your campaign and select a template.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Summer Sale 2024"
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Template</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['welcome_offer_v2', 'flash_sale_promo'].map(t => (
                    <div key={t} className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{t}</span>
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-primary"></div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">Hi {"{{1}}"}, welcome to our service. Use code {"{{2}}"} for 20% off.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Select Audience</h2>
                <p className="text-sm text-gray-500">Who do you want to send this message to?</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="border rounded-lg p-5 flex items-start gap-4 cursor-pointer hover:bg-gray-50 border-primary bg-primary/5">
                  <input type="radio" name="audience" className="mt-1" defaultChecked />
                  <div>
                    <h3 className="font-medium text-gray-900">Saved Groups</h3>
                    <p className="text-sm text-gray-500 mt-1">Select from your existing contact segments</p>
                    <select className="mt-3 w-full p-2 border rounded bg-white text-sm">
                      <option>Q3 Prospects (145 contacts)</option>
                      <option>Subscribers (2,048 contacts)</option>
                    </select>
                  </div>
                </label>

                <label className="border rounded-lg p-5 flex items-start gap-4 cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="audience" className="mt-1" />
                  <div className="w-full">
                    <h3 className="font-medium text-gray-900">Upload CSV</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload a one-time list for this campaign</p>
                    <div className="mt-3 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 hover:bg-gray-50">
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Click to upload file</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Map Variables</h2>
                <p className="text-sm text-gray-500">Map your template variables to contact fields or static values.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-700">{"{{1}}"}</div>
                  <select className="flex-1 p-2 border rounded bg-white text-sm">
                    <option>Contact: Name</option>
                    <option>Contact: First Name</option>
                    <option>Custom Value...</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-700">{"{{2}}"}</div>
                  <input type="text" placeholder="Enter custom value (e.g. SUMMER20)" className="flex-1 p-2 border rounded bg-white text-sm" defaultValue="SUMMER20" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Schedule</h2>
                <p className="text-sm text-gray-500">When should we send this campaign?</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 border-primary bg-primary/5">
                  <input type="radio" name="schedule" defaultChecked />
                  <span className="font-medium text-gray-900">Send Immediately</span>
                </label>
                
                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="schedule" className="mt-1" />
                  <div>
                    <span className="font-medium text-gray-900 block mb-3">Schedule for later</span>
                    <div className="flex gap-3">
                      <input type="date" className="p-2 border rounded text-sm bg-white" />
                      <input type="time" className="p-2 border rounded text-sm bg-white" />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Review & Confirm</h2>
                <p className="text-sm text-gray-500">Check your details before launching.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border space-y-4 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Campaign Name</span>
                  <span className="font-medium text-gray-900">{name || 'Untitled Campaign'}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Audience</span>
                  <span className="font-medium text-gray-900">Q3 Prospects (145 recipients)</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Template</span>
                  <span className="font-medium text-gray-900">welcome_offer_v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Cost</span>
                  <span className="font-medium text-primary">₹ 116.00</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Nav */}
      <div className="bg-white border-t px-6 py-4 flex justify-between shrink-0">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className="px-6 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Back
        </button>
        {step < 5 ? (
          <button 
            onClick={nextStep}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={handleLaunch}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Launch Campaign
          </button>
        )}
      </div>
    </div>
  );
}
