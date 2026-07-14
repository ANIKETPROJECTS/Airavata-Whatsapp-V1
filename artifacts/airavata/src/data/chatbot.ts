// This will later be fetched from MongoDB via our backend API

export const MOCK_BOTS = [
  { id: 'b1', name: 'Customer Support Bot', triggerWords: ['help', 'support', 'agent'], welcomeMessage: 'Hi! How can I help you today?', fallbackMessage: 'I did not understand that. Transferring you to an agent.', active: true, businessHoursOnly: false },
  { id: 'b2', name: 'Sales Qualifier', triggerWords: ['pricing', 'demo', 'buy'], welcomeMessage: 'Interested in our pricing? Answer a few questions to get a quote.', fallbackMessage: 'Please reply with YES or NO.', active: false, businessHoursOnly: true },
];
