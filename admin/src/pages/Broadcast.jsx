import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Phone,
  Eye,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import useBroadcastStore from '../stores/useBroadcastStore';
import useCustomerStore from '../stores/useCustomerStore';
import { format } from 'date-fns';

const Broadcast = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    campaigns,
    templates,
    currentCampaign,
    isLoading,
    error,
    setCampaignField,
    resetCurrentCampaign,
    loadTemplate,
    saveCampaign,
    deleteCampaign,
    duplicateCampaign,
    initialize
  } = useBroadcastStore();

  // Initialize campaigns on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Get customer stats using the same pattern as other components
  const { getCustomerStats } = useCustomerStore();
  const customerStats = getCustomerStats();

  // Memoize campaign stats to prevent infinite loops
  const campaignStats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const totalSent = campaigns.reduce((sum, campaign) => sum + (campaign.sentCount || 0), 0);
    const totalOpened = campaigns.reduce((sum, campaign) => sum + (campaign.openedCount || 0), 0);
    const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    
    return {
      totalCampaigns,
      totalSent,
      avgOpenRate
    };
  }, [campaigns]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp': return <Phone className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCampaign = () => {
    resetCurrentCampaign();
    setShowCreateModal(true);
  };

  const handleSaveCampaign = async () => {
    const result = await saveCampaign(currentCampaign);
    if (result.success) {
      setShowCreateModal(false);
      resetCurrentCampaign();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Broadcast Center</h1>
          <p className="text-gray-600 mt-1">Create and manage your marketing campaigns</p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaignStats.totalCampaigns}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">{campaignStats.totalSent}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">{campaignStats.avgOpenRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <AnimatePresence>
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          {campaign.type.toUpperCase()} • {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    {campaign.type === 'email' && campaign.subject && (
                      <p className="font-medium text-gray-900 mb-1">Subject: {campaign.subject}</p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2">{campaign.content}</p>
                  </div>

                  {campaign.status === 'completed' && (
                    <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{campaign.sentCount}</p>
                        <p className="text-xs text-gray-500">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{campaign.deliveredCount}</p>
                        <p className="text-xs text-gray-500">Delivered</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{campaign.openedCount}</p>
                        <p className="text-xs text-gray-500">Opened</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{campaign.clickedCount}</p>
                        <p className="text-xs text-gray-500">Clicked</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Recipients: {campaign.recipients === 'all_customers' ? 'All Customers' : 
                                 campaign.recipients === 'vip_customers' ? 'VIP Customers' : 
                                 'Custom List'}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => duplicateCampaign(campaign.id)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(template.type)}
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {template.type.toUpperCase()}
                    </span>
                  </div>

                  {template.subject && (
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      Subject: {template.subject}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {template.content}
                  </p>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        loadTemplate(template.id);
                        setShowCreateModal(true);
                      }}
                      className="flex-1"
                    >
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Campaign Creation */}
      <Card className="p-6 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to reach your customers?</h3>
          <p className="text-gray-600 mb-4">Create a new campaign or choose from our templates</p>
          <div className="flex justify-center space-x-3">
            <Button onClick={handleCreateCampaign}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('templates')}>
              Browse Templates
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Broadcast;