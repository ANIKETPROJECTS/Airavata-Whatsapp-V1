// This will later be fetched from MongoDB via our backend API

export const MOCK_TRANSACTIONS = [
  { id: 'tx1', date: '2024-05-12T14:30:00Z', customer: 'Priya Patel', phone: '+91 99887 76655', amount: '₹ 1,499', status: 'Completed' },
  { id: 'tx2', date: '2024-05-11T10:15:00Z', customer: 'Aarav Sharma', phone: '+91 98765 43210', amount: '₹ 450', status: 'Completed' },
  { id: 'tx3', date: '2024-05-10T16:45:00Z', customer: 'Rohan Gupta', phone: '+91 90123 45678', amount: '₹ 2,499', status: 'Failed' },
  { id: 'tx4', date: '2024-05-09T09:20:00Z', customer: 'Ananya Singh', phone: '+91 98765 11223', amount: '₹ 699', status: 'Refunded' },
];
