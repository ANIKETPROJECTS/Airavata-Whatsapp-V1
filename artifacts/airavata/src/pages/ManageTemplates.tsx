import { useState } from 'react';
import { useTemplates } from '@/hooks/use-mock-data';
import { MessageSquare, Image as ImageIcon, FileText, Video, HelpCircle, ArrowRight, Eye, Copy, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageTemplates() {
  const { templates, deleteTemplate } = useTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getHeaderIcon = (type: string) => {
    switch(type) {
      case 'Image': return <ImageIcon className="w-4 h-4" />;
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Document': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Templates</h1>
          <p className="text-sm text-gray-500">View and manage your WhatsApp message templates</p>
        </div>
        <button 
          onClick={() => window.location.href='/add-template'}
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          Create Template
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border">
        <input 
          type="text" 
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm bg-white outline-none w-full sm:w-48"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-xl border flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 truncate pr-2">{t.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(t.status)}`}>
                  {t.status}
                </span>
              </div>
              <div className="flex gap-2 text-xs text-gray-500 mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded">{t.category}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">{t.language}</span>
              </div>
              
              {/* WhatsApp Bubble Preview */}
              <div className="bg-[#efeae2] p-3 rounded-lg relative">
                <div className="bg-white rounded-lg p-3 shadow-sm text-sm text-gray-800">
                  {t.type !== 'Text' && t.type !== 'None' && (
                    <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">
                      {getHeaderIcon(t.type)}
                    </div>
                  )}
                  <p className="line-clamp-3 whitespace-pre-wrap">{t.body}</p>
                </div>
              </div>

              {t.status === 'Rejected' && t.rejectionReason && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-start gap-1.5">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{t.rejectionReason}</span>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-between items-center mt-auto">
              <span className="text-xs text-gray-500">Updated {new Date(t.lastUpdated).toLocaleDateString()}</span>
              <div className="flex gap-1">
                <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="View/Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Duplicate">
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { deleteTemplate(t.id); toast('Template deleted'); }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
