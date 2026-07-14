// This will later be fetched from MongoDB via our backend API

export const MOCK_CONTACTS = [
  { id: '1', name: 'Aarav Sharma', phone: '+91 98765 43210', tags: ['VIP', 'Lead'], group: 'Q3 Prospects', lastContacted: '2024-05-12T10:30:00Z', status: 'Active' },
  { id: '2', name: 'Vihaan Verma', phone: '+91 91234 56789', tags: ['Customer'], group: 'Subscribers', lastContacted: '2024-05-11T14:20:00Z', status: 'Active' },
  { id: '3', name: 'Priya Patel', phone: '+91 99887 76655', tags: ['Lead'], group: 'Q3 Prospects', lastContacted: '2024-05-10T09:15:00Z', status: 'Inactive' },
  { id: '4', name: 'Ananya Singh', phone: '+91 98765 11223', tags: ['Wholesale'], group: 'B2B Partners', lastContacted: '2024-05-09T16:45:00Z', status: 'Active' },
  { id: '5', name: 'Rohan Gupta', phone: '+91 90123 45678', tags: ['VIP'], group: 'Subscribers', lastContacted: '2024-05-12T11:00:00Z', status: 'Active' },
  { id: '6', name: 'Kavya Reddy', phone: '+91 91122 33445', tags: ['Customer'], group: 'Subscribers', lastContacted: '2024-05-08T13:30:00Z', status: 'Active' },
  { id: '7', name: 'Ishaan Desai', phone: '+91 92233 44556', tags: ['Lead', 'Hot'], group: 'Q3 Prospects', lastContacted: '2024-05-12T08:20:00Z', status: 'Active' },
  { id: '8', name: 'Mira Nair', phone: '+91 93344 55667', tags: ['Partner'], group: 'B2B Partners', lastContacted: '2024-05-01T10:00:00Z', status: 'Inactive' },
];

export const MOCK_GROUPS = [
  { id: 'g1', name: 'Q3 Prospects', memberCount: 145, createdDate: '2024-01-15T00:00:00Z' },
  { id: 'g2', name: 'Subscribers', memberCount: 2048, createdDate: '2023-11-01T00:00:00Z' },
  { id: 'g3', name: 'B2B Partners', memberCount: 32, createdDate: '2024-02-20T00:00:00Z' },
  { id: 'g4', name: 'Event Attendees - Mumbai', memberCount: 89, createdDate: '2024-04-10T00:00:00Z' },
];
