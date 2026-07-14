// This will later be fetched from MongoDB via our backend API

export const MOCK_CONVERSATIONS = [
  { id: 'conv1', contactName: 'Aarav Sharma', contactPhone: '+91 98765 43210', lastMessage: 'Yes, that works for me.', timestamp: '10:32 AM', unread: 2, status: 'Open', assignedTo: 'Me', windowOpen: true },
  { id: 'conv2', contactName: 'Priya Patel', contactPhone: '+91 99887 76655', lastMessage: 'Can I get a refund?', timestamp: '09:15 AM', unread: 0, status: 'Open', assignedTo: 'Unassigned', windowOpen: true },
  { id: 'conv3', contactName: 'Rohan Gupta', contactPhone: '+91 90123 45678', lastMessage: 'Thanks!', timestamp: 'Yesterday', unread: 0, status: 'Resolved', assignedTo: 'Me', windowOpen: false },
  { id: 'conv4', contactName: 'Ananya Singh', contactPhone: '+91 98765 11223', lastMessage: 'Where is my order?', timestamp: 'Yesterday', unread: 1, status: 'Open', assignedTo: 'Me', windowOpen: true },
];

export const MOCK_MESSAGES = {
  'conv1': [
    { id: 'm1', sender: 'agent', text: 'Hi Aarav, we received your request. We can schedule a call tomorrow at 2 PM. Does that work?', timestamp: '10:05 AM', status: 'read' },
    { id: 'm2', sender: 'contact', text: 'Let me check my calendar.', timestamp: '10:15 AM' },
    { id: 'm3', sender: 'contact', text: 'Yes, that works for me.', timestamp: '10:32 AM' }
  ]
};
