import { jsPDF } from "jspdf";

export type GovernmentOrderInput = {
  orderNumber: string;
  issueDate: string;
  title: string;
  department: string;
  startupName: string;
  description: string;
  targetMetrics: string;
  budgetAllocation: number;
  currentMilestone: number;
  totalMilestones: number;
};

const FONT = "times";
const INK: [number, number, number] = [22, 24, 32];
const MUTED: [number, number, number] = [110, 112, 118];
const LINE: [number, number, number] = [200, 112, 25];

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function center(doc: jsPDF, text: string, y: number, opts: { size: number; style?: "normal" | "bold" | "italic"; color?: [number, number, number] }) {
  doc.setFont(FONT, opts.style ?? "normal");
  doc.setFontSize(opts.size);
  doc.setTextColor(...(opts.color ?? INK));
  const width = doc.getTextWidth(text);
  doc.text(text, (doc.internal.pageSize.getWidth() - width) / 2, y);
}

function right(doc: jsPDF, text: string, y: number, size: number, color: [number, number, number] = MUTED) {
  doc.setFont(FONT, "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.text(text, doc.internal.pageSize.getWidth() - 18, y, { align: "right" });
}

export function buildGovernmentOrder(input: GovernmentOrderInput): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const margin = 18;
  const bodyWidth = width - margin * 2;

  // ---- Letterhead ----
  doc.setFillColor(200, 112, 25);
  doc.rect(0, 0, width, 7, "F");
  doc.setFillColor(20, 22, 30);
  doc.rect(0, 7, width, 2, "F");

  center(doc, "भारत सरकार · GOVERNMENT OF MAHARASHTRA", 20, { size: 13, style: "bold", color: INK });
  center(doc, `${input.department} · Finance & Procurement Wing`, 27, { size: 11, style: "italic", color: MUTED });
  center(doc, "STARTUP-FRIENDLY PUBLIC PROCUREMENT — PILOT SCALE-UP DECISION", 34, { size: 9, color: MUTED });

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.8);
  doc.line(margin, 39, width - margin, 39);

  // ---- Order metadata ----
  right(doc, `No. ${input.orderNumber}`, 46, 10, MUTED);
  right(doc, `Dated: ${input.issueDate}`, 52, 10, INK);

  doc.setFont(FONT, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("GOVERNMENT ORDER", margin, 62);
  doc.setFont(FONT, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.text("Scale-Up Clearance under the Outcome-Based Procurement Framework", margin, 68);

  // ---- Subject ----
  doc.setFont(FONT, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("Subject:", margin, 78);
  doc.setFont(FONT, "normal");
  doc.setTextColor(...MUTED);
  const subject = `Approval of scale-up of the pilot "${input.title}" pursuant to successful milestone completion and technical evaluation.`;
  const subjLines = doc.splitTextToSize(subject, bodyWidth - 22);
  doc.text(subjLines, margin + 22, 78);

  let y = 96;
  doc.setFont(FONT, "normal");
  doc.setFontSize(10);

  const para = (text: string, indent = 0, leading = 5.4) => {
    const lines = doc.splitTextToSize(text, bodyWidth - indent);
    doc.setTextColor(...INK);
    doc.text(lines, margin + indent, y);
    y += lines.length * leading;
  };
  const gap = (g = 3) => {
    y += g;
  };

  para("1. WHEREAS the State has, under its Startup-Friendly Public Procurement Policy, invited outcome-based solutions to the challenge titled above;", 4);
  gap();
  para("2. AND WHEREAS the undertaking \u201C" + input.startupName + "\u201D was shortlisted and a pilot project was commenced with a targeted outcome as specified below;", 4);
  gap();
  para("3. AND WHEREAS the pilot has completed " + input.currentMilestone + " of " + input.totalMilestones + " agreed milestones to the satisfaction of the appointed Technical Evaluator;", 4);
  gap();

  // ---- Approved order box ----
  doc.setFillColor(20, 22, 30);
  doc.roundedRect(margin, y, bodyWidth, 26, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT, "bold");
  doc.setFontSize(11);
  doc.text("ORDER", margin + 6, y + 9);
  doc.setFont(FONT, "normal");
  doc.setFontSize(9.5);
  const orderText = doc.splitTextToSize(
    "In exercise of the powers conferred, the State hereby approves the SCALE-UP of the above-referenced pilot into a full-fledged deployment, subject to the terms appended hereto.",
    bodyWidth - 12
  );
  doc.text(orderText, margin + 6, y + 16);
  y += 26 + 8;

  // ---- Criteria table ----
  doc.setFont(FONT, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("SANCTIONED PARAMETERS", margin, y);
  y += 5;

  const rows: [string, string][] = [
    ["Challenge Title", input.title],
    ["Administering Department", input.department],
    ["Serp Startup / Bidder", input.startupName],
    ["Prescribed Outcome / Target Metric", input.targetMetrics],
    ["Sanctioned Budget (Scale-Up)", currency(input.budgetAllocation)],
    ["Milestones Sanctioned", `${input.currentMilestone} of ${input.totalMilestones}`],
  ];

  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  let startY = y;
  doc.setFont(...([] as unknown as [string, string]));
  for (const [label, value] of rows) {
    doc.setDrawColor(220, 222, 226);
    doc.setLineWidth(0.2);
    doc.rect(margin, startY, bodyWidth, 9);
    doc.setTextColor(...MUTED);
    doc.setFont(FONT, "bold");
    doc.setFontSize(9);
    doc.text(label, margin + 4, startY + 5.5);
    doc.setTextColor(...INK);
    doc.setFontSize(9);
    const valLines = doc.splitTextToSize(value, bodyWidth - 90);
    doc.text(valLines, margin + 70, startY + 5.5);
    startY += 9;
  }
  y = startY + 10;

  // ---- Terms ----
  doc.setFont(FONT, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("TERMS OF SANCTION", margin, y);
  y += 5;
  doc.setFont(FONT, "normal");
  doc.setTextColor(...INK);
  const terms = [
    "i.  Observance of all applicable procurement, audit and reporting statutes of the State.",
    "ii. Key Performance Indicators to be reviewed quarterly by the Technical Evaluator.",
    "iii. Release of funds tied to verified milestone achievement and documented outcomes.",
  ];
  for (const term of terms) {
    doc.text(term, margin + 1, y);
    y += 5.4;
  }
  y += 6;

  // ---- Signature block ----
  doc.setFont(FONT, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("sd/-", width - 60, 235);
  doc.setFont(FONT, "bold");
  doc.text("Principal Secretary (Procurement)", width - 60, 241);
  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Department of " + (input.department.split("·")[0]?.trim() || "Procurement"), width - 60, 246);
  doc.text("Government of Maharashtra", width - 60, 251);

  // ---- Footer ----
  doc.setFillColor(200, 112, 25);
  doc.rect(0, 290, width, 7, "F");
  doc.setFillColor(20, 22, 30);
  doc.rect(0, 297, width, 2, "F");
  center(doc, "This is a system-generated order for demonstration purposes only.", 281, { size: 8, style: "italic", color: MUTED });

  return doc;
}

export function downloadGovernmentOrder(input: GovernmentOrderInput): void {
  const doc = buildGovernmentOrder(input);
  doc.save(`Government-Order-${input.orderNumber.replace(/\s+/g, "-")}.pdf`);
}
