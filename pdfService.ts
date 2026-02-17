
import { jsPDF } from 'jspdf';
import { Order } from './types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 30;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 102);
  doc.text('MVS Aqua - Premium Aquarium Store', margin, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('15 Line, Upadhyaya Nagar, Tirupati, AP 517507', margin, y);
  doc.text('Contact: +91 94902 55775', margin, y + 5);

  y += 20;
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.text(`INVOICE: #${order.id.toUpperCase()}`, margin, y);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, doc.internal.pageSize.width - 60, y);

  // Customer Info
  y += 15;
  doc.setFontSize(12);
  doc.text('Bill To:', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(order.customerName, margin, y);
  y += 5;
  doc.text(order.address, margin, y);
  y += 5;
  doc.text(`Email: ${order.email || 'N/A'}`, margin, y);
  y += 5;
  doc.text(`Phone: ${order.phone}`, margin, y);

  // Table Header
  y += 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 170, 8, 'F');
  doc.text('Description', margin + 2, y + 6);
  doc.text('Qty', margin + 100, y + 6);
  doc.text('Price', margin + 120, y + 6);
  doc.text('Total', margin + 150, y + 6);

  // Items
  y += 14;
  order.items.forEach(item => {
    doc.text(item.name, margin + 2, y);
    doc.text(item.quantity.toString(), margin + 100, y);
    doc.text(`INR ${item.price.toLocaleString()}`, margin + 120, y);
    doc.text(`INR ${(item.price * item.quantity).toLocaleString()}`, margin + 150, y);
    y += 8;
  });

  // Summary
  y += 10;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin + 100, y, margin + 170, y);
  y += 10;
  
  doc.text(`Subtotal:`, margin + 120, y);
  doc.text(`INR ${order.subtotal?.toLocaleString() || (order.total / 1.18).toFixed(2)}`, margin + 150, y);
  y += 6;
  doc.text(`Tax (GST 18%):`, margin + 120, y);
  doc.text(`INR ${order.tax?.toLocaleString() || (order.total - (order.total / 1.18)).toFixed(2)}`, margin + 150, y);
  y += 6;
  doc.text(`Shipping:`, margin + 120, y);
  doc.text(`INR ${order.shipping?.toLocaleString() || '0'}`, margin + 150, y);
  y += 10;
  doc.setFontSize(14);
  doc.text(`Grand Total:`, margin + 120, y);
  doc.text(`INR ${order.total.toLocaleString()}`, margin + 150, y);

  // Footer / Policies
  y = doc.internal.pageSize.height - 50;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('TERMS & CONDITIONS:', margin, y);
  y += 5;
  doc.text('- No Cash on Delivery. Prepaid orders only.', margin, y);
  y += 4;
  doc.text('- Every MONDAY only we dispatch parcels.', margin, y);
  y += 4;
  doc.text('- No replacement without unboxing video.', margin, y);
  y += 4;
  doc.text('- In case of damages, 45% of amount will be refunded.', margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text('Thank you for choosing MVS Aqua!', margin, y);

  return doc;
};
