import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'uploads', 'invoices');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Generates a PDF for the given Invoice document, saves it under
// uploads/invoices/<invoiceNumber>.pdf and returns the relative URL
// (served via the existing /uploads static route in server.js).
export function generateInvoicePdf(invoice) {
  return new Promise((resolve, reject) => {
    const fileName = `${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('DESIVDESI', { align: 'left' });
    doc.fontSize(10).fillColor('#555').text('Travel & Tourism Booking Platform', { align: 'left' });
    doc.moveDown(1.5);

    doc.fillColor('#000').fontSize(16).text(`Invoice ${invoice.invoiceNumber}`, { align: 'right' });
    doc.fontSize(10).fillColor('#555')
      .text(`Date: ${new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN')}`, { align: 'right' })
      .text(`Status: ${invoice.status}`, { align: 'right' });
    doc.moveDown(1);

    doc.fillColor('#000').fontSize(12).text('Bill To:');
    doc.fontSize(10).fillColor('#333')
      .text(invoice.customer?.name || '')
      .text(invoice.customer?.email || '')
      .text(invoice.customer?.mobile || '');
    doc.moveDown(1);

    // Line items table
    const tableTop = doc.y;
    doc.fontSize(10).fillColor('#000');
    doc.text('Description', 50, tableTop, { width: 250 });
    doc.text('Qty', 300, tableTop, { width: 50, align: 'right' });
    doc.text('Unit Price', 350, tableTop, { width: 90, align: 'right' });
    doc.text('Amount', 450, tableTop, { width: 90, align: 'right' });
    doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).strokeColor('#ccc').stroke();

    let y = tableTop + 22;
    (invoice.lineItems || []).forEach((item) => {
      doc.fontSize(10).fillColor('#333');
      doc.text(item.description, 50, y, { width: 250 });
      doc.text(String(item.quantity), 300, y, { width: 50, align: 'right' });
      doc.text(`Rs. ${item.unitPrice.toFixed(2)}`, 350, y, { width: 90, align: 'right' });
      doc.text(`Rs. ${item.amount.toFixed(2)}`, 450, y, { width: 90, align: 'right' });
      y += 20;
    });

    doc.moveTo(50, y + 5).lineTo(540, y + 5).strokeColor('#ccc').stroke();
    y += 15;

    const totalsRow = (label, value, bold = false) => {
      doc.fontSize(10).fillColor('#000');
      if (bold) doc.font('Helvetica-Bold');
      doc.text(label, 350, y, { width: 90, align: 'right' });
      doc.text(`Rs. ${Number(value).toFixed(2)}`, 450, y, { width: 90, align: 'right' });
      if (bold) doc.font('Helvetica');
      y += 18;
    };

    totalsRow('Subtotal', invoice.subtotal);
    if (invoice.discount) totalsRow('Discount', -invoice.discount);
    totalsRow(`Tax (${invoice.taxRate}%)`, invoice.taxAmount);
    totalsRow('Total', invoice.total, true);
    totalsRow('Amount Paid', invoice.amountPaid);
    totalsRow('Balance Due', invoice.balanceDue, true);

    doc.moveDown(3);
    doc.fontSize(9).fillColor('#888').text(
      'This is a system-generated invoice. For queries, contact support@desivdesi.com',
      50, doc.y, { width: 490, align: 'center' }
    );

    doc.end();
    stream.on('finish', () => resolve(`/uploads/invoices/${fileName}`));
    stream.on('error', reject);
  });
}
