import { create } from 'zustand';

const useBroadcastStore = create((set, get) => ({
  campaigns: [
    {
      id: 1,
      name: 'Summer Sale 2024',
      type: 'email',
      subject: 'Don\'t miss our biggest summer sale!',
      content: 'Get up to 50% off on all summer collections. Limited time offer!',
      recipients: 'all_customers',
      customRecipients: [],
      scheduledDate: new Date('2024-06-01'),
      status: 'completed',
      sentCount: 1250,
      deliveredCount: 1200,
      openedCount: 480,
      clickedCount: 120,
      createdAt: new Date('2024-05-25'),
      sentAt: new Date('2024-06-01')
    },
    {
      id: 2,
      name: 'New Arrivals Alert',
      type: 'sms',
      subject: '',
      content: 'New arrivals just dropped! Check out our latest collection. Shop now: bit.ly/newarrivals',
      recipients: 'vip_customers',
      customRecipients: [],
      scheduledDate: new Date('2024-01-20'),
      status: 'sent',
      sentCount: 85,
      deliveredCount: 82,
      openedCount: 75,
      clickedCount: 25,
      createdAt: new Date('2024-01-18'),
      sentAt: new Date('2024-01-20')
    }
  ],
  templates: [
    {
      id: 1,
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to [Brand Name]!',
      content: 'Thank you for joining our community. Enjoy 10% off your first order with code WELCOME10.'
    },
    {
      id: 2,
      name: 'Order Confirmation',
      type: 'email',
      subject: 'Order Confirmed - [Order ID]',
      content: 'Your order has been confirmed and will be processed shortly. Track your order: [Tracking Link]'
    },
    {
      id: 3,
      name: 'Flash Sale SMS',
      type: 'sms',
      subject: '',
      content: '⚡ FLASH SALE: 24hrs only! [Discount]% off everything. Use code: [Code]. Shop: [Link]'
    }
  ],
  currentCampaign: {
    name: '',
    type: 'email',
    subject: '',
    content: '',
    recipients: 'all_customers',
    customRecipients: [],
    scheduledDate: null,
    sendNow: false
  },
  isLoading: false,

  // Actions
  setCampaignField: (field, value) => {
    set(state => ({
      currentCampaign: { ...state.currentCampaign, [field]: value }
    }));
  },

  resetCurrentCampaign: () => {
    set({
      currentCampaign: {
        name: '',
        type: 'email',
        subject: '',
        content: '',
        recipients: 'all_customers',
        customRecipients: [],
        scheduledDate: null,
        sendNow: false
      }
    });
  },

  loadTemplate: (templateId) => {
    const { templates } = get();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      set(state => ({
        currentCampaign: {
          ...state.currentCampaign,
          type: template.type,
          subject: template.subject,
          content: template.content
        }
      }));
    }
  },

  saveCampaign: async (campaign) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCampaign = {
        ...campaign,
        id: Date.now(),
        status: campaign.sendNow ? 'sending' : 'scheduled',
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        createdAt: new Date(),
        sentAt: campaign.sendNow ? new Date() : null
      };

      set(state => ({
        campaigns: [newCampaign, ...state.campaigns],
        isLoading: false
      }));

      return { success: true, campaignId: newCampaign.id };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteCampaign: (campaignId) => {
    set(state => ({
      campaigns: state.campaigns.filter(c => c.id !== campaignId)
    }));
  },

  duplicateCampaign: (campaignId) => {
    const { campaigns } = get();
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const duplicated = {
        ...campaign,
        id: Date.now(),
        name: `${campaign.name} (Copy)`,
        status: 'draft',
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        createdAt: new Date(),
        sentAt: null
      };
      
      set(state => ({
        campaigns: [duplicated, ...state.campaigns]
      }));
    }
  },

  // Template management
  saveTemplate: (template) => {
    const newTemplate = {
      ...template,
      id: Date.now()
    };
    
    set(state => ({
      templates: [...state.templates, newTemplate]
    }));
  },

  deleteTemplate: (templateId) => {
    set(state => ({
      templates: state.templates.filter(t => t.id !== templateId)
    }));
  },

  // Analytics
  getCampaignStats: () => {
    const { campaigns } = get();
    const completedCampaigns = campaigns.filter(c => c.status === 'completed');
    
    return {
      totalCampaigns: campaigns.length,
      totalSent: completedCampaigns.reduce((sum, c) => sum + c.sentCount, 0),
      totalDelivered: completedCampaigns.reduce((sum, c) => sum + c.deliveredCount, 0),
      avgOpenRate: completedCampaigns.length > 0 
        ? (completedCampaigns.reduce((sum, c) => sum + (c.openedCount / Math.max(c.deliveredCount, 1)), 0) / completedCampaigns.length) * 100
        : 0,
      avgClickRate: completedCampaigns.length > 0
        ? (completedCampaigns.reduce((sum, c) => sum + (c.clickedCount / Math.max(c.deliveredCount, 1)), 0) / completedCampaigns.length) * 100
        : 0
    };
  }
}));

export default useBroadcastStore; 