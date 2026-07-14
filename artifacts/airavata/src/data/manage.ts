// This will later be fetched from MongoDB via our backend API

export const MOCK_PHONE_NUMBERS = [
  { id: 'pn1', number: '+91 98765 43210', status: 'Connected', quality: 'High', messagingTier: 'Tier 1 (1K msg/day)', verified: true },
];

export const MOCK_API_KEYS = [
  { id: 'ak1', name: 'Production Key', key: 'sk_live_****************abc1', created: '2024-01-10T00:00:00Z', lastUsed: '2024-05-12T10:00:00Z' },
  { id: 'ak2', name: 'Development Key', key: 'sk_test_****************xyz9', created: '2024-03-15T00:00:00Z', lastUsed: '2024-05-01T00:00:00Z' },
];

export const MOCK_TEAM = [
  { id: 'u1', name: 'Admin User', email: 'admin@acme.com', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Support Agent', email: 'support@acme.com', role: 'Agent', status: 'Active' },
  { id: 'u3', name: 'Marketing Manager', email: 'marketing@acme.com', role: 'Agent', status: 'Pending' },
];

export const MOCK_TAGS = [
  { id: 't1', name: 'VIP', color: 'blue' },
  { id: 't2', name: 'Lead', color: 'green' },
  { id: 't3', name: 'Customer', color: 'purple' },
  { id: 't4', name: 'Wholesale', color: 'orange' },
];
