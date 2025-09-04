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

      // Colors - Clean Black and White
      const blackColor = [0, 0, 0];
      const grayColor = [128, 128, 128];
      const lightGrayColor = [245, 245, 245];

      // Header with HASH logo and branding
      pdf.setTextColor(...blackColor);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', margin, 35);

      // Hash Logo - Using actual logo images side by side with natural proportions
      const logoY = 15;
      
      try {
        // Load hash-logo.jpg
        const hashLogoResponse = await fetch('/hash-logo.jpg');
        const hashLogoBlob = await hashLogoResponse.blob();
        const hashLogoDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(hashLogoBlob);
        });
        
        // Load hash-logo-text.jpg
        const hashTextResponse = await fetch('/hash-logo-text.jpg');
        const hashTextBlob = await hashTextResponse.blob();
        const hashTextDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(hashTextBlob);
        });
        
        // Create temporary images to get natural dimensions
        const tempLogo = new Image();
        const tempText = new Image();
        
        await new Promise((resolve) => {
          tempLogo.onload = resolve;
          tempLogo.src = hashLogoDataUrl;
        });
        
        await new Promise((resolve) => {
          tempText.onload = resolve;
          tempText.src = hashTextDataUrl;
        });
        
        // Calculate natural proportions - target height of 20mm
        const targetHeight = 20;
        const logoNaturalWidth = (tempLogo.width / tempLogo.height) * targetHeight;
        const textNaturalWidth = (tempText.width / tempText.height) * targetHeight;
        
        // Position logos side by side with natural proportions
        const gap = 3; // 3mm gap between logos
        const totalLogoWidth = logoNaturalWidth + textNaturalWidth + gap;
        const logoStartX = pageWidth - margin - totalLogoWidth;
        
        pdf.addImage(hashLogoDataUrl, 'JPEG', logoStartX, logoY, logoNaturalWidth, targetHeight);
        pdf.addImage(hashTextDataUrl, 'JPEG', logoStartX + logoNaturalWidth + gap, logoY, textNaturalWidth, targetHeight);
        
      } catch (error) {
        console.error('Error loading logo images:', error);
        // Fallback to text-based logo
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('HASH', pageWidth - margin - 30, logoY + 15);
      }

      // Invoice details section - right aligned
      let rightSideY = 60;
      pdf.setFontSize(10);
      pdf.setTextColor(...grayColor);
      pdf.text('INVOICE NO:', pageWidth - margin - 60, rightSideY);
      pdf.setTextColor(...blackColor);
      pdf.text(order.orderNumber || order._id.slice(-8), pageWidth - margin - 20, rightSideY);
      
      rightSideY += 8;
      pdf.setTextColor(...grayColor);
      pdf.text('DATE:', pageWidth - margin - 60, rightSideY);
      pdf.setTextColor(...blackColor);
      pdf.text(new Date(order.createdAt).toLocaleDateString(), pageWidth - margin - 20, rightSideY);
      
      rightSideY += 8;
      pdf.setTextColor(...grayColor);
      pdf.text('DUE DATE:', pageWidth - margin - 60, rightSideY);
      pdf.setTextColor(...blackColor);
      pdf.text(new Date(order.createdAt).toLocaleDateString(), pageWidth - margin - 20, rightSideY);

      // Issued To section
      let leftSideY = 60;
      pdf.setFontSize(10);
      pdf.setTextColor(...grayColor);
      pdf.text('ISSUED TO:', margin, leftSideY);
      
      leftSideY += 10;
      pdf.setTextColor(...blackColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(order.shippingAddress?.name || order.user?.name || 'N/A', margin, leftSideY);
      
      leftSideY += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.user?.email || 'N/A', margin, leftSideY);
      
      leftSideY += 8;
      if (order.shippingAddress?.phone) {
        pdf.text(order.shippingAddress.phone, margin, leftSideY);
        leftSideY += 8;
      }
      
      // Address
      if (order.shippingAddress) {
        const addressParts = [
          order.shippingAddress.address,
          order.shippingAddress.city,
          order.shippingAddress.state,
          order.shippingAddress.zipCode
        ].filter(Boolean);
        
        addressParts.forEach(part => {
          const lines = pdf.splitTextToSize(part, 80);
          lines.forEach(line => {
            pdf.text(line, margin, leftSideY);
            leftSideY += 6;
          });
        });
      }

      // Payment Information section
      let paymentY = 110;
      pdf.setFontSize(10);
      pdf.setTextColor(...grayColor);
      pdf.text('PAYMENT INFO:', pageWidth - margin - 60, paymentY);
      
      paymentY += 10;
      pdf.setTextColor(...blackColor);
      pdf.text(`Method: ${order.paymentMethod || 'Online'}`, pageWidth - margin - 60, paymentY);
      
      paymentY += 8;
      pdf.text(`Transaction ID:`, pageWidth - margin - 60, paymentY);
      paymentY += 6;
      const transactionId = order.paymentId || order.razorpayPaymentId || 'N/A';
      const truncatedId = transactionId.length > 20 ? transactionId.substring(0, 20) + '...' : transactionId;
      pdf.setFontSize(8);
      pdf.text(truncatedId, pageWidth - margin - 60, paymentY);

      // Products table
      let tableY = 150;
      
      // Table header
      pdf.setFillColor(...lightGrayColor);
      pdf.rect(margin, tableY, contentWidth, 12, 'F');
      
      // Header borders
      pdf.setDrawColor(...grayColor);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, tableY, contentWidth, 12);
      
      // Column headers
      pdf.setTextColor(...blackColor);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('DESCRIPTION', margin + 3, tableY + 8);
      pdf.text('RATE', margin + 100, tableY + 8);
      pdf.text('QTY', margin + 130, tableY + 8);
      pdf.text('TOTAL', margin + 155, tableY + 8);

      // Table content
      tableY += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      
      let subtotalAmount = 0;
      order.items?.forEach((item, index) => {
        if (tableY > 250) {
          pdf.addPage();
          tableY = 20;
        }
        
        const productName = item.product?.name || item.name || 'Unknown Product';
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = quantity * price;
        subtotalAmount += total;
        
        // Row separator
        if (index > 0) {
          pdf.setDrawColor(230, 230, 230);
          pdf.setLineWidth(0.3);
          pdf.line(margin, tableY - 3, margin + contentWidth, tableY - 3);
        }
        
        pdf.setTextColor(...blackColor);
        const nameLines = pdf.splitTextToSize(productName, 85);
        pdf.text(nameLines[0], margin + 3, tableY + 5);
        
        pdf.text(`${price.toFixed(0)}`, margin + 100, tableY + 5);
        pdf.text(quantity.toString(), margin + 135, tableY + 5);
        pdf.text(`${total.toFixed(0)}`, margin + 160, tableY + 5);
        
        tableY += 15;
      });

      // Summary section with proper alignment and modern styling
      const summaryY = tableY + 30;
      const summaryStartX = margin + 100; // Start position for labels
      const summaryValueX = pageWidth - margin - 40; // Right aligned position for values
      
      // Draw summary box background
      pdf.setFillColor(248, 249, 250); // Light gray background
      pdf.rect(summaryStartX - 5, summaryY - 10, 85, 50, 'F');
      
      // Summary box border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(summaryStartX - 5, summaryY - 10, 85, 50);
      
      // Subtotal
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(...blackColor);
      pdf.text('SUBTOTAL', summaryStartX, summaryY);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹ ${subtotalAmount.toFixed(0)}`, summaryValueX, summaryY, { align: 'right' });
      
      // Gateway Charges
      pdf.setFont('helvetica', 'normal');
      const gatewayRate = 0.02; // 2%
      const gatewayCharges = subtotalAmount * gatewayRate;
      pdf.text('Gateway Charges (2%)', summaryStartX, summaryY + 12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹ ${gatewayCharges.toFixed(0)}`, summaryValueX, summaryY + 12, { align: 'right' });
      
      // Divider line
      pdf.setLineWidth(1);
      pdf.line(summaryStartX, summaryY + 20, summaryStartX + 75, summaryY + 20);
      
      // Total with enhanced styling
      const totalAmount = subtotalAmount + gatewayCharges;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...blackColor);
      pdf.text('TOTAL', summaryStartX, summaryY + 32);
      pdf.setFontSize(16);
      pdf.text(`₹ ${totalAmount.toFixed(0)}`, summaryValueX, summaryY + 32, { align: 'right' });

      // Footer
      const footerY = pageHeight - 40;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...grayColor);
      pdf.text('Thank you for your business!', margin, footerY);

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
            <Button asChild size="lg" className="bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg shadow-hash-purple/25">
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
              <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        Order #{order.orderNumber || order._id?.slice(-8)}
                      </h3>
                      <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:text-right sm:flex-col sm:items-end gap-2">
                      <div className="text-lg sm:text-xl font-bold text-foreground">
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
                          className="bg-hash-purple h-1.5 sm:h-2 rounded-full transition-all duration-500"
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
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border">
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
                              <div className="font-semibold text-foreground text-sm sm:text-base">₹{item.price?.toFixed(2)}</div>
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
                      
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border">
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
          <Card className="bg-card border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {orders.length}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
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