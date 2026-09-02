import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  Project,
  ProcessStageId,
  QuotationRecord,
  CommercialNegotiationRecord,
  PaymentMilestone,
  ApprovalRequestRecord,
  ApprovalHistoryEntry,
  WorkOrderRecord,
  AdvancePaymentRecord,
  ManufacturingActivityRecord,
  ProcurementItem,
  QCInspectionRecord,
  DispatchClearanceRecord,
  DeliveryScheduledRecord,
  SiteReadinessTask,
  SiteReadinessCertificate,
  PendingTask,
  MaterialReceiptRecord,
  InstallationActivity,
  DailyProgressEntry,
  PreCommissioningCheckItem,
  CommissioningRecord,
  MachineStartRecord,
  ProjectDocument,
  FinalPaymentRecord,
  ServiceTicket,
  AuditLogEntry,
  ProjectComment,
  AppNotification,
  ClarificationRecord,
  TechnicalReviewRecord,
  RequestReceivedRecord,
  StageConfig,
  ProjectHealth,
} from '../types';
import { PROCESS_STAGES, STAGE_MAP, getStageOrder } from '../constants/stages';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PROJECTS,
  INITIAL_REQUESTS,
  INITIAL_CLARIFICATIONS,
  INITIAL_TECHNICAL_REVIEWS,
  INITIAL_QUOTATIONS,
  INITIAL_NEGOTIATIONS,
  INITIAL_PAYMENT_MILESTONES,
  INITIAL_APPROVAL_REQUESTS,
  INITIAL_APPROVAL_HISTORY,
  INITIAL_WORK_ORDERS,
  INITIAL_ADVANCE_PAYMENTS,
  INITIAL_MANUFACTURING_ACTIVITIES,
  INITIAL_PROCUREMENT_ITEMS,
  INITIAL_QC_INSPECTIONS,
  INITIAL_DISPATCH_RECORDS,
  INITIAL_DELIVERY_RECORDS,
  INITIAL_SITE_TASKS,
  INITIAL_SITE_CERTIFICATES,
  INITIAL_PENDING_TASKS,
  INITIAL_MATERIAL_RECEIPTS,
  INITIAL_INSTALLATION_ACTIVITIES,
  INITIAL_DAILY_PROGRESS,
  INITIAL_PRECOMMISSIONING_CHECKS,
  INITIAL_COMMISSIONING_RECORDS,
  INITIAL_MACHINE_START_RECORDS,
  INITIAL_PROJECT_DOCUMENTS,
  INITIAL_FINAL_PAYMENTS,
  INITIAL_SERVICE_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import {
  fetchProjectsFromSupabase,
  fetchCustomersFromSupabase,
  fetchPendingTasksFromSupabase,
  upsertProjectToSupabase,
  deleteProjectFromSupabase,
  upsertPendingTaskToSupabase,
  upsertSiteTaskToSupabase,
  insertAuditLogToSupabase,
  pushSeedDataToSupabase,
} from '../lib/databaseSync';
import { testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  customers: Customer[];
  projects: Project[];
  requests: RequestReceivedRecord[];
  clarifications: ClarificationRecord[];
  technicalReviews: TechnicalReviewRecord[];
  quotations: QuotationRecord[];
  negotiations: CommercialNegotiationRecord[];
  paymentMilestones: PaymentMilestone[];
  approvalRequests: ApprovalRequestRecord[];
  approvalHistory: ApprovalHistoryEntry[];
  workOrders: WorkOrderRecord[];
  advancePayments: AdvancePaymentRecord[];
  manufacturingActivities: ManufacturingActivityRecord[];
  procurementItems: ProcurementItem[];
  qcInspections: QCInspectionRecord[];
  dispatchRecords: DispatchClearanceRecord[];
  deliveryRecords: DeliveryScheduledRecord[];
  siteTasks: SiteReadinessTask[];
  siteCertificates: SiteReadinessCertificate[];
  pendingTasks: PendingTask[];
  materialReceipts: MaterialReceiptRecord[];
  installationActivities: InstallationActivity[];
  dailyProgress: DailyProgressEntry[];
  precommissioningChecks: PreCommissioningCheckItem[];
  commissioningRecords: CommissioningRecord[];
  machineStartRecords: MachineStartRecord[];
  documents: ProjectDocument[];
  finalPayments: FinalPaymentRecord[];
  serviceTickets: ServiceTicket[];
  auditLogs: AuditLogEntry[];
  comments: ProjectComment[];
  notifications: AppNotification[];
  stageConfigs: StageConfig[];

  // Project operations
  addProject: (p: Omit<Project, 'id' | 'projectNumber' | 'createdDate' | 'lastModifiedDate'>) => Project;
  updateProject: (id: string, updates: Partial<Project>, actorName?: string, actorRole?: string) => void;
  deleteProject: (id: string) => void;
  advanceProjectStage: (projectId: string, nextStage: ProcessStageId, actorName?: string) => void;
  calculateProjectProgress: (projectId: string) => number;

  // Module CRUD
  saveRequest: (req: Partial<RequestReceivedRecord> & { projectId: string }) => void;
  addClarification: (c: Omit<ClarificationRecord, 'id'>) => void;
  updateClarification: (id: string, updates: Partial<ClarificationRecord>) => void;
  saveTechnicalReview: (review: Partial<TechnicalReviewRecord> & { projectId: string }) => void;
  createQuotation: (q: Omit<QuotationRecord, 'id' | 'quotationNumber' | 'revisionNumber' | 'totalAmount' | 'createdAt'>) => void;
  createQuotationRevision: (baseQuotationId: string, updates: Partial<QuotationRecord>) => void;
  addNegotiation: (n: Omit<CommercialNegotiationRecord, 'id'>) => void;
  addPaymentMilestone: (m: Omit<PaymentMilestone, 'id'>) => void;
  updatePaymentMilestone: (id: string, updates: Partial<PaymentMilestone>) => void;
  requestApproval: (req: Omit<ApprovalRequestRecord, 'id'>) => void;
  processApproval: (
    projectId: string,
    decision: 'Approved' | 'Rejected' | 'Revision Required',
    approverName: string,
    comments: string,
    poNumber?: string,
    poValue?: number
  ) => void;
  saveWorkOrder: (wo: Partial<WorkOrderRecord> & { projectId: string }) => void;
  saveAdvancePayment: (adv: Partial<AdvancePaymentRecord> & { projectId: string }) => void;
  addManufacturingActivity: (act: Omit<ManufacturingActivityRecord, 'id'>) => void;
  updateManufacturingActivity: (id: string, updates: Partial<ManufacturingActivityRecord>) => void;
  addProcurementItem: (item: Omit<ProcurementItem, 'id'>) => void;
  updateProcurementItem: (id: string, updates: Partial<ProcurementItem>) => void;
  addQCInspection: (qc: Omit<QCInspectionRecord, 'id'>) => void;
  saveDispatchRecord: (disp: Partial<DispatchClearanceRecord> & { projectId: string }) => void;
  saveDeliveryRecord: (del: Partial<DeliveryScheduledRecord> & { projectId: string }) => void;
  addSiteTask: (task: Omit<SiteReadinessTask, 'id'>) => void;
  updateSiteTask: (id: string, updates: Partial<SiteReadinessTask>) => void;
  generateSiteCertificate: (
    projectId: string,
    approvedBy: { civil: string; electrical: string; mechanical: string; project: string },
    overrideReason?: string
  ) => SiteReadinessCertificate;
  setSiteReadyDecision: (projectId: string, isReady: boolean) => void;
  addPendingTask: (task: Omit<PendingTask, 'id'>) => void;
  updatePendingTask: (id: string, updates: Partial<PendingTask>) => void;
  resolvePendingTask: (id: string, closureRemarks: string) => void;
  saveMaterialReceipt: (receipt: Omit<MaterialReceiptRecord, 'id'>) => void;
  addInstallationActivity: (act: Omit<InstallationActivity, 'id'>) => void;
  updateInstallationActivity: (id: string, updates: Partial<InstallationActivity>) => void;
  addDailyProgress: (dp: Omit<DailyProgressEntry, 'id'>) => void;
  addPrecommissioningCheck: (chk: Omit<PreCommissioningCheckItem, 'id'>) => void;
  updatePrecommissioningCheck: (id: string, updates: Partial<PreCommissioningCheckItem>) => void;
  saveCommissioningRecord: (comm: Partial<CommissioningRecord> & { projectId: string }) => void;
  recordMachineStart: (ms: Omit<MachineStartRecord, 'id'>) => void;
  addDocument: (doc: Omit<ProjectDocument, 'id' | 'uploadedDate'>) => void;
  deleteDocument: (id: string) => void;
  saveFinalPayment: (fp: Partial<FinalPaymentRecord> & { projectId: string }) => void;
  addServiceTicket: (tkt: Omit<ServiceTicket, 'id' | 'ticketNumber'>) => void;
  updateServiceTicket: (id: string, updates: Partial<ServiceTicket>) => void;
  addComment: (projectId: string, comment: string, stageId?: ProcessStageId, userName?: string, userRole?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  recordAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  updateStageConfig: (id: ProcessStageId, weightPercent: number) => void;
  exportToCsv: (filename: string, rows: Record<string, any>[]) => void;

  // Supabase Live Synchronization
  supabaseSyncStatus: {
    isConnected: boolean;
    tablesReady: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    syncError: string | null;
  };
  pushLocalToSupabase: () => Promise<{ success: boolean; message: string }>;
  pullSupabaseToLocal: () => Promise<{ success: boolean; message: string }>;
  checkTablesStatus: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`p2s_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn(`Error loading state for key ${key}:`, err);
  }
  return defaultValue;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => getInitialState('customers', INITIAL_CUSTOMERS));
  const [projects, setProjects] = useState<Project[]>(() => getInitialState('projects', INITIAL_PROJECTS));
  const [requests, setRequests] = useState<RequestReceivedRecord[]>(() => getInitialState('requests', INITIAL_REQUESTS));
  const [clarifications, setClarifications] = useState<ClarificationRecord[]>(() => getInitialState('clarifications', INITIAL_CLARIFICATIONS));
  const [technicalReviews, setTechnicalReviews] = useState<TechnicalReviewRecord[]>(() => getInitialState('technicalReviews', INITIAL_TECHNICAL_REVIEWS));
  const [quotations, setQuotations] = useState<QuotationRecord[]>(() => getInitialState('quotations', INITIAL_QUOTATIONS));
  const [negotiations, setNegotiations] = useState<CommercialNegotiationRecord[]>(() => getInitialState('negotiations', INITIAL_NEGOTIATIONS));
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>(() => getInitialState('paymentMilestones', INITIAL_PAYMENT_MILESTONES));
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequestRecord[]>(() => getInitialState('approvalRequests', INITIAL_APPROVAL_REQUESTS));
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryEntry[]>(() => getInitialState('approvalHistory', INITIAL_APPROVAL_HISTORY));
  const [workOrders, setWorkOrders] = useState<WorkOrderRecord[]>(() => getInitialState('workOrders', INITIAL_WORK_ORDERS));
  const [advancePayments, setAdvancePayments] = useState<AdvancePaymentRecord[]>(() => getInitialState('advancePayments', INITIAL_ADVANCE_PAYMENTS));
  const [manufacturingActivities, setManufacturingActivities] = useState<ManufacturingActivityRecord[]>(() => getInitialState('manufacturingActivities', INITIAL_MANUFACTURING_ACTIVITIES));
  const [procurementItems, setProcurementItems] = useState<ProcurementItem[]>(() => getInitialState('procurementItems', INITIAL_PROCUREMENT_ITEMS));
  const [qcInspections, setQcInspections] = useState<QCInspectionRecord[]>(() => getInitialState('qcInspections', INITIAL_QC_INSPECTIONS));
  const [dispatchRecords, setDispatchRecords] = useState<DispatchClearanceRecord[]>(() => getInitialState('dispatchRecords', INITIAL_DISPATCH_RECORDS));
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryScheduledRecord[]>(() => getInitialState('deliveryRecords', INITIAL_DELIVERY_RECORDS));
  const [siteTasks, setSiteTasks] = useState<SiteReadinessTask[]>(() => getInitialState('siteTasks', INITIAL_SITE_TASKS));
  const [siteCertificates, setSiteCertificates] = useState<SiteReadinessCertificate[]>(() => getInitialState('siteCertificates', INITIAL_SITE_CERTIFICATES));
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(() => getInitialState('pendingTasks', INITIAL_PENDING_TASKS));
  const [materialReceipts, setMaterialReceipts] = useState<MaterialReceiptRecord[]>(() => getInitialState('materialReceipts', INITIAL_MATERIAL_RECEIPTS));
  const [installationActivities, setInstallationActivities] = useState<InstallationActivity[]>(() => getInitialState('installationActivities', INITIAL_INSTALLATION_ACTIVITIES));
  const [dailyProgress, setDailyProgress] = useState<DailyProgressEntry[]>(() => getInitialState('dailyProgress', INITIAL_DAILY_PROGRESS));
  const [precommissioningChecks, setPrecommissioningChecks] = useState<PreCommissioningCheckItem[]>(() => getInitialState('precommissioningChecks', INITIAL_PRECOMMISSIONING_CHECKS));
  const [commissioningRecords, setCommissioningRecords] = useState<CommissioningRecord[]>(() => getInitialState('commissioningRecords', INITIAL_COMMISSIONING_RECORDS));
  const [machineStartRecords, setMachineStartRecords] = useState<MachineStartRecord[]>(() => getInitialState('machineStartRecords', INITIAL_MACHINE_START_RECORDS));
  const [documents, setDocuments] = useState<ProjectDocument[]>(() => getInitialState('documents', INITIAL_PROJECT_DOCUMENTS));
  const [finalPayments, setFinalPayments] = useState<FinalPaymentRecord[]>(() => getInitialState('finalPayments', INITIAL_FINAL_PAYMENTS));
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(() => getInitialState('serviceTickets', INITIAL_SERVICE_TICKETS));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getInitialState('auditLogs', INITIAL_AUDIT_LOGS));
  const [comments, setComments] = useState<ProjectComment[]>(() => getInitialState('comments', INITIAL_COMMENTS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getInitialState('notifications', INITIAL_NOTIFICATIONS));
  const [stageConfigs, setStageConfigs] = useState<StageConfig[]>(() => getInitialState('stageConfigs', PROCESS_STAGES));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('p2s_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('p2s_customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('p2s_siteTasks', JSON.stringify(siteTasks));
  }, [siteTasks]);
  useEffect(() => {
    localStorage.setItem('p2s_pendingTasks', JSON.stringify(pendingTasks));
  }, [pendingTasks]);
  useEffect(() => {
    localStorage.setItem('p2s_quotations', JSON.stringify(quotations));
  }, [quotations]);
  useEffect(() => {
    localStorage.setItem('p2s_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('p2s_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Supabase Live Synchronization State
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<{
    isConnected: boolean;
    tablesReady: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    syncError: string | null;
  }>({
    isConnected: false,
    tablesReady: false,
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  });

  const checkTablesStatus = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const res = await testSupabaseConnection();
      setSupabaseSyncStatus((prev) => ({
        ...prev,
        isConnected: res.connected,
        tablesReady: res.tablesFound,
        syncError: res.error || null,
      }));

      // If tables are found, pull remote data from Supabase!
      if (res.tablesFound) {
        const { data: remoteProjects } = await fetchProjectsFromSupabase();
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
          setSupabaseSyncStatus((prev) => ({
            ...prev,
            lastSyncTime: new Date().toLocaleTimeString(),
          }));
        } else if (remoteProjects && remoteProjects.length === 0) {
          // Tables exist in Supabase but are empty - seed them
          console.log('Supabase tables empty, auto-seeding with local records...');
          await pushSeedDataToSupabase(customers, projects, pendingTasks);
        }

        const { data: remoteCusts } = await fetchCustomersFromSupabase();
        if (remoteCusts && remoteCusts.length > 0) {
          setCustomers(remoteCusts);
        }

        const { data: remoteTasks } = await fetchPendingTasksFromSupabase();
        if (remoteTasks && remoteTasks.length > 0) {
          setPendingTasks(remoteTasks);
        }
      }
    } catch (err: any) {
      console.warn('Supabase status check error:', err);
    }
  };

  useEffect(() => {
    checkTablesStatus();
  }, []);

  const pushLocalToSupabase = async () => {
    setSupabaseSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const res = await pushSeedDataToSupabase(customers, projects, pendingTasks);
      setSupabaseSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date().toLocaleTimeString(),
        syncError: res.success ? null : res.message,
      }));
      return res;
    } catch (err: any) {
      const msg = err.message || 'Error pushing to Supabase';
      setSupabaseSyncStatus((prev) => ({ ...prev, isSyncing: false, syncError: msg }));
      return { success: false, message: msg };
    }
  };

  const pullSupabaseToLocal = async () => {
    setSupabaseSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const { data: projs, error: pErr } = await fetchProjectsFromSupabase();
      if (pErr) throw pErr;
      if (projs && projs.length > 0) {
        setProjects(projs);
      }

      const { data: custs, error: cErr } = await fetchCustomersFromSupabase();
      if (cErr) throw cErr;
      if (custs && custs.length > 0) {
        setCustomers(custs);
      }

      const { data: tasks, error: tErr } = await fetchPendingTasksFromSupabase();
      if (tErr) throw tErr;
      if (tasks && tasks.length > 0) {
        setPendingTasks(tasks);
      }

      setSupabaseSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date().toLocaleTimeString(),
        syncError: null,
      }));
      return { success: true, message: 'Successfully fetched latest records from Supabase.' };
    } catch (err: any) {
      const msg = err.message || 'Error pulling from Supabase';
      setSupabaseSyncStatus((prev) => ({ ...prev, isSyncing: false, syncError: msg }));
      return { success: false, message: msg };
    }
  };

  // Record Audit Log helper
  const recordAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    if (supabaseSyncStatus.tablesReady) {
      insertAuditLogToSupabase(newEntry).catch(() => {});
    }
  };

  // Calculate project completion % dynamically from stage weights
  const calculateProjectProgress = (projectId: string): number => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return 0;
    if (project.projectStatus === 'Completed') return 100;
    const currentOrder = getStageOrder(project.currentStage);

    let progress = 0;
    for (const stage of stageConfigs) {
      if (stage.order < currentOrder) {
        progress += stage.weightPercent;
      } else if (stage.order === currentOrder) {
        // partial credit (e.g. 50% of current stage weight)
        progress += Math.round(stage.weightPercent * 0.5);
      }
    }
    return Math.min(100, Math.max(2, progress));
  };

  // Add Project
  const addProject = (p: Omit<Project, 'id' | 'projectNumber' | 'createdDate' | 'lastModifiedDate'>): Project => {
    const year = new Date().getFullYear();
    const count = projects.length + 1;
    const num = `PRJ-${year}-${String(count).padStart(5, '0')}`;
    const today = new Date().toISOString().substring(0, 10);

    const newProject: Project = {
      ...p,
      id: `p-${Date.now()}`,
      projectNumber: num,
      createdDate: today,
      lastModifiedDate: today,
      delayDays: 0,
      health: 'Green',
      isSiteReady: false,
    };

    setProjects((prev) => [newProject, ...prev]);

    recordAuditLog({
      userName: p.createdBy || 'System',
      userRole: 'PROJECT',
      projectId: newProject.id,
      projectNumber: newProject.projectNumber,
      module: 'Project Master',
      recordId: newProject.id,
      action: 'CREATE',
      summary: `Created new project ${newProject.projectNumber} (${newProject.projectName}) for ${newProject.customerName}`,
      newValue: JSON.stringify({ name: newProject.projectName, machine: newProject.machineType, value: newProject.expectedOrderValue }),
    });

    // Create stage 1 record
    saveRequest({
      projectId: newProject.id,
      requestDate: today,
      customerRequirement: newProject.application,
      machineType: newProject.machineType,
      machineModel: newProject.machineModel,
      capacity: newProject.capacity,
      specification: newProject.specification,
      quantity: newProject.quantity,
      customerContact: newProject.contactPerson,
      salesPerson: newProject.salesPerson,
      status: 'Draft',
    });

    if (supabaseSyncStatus.tablesReady) {
      upsertProjectToSupabase(newProject).catch((err) => console.warn('Supabase upsert project failed:', err));
    }

    return newProject;
  };

  // Update Project
  const updateProject = (id: string, updates: Partial<Project>, actorName = 'User', actorRole = 'PROJECT') => {
    let updatedProject: Project | null = null;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = {
          ...p,
          ...updates,
          lastModifiedDate: new Date().toISOString().substring(0, 10),
          lastModifiedBy: actorName,
        };
        // Re-evaluate health if target delivery or delay days changed
        if (updated.delayDays > 7) {
          updated.health = 'Red';
        } else if (updated.delayDays > 0) {
          updated.health = 'Amber';
        } else {
          updated.health = 'Green';
        }
        updatedProject = updated;
        return updated;
      })
    );

    if (supabaseSyncStatus.tablesReady && updatedProject) {
      upsertProjectToSupabase(updatedProject).catch((err) => console.warn('Supabase project update failed:', err));
    }

    recordAuditLog({
      userName: actorName,
      userRole: actorRole,
      projectId: id,
      module: 'Project Master',
      recordId: id,
      action: 'UPDATE',
      summary: `Updated project details`,
      newValue: JSON.stringify(updates),
    });
  };

  // Delete Project
  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (supabaseSyncStatus.tablesReady) {
      deleteProjectFromSupabase(id).catch((err) => console.warn('Supabase delete project failed:', err));
    }
    if (target) {
      recordAuditLog({
        userName: 'Admin',
        userRole: 'SUPER_ADMIN',
        projectId: id,
        projectNumber: target.projectNumber,
        module: 'Project Master',
        recordId: id,
        action: 'DELETE',
        summary: `Deleted project ${target.projectNumber}`,
      });
    }
  };

  // Advance Project Stage
  const advanceProjectStage = (projectId: string, nextStage: ProcessStageId, actorName = 'System') => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const oldStage = target.currentStage;
    const isCompleted = nextStage === 'AFTER_SALES_SERVICE' || nextStage === 'FINAL_PAYMENT';
    let updatedProj: Project | null = null;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const nextOrder = getStageOrder(nextStage);
        let calculated = 0;
        for (const s of stageConfigs) {
          if (s.order < nextOrder) calculated += s.weightPercent;
          else if (s.order === nextOrder) calculated += Math.round(s.weightPercent * 0.5);
        }

        const res: Project = {
          ...p,
          currentStage: nextStage,
          overallCompletionPercent: Math.min(100, calculated),
          projectStatus: isCompleted ? 'Completed' : p.projectStatus,
          lastModifiedDate: new Date().toISOString().substring(0, 10),
          lastModifiedBy: actorName,
        };
        updatedProj = res;
        return res;
      })
    );

    if (supabaseSyncStatus.tablesReady && updatedProj) {
      upsertProjectToSupabase(updatedProj).catch((err) => console.warn('Supabase stage advance update failed:', err));
    }

    recordAuditLog({
      userName: actorName,
      userRole: 'PROJECT',
      projectId,
      projectNumber: target.projectNumber,
      module: 'Process Flow',
      recordId: projectId,
      action: 'STATUS_CHANGE',
      summary: `Moved project stage from ${oldStage} to ${nextStage}`,
      oldValue: oldStage,
      newValue: nextStage,
    });
  };

  // Stage 1 Save Request
  const saveRequest = (req: Partial<RequestReceivedRecord> & { projectId: string }) => {
    setRequests((prev) => {
      const idx = prev.findIndex((r) => r.projectId === req.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...req };
        return updated;
      }
      const newReq: RequestReceivedRecord = {
        id: `req-${Date.now()}`,
        projectId: req.projectId,
        requestDate: req.requestDate || new Date().toISOString().substring(0, 10),
        customerRequirement: req.customerRequirement || '',
        machineType: req.machineType || '',
        machineModel: req.machineModel || '',
        capacity: req.capacity || '',
        specification: req.specification || '',
        application: req.application || '',
        quantity: req.quantity || 1,
        customerContact: req.customerContact || '',
        requirementDescription: req.requirementDescription || '',
        requiredDeliveryDate: req.requiredDeliveryDate || '',
        sourceOfEnquiry: req.sourceOfEnquiry || 'Email',
        salesPerson: req.salesPerson || '',
        remarks: req.remarks || '',
        status: req.status || 'Draft',
        completedDate: req.completedDate,
      };
      return [newReq, ...prev];
    });
  };

  // Stage 2 Clarifications
  const addClarification = (c: Omit<ClarificationRecord, 'id'>) => {
    const newClar: ClarificationRecord = {
      ...c,
      id: `clar-${Date.now()}`,
    };
    setClarifications((prev) => [newClar, ...prev]);
  };

  const updateClarification = (id: string, updates: Partial<ClarificationRecord>) => {
    setClarifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Stage 3 Technical Review
  const saveTechnicalReview = (review: Partial<TechnicalReviewRecord> & { projectId: string }) => {
    setTechnicalReviews((prev) => {
      const idx = prev.findIndex((r) => r.projectId === review.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...review };
        return updated;
      }
      const newRev: TechnicalReviewRecord = {
        id: `tech-${Date.now()}`,
        projectId: review.projectId,
        requirementStudy: review.requirementStudy || '',
        feasibilityCheck: review.feasibilityCheck || 'Feasible',
        technicalDiscussionNotes: review.technicalDiscussionNotes || '',
        solutionProposal: review.solutionProposal || '',
        technicalSpecification: review.technicalSpecification || '',
        capacityConfirmation: review.capacityConfirmation || '',
        utilityRequirement: review.utilityRequirement || '',
        siteRequirement: review.siteRequirement || '',
        proposedConfiguration: review.proposedConfiguration || '',
        technicalRisks: review.technicalRisks || '',
        technicalNotes: review.technicalNotes || '',
        responsibleEngineer: review.responsibleEngineer || '',
        reviewDate: review.reviewDate || new Date().toISOString().substring(0, 10),
        completionDate: review.completionDate,
        isApproved: review.isApproved || false,
      };
      return [newRev, ...prev];
    });
  };

  // Stage 4 Quotations (Support Revisions Rev 0, Rev 1...)
  const createQuotation = (q: Omit<QuotationRecord, 'id' | 'quotationNumber' | 'revisionNumber' | 'totalAmount' | 'createdAt'>) => {
    const year = new Date().getFullYear();
    const count = quotations.length + 1;
    const num = `QT-${year}-${String(count).padStart(5, '0')}`;
    const total =
      Number(q.basicPrice || 0) +
      Number(q.taxes || 0) +
      Number(q.duties || 0) +
      Number(q.freight || 0) +
      Number(q.installationCharges || 0) +
      Number(q.commissioningCharges || 0) +
      Number(q.otherCharges || 0);

    const newQ: QuotationRecord = {
      ...q,
      id: `quot-${Date.now()}`,
      quotationNumber: num,
      revisionNumber: 0,
      totalAmount: total,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setQuotations((prev) => [newQ, ...prev]);

    recordAuditLog({
      userName: q.preparedBy,
      userRole: 'COMMERCIAL',
      projectId: q.projectId,
      module: 'Quotation',
      recordId: newQ.id,
      action: 'CREATE',
      summary: `Created initial Quotation ${newQ.quotationNumber} Rev 0 totaling ${newQ.currency} ${total.toLocaleString()}`,
      newValue: JSON.stringify({ basic: q.basicPrice, total }),
    });
  };

  const createQuotationRevision = (baseQuotationId: string, updates: Partial<QuotationRecord>) => {
    const base = quotations.find((q) => q.id === baseQuotationId);
    if (!base) return;

    // find highest rev for this quotation number
    const siblings = quotations.filter((q) => q.quotationNumber === base.quotationNumber);
    const maxRev = Math.max(...siblings.map((s) => s.revisionNumber), 0);
    const nextRev = maxRev + 1;

    const merged = { ...base, ...updates };
    const total =
      Number(merged.basicPrice || 0) +
      Number(merged.taxes || 0) +
      Number(merged.duties || 0) +
      Number(merged.freight || 0) +
      Number(merged.installationCharges || 0) +
      Number(merged.commissioningCharges || 0) +
      Number(merged.otherCharges || 0);

    const newRevision: QuotationRecord = {
      ...merged,
      id: `quot-${Date.now()}`,
      revisionNumber: nextRev,
      totalAmount: total,
      status: 'Sent',
      createdAt: new Date().toISOString().substring(0, 10),
    };

    setQuotations((prev) => [newRevision, ...prev]);

    recordAuditLog({
      userName: updates.preparedBy || 'Commercial User',
      userRole: 'COMMERCIAL',
      projectId: base.projectId,
      module: 'Quotation',
      recordId: newRevision.id,
      action: 'CREATE',
      summary: `Generated Quotation Revision ${base.quotationNumber} Rev ${nextRev} (Old: Rev ${base.revisionNumber})`,
      oldValue: `Rev ${base.revisionNumber} Total: ${base.totalAmount}`,
      newValue: `Rev ${nextRev} Total: ${total}`,
    });
  };

  // Stage 5 Commercial Negotiation
  const addNegotiation = (n: Omit<CommercialNegotiationRecord, 'id'>) => {
    const newNeg: CommercialNegotiationRecord = {
      ...n,
      id: `neg-${Date.now()}`,
    };
    setNegotiations((prev) => [newNeg, ...prev]);
  };

  // Payment Milestones
  const addPaymentMilestone = (m: Omit<PaymentMilestone, 'id'>) => {
    const newM: PaymentMilestone = {
      ...m,
      id: `pm-${Date.now()}`,
    };
    setPaymentMilestones((prev) => [...prev, newM]);
  };

  const updatePaymentMilestone = (id: string, updates: Partial<PaymentMilestone>) => {
    setPaymentMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        if (updated.amountReceived >= updated.amount && updated.amount > 0) {
          updated.paymentStatus = 'Paid';
        } else if (updated.amountReceived > 0) {
          updated.paymentStatus = 'Partially Paid';
        }
        return updated;
      })
    );
  };

  // Stage 6 Approval Requests
  const requestApproval = (req: Omit<ApprovalRequestRecord, 'id'>) => {
    const newReq: ApprovalRequestRecord = {
      ...req,
      id: `appr-${Date.now()}`,
    };
    setApprovalRequests((prev) => [newReq, ...prev]);
  };

  const processApproval = (
    projectId: string,
    decision: 'Approved' | 'Rejected' | 'Revision Required',
    approverName: string,
    comments: string,
    poNumber?: string,
    poValue?: number
  ) => {
    const proj = projects.find((p) => p.id === projectId);
    const dateStr = new Date().toISOString();

    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.projectId === projectId
          ? {
              ...r,
              approvalStatus: decision,
              approvedBy: approverName,
              approvedDate: dateStr,
              remarks: comments,
              poNumber: poNumber || r.poNumber,
              poValue: poValue || r.poValue,
            }
          : r
      )
    );

    // Save to immutable history
    const histEntry: ApprovalHistoryEntry = {
      id: `ah-${Date.now()}`,
      projectId,
      stageId: 'APPROVAL',
      requestedBy: 'Anita Desai',
      requestedDate: dateStr,
      approver: approverName,
      decision,
      decisionDate: dateStr,
      comments,
      poNumber,
      poValue,
    };
    setApprovalHistory((prev) => [histEntry, ...prev]);

    recordAuditLog({
      userName: approverName,
      userRole: 'MANAGEMENT',
      projectId,
      projectNumber: proj?.projectNumber,
      module: 'Approval Engine',
      recordId: histEntry.id,
      action: decision === 'Approved' ? 'APPROVE' : 'REJECT',
      summary: `Management ${decision} PO / Commercial terms for project ${proj?.projectNumber}. Remarks: ${comments}`,
      newValue: JSON.stringify({ decision, poNumber, poValue }),
    });

    // Workflow transition rule from prompt:
    // IF APPROVED: Continue to Work Order.
    // IF REJECTED: Return to Commercial Negotiation.
    if (decision === 'Approved') {
      advanceProjectStage(projectId, 'WORK_ORDER', approverName);
    } else if (decision === 'Rejected') {
      advanceProjectStage(projectId, 'COMMERCIAL_NEGOTIATION', approverName);
    }
  };

  // Stage 7 Work Orders
  const saveWorkOrder = (wo: Partial<WorkOrderRecord> & { projectId: string }) => {
    setWorkOrders((prev) => {
      const idx = prev.findIndex((w) => w.projectId === wo.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...wo };
        return updated;
      }
      const year = new Date().getFullYear();
      const num = `WO-${year}-${String(prev.length + 1).padStart(5, '0')}`;
      const newWO: WorkOrderRecord = {
        id: `wo-${Date.now()}`,
        projectId: wo.projectId,
        internalWorkOrderNumber: wo.internalWorkOrderNumber || num,
        workOrderDate: wo.workOrderDate || new Date().toISOString().substring(0, 10),
        bomStatus: wo.bomStatus || 'Draft',
        bomFinalizedDate: wo.bomFinalizedDate,
        resourcePlanningStatus: wo.resourcePlanningStatus || 'Pending',
        projectEngineer: wo.projectEngineer || '',
        productionManager: wo.productionManager || '',
        planningEngineer: wo.planningEngineer || '',
        supplierFinalizationStatus: wo.supplierFinalizationStatus || 'In Progress',
        targetManufacturingStart: wo.targetManufacturingStart || '',
        targetManufacturingCompletion: wo.targetManufacturingCompletion || '',
        remarks: wo.remarks || '',
        isChecklistComplete: wo.isChecklistComplete || false,
      };
      return [newWO, ...prev];
    });
  };

  // Stage 8 Advance Payments
  const saveAdvancePayment = (adv: Partial<AdvancePaymentRecord> & { projectId: string }) => {
    setAdvancePayments((prev) => {
      const idx = prev.findIndex((a) => a.projectId === adv.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...adv };
        return updated;
      }
      const newAdv: AdvancePaymentRecord = {
        id: `adv-${Date.now()}`,
        projectId: adv.projectId,
        advanceRequired: adv.advanceRequired ?? true,
        advancePercentage: adv.advancePercentage || 30,
        advanceAmount: adv.advanceAmount || 0,
        invoiceNumber: adv.invoiceNumber || 'INV-001',
        invoiceDate: adv.invoiceDate || new Date().toISOString().substring(0, 10),
        paymentDueDate: adv.paymentDueDate || '',
        paymentReceived: adv.paymentReceived || false,
        amountReceived: adv.amountReceived || 0,
        paymentDate: adv.paymentDate,
        transactionReference: adv.transactionReference,
        lcApplicable: adv.lcApplicable || false,
        bgApplicable: adv.bgApplicable || false,
        paymentConditionRecorded: adv.paymentConditionRecorded || '',
      };
      return [newAdv, ...prev];
    });
  };

  // Stage 9 Manufacturing Activities & Procurement & QC
  const addManufacturingActivity = (act: Omit<ManufacturingActivityRecord, 'id'>) => {
    const newAct: ManufacturingActivityRecord = {
      ...act,
      id: `mfg-${Date.now()}`,
    };
    setManufacturingActivities((prev) => [...prev, newAct]);
  };

  const updateManufacturingActivity = (id: string, updates: Partial<ManufacturingActivityRecord>) => {
    setManufacturingActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addProcurementItem = (item: Omit<ProcurementItem, 'id'>) => {
    const newItem: ProcurementItem = {
      ...item,
      id: `proc-${Date.now()}`,
    };
    setProcurementItems((prev) => [...prev, newItem]);
  };

  const updateProcurementItem = (id: string, updates: Partial<ProcurementItem>) => {
    setProcurementItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addQCInspection = (qc: Omit<QCInspectionRecord, 'id'>) => {
    const newQC: QCInspectionRecord = {
      ...qc,
      id: `qc-${Date.now()}`,
    };
    setQcInspections((prev) => [newQC, ...prev]);
  };

  // Stage 10 Dispatch
  const saveDispatchRecord = (disp: Partial<DispatchClearanceRecord> & { projectId: string }) => {
    setDispatchRecords((prev) => {
      const idx = prev.findIndex((d) => d.projectId === disp.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...disp };
        return updated;
      }
      const newD: DispatchClearanceRecord = {
        id: `disp-${Date.now()}`,
        projectId: disp.projectId,
        finalInspectionDate: disp.finalInspectionDate || new Date().toISOString().substring(0, 10),
        inspectionResult: disp.inspectionResult || 'Pass',
        packingDate: disp.packingDate || new Date().toISOString().substring(0, 10),
        packingDetails: disp.packingDetails || '',
        numberOfPackages: disp.numberOfPackages || 1,
        grossWeight: disp.grossWeight || 0,
        netWeight: disp.netWeight || 0,
        dimensions: disp.dimensions || '',
        dispatchClearanceStatus: disp.dispatchClearanceStatus || 'Pending Inspection',
      };
      return [newD, ...prev];
    });
  };

  // Stage 11 Delivery
  const saveDeliveryRecord = (del: Partial<DeliveryScheduledRecord> & { projectId: string }) => {
    setDeliveryRecords((prev) => {
      const idx = prev.findIndex((d) => d.projectId === del.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...del };
        return updated;
      }
      const newDel: DeliveryScheduledRecord = {
        id: `del-${Date.now()}`,
        projectId: del.projectId,
        plannedDeliveryDate: del.plannedDeliveryDate || '',
        confirmedDeliveryDate: del.confirmedDeliveryDate || '',
        transporter: del.transporter || '',
        vehicleNumber: del.vehicleNumber || '',
        lrNumber: del.lrNumber || '',
        lrDate: del.lrDate || new Date().toISOString().substring(0, 10),
        driverName: del.driverName || '',
        driverPhone: del.driverPhone || '',
        dispatchDate: del.dispatchDate || new Date().toISOString().substring(0, 10),
        expectedSiteArrival: del.expectedSiteArrival || '',
        transportStatus: del.transportStatus || 'Planning',
        siteReadinessConfirmed: del.siteReadinessConfirmed || false,
      };
      return [newDel, ...prev];
    });
  };

  // Stage 12 Site Readiness Tasks & Certificate
  const addSiteTask = (task: Omit<SiteReadinessTask, 'id'>) => {
    const newTask: SiteReadinessTask = {
      ...task,
      id: `st-${Date.now()}`,
    };
    setSiteTasks((prev) => [...prev, newTask]);
  };

  const updateSiteTask = (id: string, updates: Partial<SiteReadinessTask>) => {
    setSiteTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const generateSiteCertificate = (
    projectId: string,
    approvedBy: { civil: string; electrical: string; mechanical: string; project: string },
    overrideReason?: string
  ): SiteReadinessCertificate => {
    const year = new Date().getFullYear();
    const certNum = `SRC-${year}-${String(siteCertificates.length + 1).padStart(5, '0')}`;
    const pTasks = siteTasks.filter((t) => t.projectId === projectId);
    const civTasks = pTasks.filter((t) => t.category === 'CIVIL');
    const elecTasks = pTasks.filter((t) => t.category === 'ELECTRICAL');
    const mechTasks = pTasks.filter((t) => t.category === 'MECHANICAL');

    const civPct = civTasks.length > 0 ? Math.round((civTasks.filter((t) => t.status === 'Completed').length / civTasks.length) * 100) : 100;
    const elecPct = elecTasks.length > 0 ? Math.round((elecTasks.filter((t) => t.status === 'Completed').length / elecTasks.length) * 100) : 100;
    const mechPct = mechTasks.length > 0 ? Math.round((mechTasks.filter((t) => t.status === 'Completed').length / mechTasks.length) * 100) : 100;
    const overall = Math.round((civPct + elecPct + mechPct) / 3);

    const proj = projects.find((p) => p.id === projectId);

    const newCert: SiteReadinessCertificate = {
      id: `src-${Date.now()}`,
      certificateNumber: certNum,
      projectId,
      siteName: proj?.siteName || 'Client Site',
      inspectionDate: new Date().toISOString().substring(0, 10),
      civilCompletionPercent: civPct,
      electricalCompletionPercent: elecPct,
      mechanicalCompletionPercent: mechPct,
      overallReadinessPercent: overall,
      civilApprovedBy: approvedBy.civil,
      electricalApprovedBy: approvedBy.electrical,
      mechanicalApprovedBy: approvedBy.mechanical,
      projectApprovedBy: approvedBy.project,
      certificateDate: new Date().toISOString().substring(0, 10),
      managementOverrideReason: overrideReason,
    };

    setSiteCertificates((prev) => [newCert, ...prev]);

    // Mark project as site ready
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isSiteReady: true } : p))
    );

    recordAuditLog({
      userName: approvedBy.project,
      userRole: 'PROJECT',
      projectId,
      projectNumber: proj?.projectNumber,
      module: 'Site Readiness',
      recordId: newCert.id,
      action: 'APPROVE',
      summary: `Issued Official Site Readiness Certificate ${certNum} for ${proj?.projectNumber} (${overall}% readiness)`,
      newValue: JSON.stringify(newCert),
    });

    return newCert;
  };

  const setSiteReadyDecision = (projectId: string, isReady: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isSiteReady: isReady } : p))
    );

    const proj = projects.find((p) => p.id === projectId);
    if (!isReady) {
      // Find incomplete tasks and copy to pending works if not already present
      const incomplete = siteTasks.filter(
        (t) => t.projectId === projectId && t.required && t.status !== 'Completed' && t.status !== 'Not Applicable'
      );
      for (const inc of incomplete) {
        addPendingTask({
          projectId,
          projectNumber: proj?.projectNumber || '',
          category: inc.category === 'CIVIL' ? 'Civil Pending' : inc.category === 'ELECTRICAL' ? 'Electrical Pending' : 'Mechanical Pending',
          relatedStage: 'SITE_READINESS',
          description: `Site not ready: ${inc.task}. Remarks: ${inc.remarks || 'Pending completion'}`,
          responsibleDepartment: inc.category,
          responsiblePerson: inc.responsiblePerson,
          createdDate: new Date().toISOString().substring(0, 10),
          targetDate: inc.targetDate,
          priority: 'High',
          status: 'Open',
          delayDays: 0,
        });
      }
    }
  };

  // Centralized Pending Works
  const addPendingTask = (task: Omit<PendingTask, 'id'>) => {
    const year = new Date().getFullYear();
    const id = `PEN-${String(pendingTasks.length + 1).padStart(5, '0')}`;
    const newTask: PendingTask = {
      ...task,
      id,
    };
    setPendingTasks((prev) => [newTask, ...prev]);
  };

  const updatePendingTask = (id: string, updates: Partial<PendingTask>) => {
    setPendingTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const resolvePendingTask = (id: string, closureRemarks: string) => {
    const today = new Date().toISOString().substring(0, 10);
    setPendingTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Closed',
              closedDate: today,
              closureRemarks,
            }
          : t
      )
    );
  };

  // Stage 13 Material Receipts (GRN)
  const saveMaterialReceipt = (receipt: Omit<MaterialReceiptRecord, 'id'>) => {
    const newReceipt: MaterialReceiptRecord = {
      ...receipt,
      id: `grn-${Date.now()}`,
    };
    setMaterialReceipts((prev) => [newReceipt, ...prev]);
  };

  // Stage 14 Installation Activities
  const addInstallationActivity = (act: Omit<InstallationActivity, 'id'>) => {
    const newAct: InstallationActivity = {
      ...act,
      id: `inst-${Date.now()}`,
    };
    setInstallationActivities((prev) => [...prev, newAct]);
  };

  const updateInstallationActivity = (id: string, updates: Partial<InstallationActivity>) => {
    setInstallationActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Stage 15 Daily Progress
  const addDailyProgress = (dp: Omit<DailyProgressEntry, 'id'>) => {
    const newDP: DailyProgressEntry = {
      ...dp,
      id: `dp-${Date.now()}`,
    };
    setDailyProgress((prev) => [newDP, ...prev]);

    // If problems noted, option to automatically log pending task
    if (dp.problems && dp.pendingItems) {
      const proj = projects.find((p) => p.id === dp.projectId);
      addPendingTask({
        projectId: dp.projectId,
        projectNumber: proj?.projectNumber || '',
        category: dp.installationCategory === 'Civil' ? 'Civil Pending' : dp.installationCategory === 'Electrical' ? 'Electrical Pending' : 'Mechanical Pending',
        relatedStage: 'WORK_PROGRESS',
        description: `Daily Progress Issue (${dp.workActivity}): ${dp.problems}. Pending: ${dp.pendingItems}`,
        responsibleDepartment: 'Project',
        responsiblePerson: dp.responsiblePerson,
        createdDate: dp.date,
        targetDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
        priority: 'Normal',
        status: 'Open',
        delayDays: 0,
      });
    }
  };

  // Stage 16 Pre-Commissioning Checks
  const addPrecommissioningCheck = (chk: Omit<PreCommissioningCheckItem, 'id'>) => {
    const newChk: PreCommissioningCheckItem = {
      ...chk,
      id: `pc-${Date.now()}`,
    };
    setPrecommissioningChecks((prev) => [...prev, newChk]);
  };

  const updatePrecommissioningCheck = (id: string, updates: Partial<PreCommissioningCheckItem>) => {
    setPrecommissioningChecks((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Stage 17 Commissioning
  const saveCommissioningRecord = (comm: Partial<CommissioningRecord> & { projectId: string }) => {
    setCommissioningRecords((prev) => {
      const idx = prev.findIndex((c) => c.projectId === comm.projectId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...comm };
        return updated;
      }
      const newComm: CommissioningRecord = {
        id: `comm-${Date.now()}`,
        projectId: comm.projectId,
        commissioningDate: comm.commissioningDate || new Date().toISOString().substring(0, 10),
        trialRunStart: comm.trialRunStart || '',
        trialRunEnd: comm.trialRunEnd || '',
        trialDurationHours: comm.trialDurationHours || 0,
        machineRunningHours: comm.machineRunningHours || 0,
        parameterChecks: comm.parameterChecks || '',
        adjustmentDetails: comm.adjustmentDetails || '',
        performanceTest: comm.performanceTest || '',
        performanceResult: comm.performanceResult || '',
        customerRepresentative: comm.customerRepresentative || '',
        commissioningEngineer: comm.commissioningEngineer || '',
        finalCommissioningStatus: comm.finalCommissioningStatus || 'Trial Running',
        customerAcceptanceDate: comm.customerAcceptanceDate,
      };
      return [newComm, ...prev];
    });
  };

  // Stage 18 Machine Start Date
  const recordMachineStart = (ms: Omit<MachineStartRecord, 'id'>) => {
    const newMS: MachineStartRecord = {
      ...ms,
      id: `ms-${Date.now()}`,
    };
    setMachineStartRecords((prev) => [newMS, ...prev]);

    const proj = projects.find((p) => p.id === ms.projectId);
    recordAuditLog({
      userName: ms.recordedBy,
      userRole: 'MANAGEMENT',
      projectId: ms.projectId,
      projectNumber: proj?.projectNumber,
      module: 'Machine Start Date',
      recordId: newMS.id,
      action: 'APPROVE',
      summary: `Official Commercial Machine Start Date confirmed for ${proj?.projectNumber} on ${ms.officialMachineStartDate} at ${ms.startTime}`,
      newValue: JSON.stringify(ms),
    });
  };

  // Stage 19 Documents
  const addDocument = (doc: Omit<ProjectDocument, 'id' | 'uploadedDate'>) => {
    const newDoc: ProjectDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedDate: new Date().toISOString().substring(0, 10),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Stage 20 Final Payment
  const saveFinalPayment = (fp: Partial<FinalPaymentRecord> & { projectId: string }) => {
    setFinalPayments((prev) => {
      const idx = prev.findIndex((f) => f.projectId === fp.projectId);
      const invoiceAmt = fp.finalInvoiceAmount || 0;
      const recAmt = fp.amountReceived || 0;
      const pending = Math.max(0, invoiceAmt - recAmt);

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...fp,
          pendingAmount: pending,
          duesClearanceStatus: pending === 0 ? 'Fully Cleared' : recAmt > 0 ? 'Partially Cleared' : 'Pending',
        };
        return updated;
      }
      const newFP: FinalPaymentRecord = {
        id: `fp-${Date.now()}`,
        projectId: fp.projectId,
        finalInvoiceNumber: fp.finalInvoiceNumber || 'INV-FINAL-001',
        finalInvoiceDate: fp.finalInvoiceDate || new Date().toISOString().substring(0, 10),
        finalInvoiceAmount: invoiceAmt,
        paymentDueDate: fp.paymentDueDate || '',
        amountReceived: recAmt,
        receivedDate: fp.receivedDate,
        pendingAmount: pending,
        duesClearanceStatus: pending === 0 ? 'Fully Cleared' : recAmt > 0 ? 'Partially Cleared' : 'Pending',
      };
      return [newFP, ...prev];
    });
  };

  // Stage 21 Service Tickets
  const addServiceTicket = (tkt: Omit<ServiceTicket, 'id' | 'ticketNumber'>) => {
    const year = new Date().getFullYear();
    const count = serviceTickets.length + 1;
    const num = `SRV-${year}-${String(count).padStart(5, '0')}`;
    const newTkt: ServiceTicket = {
      ...tkt,
      id: `tkt-${Date.now()}`,
      ticketNumber: num,
    };
    setServiceTickets((prev) => [newTkt, ...prev]);
  };

  const updateServiceTicket = (id: string, updates: Partial<ServiceTicket>) => {
    setServiceTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Comments
  const addComment = (projectId: string, comment: string, stageId?: ProcessStageId, userName = 'User', userRole = 'Engineer') => {
    const newC: ProjectComment = {
      id: `comm-${Date.now()}`,
      projectId,
      stageId,
      userName,
      userRole,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comment,
    };
    setComments((prev) => [newC, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Update Stage Weight Config
  const updateStageConfig = (id: ProcessStageId, weightPercent: number) => {
    setStageConfigs((prev) => prev.map((s) => (s.id === id ? { ...s, weightPercent } : s)));
  };

  // Export helper
  const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rows.map((row) =>
          headers
            .map((field) => {
              const val = row[field] ?? '';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        projects,
        requests,
        clarifications,
        technicalReviews,
        quotations,
        negotiations,
        paymentMilestones,
        approvalRequests,
        approvalHistory,
        workOrders,
        advancePayments,
        manufacturingActivities,
        procurementItems,
        qcInspections,
        dispatchRecords,
        deliveryRecords,
        siteTasks,
        siteCertificates,
        pendingTasks,
        materialReceipts,
        installationActivities,
        dailyProgress,
        precommissioningChecks,
        commissioningRecords,
        machineStartRecords,
        documents,
        finalPayments,
        serviceTickets,
        auditLogs,
        comments,
        notifications,
        stageConfigs,

        addProject,
        updateProject,
        deleteProject,
        advanceProjectStage,
        calculateProjectProgress,

        saveRequest,
        addClarification,
        updateClarification,
        saveTechnicalReview,
        createQuotation,
        createQuotationRevision,
        addNegotiation,
        addPaymentMilestone,
        updatePaymentMilestone,
        requestApproval,
        processApproval,
        saveWorkOrder,
        saveAdvancePayment,
        addManufacturingActivity,
        updateManufacturingActivity,
        addProcurementItem,
        updateProcurementItem,
        addQCInspection,
        saveDispatchRecord,
        saveDeliveryRecord,
        addSiteTask,
        updateSiteTask,
        generateSiteCertificate,
        setSiteReadyDecision,
        addPendingTask,
        updatePendingTask,
        resolvePendingTask,
        saveMaterialReceipt,
        addInstallationActivity,
        updateInstallationActivity,
        addDailyProgress,
        addPrecommissioningCheck,
        updatePrecommissioningCheck,
        saveCommissioningRecord,
        recordMachineStart,
        addDocument,
        deleteDocument,
        saveFinalPayment,
        addServiceTicket,
        updateServiceTicket,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        recordAuditLog,
        updateStageConfig,
        exportToCsv,
        supabaseSyncStatus,
        pushLocalToSupabase,
        pullSupabaseToLocal,
        checkTablesStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
