import { getSupabaseClient } from './supabase';
import { Project, Customer, PendingTask, SiteReadinessTask, AuditLogEntry, ProcessStageId, ProjectStatus, ProjectHealth, Priority } from '../types';

/**
 * Mappers between Frontend Types and PostgreSQL snake_case Schema
 */

export function projectToDb(p: Project) {
  return {
    id: p.id,
    project_number: p.projectNumber,
    project_name: p.projectName,
    customer_id: p.customerId,
    customer_name: p.customerName,
    customer_code: p.customerCode,
    contact_person: p.contactPerson || null,
    phone: p.phone || null,
    email: p.email || null,
    customer_address: p.customerAddress || null,
    site_name: p.siteName,
    site_address: p.siteAddress,
    machine_type: p.machineType,
    machine_model: p.machineModel,
    application: p.application,
    capacity: p.capacity,
    specification: p.specification || null,
    quantity: p.quantity || 1,
    sales_person: p.salesPerson,
    project_manager: p.projectManager,
    technical_person: p.technicalPerson || null,
    commercial_person: p.commercialPerson || null,
    expected_order_value: p.expectedOrderValue || 0,
    currency: p.currency || 'USD',
    expected_start_date: p.expectedStartDate,
    target_delivery_date: p.targetDeliveryDate,
    machine_required_date: p.machineRequiredDate,
    priority: p.priority || 'Normal',
    current_stage: p.currentStage || 'REQUEST_RECEIVED',
    project_status: p.projectStatus || 'Active',
    overall_completion_percent: p.overallCompletionPercent || 0,
    health: p.health || 'Green',
    delay_days: p.delayDays || 0,
    is_site_ready: Boolean(p.isSiteReady),
  };
}

export function dbToProject(row: any): Project {
  return {
    id: row.id,
    projectNumber: row.project_number,
    projectName: row.project_name,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerCode: row.customer_code,
    contactPerson: row.contact_person || '',
    phone: row.phone || '',
    email: row.email || '',
    customerAddress: row.customer_address || '',
    siteName: row.site_name,
    siteAddress: row.site_address,
    machineType: row.machine_type,
    machineModel: row.machine_model,
    application: row.application,
    capacity: row.capacity,
    specification: row.specification || '',
    quantity: row.quantity || 1,
    salesPerson: row.sales_person,
    projectManager: row.project_manager,
    technicalPerson: row.technical_person || '',
    commercialPerson: row.commercial_person || '',
    expectedOrderValue: Number(row.expected_order_value) || 0,
    currency: row.currency || 'USD',
    expectedStartDate: row.expected_start_date,
    targetDeliveryDate: row.target_delivery_date,
    machineRequiredDate: row.machine_required_date,
    priority: (row.priority as Priority) || 'Normal',
    currentStage: (row.current_stage as ProcessStageId) || 'REQUEST_RECEIVED',
    projectStatus: (row.project_status as ProjectStatus) || 'Active',
    overallCompletionPercent: Number(row.overall_completion_percent) || 0,
    health: (row.health as ProjectHealth) || 'Green',
    delayDays: Number(row.delay_days) || 0,
    isSiteReady: Boolean(row.is_site_ready),
    createdBy: row.created_by || 'System',
    lastModifiedBy: row.last_modified_by || 'System',
    createdDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    lastModifiedDate: row.last_modified_at ? new Date(row.last_modified_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function customerToDb(c: Customer) {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    contact_person: c.contactPerson,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    country: c.country || 'India',
    gst_or_tax_id: c.gstOrTaxId || null,
  };
}

export function dbToCustomer(row: any): Customer {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    country: row.country || 'India',
    gstOrTaxId: row.gst_or_tax_id || undefined,
    createdDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function pendingTaskToDb(t: PendingTask) {
  return {
    id: t.id,
    project_id: t.projectId,
    project_number: t.projectNumber,
    category: t.category,
    related_stage: t.relatedStage,
    description: t.description,
    responsible_department: t.responsibleDepartment,
    responsible_person: t.responsiblePerson,
    created_date: t.createdDate,
    target_date: t.targetDate,
    priority: t.priority,
    status: t.status,
    closed_date: t.closedDate || null,
    closure_remarks: t.closureRemarks || null,
    delay_days: t.delayDays || 0,
  };
}

export function dbToPendingTask(row: any): PendingTask {
  return {
    id: row.id,
    projectId: row.project_id,
    projectNumber: row.project_number,
    category: row.category,
    relatedStage: row.related_stage,
    description: row.description,
    responsibleDepartment: row.responsible_department,
    responsiblePerson: row.responsible_person,
    createdDate: row.created_date,
    targetDate: row.target_date,
    priority: row.priority || 'Normal',
    status: row.status || 'Open',
    closedDate: row.closed_date || undefined,
    closureRemarks: row.closure_remarks || undefined,
    delayDays: Number(row.delay_days) || 0,
  };
}

export function siteTaskToDb(t: SiteReadinessTask) {
  return {
    id: t.id,
    project_id: t.projectId,
    category: t.category,
    task: t.task,
    required: t.required,
    status: t.status,
    responsible_person: t.responsiblePerson,
    target_date: t.targetDate,
    completed_date: t.completedDate || null,
    verified_by: t.verifiedBy || null,
    verification_date: t.verificationDate || null,
    remarks: t.remarks || null,
  };
}

export function dbToSiteTask(row: any): SiteReadinessTask {
  return {
    id: row.id,
    projectId: row.project_id,
    category: row.category,
    task: row.task,
    required: Boolean(row.required),
    status: row.status,
    responsiblePerson: row.responsible_person,
    targetDate: row.target_date,
    completedDate: row.completed_date || undefined,
    verifiedBy: row.verified_by || undefined,
    verificationDate: row.verification_date || undefined,
    remarks: row.remarks || undefined,
  };
}

export function auditLogToDb(a: AuditLogEntry) {
  return {
    id: a.id,
    timestamp: a.timestamp,
    user_name: a.userName,
    user_role: a.userRole,
    project_id: a.projectId || null,
    project_number: a.projectNumber || null,
    module: a.module,
    record_id: a.recordId || a.id,
    action: a.action,
    summary: a.summary,
    old_value: a.oldValue || null,
    new_value: a.newValue || null,
  };
}

export function dbToAuditLog(row: any): AuditLogEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    userName: row.user_name,
    userRole: row.user_role,
    projectId: row.project_id || undefined,
    projectNumber: row.project_number || undefined,
    module: row.module,
    recordId: row.record_id || row.id,
    action: row.action,
    summary: row.summary,
    oldValue: row.old_value || undefined,
    newValue: row.new_value || undefined,
  };
}

/**
 * Remote Supabase Live Data Operations
 */

export async function fetchProjectsFromSupabase(): Promise<{ data: Project[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await client.from('projects').select('*').order('created_at', { ascending: false });
    if (error) return { data: null, error };
    return { data: (data || []).map(dbToProject), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function fetchCustomersFromSupabase(): Promise<{ data: Customer[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await client.from('customers').select('*').order('name');
    if (error) return { data: null, error };
    return { data: (data || []).map(dbToCustomer), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function fetchPendingTasksFromSupabase(): Promise<{ data: PendingTask[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await client.from('pending_tasks').select('*').order('created_date', { ascending: false });
    if (error) return { data: null, error };
    return { data: (data || []).map(dbToPendingTask), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function fetchSiteTasksFromSupabase(): Promise<{ data: SiteReadinessTask[] | null; error: any }> {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: 'Supabase not configured' };
  try {
    const { data, error } = await client.from('site_readiness_tasks').select('*');
    if (error) return { data: null, error };
    return { data: (data || []).map(dbToSiteTask), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function upsertProjectToSupabase(project: Project): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const dbRow = projectToDb(project);
    const { error } = await client.from('projects').upsert(dbRow, { onConflict: 'id' });
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const { error } = await client.from('projects').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function upsertCustomerToSupabase(customer: Customer): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const dbRow = customerToDb(customer);
    const { error } = await client.from('customers').upsert(dbRow, { onConflict: 'id' });
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteCustomerFromSupabase(id: string): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const { error } = await client.from('customers').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function upsertPendingTaskToSupabase(task: PendingTask): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const dbRow = pendingTaskToDb(task);
    const { error } = await client.from('pending_tasks').upsert(dbRow, { onConflict: 'id' });
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function upsertSiteTaskToSupabase(task: SiteReadinessTask): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const dbRow = siteTaskToDb(task);
    const { error } = await client.from('site_readiness_tasks').upsert(dbRow, { onConflict: 'id' });
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function insertAuditLogToSupabase(log: AuditLogEntry): Promise<{ error: any }> {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase not configured' };
  try {
    const dbRow = auditLogToDb(log);
    const { error } = await client.from('audit_logs').insert(dbRow);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

/**
 * Pushes full local seed dataset to Supabase
 */
export async function pushSeedDataToSupabase(
  customers: Customer[],
  projects: Project[],
  tasks: PendingTask[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase connection is not configured.' };
  }

  try {
    // 1. Push customers
    const custRows = customers.map(customerToDb);
    const { error: custErr } = await client.from('customers').upsert(custRows, { onConflict: 'id' });
    if (custErr) throw custErr;

    // 2. Push projects
    const projRows = projects.map(projectToDb);
    const { error: projErr } = await client.from('projects').upsert(projRows, { onConflict: 'id' });
    if (projErr) throw projErr;

    // 3. Push pending tasks
    const taskRows = tasks.map(pendingTaskToDb);
    const { error: taskErr } = await client.from('pending_tasks').upsert(taskRows, { onConflict: 'id' });
    if (taskErr) throw taskErr;

    return {
      success: true,
      message: `Successfully synchronized ${customers.length} customers, ${projects.length} machines, and ${tasks.length} pending punchlist tasks to Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Error synchronizing seed dataset to Supabase.',
    };
  }
}

