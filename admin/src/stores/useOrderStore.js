import { create } from 'zustand';

const useOrderStore = create((set, get) => ({
  orders: [
    {
      id: 'ORD001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      customerAddress: '123 Main St, City, State 12345',
      items: [
        { id: 1, name: 'Cotton T-Shirt', quantity: 2, price: 29.99, size: 'M', color: 'White' },
        { id: 2, name: 'Denim Jeans', quantity: 1, price: 59.99, size: '32', color: 'Blue' }
      ],
      subtotal: 119.97,
      shipping: 9.99,
      tax: 10.40,
      total: 140.36,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      orderDate: new Date('2024-01-15'),
      shippingDate: null,
      deliveryDate: null,
      trackingNumber: null,
      otp: null,
      otpVerified: false,
      notes: ''
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1234567891',
      customerAddress: '456 Oak Ave, City, State 12345',
      items: [
        { id: 3, name: 'Summer Dress', quantity: 1, price: 79.99, size: 'S', color: 'Red' }
      ],
      subtotal: 79.99,
      shipping: 9.99,
      tax: 7.20,
      total: 97.18,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'paypal',
      orderDate: new Date('2024-01-14'),
      shippingDate: new Date('2024-01-15'),
      deliveryDate: null,
      trackingNumber: 'TRK123456789',
      otp: '123456',
      otpVerified: false,
      notes: 'Customer requested express delivery'
    },
    {
      id: 'ORD003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      customerPhone: '+1234567892',
      customerAddress: '789 Pine St, City, State 12345',
      items: [
        { id: 1, name: 'Cotton T-Shirt', quantity: 3, price: 29.99, size: 'L', color: 'Black' }
      ],
      subtotal: 89.97,
      shipping: 9.99,
      tax: 8.00,
      total: 107.96,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      orderDate: new Date('2024-01-13'),
      shippingDate: new Date('2024-01-14'),
      deliveryDate: new Date('2024-01-16'),
      trackingNumber: 'TRK123456790',
      otp: '654321',
      otpVerified: true,
      notes: ''
    }
  ],
  isLoading: false,
  searchTerm: '',
  statusFilter: 'all',
  dateRange: 'all',

  // Actions
  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, status, ...(status === 'shipped' && { shippingDate: new Date() }) }
          : order
      )
    }));
  },

  generateOTP: (orderId) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, otp, otpVerified: false }
          : order
      )
    }));
    return otp;
  },

  verifyOTP: (orderId, enteredOTP) => {
    const { orders } = get();
    const order = orders.find(o => o.id === orderId);
    
    if (order && order.otp === enteredOTP) {
      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, otpVerified: true, status: 'delivered', deliveryDate: new Date() }
            : order
        )
      }));
      return true;
    }
    return false;
  },

  addOrderNote: (orderId, note) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, notes: note }
          : order
      )
    }));
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),

  // Getters
  getFilteredOrders: () => {
    const { orders, searchTerm, statusFilter, dateRange } = get();
    
    let filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const now = new Date();
        const orderDate = new Date(order.orderDate);
        
        switch (dateRange) {
          case 'today':
            matchesDate = orderDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            matchesDate = orderDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  },

  getOrderStats: () => {
    const { orders } = get();
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0
    };
  }
}));

export default useOrderStore; 