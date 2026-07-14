// This will later be fetched from MongoDB via our backend API

export const MOCK_INTEGRATIONS = [
  { id: 'i1', name: 'Shopify', description: 'Sync products and order status updates.', connected: true, icon: 'shopify' },
  { id: 'i2', name: 'WooCommerce', description: 'Send abandoned cart reminders.', connected: false, icon: 'woocommerce' },
  { id: 'i3', name: 'Zapier', description: 'Connect with 3000+ apps.', connected: false, icon: 'zapier' },
  { id: 'i4', name: 'Google Sheets', description: 'Export contacts automatically.', connected: true, icon: 'google-sheets' },
  { id: 'i5', name: 'HubSpot', description: 'Sync leads to your CRM.', connected: false, icon: 'hubspot' },
  { id: 'i6', name: 'Salesforce', description: 'Enterprise CRM integration.', connected: false, icon: 'salesforce' },
];

export const MOCK_WEBHOOKS = [
  { id: 'w1', url: 'https://api.acmecorp.com/webhooks/whatsapp', events: ['messages', 'statuses'], active: true },
];
