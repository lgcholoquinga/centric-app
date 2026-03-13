import { Injectable } from '@angular/core';
import type { MovementReportRow } from '@shared/interfaces';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class PdfService {
  downloadMovementReport(
    rows: MovementReportRow[],
    subtitle = '',
    filename = 'movement-report.pdf'
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });

    const primaryColor: [number, number, number] = [23, 37, 84];
    const accentColor: [number, number, number] = [252, 211, 77];

    // ── Title ──────────────────────────────────────────────────────────────
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Movement Report', 14, 14);

    // ── Subtitle / filters ─────────────────────────────────────────────────
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    if (subtitle) {
      doc.text(subtitle, 14, 30);
    }

    const generated = `Generated: ${new Date().toLocaleString()}`;
    doc.text(generated, doc.internal.pageSize.getWidth() - 14, 30, { align: 'right' });

    // ── Table ──────────────────────────────────────────────────────────────
    autoTable(doc, {
      startY: 36,
      head: [['Date', 'Client', 'Account', 'Account type', 'Type', 'Amount', 'Balance']],
      body: rows.map(r => [
        r.date,
        r.client,
        r.accountNumber,
        r.accountType,
        r.type,
        `$${Math.abs(r.amount).toFixed(2)}`,
        `$${r.balance.toFixed(2)}`,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: accentColor,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
      didParseCell: data => {
        if (data.section === 'body' && data.column.index === 4) {
          const isDeposit = data.cell.raw === 'Deposit';
          data.cell.styles.textColor = isDeposit ? [22, 163, 74] : [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // ── Footer ─────────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${String(i)} of ${String(totalPages)}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: 'center' }
      );
    }

    doc.save(filename);
  }
}
