import { useState } from 'react';
import { 
  Search, Filter, Plus, Download, Upload, MoreHorizontal, 
  Trash2, Tag, FolderPlus
} from 'lucide-react';
import { useContacts } from '@/hooks/use-mock-data';
import { toast } from 'sonner';

export default function Contacts() {
  const { contacts, groups } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedContacts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedContacts(newSet);
  };

  const toggleAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedContacts.size === 0) return;
    toast.success(`${action} applied to ${selectedContacts.size} contacts`);
    setSelectedContacts(new Set());
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500">Manage your audience and segments</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast('Import modal opened')}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button 
            onClick={() => toast('Add contact modal opened')}
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 border-b bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="border rounded-lg px-3 py-2 text-sm bg-white outline-none">
            <option value="">All Groups</option>
            {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
          </select>
          <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedContacts.size > 0 && (
        <div className="px-6 py-3 bg-primary/5 border-b flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary">
            {selectedContacts.size} contacts selected
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkAction('Added to group')} className="px-3 py-1.5 text-sm bg-white border shadow-sm rounded-md hover:bg-gray-50 flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4" /> Add to Group
            </button>
            <button onClick={() => handleBulkAction('Tags added')} className="px-3 py-1.5 text-sm bg-white border shadow-sm rounded-md hover:bg-gray-50 flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Add Tag
            </button>
            <button onClick={() => handleBulkAction('Exported')} className="px-3 py-1.5 text-sm bg-white border shadow-sm rounded-md hover:bg-gray-50 flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button onClick={() => handleBulkAction('Deleted')} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 border-b shadow-sm">
            <tr>
              <th className="px-6 py-3 font-medium w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Phone Number</th>
              <th className="px-6 py-3 font-medium">Tags</th>
              <th className="px-6 py-3 font-medium">Group</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-900">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No contacts found.
                </td>
              </tr>
            ) : (
              filteredContacts.map(contact => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 transition-colors ${selectedContacts.has(contact.id) ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedContacts.has(contact.id)}
                      onChange={() => toggleSelect(contact.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{contact.group || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                      ${contact.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${contact.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Mock) */}
      <div className="px-6 py-4 border-t flex items-center justify-between bg-white text-sm text-gray-500">
        <div>Showing 1 to {filteredContacts.length} of {contacts.length} results</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border rounded bg-primary text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
