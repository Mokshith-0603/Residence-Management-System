import jsPDF from "jspdf";
import "jspdf-autotable";

export function generateMaintenancePDF(bills) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Maintenance Bills", 14, 15);

  const rows = bills.map(b => [
    b.residentName,
    b.houseNo,
    b.month,
    b.billTitle,
    b.amount,
    b.status
  ]);

  doc.autoTable({
    head: [["Name", "House", "Month", "Title", "Amount", "Status"]],
    body: rows,
    startY: 25
  });

  doc.save("maintenance-bills.pdf");
}
