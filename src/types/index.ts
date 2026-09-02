/**
 * Purchase to Start-up Management System (P2S) - Core Type Definitions
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGEMENT'
  | 'SALES'
  | 'COMMERCIAL'
  | 'TECHNICAL'
  | 'PURCHASE'
  | 'ACCOUNTS'
  | 'PRODUCTION'
  | 'QUALITY'
  | 'LOGISTICS'
  | 'CIVIL'
  | 'ELECTRICAL'
  | 'MECHANICAL'
  | 'PROJECT'
  | 'SERVICE'
  | 'VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department: string;
  phone?: string;
  isActive: boolean;
  avatarUrl?: string;
}

export type ProjectStatus = 'Draft' | 'Active' | 'On Hold' | 'Delayed' | 'Completed' | 'Cancelled';

export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type ProjectHealth = 'Green' | 'Amber' | 'Red';

export type ProcessStageId =
  | 'REQUEST_RECEIVED' // 1
  | 'QUESTION_RECEIVED' // 2
  | 'TECHNICAL_COMPREHENSION' // 3
  | 'QUOTATION_RECEIVED' // 4
  | 'COMMERCIAL_NEGOTIATION' // 5
  | 'APPROVAL' // 6
  | 'WORK_ORDER' // 7
  | 'ADVANCE_PAYMENT' // 8
  | 'MANUFACTURING' // 9
  | 'READY_FOR_DISPATCH' // 10
  | 'DELIVERY_SCHEDULED' // 11
  | 'SITE_READINESS' // 12
  | 'MATERIAL_RECEIVED' // 13
  | 'INSTALLATION_ERECTION' // 14
  | 'WORK_PROGRESS' // 15
  | 'PRE_COMMISSIONING' // 16
  | 'COMMISSIONING' // 17
  | 'MACHINE_START' // 18
  | 'DOCUMENTATION_HANDOVER' // 19
  | 'FINAL_PAYMENT' // 20
  | 'AFTER_SALES_SERVICE'; // 21

export type StageStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Pending'
  | 'Delayed'
  | 'Approval Required'
  | 'Rejected';

export interface StageConfig {
  id: ProcessStageId;
  order: number;
  name: string;
  shortName: string;
  category: 'Commercial' | 'Technical' | 'Manufacturing' | 'Site' | 'Handover' | 'Service';
  weightPercent: number;
  responsibleDepartment: string;
  description: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  gstOrTaxId?: string;
  createdDate: string;
}

export interface Project {
  id: string;
  projectNumber: string; // e.g. PRJ-2026-00001
  projectName: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  customerAddress: string;
  siteName: string;
  siteAddress: string;
  machineType: string;
  machineModel: string;
  application: string;
  capacity: string;
  specification: string;
  quantity: number;
  salesPerson: string;
  projectManager: string;
  technicalPerson: string;
  commercialPerson: string;
  expectedOrderValue: number;
  currency: string;
  expectedStartDate: string;
  targetDeliveryDate: string;
  machineRequiredDate: string;
  priority: Priority;
  currentStage: ProcessStageId;
  projectStatus: ProjectStatus;
  overallCompletionPercent: number;
  health: ProjectHealth;
  delayDays: number;
  isSiteReady: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

// Stage 1: Request Received
export interface RequestReceivedRecord {
  id: string;
  projectId: string;
  requestDate: string;
  customerRequirement: string;
  machineType: string;
  machineModel: string;
  capacity: string;
  specification: string;
  application: string;
  quantity: number;
  customerContact: string;
  requirementDescription: string;
  requiredDeliveryDate: string;
  sourceOfEnquiry: 'Email' | 'Phone' | 'WhatsApp' | 'Website' | 'Existing Customer' | 'Reference' | 'Other';
  salesPerson: string;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Completed';
  completedDate?: string;
}

// Stage 2: Question / Clarification Received
export interface ClarificationRecord {
  id: string;
  projectId: string;
  clarificationDate: string;
  clarificationType: 'Technical' | 'Commercial' | 'Site' | 'Utility' | 'Documentation' | 'Other';
  question: string;
  customerResponse?: string;
  responsibleDepartment: string;
  responsiblePerson: string;
  requiredByDate: string;
  responseDate?: string;
  status: 'Open' | 'Awaiting Customer' | 'Answered' | 'Closed';
  isMandatory: boolean;
  documents?: string[];
  remarks?: string;
}

// Stage 3: Technical Comprehension
export interface TechnicalReviewRecord {
  id: string;
  projectId: string;
  requirementStudy: string;
  feasibilityCheck: 'Feasible' | 'Feasible With Modification' | 'Clarification Required' | 'Not Feasible';
  technicalDiscussionNotes: string;
  solutionProposal: string;
  technicalSpecification: string;
  capacityConfirmation: string;
  utilityRequirement: string;
  siteRequirement: string;
  proposedConfiguration: string;
  technicalRisks: string;
  technicalNotes: string;
  responsibleEngineer: string;
  reviewDate: string;
  completionDate?: string;
  isApproved: boolean;
  approvedBy?: string;
  approvalDate?: string;
}

// Stage 4: Quotation Received & Revisions
export interface QuotationRecord {
  id: string;
  projectId: string;
  quotationNumber: string; // QT-2026-00001
  revisionNumber: number; // 0, 1, 2...
  quotationDate: string;
  validUntil: string;
  technicalSpecification: string;
  commercialOffer: string;
  basicPrice: number;
  taxes: number;
  duties: number;
  freight: number;
  installationCharges: number;
  commissioningCharges: number;
  otherCharges: number;
  totalAmount: number; // calculated automatically
  currency: string;
  deliverySchedule: string;
  paymentTerms: string;
  warrantyTerms: string;
  specialConditions: string;
  preparedBy: string;
  approvedBy?: string;
  documentUrl?: string;
  status: 'Draft' | 'Sent' | 'Revised' | 'Accepted' | 'Rejected';
  createdAt: string;
}

// Stage 5: Commercial Negotiation
export interface CommercialNegotiationRecord {
  id: string;
  projectId: string;
  negotiationDate: string;
  meetingType: 'In-person Meeting' | 'Virtual Video Call' | 'Phone Conference' | 'Email Exchange';
  priceDiscussed: number;
  negotiatedPrice: number;
  discount: number;
  finalPrice: number;
  paymentTerms: string;
  deliveryTerms: string;
  taxesAndDuties: string;
  warranty: string;
  otherTerms: string;
  discussionNotes: string;
  customerRepresentative: string;
  companyRepresentative: string;
  nextFollowUpDate?: string;
  status: 'Negotiation Open' | 'Awaiting Customer' | 'Final Terms Agreed' | 'Lost' | 'On Hold';
}

// Payment Milestones
export interface PaymentMilestone {
  id: string;
  projectId: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  dueCondition: string;
  dueDate: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  amountReceived: number;
  receivedDate?: string;
  paymentReference?: string;
  paymentStatus: 'Not Due' | 'Due' | 'Partially Paid' | 'Paid' | 'Overdue';
  remarks?: string;
}

// Stage 6: Approval Engine
export interface ApprovalRequestRecord {
  id: string;
  projectId: string;
  approvalRequestedDate: string;
  poReceived: boolean;
  poNumber?: string;
  poDate?: string;
  poValue?: number;
  poDocument?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
  requestedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  remarks?: string;
}

export interface ApprovalHistoryEntry {
  id: string;
  projectId: string;
  stageId: ProcessStageId;
  requestedBy: string;
  requestedDate: string;
  approver: string;
  decision: 'Approved' | 'Rejected' | 'Revision Required';
  decisionDate: string;
  comments: string;
  poNumber?: string;
  poValue?: number;
}

// Stage 7: Work Order
export interface WorkOrderRecord {
  id: string;
  projectId: string;
  internalWorkOrderNumber: string; // WO-2026-00001
  workOrderDate: string;
  bomStatus: 'Draft' | 'Under Review' | 'Finalized';
  bomFinalizedDate?: string;
  resourcePlanningStatus: 'Pending' | 'Allocated' | 'Approved';
  projectEngineer: string;
  productionManager: string;
  planningEngineer: string;
  supplierFinalizationStatus: 'In Progress' | 'Finalized';
  targetManufacturingStart: string;
  targetManufacturingCompletion: string;
  remarks: string;
  workOrderDocument?: string;
  isChecklistComplete: boolean;
}

// Stage 8: Advance Payment
export interface AdvancePaymentRecord {
  id: string;
  projectId: string;
  advanceRequired: boolean;
  advancePercentage: number;
  advanceAmount: number;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDueDate: string;
  paymentReceived: boolean;
  amountReceived: number;
  paymentDate?: string;
  transactionReference?: string;
  lcApplicable: boolean;
  lcNumber?: string;
  lcDate?: string;
  bgApplicable: boolean;
  bgNumber?: string;
  bgExpiryDate?: string;
  paymentConditionRecorded: string;
  remarks?: string;
  documents?: string[];
}

// Stage 9: Manufacturing
export interface ManufacturingActivityRecord {
  id: string;
  projectId: string;
  category: 'Material Procurement' | 'Fabrication' | 'Machining' | 'Assembly' | 'QC & Testing';
  activity: string;
  description: string;
  responsibleDepartment: string;
  responsiblePerson: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  completionPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Delayed';
  delayDays: number;
  remarks?: string;
}

export interface ProcurementItem {
  id: string;
  projectId: string;
  materialCode: string;
  materialDescription: string;
  bomQuantity: number;
  requiredQuantity: number;
  unit: string;
  supplier: string;
  poNumber?: string;
  poDate?: string;
  expectedDelivery: string;
  receivedQuantity: number;
  receivedDate?: string;
  pendingQuantity: number;
  inspectionRequired: boolean;
  status: 'Not Ordered' | 'RFQ' | 'Ordered' | 'Partially Received' | 'Received' | 'Delayed';
  remarks?: string;
}

export interface QCInspectionRecord {
  id: string;
  projectId: string;
  inspectionNumber: string;
  inspectionDate: string;
  inspectionType: 'Incoming Material' | 'In-process Fabrication' | 'Dimensional' | 'Hydrostatic' | 'Electrical' | 'Final Assembly';
  item: string;
  specification: string;
  actualResult: string;
  passFail: 'Pass' | 'Fail';
  inspectedBy: string;
  correctiveAction?: string;
  reinspectionRequired: boolean;
  reinspectionDate?: string;
  finalStatus: 'Open' | 'Closed' | 'Conditional';
  documentUrl?: string;
}

// Stage 10: Ready for Dispatch
export interface DispatchClearanceRecord {
  id: string;
  projectId: string;
  finalInspectionDate: string;
  inspectionResult: 'Pass' | 'Conditional Pass' | 'Fail';
  packingDate: string;
  packingDetails: string;
  numberOfPackages: number;
  grossWeight: number; // kg
  netWeight: number; // kg
  dimensions: string;
  dispatchClearanceStatus: 'Pending Inspection' | 'Approved for Dispatch' | 'Hold';
  clearanceDate?: string;
  approvedBy?: string;
  remarks?: string;
  packingListDocument?: string;
  inspectionReportDocument?: string;
}

// Stage 11: Delivery Scheduled
export interface DeliveryScheduledRecord {
  id: string;
  projectId: string;
  plannedDeliveryDate: string;
  confirmedDeliveryDate: string;
  transporter: string;
  vehicleNumber: string;
  lrNumber: string;
  lrDate: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  expectedSiteArrival: string;
  actualSiteArrival?: string;
  transportStatus: 'Planning' | 'Vehicle Arranged' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Delayed';
  siteReadinessConfirmed: boolean;
  remarks?: string;
  documents?: string[];
}

// Stage 12: Site Readiness
export type SiteWorkCategory = 'CIVIL' | 'ELECTRICAL' | 'MECHANICAL';

export interface SiteReadinessTask {
  id: string;
  projectId: string;
  category: SiteWorkCategory;
  task: string;
  required: boolean;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Not Applicable' | 'Pending Correction';
  responsiblePerson: string;
  targetDate: string;
  completedDate?: string;
  verifiedBy?: string;
  verificationDate?: string;
  remarks?: string;
  photoUrl?: string;
  documentUrl?: string;
}

export interface SiteReadinessCertificate {
  id: string;
  certificateNumber: string; // SRC-2026-00001
  projectId: string;
  siteName: string;
  inspectionDate: string;
  civilCompletionPercent: number;
  electricalCompletionPercent: number;
  mechanicalCompletionPercent: number;
  overallReadinessPercent: number;
  civilApprovedBy: string;
  electricalApprovedBy: string;
  mechanicalApprovedBy: string;
  projectApprovedBy: string;
  certificateDate: string;
  managementOverrideReason?: string;
}

// Centralized Pending Works
export type PendingWorkCategory =
  | 'Civil Pending'
  | 'Electrical Pending'
  | 'Mechanical Pending'
  | 'Utilities Pending'
  | 'Documentation Pending'
  | 'Commercial Pending'
  | 'Manufacturing Pending'
  | 'Customer Pending'
  | 'Other';

export interface PendingTask {
  id: string; // PEN-00001
  projectId: string;
  projectNumber: string;
  category: PendingWorkCategory;
  relatedStage: ProcessStageId;
  description: string;
  responsibleDepartment: string;
  responsiblePerson: string;
  createdDate: string;
  targetDate: string;
  priority: Priority;
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  closedDate?: string;
  closureRemarks?: string;
  delayDays: number;
}

// Stage 13: Material Received at Site
export interface MaterialReceiptRecord {
  id: string;
  projectId: string;
  grnNumber: string; // GRN-2026-00001
  grnDate: string;
  receivedDate: string;
  transporter: string;
  vehicleNumber: string;
  receivedBy: string;
  packageCount: number;
  materialCondition: 'Intact & Undamaged' | 'Minor Outer Scratches' | 'Damaged Box' | 'Severe Damage';
  shortageFound: boolean;
  damageFound: boolean;
  inspectionDate: string;
  inspectionResult: 'Accepted' | 'Accepted with Observations' | 'Rejected';
  storageLocation: string;
  handlingInstructions: string;
  remarks?: string;
  photoUrl?: string;
  grnDocument?: string;
}

// Stage 14: Installation & Erection
export interface InstallationActivity {
  id: string;
  projectId: string;
  category: 'Civil' | 'Electrical' | 'Mechanical';
  task: string;
  responsibleTeam: string;
  supervisor: string;
  plannedStart: string;
  plannedCompletion: string;
  actualStart?: string;
  actualCompletion?: string;
  progressPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  remarks?: string;
}

// Stage 15: Work Progress Tracking / Daily Progress Entry
export interface DailyProgressEntry {
  id: string;
  projectId: string;
  date: string;
  installationCategory: 'Civil' | 'Electrical' | 'Mechanical' | 'General';
  workActivity: string;
  description: string;
  manpower: number;
  workingHours: number;
  progressTodayPercent: number;
  overallProgressPercent: number;
  problems?: string;
  pendingItems?: string;
  actionRequired?: string;
  responsiblePerson: string;
  expectedResolution?: string;
  photos?: string[];
  enteredBy: string;
}

// Stage 16: Pre-Commissioning Checks
export interface PreCommissioningCheckItem {
  id: string;
  projectId: string;
  checkItem: string;
  category: 'Mechanical Check' | 'Electrical Check' | 'Instrument Check' | 'Safety Check';
  specification: string;
  observation: string;
  result: 'Pass' | 'Fail' | 'Conditional Pass';
  checkedBy: string;
  checkDate: string;
  correctionRequired: boolean;
  correctionDescription?: string;
  correctedDate?: string;
  verifiedBy?: string;
  remarks?: string;
}

// Stage 17: Commissioning & Machine Start
export interface CommissioningRecord {
  id: string;
  projectId: string;
  commissioningDate: string;
  trialRunStart: string;
  trialRunEnd: string;
  trialDurationHours: number;
  machineRunningHours: number;
  parameterChecks: string;
  adjustmentDetails: string;
  performanceTest: string;
  performanceResult: string;
  customerRepresentative: string;
  commissioningEngineer: string;
  issuesFound?: string;
  correctiveActions?: string;
  finalCommissioningStatus: 'Not Started' | 'Trial Running' | 'Correction Required' | 'Successful' | 'Customer Accepted';
  customerAcceptanceDate?: string;
  remarks?: string;
  documents?: string[];
}

// Stage 18: Official Machine Start Date
export interface MachineStartRecord {
  id: string;
  projectId: string;
  officialMachineStartDate: string;
  startTime: string;
  commissioningReference: string;
  recordedBy: string;
  customerAcceptanceReference: string;
  machineStatus: 'Commercial Production' | 'Trial Production' | 'Standby';
  productionStarted: boolean;
  handoverToCustomer: boolean;
  handoverDate?: string;
  remarks?: string;
}

// Stage 19: Documentation & Handover
export interface ProjectDocument {
  id: string;
  projectId: string;
  documentType:
    | 'O&M Manual'
    | 'Test Certificates'
    | 'Warranty Document'
    | 'Training Documents'
    | 'Electrical Drawings'
    | 'Mechanical Drawings'
    | 'Spare Parts List'
    | 'Commissioning Report'
    | 'Customer Acceptance'
    | 'Other Documents';
  documentNumber: string;
  fileName: string;
  fileSize: string;
  revision: string;
  uploadedDate: string;
  uploadedBy: string;
  customerSubmittedDate?: string;
  customerAccepted: boolean;
  remarks?: string;
  fileUrl: string;
}

// Stage 20: Final Payment
export interface FinalPaymentRecord {
  id: string;
  projectId: string;
  finalInvoiceNumber: string;
  finalInvoiceDate: string;
  finalInvoiceAmount: number;
  paymentDueDate: string;
  amountReceived: number;
  receivedDate?: string;
  pendingAmount: number; // calculated automatically
  duesClearanceStatus: 'Pending' | 'Partially Cleared' | 'Fully Cleared';
  transactionReference?: string;
  accountsApprovedBy?: string;
  remarks?: string;
  documents?: string[];
}

// Stage 21: After Sales Service & Service Tickets
export interface ServiceTicket {
  id: string;
  ticketNumber: string; // SRV-2026-00001
  projectId: string;
  projectNumber: string;
  customerName: string;
  machineModel: string;
  complaintDate: string;
  complaintType: 'Breakdown' | 'Routine Maintenance' | 'Parts Replacement' | 'Operational Guidance' | 'Electrical Fault';
  problemDescription: string;
  priority: Priority;
  assignedEngineer: string;
  visitRequired: boolean;
  visitDate?: string;
  rootCause?: string;
  actionTaken?: string;
  partsUsed?: string;
  resolvedDate?: string;
  customerConfirmation?: string;
  ticketStatus: 'Open' | 'Assigned' | 'In Progress' | 'Waiting Customer' | 'Waiting Parts' | 'Resolved' | 'Closed';
  photos?: string[];
}

// Activity & Audit Log
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  projectId?: string;
  projectNumber?: string;
  module: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'STATUS_CHANGE' | 'LOGIN';
  summary: string;
  oldValue?: string;
  newValue?: string;
}

// Project Comments
export interface ProjectComment {
  id: string;
  projectId: string;
  stageId?: ProcessStageId;
  userName: string;
  userRole: string;
  userAvatar?: string;
  createdAt: string;
  comment: string;
}

// App Notification
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  projectId?: string;
  projectNumber?: string;
  stageId?: ProcessStageId;
}
