import jsPDF from 'jspdf';

export interface ReceiptData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  projectDescription: string;
  paymentDate: Date;
  paymentMethod?: string;
}

export function generateReceiptPDF(data: ReceiptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Colors
  const primaryColor = [16, 185, 129]; // emerald-400
  const darkColor = [20, 20, 20]; // dark background
  const textColor = [255, 255, 255]; // white
  const mutedColor = [156, 163, 175]; // gray

  // Header with brand name
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor(...textColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Covion Builders', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Modern Construction Solutions', margin, 35);
  
  // Receipt title
  yPos = 80;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', margin, yPos);
  
  yPos += 15;
  
  // Receipt details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const details = [
    ['Invoice Number:', data.invoiceNumber],
    ['Date:', data.paymentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })],
    ['Time:', data.paymentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })],
    ['Customer Name:', data.customerName],
    ['Customer Email:', data.customerEmail],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 60, yPos);
    yPos += 8;
  });

  // Project details section
  yPos += 5;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Project Details', margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const projectLines = doc.splitTextToSize(
    data.projectDescription || 'N/A',
    pageWidth - 2 * margin
  );
  projectLines.forEach((line: string) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  // Payment summary
  yPos += 10;
  doc.setDrawColor(...primaryColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Payment Summary', margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Amount Paid:', margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`$${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin, yPos, { align: 'right' });
  
  if (data.paymentMethod) {
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Payment Method: ${data.paymentMethod}`, margin, yPos);
  }

  // Status
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Status: Paid', margin, yPos);

  // Footer
  yPos = pageHeight - 40;
  doc.setDrawColor(...mutedColor);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Covion Builders', margin, yPos);
  doc.text('covionbuilders@gmail.com', margin, yPos + 5);
  doc.text('(951) 723-4052', margin, yPos + 10);
  doc.text('Serving California', margin, yPos + 15);
  
  doc.text(
    `This is a computer-generated receipt. No signature required.`,
    pageWidth - margin,
    yPos + 15,
    { align: 'right' }
  );

  // Generate filename
  const filename = `Receipt_${data.invoiceNumber}_${data.paymentDate.toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

