// This will later be fetched from MongoDB via our backend API

export const MOCK_TEMPLATES = [
  { id: 't1', name: 'welcome_offer_v2', category: 'Marketing', language: 'en_US', status: 'Approved', type: 'Image', body: 'Hi {{1}}, welcome to Airavata! Enjoy 20% off your first order with code {{2}}.', lastUpdated: '2024-05-10T12:00:00Z' },
  { id: 't2', name: 'order_update_shipped', category: 'Utility', language: 'en_US', status: 'Approved', type: 'Text', body: 'Your order {{1}} has shipped! Track it here: {{2}}', lastUpdated: '2024-05-01T10:00:00Z' },
  { id: 't3', name: 'diwali_sale_promo', category: 'Marketing', language: 'hi_IN', status: 'Pending', type: 'Video', body: 'Diwali is here! Get up to 50% off on all electronics.', lastUpdated: '2024-05-12T09:30:00Z' },
  { id: 't4', name: 'otp_verification', category: 'Authentication', language: 'en_US', status: 'Approved', type: 'Text', body: 'Your verification code is {{1}}. Do not share this code.', lastUpdated: '2024-03-15T14:20:00Z' },
  { id: 't5', name: 'feedback_request', category: 'Utility', language: 'en_US', status: 'Rejected', rejectionReason: 'Contains promotional content in utility template', type: 'Text', body: 'How was your experience? Reply 1 for Good, 2 for Bad. Also check out our new arrivals!', lastUpdated: '2024-05-11T16:45:00Z' },
];
