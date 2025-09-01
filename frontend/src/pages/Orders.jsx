import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import ReviewModal from "../components/ReviewModal";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ordersAPI } from "../services/api";
import toast from "react-hot-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Orders() {
  const { orders, setOrders, user } = useUserStore();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null, orderId: null });

  // Load orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await ordersAPI.getUserOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user, setOrders]);

  // PDF Invoice Generation Function
  const generateInvoicePDF = async (order) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Colors - Black and White Theme
      const blackColor = '#000000';
      const grayColor = '#666666';
      const lightGrayColor = '#f8f9fa';

      // Add Hash Header with Black Theme
      pdf.setFillColor(0, 0, 0); // Black background
      pdf.rect(0, 0, pageWidth, 70, 'F');
      
      // Hash Logo (text-based) - Larger and more prominent
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(42);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HASH', margin, 40);
      
      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('PREMIUM E-COMMERCE PLATFORM', margin, 52);
      
      // Invoice title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth - margin - 45, 40);
      
      // Company details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('support@hash.com | www.hash.com', margin, 62);

      // Invoice details section
      let yPos = 90;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Invoice Details', margin, yPos);
      
      // Add a line under the heading
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos + 2, margin + 60, yPos + 2);
      
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`Invoice #: ${order.orderNumber || order._id.slice(-8)}`, margin, yPos);
      pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, margin + 90, yPos);
      
      yPos += 8;
      pdf.text(`Order ID: ${order._id}`, margin, yPos);
      pdf.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, margin + 90, yPos);

      // Customer details
      yPos += 25;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Bill To:', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 30, yPos + 2);
      
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(order.shippingAddress?.name || 'N/A', margin, yPos);
      yPos += 7;
      pdf.text(order.user?.email || 'N/A', margin, yPos);
      yPos += 7;
      if (order.shippingAddress?.phone) {
        pdf.text(`Phone: ${order.shippingAddress.phone}`, margin, yPos);
        yPos += 7;
      }
      
      // Address
      if (order.shippingAddress) {
        const address = `${order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`;
        // Split long address into multiple lines
        const addressLines = pdf.splitTextToSize(address, 80);
        pdf.text(addressLines, margin, yPos);
        yPos += addressLines.length * 7;
      }

      // Payment details
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Payment Information:', margin + 110, yPos - 35);
      pdf.line(margin + 110, yPos - 33, margin + 170, yPos - 33);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`Method: ${order.paymentMethod || 'Online'}`, margin + 110, yPos - 23);
      pdf.text(`Transaction ID: ${order.paymentId || 'N/A'}`, margin + 110, yPos - 15);

      // Products table header
      yPos += 15;
      
      // Table header background
      pdf.setFillColor(248, 249, 250); // Light gray
      pdf.rect(margin, yPos, contentWidth, 12, 'F');
      
      // Table header border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPos, contentWidth, 12);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('Product', margin + 3, yPos + 8);
      pdf.text('Qty', margin + 100, yPos + 8);
      pdf.text('Price', margin + 125, yPos + 8);
      pdf.text('Total', margin + 155, yPos + 8);

      // Products table content
      yPos += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      order.items?.forEach((item, index) => {
        if (yPos > 250) { // Check if we need a new page
          pdf.addPage();
          yPos = 20;
        }
        
        const productName = item.product?.name || 'Unknown Product';
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = quantity * price;
        
        // Add row border
        pdf.setDrawColor(233, 236, 239);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPos + 5, margin + contentWidth, yPos + 5);
        
        pdf.text(productName.length > 45 ? productName.substring(0, 45) + '...' : productName, margin + 3, yPos + 3);
        pdf.text(quantity.toString(), margin + 100, yPos + 3);
        pdf.text(`₹${price.toFixed(2)}`, margin + 125, yPos + 3);
        pdf.text(`₹${total.toFixed(2)}`, margin + 155, yPos + 3);
        
        yPos += 10;
      });

      // Total section
      yPos += 15;
      
      // Summary box background
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin + 100, yPos - 5, contentWidth - 100, 45, 'F');
      
      // Summary box border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin + 100, yPos - 5, contentWidth - 100, 45);
      
      const subtotal = order.subtotal || 0;
      const shipping = order.shippingCost || 0;
      const total = order.totalAmount || 0;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('Subtotal:', margin + 105, yPos + 5);
      pdf.text(`₹${subtotal.toFixed(2)}`, margin + 155, yPos + 5);
      
      yPos += 8;
      pdf.text('Shipping:', margin + 105, yPos + 5);
      pdf.text(`₹${shipping.toFixed(2)}`, margin + 155, yPos + 5);
      
      yPos += 12;
      // Total line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.8);
      pdf.line(margin + 105, yPos, margin + contentWidth - 5, yPos);
      
      yPos += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('TOTAL:', margin + 105, yPos + 5);
      pdf.text(`₹${total.toFixed(2)}`, margin + 155, yPos + 5);

      // Footer
      yPos = pageHeight - 40;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Thank you for shopping with Hash!', margin, yPos);
      
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.text('For support, contact us at support@hash.com', margin, yPos);
      
      yPos += 6;
      pdf.text('© Hash - Premium E-commerce Platform', margin, yPos);

      // Save the PDF
      pdf.save(`Hash_Invoice_${order.orderNumber || order._id.slice(-8)}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate invoice');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-hash-green/10 text-hash-green border border-hash-green/20';
      case 'shipped': return 'bg-hash-blue/10 text-hash-blue border border-hash-blue/20';
      case 'processing': return 'bg-hash-orange/10 text-hash-orange border border-hash-orange/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hash-purple mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-foreground mb-4 font-space">No Orders Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white shadow-lg shadow-hash-purple/25">
              <a href="/shop">Start Shopping</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="container mx-auto py-6 sm:py-12 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 font-space">Order History</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your orders and view purchase history</p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id || order.id}
              variants={itemVariants}
              layout
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        Order #{order.orderNumber || order._id?.slice(-8)}
                      </h3>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:text-right sm:flex-col sm:items-end gap-2">
                      <div className="text-lg sm:text-xl font-bold text-hash-purple">
                        ₹{order.totalAmount?.toFixed(2)}
                      </div>
                      <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                        <span>{getStatusIcon(order.status)}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress */}
                  {order.status !== 'cancelled' && (
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                        <span>Order Progress</span>
                        <span>{order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : '33%'}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-gradient-to-r from-hash-purple to-hash-blue h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: order.status === 'delivered' ? '100%' : 
                                   order.status === 'shipped' ? '66%' : '33%' 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Ordered</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="text-xs sm:text-sm"
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        Reorder
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => generateInvoicePDF(order)}
                      className="text-xs sm:text-sm"
                    >
                      Download Invoice
                    </Button>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border"
                    >
                      <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-accent/50 rounded-xl border border-border">
                            <img
                              src={item.image || item.product?.images?.[0]?.url || item.product?.images?.[0] || `https://placehold.co/60x60/64748b/fff?text=Item`}
                              alt={item.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                e.target.src = `https://placehold.co/60x60/64748b/fff?text=Item`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-foreground text-sm sm:text-base truncate">{item.name}</h5>
                              <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              {item.size && <p className="text-xs sm:text-sm text-muted-foreground">Size: {item.size}</p>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-semibold text-hash-purple text-sm sm:text-base">₹{item.price?.toFixed(2)}</div>
                              {order.status === 'delivered' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-1 sm:mt-2 text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
                                  onClick={() => setReviewModal({ 
                                    isOpen: true, 
                                    product: item.product || item,
                                    orderId: order._id || order.id
                                  })}
                                >
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-accent/50 rounded-xl border border-border">
                        <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Delivery Address</h4>
                        <div className="text-muted-foreground text-sm sm:text-base">
                          <p>{order.shippingAddress?.line1}</p>
                          {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          {order.shippingAddress?.landmark && <p>Near: {order.shippingAddress.landmark}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary Stats */}
        <motion.div 
          className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <Card className="bg-card/80 backdrop-blur-sm border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-hash-purple mb-2">
                {orders.length}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-hash-blue mb-2">
                ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-hash-green mb-2">
                {orders.filter(order => order.status === 'delivered').length}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, product: null, orderId: null })}
        product={reviewModal.product}
        orderId={reviewModal.orderId}
        onReviewSubmitted={() => {
          toast.success("Thank you for your review!");
        }}
      />
    </div>
  );
} 