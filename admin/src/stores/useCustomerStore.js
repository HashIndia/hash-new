import { create } from 'zustand';

const useCustomerStore = create((set, get) => ({
  customers: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State 12345',
      totalOrders: 5,
      totalSpent: 450.25,
      lastOrder: new Date('2024-01-15'),
      joinDate: new Date('2023-06-15'),
      status: 'active',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        whatsappNotifications: false
      },
      tags: ['VIP', 'Frequent Buyer']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City, State 12345',
      totalOrders: 3,
      totalSpent: 275.50,
      lastOrder: new Date('2024-01-14'),
      joinDate: new Date('2023-08-20'),
      status: 'active',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: true
      },
      tags: ['New Customer']
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      address: '789 Pine St, City, State 12345',
      totalOrders: 8,
      totalSpent: 725.80,
      lastOrder: new Date('2024-01-13'),
      joinDate: new Date('2023-03-10'),
      status: 'active',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        whatsappNotifications: true
      },
      tags: ['VIP', 'Loyal Customer']
    },
    {
      id: 4,
      name: 'Alice Wilson',
      email: 'alice@example.com',
      phone: '+1234567893',
      address: '321 Elm St, City, State 12345',
      totalOrders: 1,
      totalSpent: 89.99,
      lastOrder: new Date('2024-01-12'),
      joinDate: new Date('2024-01-12'),
      status: 'active',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: false
      },
      tags: ['New Customer']
    }
  ],
  isLoading: false,
  searchTerm: '',
  statusFilter: 'all',
  selectedCustomers: [],

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  selectCustomer: (customerId) => {
    set(state => ({
      selectedCustomers: state.selectedCustomers.includes(customerId)
        ? state.selectedCustomers.filter(id => id !== customerId)
        : [...state.selectedCustomers, customerId]
    }));
  },

  selectAllCustomers: () => {
    const { getFilteredCustomers } = get();
    const filteredCustomers = getFilteredCustomers();
    set({ selectedCustomers: filteredCustomers.map(c => c.id) });
  },

  deselectAllCustomers: () => {
    set({ selectedCustomers: [] });
  },

  updateCustomerPreferences: (customerId, preferences) => {
    set(state => ({
      customers: state.customers.map(customer =>
        customer.id === customerId
          ? { ...customer, preferences: { ...customer.preferences, ...preferences } }
          : customer
      )
    }));
  },

  addCustomerTag: (customerId, tag) => {
    set(state => ({
      customers: state.customers.map(customer =>
        customer.id === customerId
          ? { ...customer, tags: [...new Set([...customer.tags, tag])] }
          : customer
      )
    }));
  },

  removeCustomerTag: (customerId, tag) => {
    set(state => ({
      customers: state.customers.map(customer =>
        customer.id === customerId
          ? { ...customer, tags: customer.tags.filter(t => t !== tag) }
          : customer
      )
    }));
  },

  // Getters
  getFilteredCustomers: () => {
    const { customers, searchTerm, statusFilter } = get();
    
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder));
  },

  getSelectedCustomers: () => {
    const { customers, selectedCustomers } = get();
    return customers.filter(customer => selectedCustomers.includes(customer.id));
  },

  getCustomerStats: () => {
    const { customers } = get();
    
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      vip: customers.filter(c => c.tags.includes('VIP')).length,
      avgOrderValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + (c.totalSpent / Math.max(c.totalOrders, 1)), 0) / customers.length 
        : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    };
  }
}));

export default useCustomerStore; 