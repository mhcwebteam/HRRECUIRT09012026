import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const pdfGenerator = (
  data,
  salaryComponents,
  calculations,
  offerCTC,
  remarks
) => {
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica');

  // Add header with company logo space
  doc.setFillColor(16, 185, 129); // Emerald color
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Salary Stack Details', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Comprehensive Salary Breakdown Report', 105, 25, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  let yPosition = 45;

  // Employee Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const employeeInfo = [
    ['Name:', data?.NAME || 'N/A', 'Case ID:', data?.CASEID || 'N/A'],
    ['Job Title:', data?.JOB_TITLE || 'Full Stack Developer', 'Email:', data?.EMAIL || 'N/A'],
    ['Phone:', data?.PHONE_NUMBER || 'N/A', 'Location:', data?.PLANT || 'Head Office'],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: employeeInfo,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 30 },
      3: { cellWidth: 60 },
    },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Salary Breakdown Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Salary Breakdown', 14, yPosition);
  yPosition += 5;

  const salaryData = [
    // Section I - Compensation Components
    [
      { content: 'I. COMPENSATION COMPONENTS', colSpan: 3, styles: { fillColor: [209, 250, 229], fontStyle: 'bold', textColor: [5, 150, 105] } }
    ],
    ['Basic Salary', salaryComponents.basicSalary.toLocaleString('en-IN'), (salaryComponents.basicSalary * 12).toLocaleString('en-IN')],
    ['HRA', salaryComponents.hra.toLocaleString('en-IN'), (salaryComponents.hra * 12).toLocaleString('en-IN')],
    ['Conveyance', salaryComponents.conveyance.toLocaleString('en-IN'), (salaryComponents.conveyance * 12).toLocaleString('en-IN')],
    ['Education Allowance', salaryComponents.educationAllowance.toLocaleString('en-IN'), (salaryComponents.educationAllowance * 12).toLocaleString('en-IN')],
    ['Special Allowance', calculations.specialAllowance.toLocaleString('en-IN'), (calculations.specialAllowance * 12).toLocaleString('en-IN')],
    [
      { content: 'GROSS SALARY (sum of 1 to 5)', styles: { fontStyle: 'bold', fillColor: [236, 253, 245] } },
      { content: calculations.grossSalary.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [236, 253, 245] } },
      { content: calculations.grossSalaryAnnual.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [236, 253, 245] } }
    ],

    // Section II - Other Benefits
    [
      { content: 'II. OTHER BENEFITS', colSpan: 3, styles: { fillColor: [219, 234, 254], fontStyle: 'bold', textColor: [30, 64, 175] } }
    ],
    ['Bonus', calculations.bonus.toLocaleString('en-IN'), (calculations.bonus * 12).toLocaleString('en-IN')],
    ['Leave Travel Allowance', salaryComponents.leaveTravelAllowance.toLocaleString('en-IN'), (salaryComponents.leaveTravelAllowance * 12).toLocaleString('en-IN')],
    ['Meal Vouchers', salaryComponents.mealVouchers.toLocaleString('en-IN'), (salaryComponents.mealVouchers * 12).toLocaleString('en-IN')],
    ['Employer PF Contribution', salaryComponents.employerPFContribution.toLocaleString('en-IN'), (salaryComponents.employerPFContribution * 12).toLocaleString('en-IN')],
    ['Employer ESI Contribution', salaryComponents.employerESIContribution.toLocaleString('en-IN'), (salaryComponents.employerESIContribution * 12).toLocaleString('en-IN')],

    // Section III - Deductions
    [
      { content: 'III. DEDUCTIONS ON GROSS SALARY', colSpan: 3, styles: { fillColor: [254, 226, 226], fontStyle: 'bold', textColor: [153, 27, 27] } }
    ],
    ['Employee PF Contribution', salaryComponents.employeePFContribution.toLocaleString('en-IN'), (salaryComponents.employeePFContribution * 12).toLocaleString('en-IN')],
    ['Employee ESI Contribution', salaryComponents.employeeESIContribution.toLocaleString('en-IN'), (salaryComponents.employeeESIContribution * 12).toLocaleString('en-IN')],
    ['Professional Tax', salaryComponents.professionalTax.toLocaleString('en-IN'), (salaryComponents.professionalTax * 12).toLocaleString('en-IN')],
    [
      { content: 'TOTAL DEDUCTIONS (sum of 1 to 3)', styles: { fontStyle: 'bold', fillColor: [254, 242, 242] } },
      { content: calculations.totalDeductions.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [254, 242, 242] } },
      { content: (calculations.totalDeductions * 12).toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [254, 242, 242] } }
    ],

    // Section IV - Net Salary
    [
      { content: 'IV. NET SALARY', colSpan: 3, styles: { fillColor: [220, 252, 231], fontStyle: 'bold', textColor: [21, 128, 61] } }
    ],
    [
      { content: 'NET SALARY (I+II-III)', styles: { fontStyle: 'bold', fillColor: [240, 253, 244] } },
      { content: calculations.netSalaryMonthly.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [240, 253, 244] } },
      { content: calculations.netSalaryAnnual.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [240, 253, 244] } }
    ],

    // Section V - Fixed Cost
    [
      { content: 'V. FIXED COST TO COMPANY', colSpan: 3, styles: { fillColor: [243, 232, 255], fontStyle: 'bold', textColor: [107, 33, 168] } }
    ],
    [
      { content: 'FIXED COST TO COMPANY', styles: { fontStyle: 'bold', fillColor: [250, 245, 255] } },
      { content: (offerCTC / 12).toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [250, 245, 255] } },
      { content: offerCTC.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [250, 245, 255] } }
    ],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Compensation Components', 'Monthly - INR', 'Annual - INR']],
    body: salaryData,
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 45, halign: 'right' },
      2: { cellWidth: 45, halign: 'right' },
    },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Add Offer CTC Highlight Box
  doc.setFillColor(255, 237, 213);
  doc.setDrawColor(251, 146, 60);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, yPosition, 182, 15, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 88, 12);
  doc.text('Offer CTC (Per Annum):', 20, yPosition + 7);
  doc.text(`₹ ${offerCTC.toLocaleString('en-IN')}`, 176, yPosition + 7, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  yPosition += 20;

  // Add Remarks if any
  if (remarks && remarks.trim()) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Remarks / Notes:', 14, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitRemarks = doc.splitTextToSize(remarks, 180);
    doc.text(splitRemarks, 14, yPosition);
    yPosition += splitRemarks.length * 5;
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on: ${new Date().toLocaleString('en-IN')}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 14,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  return doc;
};

export const downloadSalaryPDF = (
  data,
  salaryComponents,
  calculations,
  offerCTC,
  remarks
) => {
  const doc = generateSalaryPDF(data, salaryComponents, calculations, offerCTC, remarks);
  const fileName = `Salary_Stack_${data?.NAME?.replace(/\s+/g, '_')}_${data?.CASEID || 'N/A'}.pdf`;
  doc.save(fileName);
};

export const previewSalaryPDF = (
  data,
  salaryComponents,
  calculations,
  offerCTC,
  remarks
) => {
  const doc = generateSalaryPDF(data, salaryComponents, calculations, offerCTC, remarks);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

// React Component for PDF Actions
const PDFActions = ({ data, salaryComponents, calculations, offerCTC, remarks }) => {
  const handleDownload = () => {
    downloadSalaryPDF(data, salaryComponents, calculations, offerCTC, remarks);
  };

  const handlePreview = () => {
    previewSalaryPDF(data, salaryComponents, calculations, offerCTC, remarks);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handleDownload}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PDF
      </button>
      
      <button
        onClick={handlePreview}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview PDF
      </button>
    </div>
  );
};

export default pdfGenerator;