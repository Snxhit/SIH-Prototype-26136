export const TEMPLATE_KEYS = [
  "problem_statement",
  "evaluation_criteria",
  "pilot_agreement",
  "ip_data_clause",
  "cybersecurity_risk",
  "procurement_scaleup",
] as const;

export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

export interface Template {
  id: string;
  template_key: TemplateKey;
  doc_id: string;
  title: string;
  filename: string;
  hash: string;
  labels: string[];
  default_values: string[];
  body_template: string;
  created_at?: string;
}

export interface ChallengePrefill {
  title: string;
  department_name: string;
  target_metrics: string;
}

export type TemplateParams = [string, string, string];

export function renderTemplateBody(body: string, params: TemplateParams): string {
  return body
    .replaceAll("{{p1}}", params[0] ?? "")
    .replaceAll("{{p2}}", params[1] ?? "")
    .replaceAll("{{p3}}", params[2] ?? "");
}

export function buildChallengePrefill(params: TemplateParams): ChallengePrefill {
  const kpi = (params[1] ?? "").trim();
  return {
    title: kpi
      ? `Innovation Challenge: ${kpi.slice(0, 48)}${kpi.length > 48 ? "…" : ""}`
      : "Innovation Challenge",
    department_name: (params[0] ?? "").trim(),
    target_metrics: kpi,
  };
}

export const MOCK_TEMPLATES: Template[] = [
  {
    id: "template-mock-01",
    template_key: "problem_statement",
    doc_id: "STD-GFR-TPL-01",
    title: "Outcome Problem Statement",
    filename: "STD-GFR-TPL-01_Problem_Statement.md",
    hash: "0x8f7a...39b1",
    labels: ["Department Authority", "Target Measurable KPI", "Sandbox Trial Scope"],
    default_values: [
      "Water Supply & Sanitation Department, GoM",
      "Real-time acoustic detection of leaks >0.5 LPM with >95% accuracy in 48h",
      "5 km municipal distribution pipeline across 60 calendar days",
    ],
    body_template: `STANDARD GOVERNMENT CHALLENGE IDENTIFICATION & OUTCOME FORMULATION TEMPLATE
Issued under Public Procurement (Preference to Make in India) & GFR Rule 173(i)
1. COMMISSIONING PUBLIC AUTHORITY: {{p1}}
2. OPERATIONAL PROBLEM DEFINITION: Invites functional tech solutions around measurable operational benchmarks.
3. MANDATORY PERFORMANCE TARGET: "{{p2}}", verified via continuous edge telemetry.
4. CONTROLLED SANDBOX PARAMETERS: Testbed Scope {{p3}}.
5. ELIGIBILITY & WAIVERS: DPIIT startups 100% waiver on prior turnover/experience; EMD exempted under GFR 170(i).
Signed by Designated Department Procurement Cell.`,
  },
  {
    id: "template-mock-02",
    template_key: "evaluation_criteria",
    doc_id: "STD-GFR-TPL-02",
    title: "QCBS Evaluation Rubric",
    filename: "STD-GFR-TPL-02_QCBS_Rubric.md",
    hash: "0x1b4c...98e4",
    labels: ["Minimum Scale Threshold", "Evaluation Model", "TRL Benchmark"],
    default_values: [
      "85.0% Weighted Aggregate Score",
      "QCBS 80:20 (Technical Merit to Commercial Viability)",
      "TRL 6 to TRL 8 (Validated Prototype / Operational Demonstration)",
    ],
    body_template: `STANDARD EVALUATION CRITERIA & SCORING MATRIX (INNOVATION PROCUREMENT)
Compliant with CVC Guidelines & Central Vigilance Commission Manual
1. EVALUATION METHODOLOGY: Model {{p2}}; Minimum Readiness {{p3}}.
2. WEIGHTED SCORING MATRIX (100%): Pillar1 Technical Merit 30% | Pillar2 KPI Accuracy 25% |
   Pillar3 Cybersecurity 20% | Pillar4 Multi-District Scalability 15% | Pillar5 DPIIT Validation 10%.
3. DIRECT SCALE-UP CLEARANCE: startups scoring >= {{p1}} certified for direct single-source procurement on GeM.`,
  },
  {
    id: "template-mock-03",
    template_key: "pilot_agreement",
    doc_id: "STD-GFR-TPL-03",
    title: "Sandbox Pilot Agreement",
    filename: "STD-GFR-TPL-03_Sandbox_Agreement.md",
    hash: "0x3c2d...77a9",
    labels: ["Department Authority", "Startup Entity Name", "Escrow Allocation"],
    default_values: [
      "Department of Urban Development, Government of Maharashtra",
      "HydroSense DeepTech Innovations Private Limited",
      "Rs 38,00,000 locked in Smart Escrow",
    ],
    body_template: `TRIPARTITE SANDBOX PILOT AGREEMENT FOR INNOVATION PROCUREMENT
Between Commissioning Department, Startup Provider & Escrow Trustee
PARTIES: 1. {{p1}} (Department) 2. {{p2}} (Startup) 3. Smart Escrow Trustee.
1. COMMITTED ESCROW FUNDING: {{p3}} held in escrow, released on verified milestone sign-off.
2. MILESTONE TRANCHES: Tranche1 30% lab calibration | Tranche2 40% live field deployment | Tranche3 30% audit & scale-up.
3. DISBURSEMENT: verified telemetry triggers direct payment within 48 hours.`,
  },
  {
    id: "template-mock-04",
    template_key: "ip_data_clause",
    doc_id: "STD-GFR-TPL-04",
    title: "IP Retainment & Data Clause",
    filename: "STD-GFR-TPL-04_IP_Data_Retainment.md",
    hash: "0x4e5f...12c8",
    labels: ["Startup Entity Name", "Licensed Government Usage", "Cloud Region"],
    default_values: [
      "HydroSense DeepTech Innovations Private Limited",
      "Non-Exclusive, Royalty-Free Internal Administrative License",
      "MeitY-Empanelled Data Centers (Mumbai / Pune Region, India)",
    ],
    body_template: `STANDARD INTELLECTUAL PROPERTY & CITIZEN DATA PROTECTION FRAMEWORK (NDGFP)
1. IP OWNERSHIP: code, weights, firmware & patents developed by {{p1}} remain SOLE property of the Startup.
2. GOV USAGE: Department receives {{p2}} for internal municipal operations only.
3. DATA LOCALIZATION: all data must reside in {{p3}}; zero cross-border transfer; PII SHA-256 masked before ML ingestion.`,
  },
  {
    id: "template-mock-05",
    template_key: "cybersecurity_risk",
    doc_id: "STD-GFR-TPL-05",
    title: "Cybersecurity & Risk Protocols",
    filename: "STD-GFR-TPL-05_Cybersecurity_Risk.md",
    hash: "0x6a7b...88f3",
    labels: ["Risk Stop-Loss Limit", "CERT-In Audit Standard", "Rollback Mechanism"],
    default_values: [
      "Max 5.0% System Anomaly Deviation",
      "CERT-In Empanelled Information Security Audit",
      "Immediate Automated Failover to Legacy Manual Operations",
    ],
    body_template: `STANDARD CYBERSECURITY & OPERATIONAL RISK MITIGATION PROTOCOL
1. RISK ISOLATION: sandbox isolated with zero write-access to core SCADA systems.
2. STOP-LOSS: ceiling {{p1}}; on breach trigger {{p3}}.
3. CERTIFICATION: cloud architecture must satisfy {{p2}}; TLS 1.3 + AES-256; VAPT clearance before Phase 2.`,
  },
  {
    id: "template-mock-06",
    template_key: "procurement_scaleup",
    doc_id: "STD-GFR-TPL-06",
    title: "Direct GeM Scale-Up Pathway",
    filename: "STD-GFR-TPL-06_GeM_Scaleup_Conversion.md",
    hash: "0x7c8d...44e1",
    labels: ["Qualifying Audit Score", "Scale Horizon", "Procurement Mode"],
    default_values: [
      "Score >= 85.0% on Independent QCBS Matrix",
      "State-wide rollout across 80 Urban Local Bodies (ULBs)",
      "Direct Purchase under GeM Innovation Category / GFR Rule 194",
    ],
    body_template: `STANDARD CONVERSION CERTIFICATE: SANDBOX PILOT TO COMMERCIAL SCALE-UP
Legal Pathway for Direct Procurement without Re-Tendering (GFR 2017)
2. SCALE-UP BENCHMARK: verified {{p1}} certifies the solution as PROVEN INNOVATIVE TECHNOLOGY.
3. SINGLE-SOURCE JUSTIFICATION: re-tendering waived; horizon {{p2}}; mode {{p3}}.
4. PRICING: locked to sandbox unit economics with mandatory 15% volume discount for state-wide scale-up.`,
  },
];