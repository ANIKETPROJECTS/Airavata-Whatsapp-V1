import { useState } from 'react';
import { Workflow, MousePointer2, Plus, MessageSquare, HelpCircle, Split, PhoneCall, Link2, Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';

export default function FlowBuilder() {
  const nodeTypes = [
    { type: 'message', icon: MessageSquare, label: 'Send Message', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { type: 'question', icon: HelpCircle, label: 'Ask Question', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { type: 'condition', icon: Split, label: 'Condition', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { type: 'menu', icon: MousePointer2, label: 'Button Menu', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { type: 'action', icon: PhoneCall, label: 'Action', color: 'bg-red-50 text-red-600 border-red-200' },
    { type: 'api', icon: Link2, label: 'API Call', color: 'bg-gray-50 text-gray-600 border-gray-200' },
    { type: 'delay', icon: Clock, label: 'Delay', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Workflow className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-gray-900">Flow Builder</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex bg-gray-100 p-1 rounded-lg border mr-2">
            <button className="p-1 hover:bg-white rounded hover:shadow-sm"><ZoomOut className="w-4 h-4 text-gray-600" /></button>
            <span className="px-2 font-medium text-gray-600">100%</span>
            <button className="p-1 hover:bg-white rounded hover:shadow-sm"><ZoomIn className="w-4 h-4 text-gray-600" /></button>
          </div>
          <button
            onClick={() => toast('Create a flow to get started')}
            className="px-3 py-1.5 font-medium text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Flow
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Palette */}
        <div className="w-64 bg-white border-r flex flex-col shrink-0 z-10">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Node Types</h2>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto">
            {nodeTypes.map(n => (
              <div
                key={n.type}
                className={`p-3 border rounded-lg flex items-center gap-3 cursor-grab hover:shadow-md transition-all ${n.color}`}
              >
                <div className="bg-white p-1.5 rounded shadow-sm"><n.icon className="w-4 h-4" /></div>
                <span className="font-medium text-sm">{n.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas — empty state */}
        <div
          className="flex-1 relative bg-[#f8fafc] cursor-default"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm">
              <Workflow className="w-7 h-7 opacity-30" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-500">No flows yet</p>
              <p className="text-sm mt-1">Click <span className="font-semibold">New Flow</span> to build your first automation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
