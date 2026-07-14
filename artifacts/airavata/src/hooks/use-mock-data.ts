import { useState, useCallback } from 'react';
import { MOCK_CONTACTS, MOCK_GROUPS } from '../data/contacts';
import { MOCK_TEMPLATES } from '../data/templates';
import { MOCK_CAMPAIGNS, MOCK_CHART_DATA } from '../data/campaigns';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../data/chat';

export function useContacts() {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const addContact = useCallback((contact: any) => {
    setContacts(prev => [{ ...contact, id: Math.random().toString() }, ...prev]);
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  return { contacts, groups, addContact, deleteContact };
}

export function useTemplates() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  const addTemplate = useCallback((template: any) => {
    setTemplates(prev => [{ ...template, id: Math.random().toString() }, ...prev]);
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  return { templates, addTemplate, deleteTemplate };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [chartData] = useState(MOCK_CHART_DATA);

  const addCampaign = useCallback((campaign: any) => {
    setCampaigns(prev => [{ ...campaign, id: Math.random().toString() }, ...prev]);
  }, []);

  return { campaigns, chartData, addCampaign };
}

export function useChat() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, any>>(MOCK_MESSAGES);

  const addMessage = useCallback((convId: string, text: string) => {
    setMessages(prev => {
      const convMessages = prev[convId] || [];
      return {
        ...prev,
        [convId]: [
          ...convMessages, 
          { id: Math.random().toString(), sender: 'agent', text, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'sent' }
        ]
      };
    });
  }, []);

  return { conversations, messages, addMessage };
}
