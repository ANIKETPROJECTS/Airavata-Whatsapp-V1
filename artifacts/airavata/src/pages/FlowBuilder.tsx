import { useState } from 'react';
import { Workflow, MousePointer2, Plus, Save, Play, ZoomIn, ZoomOut, MessageSquare, HelpCircle, Split, PhoneCall, Link2, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FlowBuilder() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', x: 50, y: 100, label: 'Trigger: Keyword "Help"' },
    { id: 2, type: 'message', x: 300, y: 100, label: 'Send: Welcome Message' },
    { id: 3, type: 'condition', x: 550, y: 100, label: 'Condition: Agent Online?' },
    { id: 4, type: 'action', x: 800, y: 50, label: 'Assign to Agent' },
    { id: 5, type: 'message', x: 800, y: 150, label: 'Send: Offline Form' }
  ]);

  const [connections] = useState([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4, label: 'Yes' },
    { from: 3, to: 5, label: 'No' }
  ]);

  const [activeNode, setActiveNode] = useState<number | null>(null);

  const handleSave = () => {
    toast.success('Flow saved successfully');
  };

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
          <h1 className="font-semibold text-gray-900">Customer Support Flow</h1>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex bg-gray-100 p-1 rounded-lg border mr-2">
            <button className="p-1 hover:bg-white rounded hover:shadow-sm"><ZoomOut className="w-4 h-4 text-gray-600" /></button>
            <span className="px-2 font-medium text-gray-600">100%</span>
            <button className="p-1 hover:bg-white rounded hover:shadow-sm"><ZoomIn className="w-4 h-4 text-gray-600" /></button>
          </div>
          
          <button className="px-3 py-1.5 font-medium text-gray-700 border bg-white rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Play className="w-4 h-4" /> Test Flow
          </button>
          <button onClick={handleSave} className="px-3 py-1.5 font-medium text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Save
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

        {/* Canvas Area (Mock Drag & Drop Canvas) */}
        <div className="flex-1 relative bg-[#f8fafc] cursor-grab" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          {/* Mock Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((c, i) => {
              const fromNode = nodes.find(n => n.id === c.from);
              const toNode = nodes.find(n => n.id === c.to);
              if (!fromNode || !toNode) return null;
              
              // Simple straight lines for mockup
              return (
                <g key={i}>
                  <line 
                    x1={fromNode.x + 200} 
                    y1={fromNode.y + 30} 
                    x2={toNode.x} 
                    y2={toNode.y + 30} 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                  />
                  {c.label && (
                    <text 
                      x={(fromNode.x + 200 + toNode.x) / 2} 
                      y={(fromNode.y + 30 + toNode.y + 30) / 2 - 5}
                      fill="#64748b"
                      fontSize="12"
                      textAnchor="middle"
                    >{c.label}</text>
                  )}
                  <circle cx={toNode.x} cy={toNode.y + 30} r="4" fill="#94a3b8" />
                </g>
              );
            })}
          </svg>

          {/* Mock Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`absolute w-[200px] bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-colors
                ${activeNode === node.id ? 'border-primary shadow-md z-10' : 'border-gray-200 hover:border-gray-300'}`}
              style={{ left: node.x, top: node.y }}
            >
              <div className="p-3 flex items-center gap-2 border-b bg-gray-50 rounded-t-[10px]">
                <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs text-gray-700 uppercase">{node.type}</span>
              </div>
              <div className="p-4 text-sm font-medium text-gray-900">
                {node.label}
              </div>
              
              {/* Output connector */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-primary">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Config (Appears when node is clicked) */}
        {activeNode && (
          <div className="w-80 bg-white border-l flex flex-col shrink-0 z-10 absolute right-0 top-0 bottom-0 shadow-xl animate-in slide-in-from-right-8">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Configure Node</h2>
              <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-gray-900 text-sm">Close</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Node Label</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" defaultValue={nodes.find(n => n.id === activeNode)?.label} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message Text</label>
                <textarea rows={4} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" defaultValue="Hello! Welcome to our support. How can I help?" />
              </div>
              <button className="w-full py-2 bg-primary/10 text-primary font-medium rounded-lg text-sm hover:bg-primary/20 transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
