/**
 * Supabase PostgreSQL Database Schema Definitions
 * Covers all 21 Process Stages, Master Entities, Relations & Constraints
 */

export interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey?: boolean;
  foreignKey?: string;
  nullable?: boolean;
  defaultValue?: string;
  description: string;
}

export interface TableDefinition {
  name: string;
  displayName: string;
  category: 'Core Master' | 'Commercial & Quotations' | 'Engineering & Production' | 'Site & Installation' | 'Commissioning & Handover' | 'Governance & Service';
  stage: string;
  description: string;
  columns: ColumnDefinition[];
}

export const SCHEMA_TABLES: TableDefinition[] = [
  {
    name: 'projects',
    displayName: 'Machines & Projects Master',
    category: 'Core Master',
    stage: 'Stages 1 - 21 (Full Lifecycle)',
    description: 'Central registry for all industrial machines, equipment packages, progress, health, and commercial values.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, defaultValue: 'uuid_generate_v4()', description: 'Unique identifier for the machine project' },
      { name: 'project_number', type: 'VARCHAR(50)', nullable: false, description: 'Unique machine code (e.g. MCH-2024-001 or PRJ-2026-00001)' },
      { name: 'project_name', type: 'VARCHAR(255)', nullable: false, description: 'Machine description or model title' },
      { name: 'customer_id', type: 'UUID / TEXT', foreignKey: 'customers(id)', nullable: false, description: 'Foreign key to customer record' },
      { name: 'customer_name', type: 'VARCHAR(255)', nullable: false, description: 'Client / enterprise name' },
      { name: 'customer_code', type: 'VARCHAR(50)', nullable: false, description: 'Unique customer code identifier' },
      { name: 'machine_type', type: 'VARCHAR(150)', nullable: false, description: 'Type of machine (e.g. Stenter, Dyeing Vessel, Calender)' },
      { name: 'machine_model', type: 'VARCHAR(150)', nullable: false, description: 'Specific manufacturer model code' },
      { name: 'capacity', type: 'VARCHAR(150)', nullable: false, description: 'Rated production capacity (e.g. 75 m/min, 1000 kg/batch)' },
      { name: 'application', type: 'VARCHAR(255)', nullable: false, description: 'Fabric / industrial process application' },
      { name: 'specification', type: 'TEXT', nullable: true, description: 'Technical scope & mechanical specifications' },
      { name: 'quantity', type: 'INT', nullable: false, defaultValue: '1', description: 'Number of machine units' },
      { name: 'sales_person', type: 'VARCHAR(150)', nullable: false, description: 'Assigned Sales Executive' },
      { name: 'project_manager', type: 'VARCHAR(150)', nullable: false, description: 'Lead Project Manager / In-Charge' },
      { name: 'technical_person', type: 'VARCHAR(150)', nullable: true, description: 'Assigned Lead Technical Engineer' },
      { name: 'commercial_person', type: 'VARCHAR(150)', nullable: true, description: 'Assigned Commercial / Purchase Officer' },
      { name: 'expected_order_value', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Contract / Order monetary value' },
      { name: 'currency', type: 'VARCHAR(10)', defaultValue: "'USD'", description: 'Currency code (USD, INR, EUR)' },
      { name: 'expected_start_date', type: 'DATE', nullable: false, description: 'Kickoff / order placement date' },
      { name: 'target_delivery_date', type: 'DATE', nullable: false, description: 'Committed site arrival deadline' },
      { name: 'machine_required_date', type: 'DATE', nullable: false, description: 'Customer site readiness required date' },
      { name: 'current_stage', type: 'VARCHAR(50)', defaultValue: "'REQUEST_RECEIVED'", description: 'Active stage key (1 to 21)' },
      { name: 'project_status', type: 'VARCHAR(50)', defaultValue: "'Active'", description: 'Status: Draft, Active, Delayed, Completed' },
      { name: 'overall_completion_percent', type: 'NUMERIC(5,2)', defaultValue: '0.00', description: 'Weighted completion percentage (0 - 100%)' },
      { name: 'health', type: 'VARCHAR(20)', defaultValue: "'Green'", description: 'Health indicator: Green, Amber, Red' },
      { name: 'delay_days', type: 'INT', defaultValue: '0', description: 'Cumulative schedule delay in days' },
      { name: 'is_site_ready', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Site readiness verification flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Record creation timestamp' },
    ],
  },
  {
    name: 'customers',
    displayName: 'Customers & Clients Master',
    category: 'Core Master',
    stage: 'Master Data',
    description: 'Master record of industrial clients, contact officers, GST/Tax IDs, and site addresses.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, defaultValue: 'uuid_generate_v4()', description: 'Primary key' },
      { name: 'code', type: 'VARCHAR(50)', nullable: false, description: 'Customer code (e.g. CUST-001)' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Company / Organization title' },
      { name: 'contact_person', type: 'VARCHAR(150)', nullable: false, description: 'Primary officer contact' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Official email address' },
      { name: 'phone', type: 'VARCHAR(50)', nullable: false, description: 'Contact phone number' },
      { name: 'address', type: 'TEXT', nullable: false, description: 'Corporate & plant postal address' },
      { name: 'city', type: 'VARCHAR(100)', nullable: false, description: 'Operational city' },
      { name: 'country', type: 'VARCHAR(100)', defaultValue: "'India'", description: 'Country of operation' },
      { name: 'gst_or_tax_id', type: 'VARCHAR(50)', nullable: true, description: 'GSTIN / Corporate Tax Registration' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Creation timestamp' },
    ],
  },
  {
    name: 'request_received',
    displayName: 'Stage 1: Enquiry & Scope',
    category: 'Commercial & Quotations',
    stage: 'Stage 1: Request Received',
    description: 'Initial customer inquiry, tender specifications, and scope of supply intake.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Related machine project' },
      { name: 'request_date', type: 'DATE', nullable: false, description: 'Date enquiry was received' },
      { name: 'customer_requirement', type: 'TEXT', nullable: false, description: 'Detailed requirement statement' },
      { name: 'machine_type', type: 'VARCHAR(150)', nullable: true, description: 'Requested machine classification' },
      { name: 'capacity', type: 'VARCHAR(150)', nullable: true, description: 'Required machine throughput' },
      { name: 'source_of_enquiry', type: 'VARCHAR(50)', nullable: true, description: 'Direct, Tender, Exhibition, Agent' },
      { name: 'sales_person', type: 'VARCHAR(150)', nullable: true, description: 'Handling sales representative' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Draft'", description: 'Draft, Reviewed, Converted' },
    ],
  },
  {
    name: 'clarifications',
    displayName: 'Stage 2: Question & Clarifications',
    category: 'Commercial & Quotations',
    stage: 'Stage 2: Question Received',
    description: 'Commercial & technical question logs, customer responses, and mandatory resolution checkpoints.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'clarification_date', type: 'DATE', nullable: false, description: 'Date question was logged' },
      { name: 'clarification_type', type: 'VARCHAR(50)', nullable: false, description: 'Technical, Commercial, Civil, Utility' },
      { name: 'question', type: 'TEXT', nullable: false, description: 'Specific query raised' },
      { name: 'customer_response', type: 'TEXT', nullable: true, description: 'Official response from buyer' },
      { name: 'responsible_department', type: 'VARCHAR(100)', nullable: false, description: 'Technical, Sales, Purchase' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Open'", description: 'Open, In Review, Resolved' },
      { name: 'is_mandatory', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Blocking flag for progression' },
    ],
  },
  {
    name: 'technical_reviews',
    displayName: 'Stage 3: Technical Comprehension',
    category: 'Commercial & Quotations',
    stage: 'Stage 3: Technical Comprehension',
    description: 'Engineering feasibility checks, utility requirements, power ratings, and sign-offs.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'feasibility_check', type: 'VARCHAR(50)', nullable: false, description: 'Feasible, Feasible with Deviations, Critical' },
      { name: 'technical_specification', type: 'TEXT', nullable: true, description: 'Approved engineering parameters' },
      { name: 'utility_requirement', type: 'TEXT', nullable: true, description: 'Power (kW), Gas (kg/h), Water (L/h)' },
      { name: 'site_requirement', type: 'TEXT', nullable: true, description: 'Footprint, Foundation & Ceiling clearance' },
      { name: 'responsible_engineer', type: 'VARCHAR(150)', nullable: false, description: 'Lead design engineer' },
      { name: 'is_approved', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Technical sign-off flag' },
    ],
  },
  {
    name: 'quotations',
    displayName: 'Stage 4: Quotations & Revisions',
    category: 'Commercial & Quotations',
    stage: 'Stage 4: Quotation Received',
    description: 'Detailed commercial proposals with revision history (Rev 0, Rev 1), tax, freight, and payment conditions.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'quotation_number', type: 'VARCHAR(50)', nullable: false, description: 'Official quote number' },
      { name: 'revision_number', type: 'INT', defaultValue: '0', description: '0 for initial, 1 for Rev 1, etc.' },
      { name: 'quotation_date', type: 'DATE', nullable: false, description: 'Issue date' },
      { name: 'valid_until', type: 'DATE', nullable: false, description: 'Offer expiry date' },
      { name: 'basic_price', type: 'NUMERIC(15,2)', nullable: false, description: 'Base equipment price' },
      { name: 'taxes', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'GST / Duties amount' },
      { name: 'freight', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Logistics & transit insurance' },
      { name: 'installation_charges', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Erection & commissioning fees' },
      { name: 'total_amount', type: 'NUMERIC(15,2)', nullable: false, description: 'Grand total offer value' },
      { name: 'currency', type: 'VARCHAR(10)', defaultValue: "'USD'", description: 'Currency code' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Sent'", description: 'Draft, Sent, Under Negotiation, Accepted' },
    ],
  },
  {
    name: 'commercial_negotiations',
    displayName: 'Stage 5: Commercial Negotiations',
    category: 'Commercial & Quotations',
    stage: 'Stage 5: Commercial Negotiation',
    description: 'Audit record of commercial meetings, price adjustments, payment terms, and buyer counter-proposals.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'negotiation_date', type: 'DATE', nullable: false, description: 'Meeting date' },
      { name: 'price_discussed', type: 'NUMERIC(15,2)', nullable: false, description: 'Quoted figure' },
      { name: 'discount', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Concession / Discount offered' },
      { name: 'final_price', type: 'NUMERIC(15,2)', nullable: false, description: 'Agreed contract price' },
      { name: 'payment_terms', type: 'TEXT', nullable: true, description: 'Agreed milestone structure' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Negotiation Open'", description: 'Negotiation Open, Terms Agreed, Finalized' },
    ],
  },
  {
    name: 'payment_milestones',
    displayName: 'Payment Milestones Schedule',
    category: 'Commercial & Quotations',
    stage: 'Commercial / All Stages',
    description: 'Structured progress payment triggers (Advance, Ready for Dispatch, Commissioning, Final Retention).',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'milestone_name', type: 'VARCHAR(150)', nullable: false, description: 'Advance, Delivery, Handover milestone' },
      { name: 'percentage', type: 'NUMERIC(5,2)', nullable: false, description: 'Percent of total contract' },
      { name: 'amount', type: 'NUMERIC(15,2)', nullable: false, description: 'Calculated milestone value' },
      { name: 'due_condition', type: 'TEXT', nullable: false, description: 'Trigger condition (e.g. Against Work Order)' },
      { name: 'invoice_number', type: 'VARCHAR(50)', nullable: true, description: 'Generated tax invoice ref' },
      { name: 'amount_received', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Realized remittance' },
      { name: 'payment_status', type: 'VARCHAR(50)', defaultValue: "'Not Due'", description: 'Not Due, Invoiced, Paid, Overdue' },
    ],
  },
  {
    name: 'approval_requests',
    displayName: 'Stage 6: PO & Internal Approvals',
    category: 'Commercial & Quotations',
    stage: 'Stage 6: Approval',
    description: 'Customer Purchase Order validation, management commercial clearances, and internal work authorizations.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'po_received', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Purchase order document received' },
      { name: 'po_number', type: 'VARCHAR(100)', nullable: true, description: 'Customer purchase order number' },
      { name: 'po_value', type: 'NUMERIC(15,2)', nullable: true, description: 'Verified PO total value' },
      { name: 'approval_status', type: 'VARCHAR(50)', defaultValue: "'Pending'", description: 'Pending, Approved, Rejected' },
      { name: 'requested_by', type: 'VARCHAR(150)', nullable: false, description: 'Sales officer submitting request' },
      { name: 'approved_by', type: 'VARCHAR(150)', nullable: true, description: 'Director / Management approver' },
      { name: 'approved_date', type: 'TIMESTAMPTZ', nullable: true, description: 'Formal clearance timestamp' },
    ],
  },
  {
    name: 'work_orders',
    displayName: 'Stage 7: Internal Work Order',
    category: 'Engineering & Production',
    stage: 'Stage 7: Work Order',
    description: 'Factory manufacturing order issuance, BOM lock, production planning, and shopfloor scheduling.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'internal_work_order_number', type: 'VARCHAR(50)', nullable: false, description: 'Unique factory WO code' },
      { name: 'work_order_date', type: 'DATE', nullable: false, description: 'Issuance date' },
      { name: 'bom_status', type: 'VARCHAR(50)', defaultValue: "'Draft'", description: 'BOM status: Draft, Verified, Released' },
      { name: 'target_manufacturing_start', type: 'DATE', nullable: false, description: 'Fabrication commencement target' },
      { name: 'target_manufacturing_completion', type: 'DATE', nullable: false, description: 'Shopfloor testing target' },
      { name: 'is_checklist_complete', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Mandatory kickoff checklist flag' },
    ],
  },
  {
    name: 'advance_payments',
    displayName: 'Stage 8: Advance Payment Milestone',
    category: 'Commercial & Quotations',
    stage: 'Stage 8: Advance Payment',
    description: 'Advance payment invoice generation, bank remittance verification, LC/Bank Guarantee tracking.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'advance_percentage', type: 'NUMERIC(5,2)', nullable: false, description: 'Agreed advance % (e.g. 20%)' },
      { name: 'advance_amount', type: 'NUMERIC(15,2)', nullable: false, description: 'Advance monetary requirement' },
      { name: 'invoice_number', type: 'VARCHAR(50)', nullable: false, description: 'Proforma / advance invoice' },
      { name: 'payment_received', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Bank receipt confirmation' },
      { name: 'amount_received', type: 'NUMERIC(15,2)', defaultValue: '0.00', description: 'Credited bank amount' },
      { name: 'transaction_reference', type: 'VARCHAR(150)', nullable: true, description: 'UTR / SWIFT reference number' },
    ],
  },
  {
    name: 'manufacturing_activities',
    displayName: 'Stage 9: Manufacturing Shopfloor Tracking',
    category: 'Engineering & Production',
    stage: 'Stage 9: Manufacturing',
    description: 'Sub-assembly progress (Chamber fabrication, Electrical panel wiring, Roller grinding, Pneumatics).',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Fabrication, Machining, Assembly, Testing' },
      { name: 'activity', type: 'VARCHAR(255)', nullable: false, description: 'Specific station work description' },
      { name: 'planned_start', type: 'DATE', nullable: false, description: 'Scheduled start date' },
      { name: 'planned_end', type: 'DATE', nullable: false, description: 'Scheduled completion' },
      { name: 'completion_percent', type: 'NUMERIC(5,2)', defaultValue: '0.00', description: 'Progress (0 to 100%)' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Not Started'", description: 'Not Started, In Progress, Completed' },
      { name: 'delay_days', type: 'INT', defaultValue: '0', description: 'Shopfloor variance in days' },
    ],
  },
  {
    name: 'site_readiness_tasks',
    displayName: 'Stage 12: Site Readiness Checklist',
    category: 'Site & Installation',
    stage: 'Stage 12: Site Readiness',
    description: 'Pre-dispatch physical inspection tasks across Civil, Electrical, and Mechanical readiness at customer mill.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'CIVIL, ELECTRICAL, MECHANICAL' },
      { name: 'task', type: 'VARCHAR(255)', nullable: false, description: 'Specific prerequisite item' },
      { name: 'required', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Is critical path item' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Not Started'", description: 'Not Started, In Progress, Ready' },
      { name: 'responsible_person', type: 'VARCHAR(150)', nullable: false, description: 'Site engineer in charge' },
      { name: 'target_date', type: 'DATE', nullable: false, description: 'Expected completion date' },
      { name: 'completed_date', type: 'DATE', nullable: true, description: 'Sign-off date' },
    ],
  },
  {
    name: 'pending_tasks',
    displayName: 'Centralized Punchlist & Pending Works',
    category: 'Governance & Service',
    stage: 'All Stages (Cross-functional)',
    description: 'Central registry of non-conformances, site blockers, installation punch items, and audit deficiencies.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'project_id', type: 'UUID / TEXT', foreignKey: 'projects(id)', nullable: false, description: 'Machine reference' },
      { name: 'project_number', type: 'VARCHAR(50)', nullable: false, description: 'Denormalized machine code for fast queries' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Civil, Electrical, Mechanical, Documentation' },
      { name: 'related_stage', type: 'VARCHAR(50)', nullable: false, description: 'Originating stage' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Issue or required remedial action' },
      { name: 'responsible_department', type: 'VARCHAR(100)', nullable: false, description: 'Assigned resolving unit' },
      { name: 'responsible_person', type: 'VARCHAR(150)', nullable: false, description: 'Assigned specialist' },
      { name: 'target_date', type: 'DATE', nullable: false, description: 'Resolution deadline' },
      { name: 'priority', type: 'VARCHAR(30)', defaultValue: "'Normal'", description: 'Low, Normal, High, Urgent' },
      { name: 'status', type: 'VARCHAR(50)', defaultValue: "'Open'", description: 'Open, In Progress, Resolved, Closed' },
      { name: 'closure_remarks', type: 'TEXT', nullable: true, description: 'Resolution notes and sign-off remark' },
    ],
  },
  {
    name: 'audit_logs',
    displayName: 'System Audit Trail & History',
    category: 'Governance & Service',
    stage: 'Governance',
    description: 'Immutable regulatory and operational audit log capturing stage transitions, commercial updates, and user actions.',
    columns: [
      { name: 'id', type: 'UUID / TEXT', primaryKey: true, description: 'Primary Key' },
      { name: 'timestamp', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Exact audit time' },
      { name: 'user_name', type: 'VARCHAR(150)', nullable: false, description: 'Actor full name' },
      { name: 'user_role', type: 'VARCHAR(50)', nullable: false, description: 'Role (e.g. SUPER_ADMIN, SALES)' },
      { name: 'project_id', type: 'UUID / TEXT', nullable: true, description: 'Associated machine' },
      { name: 'project_number', type: 'VARCHAR(50)', nullable: true, description: 'Associated machine code' },
      { name: 'module', type: 'VARCHAR(100)', nullable: false, description: 'Lifecycle Module / Stage' },
      { name: 'action', type: 'VARCHAR(50)', nullable: false, description: 'CREATE, UPDATE, APPROVE, STAGE_ADVANCE' },
      { name: 'summary', type: 'TEXT', nullable: false, description: 'Human readable event narrative' },
    ],
  },
];

/**
 * Complete Migration SQL Script (Copy-ready for Supabase SQL Editor)
 */
export const COMPLETE_SCHEMA_SQL = `-- ==============================================================================
-- PURCHASE TO START-UP MANAGEMENT SYSTEM (P2S)
-- Supabase Migration: 0001_initial_schema.sql
-- Complete PostgreSQL Normalized Schema with Row Level Security & Indexes
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    head_person VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
    department VARCHAR(100) NOT NULL DEFAULT 'Management',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMER MASTER
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    gst_or_tax_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS / MACHINES MASTER
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_number VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE RESTRICT,
    customer_name VARCHAR(255) NOT NULL,
    customer_code VARCHAR(50) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(50),
    email VARCHAR(255),
    customer_address TEXT,
    site_name VARCHAR(255) NOT NULL,
    site_address TEXT NOT NULL,
    machine_type VARCHAR(150) NOT NULL,
    machine_model VARCHAR(150) NOT NULL,
    application VARCHAR(255) NOT NULL,
    capacity VARCHAR(150) NOT NULL,
    specification TEXT,
    quantity INT NOT NULL DEFAULT 1,
    sales_person VARCHAR(150) NOT NULL,
    project_manager VARCHAR(150) NOT NULL,
    technical_person VARCHAR(150),
    commercial_person VARCHAR(150),
    expected_order_value NUMERIC(15,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    expected_start_date DATE NOT NULL,
    target_delivery_date DATE NOT NULL,
    machine_required_date DATE NOT NULL,
    priority VARCHAR(30) DEFAULT 'Normal',
    current_stage VARCHAR(50) DEFAULT 'REQUEST_RECEIVED',
    project_status VARCHAR(50) DEFAULT 'Active',
    overall_completion_percent NUMERIC(5,2) DEFAULT 0.00,
    health VARCHAR(20) DEFAULT 'Green',
    delay_days INT DEFAULT 0,
    is_site_ready BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(project_status);
CREATE INDEX IF NOT EXISTS idx_projects_current_stage ON public.projects(current_stage);
CREATE INDEX IF NOT EXISTS idx_projects_project_number ON public.projects(project_number);

-- 5. STAGE 1: REQUEST RECEIVED
CREATE TABLE IF NOT EXISTS public.request_received (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    request_date DATE NOT NULL,
    customer_requirement TEXT NOT NULL,
    machine_type VARCHAR(150),
    machine_model VARCHAR(150),
    capacity VARCHAR(150),
    specification TEXT,
    application VARCHAR(255),
    quantity INT DEFAULT 1,
    customer_contact VARCHAR(150),
    requirement_description TEXT,
    required_delivery_date DATE,
    source_of_enquiry VARCHAR(50),
    sales_person VARCHAR(150),
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    completed_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STAGE 2: CLARIFICATIONS
CREATE TABLE IF NOT EXISTS public.clarifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    clarification_date DATE NOT NULL,
    clarification_type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    customer_response TEXT,
    responsible_department VARCHAR(100) NOT NULL,
    responsible_person VARCHAR(150) NOT NULL,
    required_by_date DATE NOT NULL,
    response_date DATE,
    status VARCHAR(50) DEFAULT 'Open',
    is_mandatory BOOLEAN DEFAULT TRUE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STAGE 3: TECHNICAL REVIEW
CREATE TABLE IF NOT EXISTS public.technical_reviews (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    requirement_study TEXT NOT NULL,
    feasibility_check VARCHAR(50) NOT NULL,
    technical_discussion_notes TEXT,
    solution_proposal TEXT,
    technical_specification TEXT,
    capacity_confirmation VARCHAR(150),
    utility_requirement TEXT,
    site_requirement TEXT,
    proposed_configuration TEXT,
    technical_risks TEXT,
    technical_notes TEXT,
    responsible_engineer VARCHAR(150) NOT NULL,
    review_date DATE NOT NULL,
    completion_date DATE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(150),
    approval_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STAGE 4: QUOTATIONS
CREATE TABLE IF NOT EXISTS public.quotations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    quotation_number VARCHAR(50) NOT NULL,
    revision_number INT NOT NULL DEFAULT 0,
    quotation_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    technical_specification TEXT,
    commercial_offer TEXT,
    basic_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    taxes NUMERIC(15,2) DEFAULT 0.00,
    duties NUMERIC(15,2) DEFAULT 0.00,
    freight NUMERIC(15,2) DEFAULT 0.00,
    installation_charges NUMERIC(15,2) DEFAULT 0.00,
    commissioning_charges NUMERIC(15,2) DEFAULT 0.00,
    other_charges NUMERIC(15,2) DEFAULT 0.00,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_schedule VARCHAR(255),
    payment_terms TEXT,
    warranty_terms TEXT,
    special_conditions TEXT,
    prepared_by VARCHAR(150) NOT NULL,
    approved_by VARCHAR(150),
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STAGE 5: COMMERCIAL NEGOTIATION
CREATE TABLE IF NOT EXISTS public.commercial_negotiations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    negotiation_date DATE NOT NULL,
    meeting_type VARCHAR(100) NOT NULL,
    price_discussed NUMERIC(15,2) NOT NULL,
    negotiated_price NUMERIC(15,2) NOT NULL,
    discount NUMERIC(15,2) DEFAULT 0.00,
    final_price NUMERIC(15,2) NOT NULL,
    payment_terms TEXT,
    delivery_terms TEXT,
    taxes_and_duties TEXT,
    warranty TEXT,
    other_terms TEXT,
    discussion_notes TEXT,
    customer_representative VARCHAR(150),
    company_representative VARCHAR(150),
    next_follow_up_date DATE,
    status VARCHAR(50) DEFAULT 'Negotiation Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENT MILESTONES
CREATE TABLE IF NOT EXISTS public.payment_milestones (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(150) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    due_condition TEXT NOT NULL,
    due_date DATE NOT NULL,
    invoice_number VARCHAR(50),
    invoice_date DATE,
    amount_received NUMERIC(15,2) DEFAULT 0.00,
    received_date DATE,
    payment_reference VARCHAR(150),
    payment_status VARCHAR(50) DEFAULT 'Not Due',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STAGE 6: APPROVAL REQUESTS & HISTORY
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    approval_requested_date DATE NOT NULL,
    po_received BOOLEAN DEFAULT FALSE,
    po_number VARCHAR(100),
    po_date DATE,
    po_value NUMERIC(15,2),
    po_document TEXT,
    approval_status VARCHAR(50) DEFAULT 'Pending',
    requested_by VARCHAR(150) NOT NULL,
    approved_by VARCHAR(150),
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.approval_history (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    stage_id VARCHAR(50) NOT NULL,
    requested_by VARCHAR(150) NOT NULL,
    requested_date TIMESTAMPTZ NOT NULL,
    approver VARCHAR(150) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    decision_date TIMESTAMPTZ DEFAULT NOW(),
    comments TEXT,
    po_number VARCHAR(100),
    po_value NUMERIC(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STAGE 7: WORK ORDERS
CREATE TABLE IF NOT EXISTS public.work_orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    internal_work_order_number VARCHAR(50) UNIQUE NOT NULL,
    work_order_date DATE NOT NULL,
    bom_status VARCHAR(50) DEFAULT 'Draft',
    bom_finalized_date DATE,
    resource_planning_status VARCHAR(50) DEFAULT 'Pending',
    project_engineer VARCHAR(150),
    production_manager VARCHAR(150),
    planning_engineer VARCHAR(150),
    supplier_finalization_status VARCHAR(50) DEFAULT 'In Progress',
    target_manufacturing_start DATE NOT NULL,
    target_manufacturing_completion DATE NOT NULL,
    remarks TEXT,
    work_order_document TEXT,
    is_checklist_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. STAGE 8: ADVANCE PAYMENTS
CREATE TABLE IF NOT EXISTS public.advance_payments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    advance_required BOOLEAN DEFAULT TRUE,
    advance_percentage NUMERIC(5,2) NOT NULL,
    advance_amount NUMERIC(15,2) NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    payment_due_date DATE NOT NULL,
    payment_received BOOLEAN DEFAULT FALSE,
    amount_received NUMERIC(15,2) DEFAULT 0.00,
    payment_date DATE,
    transaction_reference VARCHAR(150),
    lc_applicable BOOLEAN DEFAULT FALSE,
    lc_number VARCHAR(100),
    lc_date DATE,
    bg_applicable BOOLEAN DEFAULT FALSE,
    bg_number VARCHAR(100),
    bg_expiry_date DATE,
    payment_condition_recorded TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. STAGE 9: MANUFACTURING ACTIVITIES, PROCUREMENT & QC
CREATE TABLE IF NOT EXISTS public.manufacturing_activities (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    activity VARCHAR(255) NOT NULL,
    description TEXT,
    responsible_department VARCHAR(100) NOT NULL,
    responsible_person VARCHAR(150) NOT NULL,
    planned_start DATE NOT NULL,
    planned_end DATE NOT NULL,
    actual_start DATE,
    actual_end DATE,
    completion_percent NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Not Started',
    delay_days INT DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.procurement_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    material_code VARCHAR(100) NOT NULL,
    material_description TEXT NOT NULL,
    bom_quantity NUMERIC(10,2) NOT NULL,
    required_quantity NUMERIC(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    po_number VARCHAR(100),
    po_date DATE,
    expected_delivery DATE NOT NULL,
    received_quantity NUMERIC(10,2) DEFAULT 0.00,
    received_date DATE,
    pending_quantity NUMERIC(10,2) NOT NULL,
    inspection_required BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Ordered',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.qc_inspections (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    inspection_number VARCHAR(50) NOT NULL,
    inspection_date DATE NOT NULL,
    inspection_type VARCHAR(100) NOT NULL,
    item VARCHAR(255) NOT NULL,
    specification TEXT NOT NULL,
    actual_result TEXT NOT NULL,
    pass_fail VARCHAR(20) NOT NULL,
    inspected_by VARCHAR(150) NOT NULL,
    corrective_action TEXT,
    reinspection_required BOOLEAN DEFAULT FALSE,
    reinspection_date DATE,
    final_status VARCHAR(50) DEFAULT 'Closed',
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. STAGE 10: DISPATCH CLEARANCE
CREATE TABLE IF NOT EXISTS public.dispatch_records (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    final_inspection_date DATE NOT NULL,
    inspection_result VARCHAR(50) NOT NULL,
    packing_date DATE NOT NULL,
    packing_details TEXT,
    number_of_packages INT DEFAULT 1,
    gross_weight NUMERIC(10,2) DEFAULT 0.00,
    net_weight NUMERIC(10,2) DEFAULT 0.00,
    dimensions VARCHAR(150),
    dispatch_clearance_status VARCHAR(50) DEFAULT 'Pending Inspection',
    clearance_date DATE,
    approved_by VARCHAR(150),
    remarks TEXT,
    packing_list_document TEXT,
    inspection_report_document TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. STAGE 11: DELIVERY & TRANSIT
CREATE TABLE IF NOT EXISTS public.delivery_records (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    planned_delivery_date DATE NOT NULL,
    confirmed_delivery_date DATE NOT NULL,
    transporter VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(100) NOT NULL,
    lr_number VARCHAR(100) NOT NULL,
    lr_date DATE NOT NULL,
    driver_name VARCHAR(150),
    driver_phone VARCHAR(50),
    dispatch_date DATE NOT NULL,
    expected_site_arrival DATE NOT NULL,
    actual_site_arrival DATE,
    transport_status VARCHAR(50) DEFAULT 'Planning',
    site_readiness_confirmed BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. STAGE 12: SITE READINESS TASKS & CERTIFICATES
CREATE TABLE IF NOT EXISTS public.site_readiness_tasks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    task VARCHAR(255) NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Not Started',
    responsible_person VARCHAR(150) NOT NULL,
    target_date DATE NOT NULL,
    completed_date DATE,
    verified_by VARCHAR(150),
    verification_date DATE,
    remarks TEXT,
    photo_url TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_readiness_certificates (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    site_name VARCHAR(255) NOT NULL,
    inspection_date DATE NOT NULL,
    civil_completion_percent NUMERIC(5,2) NOT NULL,
    electrical_completion_percent NUMERIC(5,2) NOT NULL,
    mechanical_completion_percent NUMERIC(5,2) NOT NULL,
    overall_readiness_percent NUMERIC(5,2) NOT NULL,
    civil_approved_by VARCHAR(150) NOT NULL,
    electrical_approved_by VARCHAR(150) NOT NULL,
    mechanical_approved_by VARCHAR(150) NOT NULL,
    project_approved_by VARCHAR(150) NOT NULL,
    certificate_date DATE NOT NULL,
    management_override_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CENTRALIZED PENDING WORKS (PUNCHLIST)
CREATE TABLE IF NOT EXISTS public.pending_tasks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    project_number VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    related_stage VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    responsible_department VARCHAR(100) NOT NULL,
    responsible_person VARCHAR(150) NOT NULL,
    created_date DATE NOT NULL,
    target_date DATE NOT NULL,
    priority VARCHAR(30) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'Open',
    closed_date DATE,
    closure_remarks TEXT,
    delay_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. STAGE 13: MATERIAL RECEIVED AT SITE (GRN)
CREATE TABLE IF NOT EXISTS public.material_receipts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    grn_date DATE NOT NULL,
    received_date DATE NOT NULL,
    transporter VARCHAR(255),
    vehicle_number VARCHAR(100),
    received_by VARCHAR(150) NOT NULL,
    package_count INT DEFAULT 1,
    material_condition VARCHAR(100) NOT NULL,
    shortage_found BOOLEAN DEFAULT FALSE,
    damage_found BOOLEAN DEFAULT FALSE,
    inspection_date DATE NOT NULL,
    inspection_result VARCHAR(100) NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    handling_instructions TEXT,
    remarks TEXT,
    photo_url TEXT,
    grn_document TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. STAGE 14: INSTALLATION & ERECTION
CREATE TABLE IF NOT EXISTS public.installation_activities (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    task VARCHAR(255) NOT NULL,
    responsible_team VARCHAR(150) NOT NULL,
    supervisor VARCHAR(150) NOT NULL,
    planned_start DATE NOT NULL,
    planned_completion DATE NOT NULL,
    actual_start DATE,
    actual_completion DATE,
    progress_percent NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Not Started',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. STAGE 15: DAILY PROGRESS TRACKING
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    installation_category VARCHAR(50) NOT NULL,
    work_activity VARCHAR(255) NOT NULL,
    description TEXT,
    manpower INT NOT NULL DEFAULT 1,
    working_hours NUMERIC(4,1) NOT NULL DEFAULT 8.0,
    progress_today_percent NUMERIC(5,2) DEFAULT 0.00,
    overall_progress_percent NUMERIC(5,2) DEFAULT 0.00,
    problems TEXT,
    pending_items TEXT,
    action_required TEXT,
    responsible_person VARCHAR(150) NOT NULL,
    expected_resolution TEXT,
    entered_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. STAGE 16: PRE-COMMISSIONING CHECKS
CREATE TABLE IF NOT EXISTS public.precommissioning_checks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    check_item VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    specification TEXT NOT NULL,
    observation TEXT NOT NULL,
    result VARCHAR(30) NOT NULL,
    checked_by VARCHAR(150) NOT NULL,
    check_date DATE NOT NULL,
    correction_required BOOLEAN DEFAULT FALSE,
    correction_description TEXT,
    corrected_date DATE,
    verified_by VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. STAGE 17: COMMISSIONING & MACHINE START
CREATE TABLE IF NOT EXISTS public.commissioning_records (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    commissioning_date DATE NOT NULL,
    trial_run_start TIMESTAMPTZ,
    trial_run_end TIMESTAMPTZ,
    trial_duration_hours NUMERIC(6,2) DEFAULT 0.00,
    machine_running_hours NUMERIC(8,2) DEFAULT 0.00,
    parameter_checks TEXT,
    adjustment_details TEXT,
    performance_test TEXT,
    performance_result TEXT,
    customer_representative VARCHAR(150),
    commissioning_engineer VARCHAR(150),
    issues_found TEXT,
    corrective_actions TEXT,
    final_commissioning_status VARCHAR(50) DEFAULT 'Not Started',
    customer_acceptance_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. STAGE 18: MACHINE START DATE
CREATE TABLE IF NOT EXISTS public.machine_start_records (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    official_machine_start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    commissioning_reference VARCHAR(100),
    recorded_by VARCHAR(150) NOT NULL,
    customer_acceptance_reference VARCHAR(150),
    machine_status VARCHAR(100) DEFAULT 'Commercial Production',
    production_started BOOLEAN DEFAULT TRUE,
    handover_to_customer BOOLEAN DEFAULT TRUE,
    handover_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. STAGE 19: PROJECT DOCUMENTS
CREATE TABLE IF NOT EXISTS public.project_documents (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    revision VARCHAR(20) DEFAULT 'Rev 0',
    uploaded_date DATE NOT NULL,
    uploaded_by VARCHAR(150) NOT NULL,
    customer_submitted_date DATE,
    customer_accepted BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. STAGE 20: FINAL PAYMENT
CREATE TABLE IF NOT EXISTS public.final_payments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    final_invoice_number VARCHAR(100) NOT NULL,
    final_invoice_date DATE NOT NULL,
    final_invoice_amount NUMERIC(15,2) NOT NULL,
    payment_due_date DATE NOT NULL,
    amount_received NUMERIC(15,2) DEFAULT 0.00,
    received_date DATE,
    pending_amount NUMERIC(15,2) NOT NULL,
    dues_clearance_status VARCHAR(50) DEFAULT 'Pending',
    transaction_reference VARCHAR(150),
    accounts_approved_by VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. STAGE 21: AFTER SALES SERVICE TICKETS
CREATE TABLE IF NOT EXISTS public.service_tickets (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    project_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    machine_model VARCHAR(150) NOT NULL,
    complaint_date DATE NOT NULL,
    complaint_type VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'Normal',
    assigned_engineer VARCHAR(150) NOT NULL,
    visit_required BOOLEAN DEFAULT FALSE,
    visit_date DATE,
    root_cause TEXT,
    action_taken TEXT,
    parts_used TEXT,
    resolved_date DATE,
    customer_confirmation VARCHAR(150),
    ticket_status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    project_id TEXT,
    project_number VARCHAR(50),
    module VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT
);

-- 29. ROW LEVEL SECURITY & OPEN ACCESS POLICIES (for anon and authenticated roles)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "p2s_all_access" ON public.%I;', tbl);
        EXECUTE format('CREATE POLICY "p2s_all_access" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl);
    END LOOP;
END $$;
`;

/**
 * Complete Seed Data SQL Script (Copy-ready for Supabase SQL Editor)
 */
export const COMPLETE_SEED_SQL = `-- 1. SEED 5 INDUSTRIAL CUSTOMERS
INSERT INTO public.customers (id, code, name, contact_person, email, phone, address, city, country, gst_or_tax_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'CUST-001', 'Yashoda Linen & Textile Mills Ltd.', 'Mr. Harish Chandra', 'harish@yashodalinen.com', '+91 98220 99881', 'Plot 42, GIDC Industrial Estate, Naroda', 'Ahmedabad', 'India', '24AAACY1234F1Z5'),
('c2222222-2222-2222-2222-222222222222', 'CUST-002', 'Vardhman Polytex Industries', 'Rajeev Mehra', 'rmehra@vardhmanpoly.com', '+91 98140 33441', 'Industrial Area A, Ludhiana Highway', 'Ludhiana', 'India', '03AAACV9876E1Z2'),
('c3333333-3333-3333-3333-333333333333', 'CUST-003', 'Aravind Synthetic Fibers Corp.', 'Senthil Nathan', 'snathan@aravindsynth.in', '+91 98422 55662', 'SIPCOT Industrial Complex, Perundurai', 'Erode', 'India', '33AAACA4567K1Z8'),
('c4444444-4444-4444-4444-444444444444', 'CUST-004', 'Welspun Advanced Technical Fabrics', 'Amitabh Trivedi', 'atrivedi@welspun.com', '+91 98795 11228', 'Anjar Industrial Zone, Kutch', 'Anjar', 'India', '24AAACW8890J1ZT'),
('c5555555-5555-5555-5555-555555555555', 'CUST-005', 'Raymond Woollen & Suiting Unit', 'Sunil Shelar', 'sunil.shelar@raymond.in', '+91 98230 44552', 'MIDC Industrial Area, Butibori', 'Nagpur', 'India', '27AAACR3456L1Z4')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED 10 INDUSTRIAL MACHINES ACROSS LIFECYCLE
INSERT INTO public.projects (
    id, project_number, project_name, customer_id, customer_name, customer_code,
    contact_person, phone, email, customer_address, site_name, site_address,
    machine_type, machine_model, application, capacity, specification, quantity,
    sales_person, project_manager, technical_person, commercial_person,
    expected_order_value, currency, expected_start_date, target_delivery_date, machine_required_date,
    priority, current_stage, project_status, overall_completion_percent, health, delay_days, is_site_ready
) VALUES
(
    'p1111111-1111-1111-1111-111111111111', 'MCH-2026-00001', '8-Chamber Gas Heated Stenter Line',
    'c1111111-1111-1111-1111-111111111111', 'Yashoda Linen & Textile Mills Ltd.', 'CUST-001',
    'Mr. Harish Chandra', '+91 98220 99881', 'harish@yashodalinen.com', 'Plot 42, GIDC Naroda',
    'Plant 2 Finishing Hall', 'Naroda GIDC, Phase 2, Ahmedabad',
    'Textile Finishing Stenter', 'STX-3200-8C', '100% Linen & Cotton finishing with heat-setting',
    '75 meters/minute', 'Working Width 3200mm, Natural gas burners, Pin-clip horizontal chain', 1,
    'Vikram Malhotra', 'Rajesh Kulkarni', 'Dr. Arvind Joshi', 'Anita Desai',
    420000.00, 'USD', '2026-01-15', '2026-06-30', '2026-07-20',
    'High', 'SITE_READINESS', 'Active', 60.00, 'Amber', 4, false
),
(
    'p2222222-2222-2222-2222-222222222222', 'MCH-2026-00002', 'High-Speed Rotary Screen Printing Machine',
    'c2222222-2222-2222-2222-222222222222', 'Vardhman Polytex Industries', 'CUST-002',
    'Rajeev Mehra', '+91 98140 33441', 'rmehra@vardhmanpoly.com', 'Industrial Area A, Ludhiana',
    'Ludhiana Main Print Unit', 'Plot 18, Focal Point Phase IV, Ludhiana',
    'Rotary Screen Printing Machine', 'RSP-16C-2400', '16-color continuous reactive pigment printing',
    '90 meters/minute', 'Magnetic squeegee system, 2400mm repeat 640/820/914mm', 1,
    'Vikram Malhotra', 'Sunil Pawar', 'Dr. Arvind Joshi', 'Anita Desai',
    580000.00, 'USD', '2026-02-01', '2026-08-15', '2026-09-01',
    'Normal', 'MANUFACTURING', 'Active', 48.00, 'Green', 0, false
),
(
    'p3333333-3333-3333-3333-333333333333', 'MCH-2026-00003', 'Eco-Soft Softflow High Temperature Fabric Dyeing Vessel',
    'c3333333-3333-3333-3333-333333333333', 'Aravind Synthetic Fibers Corp.', 'CUST-003',
    'Senthil Nathan', '+91 98422 55662', 'snathan@aravindsynth.in', 'SIPCOT Industrial Complex, Perundurai',
    'Perundurai Dyeing Shed A', 'Plot 104, SIPCOT, Perundurai',
    'HTHP Fabric Dyeing Vessel', 'ECO-HT-4T-1000', 'Polyester micro-filament & blended knit dyeing',
    '1000 kg/batch', 'SS 316Ti pressure vessel, Liquor ratio 1:3.8, Internal plaiting', 2,
    'Vikram Malhotra', 'Rajesh Kulkarni', 'Dr. Arvind Joshi', 'Anita Desai',
    215000.00, 'USD', '2025-11-10', '2026-03-25', '2026-04-10',
    'Urgent', 'COMMISSIONING', 'Active', 88.00, 'Green', 0, true
)
ON CONFLICT (id) DO NOTHING;
`;
