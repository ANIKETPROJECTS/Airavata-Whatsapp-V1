import { useState } from 'react';
import { 
  Search, Filter, MessageSquare, Phone, MoreVertical, 
  Send, Paperclip, Smile, Image as ImageIcon, Clock, Check, CheckCheck,
  Plus
} from 'lucide-react';
import { useChat } from '@/hooks/use-mock-data';
import { toast } from 'sonner';

export default function LiveChat() {
  const { conversations, messages, addMessage } = useChat();
  const [activeTab, setActiveTab] = useState('Open');
  const [activeConvId, setActiveConvId] = useState<string | null>(conversations[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages = activeConvId ? (messages[activeConvId] || []) : [];

  const handleSend = () => {
    if (!messageInput.trim() || !activeConvId) return;
    addMessage(activeConvId, messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-white overflow-hidden">
      {/* Left Panel: Conversation List */}
      <div className="w-80 border-r flex flex-col bg-gray-50/30 shrink-0">
        <div className="p-4 border-b">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Open', 'Resolved'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations
            .filter(c => activeTab === 'All' || c.status === activeTab)
            .map(conv => (
            <button 
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-gray-50 flex gap-3 ${
                activeConvId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                  {conv.contactName.charAt(0)}
                </div>
                {conv.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                    {conv.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm truncate">{conv.contactName}</span>
                  <span className="text-xs text-gray-500">{conv.timestamp}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Middle Panel: Active Chat */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                {activeConv.contactName.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{activeConv.contactName}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{activeConv.contactPhone}</span>
                  <span>•</span>
                  {activeConv.windowOpen ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 24h Window Open
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> 24h Window Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toast('Conversation marked as resolved')}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 font-medium text-gray-700"
              >
                Resolve
              </button>
              <button 
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={`p-2 rounded-lg transition-colors ${rightPanelOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#efeae2] relative">
            {/* WhatsApp Doodle Background Pattern could go here via pseudo-element in CSS */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <span className="px-3 py-1 bg-white/80 rounded-md text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
                  Today
                </span>
              </div>
              
              {activeMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 shadow-sm relative ${
                    msg.sender === 'agent' 
                      ? 'bg-[#dcf8c6] rounded-tr-none text-gray-900' 
                      : 'bg-white rounded-tl-none text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                      {msg.sender === 'agent' && (
                        <CheckCheck className={`w-3 h-3 ${msg.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-gray-50 border-t shrink-0">
            {activeConv.windowOpen ? (
              <div className="max-w-3xl mx-auto flex items-end gap-2 bg-white border rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <div className="flex gap-1 pb-1">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Smile className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Paperclip className="w-5 h-5" /></button>
                </div>
                <textarea
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 max-h-32 min-h-[40px] resize-none border-none outline-none py-2 px-2 text-sm bg-transparent"
                  rows={1}
                />
                <div className="pb-1">
                  <button 
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  The 24-hour customer service window has closed. You can only send approved Template Messages until the customer replies.
                </p>
                <button className="mt-2 px-4 py-1.5 bg-white text-orange-700 text-sm font-medium border border-orange-200 rounded hover:bg-orange-100">
                  Send Template
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
            <p className="text-sm text-gray-500">Choose a contact from the list to start chatting.</p>
          </div>
        </div>
      )}

      {/* Right Panel: Contact Info */}
      {rightPanelOpen && activeConv && (
        <div className="w-72 border-l bg-white flex flex-col shrink-0 overflow-y-auto">
          <div className="p-6 text-center border-b">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto mb-3">
              {activeConv.contactName.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-900">{activeConv.contactName}</h3>
            <p className="text-sm text-gray-500">{activeConv.contactPhone}</p>
            
            <div className="flex gap-2 justify-center mt-4">
              <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><Phone className="w-4 h-4" /></button>
              <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><Search className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">VIP</span>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Lead</span>
                <button className="px-2 py-1 border border-dashed rounded text-xs text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</h4>
                <button className="text-xs text-primary font-medium hover:underline">Edit</button>
              </div>
              <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg text-sm text-gray-700">
                Interested in the premium plan. Call scheduled for tomorrow.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">About</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Group</span>
                  <span className="font-medium text-gray-900">Q3 Prospects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="font-medium text-gray-900">English (en_US)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Opt-in Date</span>
                  <span className="font-medium text-gray-900">May 1, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
