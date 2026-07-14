// This will later be fetched from MongoDB via our backend API

export const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'May Welcome Series', templateId: 't1', templateName: 'welcome_offer_v2', status: 'Completed', sent: 1250, delivered: 1245, read: 980, failed: 5, date: '2024-05-01T08:00:00Z' },
  { id: 'c2', name: 'Flash Sale Alert', templateId: 't1', templateName: 'flash_sale_promo', status: 'Completed', sent: 4500, delivered: 4320, read: 3100, failed: 180, date: '2024-05-05T14:30:00Z' },
  { id: 'c3', name: 'VIP Exclusive Preview', templateId: 't2', templateName: 'vip_preview', status: 'Active', sent: 300, delivered: 295, read: 150, failed: 0, date: '2024-05-12T10:00:00Z' },
  { id: 'c4', name: 'Dormant Reactivation', templateId: 't1', templateName: 'miss_you_offer', status: 'Scheduled', sent: 0, delivered: 0, read: 0, failed: 0, date: '2024-05-15T09:00:00Z' },
];

export const MOCK_CHART_DATA = [
  { date: 'May 1', sent: 1250, delivered: 1245, read: 980 },
  { date: 'May 2', sent: 300, delivered: 298, read: 250 },
  { date: 'May 3', sent: 400, delivered: 395, read: 310 },
  { date: 'May 4', sent: 200, delivered: 195, read: 150 },
  { date: 'May 5', sent: 4500, delivered: 4320, read: 3100 },
  { date: 'May 6', sent: 150, delivered: 148, read: 120 },
  { date: 'May 7', sent: 500, delivered: 490, read: 410 },
];
