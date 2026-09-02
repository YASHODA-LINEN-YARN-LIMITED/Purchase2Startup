-- ==============================================================================
-- PURCHASE TO START-UP MANAGEMENT SYSTEM (P2S)
-- Supabase Migration: 0001_initial_schema.sql
-- Complete PostgreSQL Normalized Schema with Row Level Security & Indexes
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    head_person VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 4. PROJECTS MASTER
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. PRJ-2026-00001
    project_name VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
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
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_modified_by UUID,
    last_modified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(project_status);
CREATE INDEX IF NOT EXISTS idx_projects_current_stage ON public.projects(current_stage);
CREATE INDEX IF NOT EXISTS idx_projects_project_number ON public.projects(project_number);

-- 5. STAGE 1: REQUEST RECEIVED
CREATE TABLE IF NOT EXISTS public.request_received (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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

-- 8. STAGE 4: QUOTATIONS (Supports revisions Rev 0, Rev 1...)
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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

-- 14. STAGE 9: MANUFACTURING ACTIVITIES & PROCUREMENT & QC
CREATE TABLE IF NOT EXISTS public.manufacturing_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- CIVIL, ELECTRICAL, MECHANICAL
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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

-- 18. CENTRALIZED PENDING WORKS
CREATE TABLE IF NOT EXISTS public.pending_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- Civil, Electrical, Mechanical
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
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

-- 28. AUDIT LOGS & COMMENTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    project_number VARCHAR(50),
    module VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    stage_id VARCHAR(50),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    user_avatar TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    project_number VARCHAR(50),
    stage_id VARCHAR(50)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users read and write access on core tables
CREATE POLICY "Allow authenticated read on projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert on projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on projects" ON public.projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
