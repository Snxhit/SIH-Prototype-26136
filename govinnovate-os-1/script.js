// Active Template State
let currentTemplateKey = "problem_statement";

// Standard Legal & Operational Templates (Structured for clean UI cards in Emerald/Crisp White/Tech Orange)
const standardTemplates = {
  problem_statement: {
    title: "Outcome Problem Statement Formulation",
    filename: "Outcome_Problem_Statement.md",
    labels: ["Department Authority", "Target Measurable KPI", "Sandbox Trial Scope"],
    defaultValues: [
      "Water Supply & Sanitation Department, GoM",
      "Real-time acoustic detection of leaks >0.5 LPM with >95% accuracy in 48h",
      "5 km municipal distribution pipeline across 60 calendar days"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">1. Commissioning Public Authority</div>
        <p class="text-xs text-[#FFFFFF] font-semibold">${p1}</p>
        <span class="inline-block text-[10px] px-2 py-0.5 rounded bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30 font-medium">Public Infrastructure Sandbox</span>
      </div>

      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">2. Operational Problem Formulation</div>
        <p class="text-xs text-[#E2E8F0] leading-relaxed">Focuses on measurable functional technological benchmarks rather than rigid brand/hardware specifications.</p>
      </div>

      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">3. Mandatory Performance Target (Outcome KPI)</div>
        <p class="text-xs font-semibold text-[#FFFFFF]">"${p2}"</p>
        <p class="text-[11px] text-[#E2E8F0]">Verification Horizon: Performance logged through real-time edge telemetry and independent evaluation.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div class="p-3 bg-[#0B3D26] rounded-xl border border-[#166534]">
          <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">4. Controlled Sandbox</div>
          <p class="text-xs text-[#E2E8F0] mt-0.5">${p3}</p>
        </div>
        <div class="p-3 bg-[#0B3D26] rounded-xl border border-[#166534]">
          <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">5. Statutory Waivers</div>
          <p class="text-xs text-[#E2E8F0] mt-0.5">GFR 173(i) Turnover Exemption & Rule 170(i) EMD Waiver active[cite: 1, 2].</p>
        </div>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `STANDARD CHALLENGE OUTCOME FORMULATION\nAuthority: ${p1}\nKPI: ${p2}\nScope: ${p3}\nStatutory: GFR 173(i) & 170(i) Exemptions`
  },

  evaluation_criteria: {
    title: "QCBS Evaluation Rubric",
    filename: "QCBS_Rubric.md",
    labels: ["Minimum Scale Threshold", "Evaluation Model", "TRL Benchmark"],
    defaultValues: [
      "85.0% Weighted Aggregate Score",
      "QCBS 80:20 (Technical Merit to Commercial Viability)",
      "TRL 6 to TRL 8 (Validated Prototype)"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Evaluation Methodology</div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-[#FFFFFF]">${p2}</span>
          <span class="text-[10px] px-2 py-0.5 bg-[#FF6B35]/15 text-[#FF6B35] rounded border border-[#FF6B35]/30 font-medium">${p3}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div class="p-2.5 bg-[#0B3D26] rounded-xl border border-[#166534] text-center">
          <span class="text-[10px] text-[#E2E8F0] block font-bold">Pillar 1: Technical Merit</span>
          <span class="text-xs font-bold text-[#FF6B35]">30% Weight</span>
        </div>
        <div class="p-2.5 bg-[#0B3D26] rounded-xl border border-[#166534] text-center">
          <span class="text-[10px] text-[#E2E8F0] block font-bold">Pillar 2: KPI Precision</span>
          <span class="text-xs font-bold text-[#FF6B35]">25% Weight</span>
        </div>
        <div class="p-2.5 bg-[#0B3D26] rounded-xl border border-[#166534] text-center">
          <span class="text-[10px] text-[#E2E8F0] block font-bold">Pillar 3: Data Security</span>
          <span class="text-xs font-bold text-[#FF6B35]">20% Weight</span>
        </div>
        <div class="p-2.5 bg-[#0B3D26] rounded-xl border border-[#166534] text-center">
          <span class="text-[10px] text-[#E2E8F0] block font-bold">Pillar 4: Scalability</span>
          <span class="text-xs font-bold text-[#FF6B35]">15% Weight</span>
        </div>
        <div class="p-2.5 bg-[#0B3D26] rounded-xl border border-[#166534] text-center col-span-2 sm:col-span-2">
          <span class="text-[10px] text-[#E2E8F0] block font-bold">Pillar 5: DPIIT Exemption Gate</span>
          <span class="text-xs font-bold text-[#FFFFFF]">10% Weight (100% Passed)</span>
        </div>
      </div>

      <div class="p-3 bg-[#FF6B35]/15 rounded-xl border border-[#FF6B35]/30 flex items-center justify-between">
        <span class="text-xs text-[#FFFFFF] font-semibold">Scale-Up Benchmark</span>
        <span class="text-xs font-mono font-bold text-[#FF6B35]">&ge; ${p1} (Direct GeM Conversion)</span>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `QCBS EVALUATION RUBRIC\nModel: ${p2}\nReadiness: ${p3}\nQualifying: >= ${p1}`
  },

  pilot_agreement: {
    title: "Sandbox Pilot Agreement",
    filename: "Sandbox_Agreement.md",
    labels: ["Department Authority", "Startup Entity Name", "Escrow Allocation"],
    defaultValues: [
      "Department of Urban Development, Government of Maharashtra",
      "HydroSense DeepTech Innovations Private Limited",
      "₹38,00,000 locked in Escrow Vault"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Parties & Authority</div>
        <p class="text-xs text-[#E2E8F0]"><strong>Authority:</strong> ${p1}</p>
        <p class="text-xs text-[#E2E8F0]"><strong>Startup:</strong> ${p2}</p>
      </div>
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">Escrow Commitment</div>
        <p class="text-xs font-mono font-bold text-[#FF6B35]">${p3}</p>
        <p class="text-[11px] text-[#E2E8F0]">Guaranteed tranche disbursements within 48 hours of milestone telemetry verification[cite: 1, 2].</p>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `SANDBOX PILOT AGREEMENT\nDepartment: ${p1}\nStartup: ${p2}\nEscrow: ${p3}`
  },

  ip_data_clause: {
    title: "IP Retainment & Data Clause",
    filename: "IP_Data_Retainment.md",
    labels: ["Startup Entity Name", "Licensed Government Usage", "Cloud Region"],
    defaultValues: [
      "HydroSense DeepTech Innovations Private Limited",
      "Internal Administrative License",
      "MeitY-Empanelled Data Centers (India Region)"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">100% IP Retainment</div>
        <p class="text-xs text-[#E2E8F0]">All neural network weights, algorithms, and source code developed by <strong class="text-[#FFFFFF]">${p1}</strong> remain exclusive startup property[cite: 1, 2].</p>
      </div>
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">Data Sovereignty</div>
        <p class="text-xs text-[#E2E8F0]">Internal scope: <strong class="text-[#FFFFFF]">${p2}</strong>.</p>
        <p class="text-[11px] text-[#E2E8F0]">All municipal telemetry hosted in <strong class="text-[#FFFFFF]">${p3}</strong>.</p>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `IP & DATA PROTECTION\nStartup: ${p1}\nScope: ${p2}\nLocation: ${p3}`
  },

  cybersecurity_risk: {
    title: "Cybersecurity & Risk Protocols",
    filename: "Cybersecurity_Risk.md",
    labels: ["Risk Stop-Loss Limit", "CERT-In Audit Standard", "Rollback Mechanism"],
    defaultValues: [
      "Max 5.0% System Anomaly Deviation",
      "CERT-In Empanelled Security Audit",
      "Immediate Automated Failover to Manual Operations"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Risk Stop-Loss Limit</div>
        <p class="text-xs text-[#E2E8F0]">Tolerance Ceiling: <strong class="text-[#FFFFFF]">${p1}</strong></p>
      </div>
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">Audit & Rollback Triggers</div>
        <p class="text-xs text-[#E2E8F0]">Certification: <strong class="text-[#FFFFFF]">${p2}</strong></p>
        <p class="text-xs text-[#E2E8F0]">Emergency Trigger: <strong class="text-[#FFFFFF]">${p3}</strong></p>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `CYBERSECURITY PROTOCOLS\nStopLoss: ${p1}\nStandard: ${p2}\nFailover: ${p3}`
  },

  procurement_scaleup: {
    title: "Direct GeM Scale-Up Pathway",
    filename: "GeM_Scaleup_Conversion.md",
    labels: ["Qualifying Audit Score", "Scale Horizon", "Procurement Mode"],
    defaultValues: [
      "Score >= 85.0% on QCBS Rubric",
      "State-wide rollout across Urban Local Bodies (ULBs)",
      "Direct Purchase under GeM Innovation Category"
    ],
    renderCardHtml: (p1, p2, p3) => `
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Scale-Up Conversion Authorization</div>
        <p class="text-xs text-[#E2E8F0]">Benchmark achieved: <strong class="text-[#FFFFFF]">${p1}</strong></p>
      </div>
      <div class="p-3.5 bg-[#0B3D26] rounded-xl border border-[#166534] space-y-1">
        <div class="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-wider">Procurement Pathway</div>
        <p class="text-xs text-[#E2E8F0]">Horizon: <strong class="text-[#FFFFFF]">${p2}</strong></p>
        <p class="text-xs text-[#E2E8F0]">Mode: <strong class="text-[#FFFFFF]">${p3}</strong></p>
      </div>
    `,
    generateRaw: (p1, p2, p3) => `SCALE-UP CONVERSION\nScore: ${p1}\nHorizon: ${p2}\nMode: ${p3}`
  }
};

// Mock Database
let challenges = [
  {
    id: "CH-MH-01",
    dept: "Water Supply & Sanitation Department",
    title: "Acoustic Edge AI for Underground Pipeline Leakage",
    target: "Identify micro-leaks >0.5 LPM with >95% spatial accuracy under 48 hours",
    desc: "Detect and localise micro-leaks in municipal networks using acoustic telemetry and ML anomaly detection.",
    budget: 3800000,
    published: "2026-08-24",
    applied: true
  },
  {
    id: "CH-MH-02",
    dept: "Department of Agriculture & PMFBY Cell",
    title: "Hyperspectral Drone Crop Damage Assessment",
    target: "Reduce loss assessment turnaround from 21 days to 48 hours with 92% ground match",
    desc: "Automate crop claim assessment turnaround using multispectral drone imagery.",
    budget: 4200000,
    published: "2026-08-26",
    applied: false
  }
];

let pilots = [
  {
    id: "PL-8821",
    startup: "HydroSense DeepTech",
    dpiit: "DIPP-98214",
    title: "Acoustic IoT Leak Detection",
    environment: "Geofenced 5km Urban Zone",
    dataPrivacy: "Anonymized PII + Edge Gateway",
    stopLoss: "Max 5.0% False Positive",
    ipRetainment: "100% Retained by Startup",
    milestoneCurrent: 2,
    totalMilestones: 4,
    tranche: 1250000,
    coverage: 68,
    status: "Active Sandbox",
    isApproved: false,
    auditScore: 0
  },
  {
    id: "PL-8822",
    startup: "AgroVision AI Labs",
    dpiit: "DIPP-84192",
    title: "Hyperspectral Drone Assessment",
    environment: "Synthetic Test Farm Flight Grid",
    dataPrivacy: "Air-Gapped Edge Processing",
    stopLoss: "Max 2.0% Anomaly Deviation",
    ipRetainment: "100% Retained by Startup",
    milestoneCurrent: 4,
    totalMilestones: 4,
    tranche: 2500000,
    coverage: 100,
    status: "Scale-Up Ready",
    isApproved: true,
    auditScore: 91.0
  }
];

let transactions = [
  {
    id: "TX-ESCROW-001",
    startup: "AgroVision AI Labs",
    amount: 2500000,
    timestamp: "2026-08-28 11:15 IST",
    txHash: "0x1b4c...98e4"
  }
];

let activePilotIndexForAudit = null;

function formatINR(val) {
  return "₹" + Number(val).toLocaleString("en-IN");
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  selectTemplate("problem_statement");
  renderAllViews();
});

// View Router
function switchView(viewName) {
  const views = ["overview", "templates", "sandbox", "evaluator", "department", "startup"];
  views.forEach((v) => {
    const isCurrent = v === viewName;
    const navBtn = document.getElementById(`nav-${v}`);
    const viewContainer = document.getElementById(`view-${v}`);

    if (navBtn) {
      navBtn.className = isCurrent ? "sidebar-nav-item active-sidebar-tab" : "sidebar-nav-item";
    }
    if (viewContainer) {
      viewContainer.classList.toggle("hidden", !isCurrent);
    }
  });

  if (window.lucide) lucide.createIcons();
}

function renderAllViews() {
  renderSandboxTable();
  renderEvaluatorTable();
  renderStartupHub();
  renderDepartmentPanel();
  renderEscrowDrawer();
  renderOverview();
  if (window.lucide) lucide.createIcons();
}

function renderOverview() {
  const disbursed = transactions.reduce((a, t) => a + t.amount, 0);
  const escrowBal = pilots.reduce((a, p) => a + p.tranche, 0) + 23500000;
  const approved = pilots.filter((p) => p.isApproved).length;

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText("ov-active-pilots", pilots.length);
  setText("ov-approved", approved);
  setText("ov-escrow", "₹" + (escrowBal / 10000000).toFixed(2) + " Cr");
  setText("ov-disbursed", formatINR(disbursed));
  setText("ov-challenges", challenges.length);

  const wrap = document.getElementById("ov-pilot-progress");
  if (wrap) {
    wrap.innerHTML = pilots.map((p) => `
      <div class="p-3.5 bg-[#0F5132] rounded-2xl border border-[#166534]">
        <div class="flex justify-between items-center text-xs font-bold mb-1.5">
          <span class="text-[#FFFFFF]">${p.startup}</span>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${p.isApproved ? 'bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30' : 'bg-[#166534] text-[#E2E8F0] border border-[#1E7E4A]'}">${p.isApproved ? 'Approved' : 'Active'}</span>
        </div>
        <div class="w-full bg-[#0B3D26] h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#FF6B35] to-[#FFA07A] h-full rounded-full" style="width: ${(p.milestoneCurrent / p.totalMilestones) * 100}%"></div>
        </div>
        <div class="text-[10px] text-[#E2E8F0] font-mono mt-1.5">Milestone ${p.milestoneCurrent}/${p.totalMilestones} · ${formatINR(p.tranche)}</div>
      </div>
    `).join("");
  }
}

function selectTemplate(key) {
  currentTemplateKey = key;
  const tpl = standardTemplates[key];

  document.querySelectorAll(".template-card").forEach((card) => card.classList.remove("active-card"));
  const activeCard = document.getElementById(`tpl-card-${key}`);
  if (activeCard) activeCard.classList.add("active-card");

  document.getElementById("editor-file-title").textContent = tpl.title;
  document.getElementById("param-label-1").textContent = tpl.labels[0];
  document.getElementById("param-label-2").textContent = tpl.labels[1];
  document.getElementById("param-label-3").textContent = tpl.labels[2];

  document.getElementById("param-input-1").value = tpl.defaultValues[0];
  document.getElementById("param-input-2").value = tpl.defaultValues[1];
  document.getElementById("param-input-3").value = tpl.defaultValues[2];

  renderTemplateText();
}

function renderTemplateText() {
  const tpl = standardTemplates[currentTemplateKey];
  const p1 = document.getElementById("param-input-1").value;
  const p2 = document.getElementById("param-input-2").value;
  const p3 = document.getElementById("param-input-3").value;
  document.getElementById("template-card-container").innerHTML = tpl.renderCardHtml(p1, p2, p3);
}

function copyCurrentDocument() {
  const tpl = standardTemplates[currentTemplateKey];
  const p1 = document.getElementById("param-input-1").value;
  const p2 = document.getElementById("param-input-2").value;
  const p3 = document.getElementById("param-input-3").value;
  navigator.clipboard.writeText(tpl.generateRaw(p1, p2, p3)).then(() => {
    const btnText = document.getElementById("copy-btn-text");
    btnText.textContent = "✓ Copied!";
    setTimeout(() => { btnText.textContent = "Copy Text"; }, 2000);
  });
}

function downloadAsDocument() {
  const tpl = standardTemplates[currentTemplateKey];
  const p1 = document.getElementById("param-input-1").value;
  const p2 = document.getElementById("param-input-2").value;
  const p3 = document.getElementById("param-input-3").value;
  const blob = new Blob([tpl.generateRaw(p1, p2, p3)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = tpl.filename;
  a.click();
  URL.revokeObjectURL(url);
}

function applyActiveTemplateToDepartment() {
  const p1 = document.getElementById("param-input-1").value;
  const p2 = document.getElementById("param-input-2").value;
  document.getElementById("post-dept").value = p1;
  document.getElementById("post-kpi").value = p2;
  document.getElementById("post-title").value = `Innovation Challenge: ${p2.slice(0, 45)}...`;
  switchView("department");
  alert("✓ Template parameters populated into Department Formulation form!");
}

function renderSandboxTable() {
  const tbody = document.getElementById("sandbox-table-body");
  if (!tbody) return;

  tbody.innerHTML = pilots.map((p) => `
    <tr class="hover:bg-[#166534]/50 transition">
      <td class="py-3.5 px-5">
        <div class="font-bold text-[#FFFFFF]">${p.startup}</div>
        <div class="text-[10px] text-[#E2E8F0] font-mono">${p.id} · ${p.dpiit}</div>
      </td>
      <td class="py-3.5 px-5 text-[#FFFFFF] font-medium">${p.environment}</td>
      <td class="py-3.5 px-5 text-[#E2E8F0]">${p.dataPrivacy}</td>
      <td class="py-3.5 px-5 text-[#FF6B35] font-mono font-medium">${p.stopLoss}</td>
      <td class="py-3.5 px-5 text-[#FFFFFF] font-bold">${p.ipRetainment}</td>
      <td class="py-3.5 px-5 text-right">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
          Sandbox Active
        </span>
      </td>
    </tr>
  `).join("");
}

function renderEvaluatorTable() {
  const tbody = document.getElementById("evaluator-table-body");
  if (!tbody) return;

  tbody.innerHTML = pilots.map((p, idx) => `
    <tr class="hover:bg-[#166534]/50 transition">
      <td class="py-3.5 px-5">
        <div class="font-bold text-[#FFFFFF]">${p.startup}</div>
        <div class="text-[10px] text-[#E2E8F0] font-mono">${p.dpiit}</div>
      </td>
      <td class="py-3.5 px-5 text-[#FFFFFF] font-medium">${p.title}</td>
      <td class="py-3.5 px-5 text-[#E2E8F0] font-mono">M${p.milestoneCurrent}/${p.totalMilestones}</td>
      <td class="py-3.5 px-5 font-bold font-mono text-[#FFFFFF]">${p.auditScore > 0 ? p.auditScore + "%" : "Pending"}</td>
      <td class="py-3.5 px-5">
        ${p.isApproved
          ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40">GeM Scale Ready</span>`
          : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#166534] text-[#E2E8F0] border border-[#1E7E4A]">Evaluation Active</span>`
        }
      </td>
      <td class="py-3.5 px-5 text-right">
        ${p.isApproved
          ? `<button class="text-[#FF6B35] bg-[#FF6B35]/15 border border-[#FF6B35]/30 px-3 py-1.5 rounded-xl font-bold text-xs">✓ Scale Approved</button>`
          : `<button onclick="openEvalModal(${idx})" class="btn-primary">Audit & Evaluate</button>`
        }
      </td>
    </tr>
  `).join("");
}

function renderStartupHub() {
  const chalList = document.getElementById("startup-challenges-list");
  if (chalList) {
    chalList.innerHTML = challenges.map((c, idx) => `
      <div class="bg-[#0B3D26] p-5 rounded-3xl border border-[#166534] shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div class="text-[10px] text-[#FF6B35] font-mono font-bold uppercase tracking-wider mb-1">${c.dept}</div>
          <h4 class="text-sm font-bold text-[#FFFFFF] mb-2">${c.title}</h4>
          <p class="text-xs text-[#E2E8F0] mb-3 leading-relaxed">${c.desc}</p>
          <div class="bg-[#0F5132] p-3 rounded-2xl border border-[#166534] text-xs text-[#FFFFFF] mb-2">
            🎯 <span class="font-bold text-[#FFFFFF]">Target:</span> ${c.target}
          </div>
          <div class="text-xs text-[#E2E8F0]">
            Escrow Allocation: <strong class="text-[#FF6B35] font-mono">${formatINR(c.budget)}</strong>
          </div>
        </div>
        <button onclick="applyToChallenge(${idx})" class="btn-primary w-full justify-center">
          ${c.applied ? "✓ Applied (GFR 173(i) Exempted)" : "One-Click Apply"}
        </button>
      </div>
    `).join("");
  }

  const stepperContainer = document.getElementById("startup-stepper-container");
  if (stepperContainer) {
    stepperContainer.innerHTML = pilots.map((p, pIdx) => `
      <div class="bg-[#0B3D26] p-5 rounded-3xl border border-[#166534] shadow-xl space-y-4">
        <div class="flex justify-between items-center border-b border-[#166534] pb-3">
          <div>
            <div class="text-sm font-bold text-[#FFFFFF]">${p.title}</div>
            <div class="text-[10px] text-[#E2E8F0] font-mono">${p.startup}</div>
          </div>
          <span class="text-[10px] font-mono font-bold text-[#FF6B35] bg-[#FF6B35]/15 px-3 py-1 rounded-full border border-[#FF6B35]/30">
            Tranche: ${formatINR(p.tranche)}
          </span>
        </div>
        <div class="flex justify-end">
          <button onclick="submitMilestoneTelemetry(${pIdx})" class="btn-primary text-xs">
            Submit Milestone Evidence Feed
          </button>
        </div>
      </div>
    `).join("");
  }
}

function submitMilestoneTelemetry(pIdx) {
  alert(`✓ Telemetry Evidence Feed submitted for ${pilots[pIdx].startup}!\n\nEvaluator Committee notified for scoring.`);
  switchView("evaluator");
}

function renderDepartmentPanel() {
  const tbody = document.getElementById("dept-table-body");
  if (tbody) {
    tbody.innerHTML = challenges.map((c) => `
      <tr class="hover:bg-[#166534]/50 transition">
        <td class="py-3 px-5 font-bold text-[#FFFFFF] text-xs">${c.title}</td>
        <td class="py-3 px-5 text-[#FFFFFF] text-xs">${c.dept}</td>
        <td class="py-3 px-5 text-[#E2E8F0] text-xs">${c.target}</td>
        <td class="py-3 px-5 font-bold text-[#FF6B35] text-xs font-mono">${formatINR(c.budget)}</td>
        <td class="py-3 px-5 text-[#E2E8F0]/60 text-right text-[11px] font-mono">${c.published}</td>
      </tr>
    `).join("");
  }
}

function renderEscrowDrawer() {
  const list = document.getElementById("escrow-tx-list");
  if (!list) return;

  list.innerHTML = transactions.map((tx) => `
    <div class="p-3.5 bg-[#0F5132] rounded-2xl border border-[#166534] text-xs flex justify-between items-center">
      <div>
        <div class="font-bold text-[#FFFFFF]">${tx.startup}</div>
        <div class="text-[10px] text-[#E2E8F0] font-mono">${tx.timestamp}</div>
      </div>
      <div class="text-right">
        <div class="font-bold text-[#FF6B35] font-mono">+${formatINR(tx.amount)}</div>
        <span class="text-[10px] font-mono text-[#E2E8F0]">Disbursed</span>
      </div>
    </div>
  `).join("");
}

function toggleEscrowDrawer(open) {
  const drawer = document.getElementById("escrowDrawer");
  if (drawer) {
    drawer.classList.toggle("hidden", !open);
    drawer.classList.toggle("flex", open);
  }
}

function openEvalModal(idx) {
  activePilotIndexForAudit = idx;
  const modal = document.getElementById("evalModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeEvalModal() {
  const modal = document.getElementById("evalModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function updateModalRubricTotal() {
  const v1 = Number(document.getElementById("modal-range-1").value);
  const v2 = Number(document.getElementById("modal-range-2").value);
  const v3 = Number(document.getElementById("modal-range-3").value);
  const v4 = Number(document.getElementById("modal-range-4").value);
  const v5 = 100;

  document.getElementById("score-val-1").textContent = `${v1}%`;
  document.getElementById("score-val-2").textContent = `${v2}%`;
  document.getElementById("score-val-3").textContent = `${v3}%`;
  document.getElementById("score-val-4").textContent = `${v4}%`;

  const total = (v1 * 0.30 + v2 * 0.25 + v3 * 0.20 + v4 * 0.15 + v5 * 0.10).toFixed(1);
  document.getElementById("modal-rubric-total").textContent = `${total}%`;
}

function confirmApproval() {
  if (activePilotIndexForAudit !== null) {
    const p = pilots[activePilotIndexForAudit];
    p.isApproved = true;
    p.status = "Scale-Up Ready";
    p.coverage = 100;
    p.milestoneCurrent = 4;
    p.auditScore = Number(document.getElementById("modal-rubric-total").textContent.replace("%", ""));

    transactions.unshift({
      id: `TX-ESCROW-00${transactions.length + 1}`,
      startup: p.startup,
      amount: p.tranche,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
      txHash: `0x${Math.random().toString(16).slice(2, 8)}`
    });

    closeEvalModal();
    renderAllViews();
    alert(`✓ Evaluation Completed!\nScore: ${p.auditScore}%\nReleased ${formatINR(p.tranche)} from Smart Escrow to ${p.startup}.`);
  }
}

function applyToChallenge(idx) {
  challenges[idx].applied = true;
  alert(`✓ Proposal Fast-Track Submitted for ${challenges[idx].title}!`);
  renderAllViews();
}

function handlePostChallenge(e) {
  e.preventDefault();
  challenges.unshift({
    id: `CH-MH-${Date.now().toString().slice(-2)}`,
    title: document.getElementById("post-title").value,
    dept: document.getElementById("post-dept").value,
    budget: Number(document.getElementById("post-budget").value),
    target: document.getElementById("post-kpi").value,
    desc: document.getElementById("post-desc").value,
    published: new Date().toISOString().split("T")[0],
    applied: false
  });
  e.target.reset();
  alert("✓ Problem statement published with attached sandbox architecture!");
  renderAllViews();
}

function runAutoDemoSimulation() {
  switchView("evaluator");
  setTimeout(() => {
    openEvalModal(0);
    setTimeout(() => {
      confirmApproval();
      setTimeout(() => {
        toggleEscrowDrawer(true);
      }, 600);
    }, 1000);
  }, 300);
}

function showPage(name) {
  const pages = { landing: "page-landing", signin: "page-signin", dashboard: "page-dashboard" };
  Object.keys(pages).forEach((key) => {
    const el = document.getElementById(pages[key]);
    if (el) el.classList.toggle("hidden", key !== name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "dashboard") {
    switchView("overview");
  }
  if (window.lucide) lucide.createIcons();
}

function setSigninRole(role) {
  const isGov = role === "government";
  document.getElementById("signin-tab-gov").className = isGov ? "py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35]" : "py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#E2E8F0]";
  document.getElementById("signin-tab-startup").className = !isGov ? "py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35]" : "py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#E2E8F0]";
  document.getElementById("signin-email-label").textContent = isGov ? "Official Government Email" : "Startup Representative Email";
  document.getElementById("signin-email-input").placeholder = isGov ? "officer@department.gov.in" : "founder@startup.in";
}

function handleSignin(e) {
  e.preventDefault();
  showPage("dashboard");
}

function runLandingDemo() {
  showPage("dashboard");
  runAutoDemoSimulation();
}