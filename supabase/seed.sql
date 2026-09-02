-- ==============================================================================
-- PURCHASE TO START-UP MANAGEMENT SYSTEM (P2S)
-- Supabase Seed Data: seed.sql
-- 5 Customers, 10 Projects across stages, Department users, Quotations, Milestones,
-- Manufacturing activities, Site Readiness checks, Installation progress, Service
-- ==============================================================================

-- 1. SEED DEPARTMENTS
INSERT INTO public.departments (id, code, name, head_person) VALUES
('d1111111-1111-1111-1111-111111111111', 'MGMT', 'Management', 'R. K. Singhania'),
('d2222222-2222-2222-2222-222222222222', 'SALES', 'Sales & Marketing', 'Vikram Malhotra'),
('d3333333-3333-3333-3333-333333333333', 'COMM', 'Commercial & Purchase', 'Anita Desai'),
('d4444444-4444-4444-4444-444444444444', 'TECH', 'Technical & Design Engineering', 'Dr. Arvind Joshi'),
('d5555555-5555-5555-5555-555555555555', 'PROD', 'Production & Manufacturing', 'Sunil Pawar'),
('d6666666-6666-6666-6666-666666666666', 'QC', 'Quality Control & Inspection', 'Pradeep Nair'),
('d7777777-7777-7777-7777-777777777777', 'SITE', 'Site Project & Civil/Mech', 'Rajesh Kulkarni'),
('d8888888-8888-8888-8888-888888888888', 'SRV', 'Service & After Sales', 'Deepak Verma')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED USERS / PROFILES
INSERT INTO public.profiles (id, email, full_name, role, department, phone, is_active) VALUES
('u1111111-1111-1111-1111-111111111111', 'admin@p2s-management.com', 'Super Admin', 'SUPER_ADMIN', 'Management', '+91 98200 11223', true),
('u2222222-2222-2222-2222-222222222222', 'vikram.sales@p2s-management.com', 'Vikram Malhotra', 'SALES', 'Sales & Marketing', '+91 98201 22334', true),
('u3333333-3333-3333-3333-333333333333', 'anita.comm@p2s-management.com', 'Anita Desai', 'COMMERCIAL', 'Commercial & Purchase', '+91 98202 33445', true),
('u4444444-4444-4444-4444-444444444444', 'arvind.tech@p2s-management.com', 'Dr. Arvind Joshi', 'TECHNICAL', 'Technical & Design Engineering', '+91 98203 44556', true),
('u5555555-5555-5555-5555-555555555555', 'sunil.prod@p2s-management.com', 'Sunil Pawar', 'PRODUCTION', 'Production & Manufacturing', '+91 98204 55667', true),
('u6666666-6666-6666-6666-666666666666', 'rajesh.site@p2s-management.com', 'Rajesh Kulkarni', 'PROJECT', 'Site Project & Civil/Mech', '+91 98205 66778', true),
('u7777777-7777-7777-7777-777777777777', 'deepak.srv@p2s-management.com', 'Deepak Verma', 'SERVICE', 'Service & After Sales', '+91 98206 77889', true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED 5 INDUSTRIAL CUSTOMERS
INSERT INTO public.customers (id, code, name, contact_person, email, phone, address, city, country, gst_or_tax_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'CUST-001', 'Yashoda Linen & Textile Mills Ltd.', 'Mr. Harish Chandra', 'harish@yashodalinen.com', '+91 98220 99881', 'Plot 42, GIDC Industrial Estate, Naroda', 'Ahmedabad', 'India', '24AAACY1234F1Z5'),
('c2222222-2222-2222-2222-222222222222', 'CUST-002', 'Vardhman Polytex Industries', 'Rajeev Mehra', 'rmehra@vardhmanpoly.com', '+91 98140 33441', 'Industrial Area A, Ludhiana Highway', 'Ludhiana', 'India', '03AAACV9876E1Z2'),
('c3333333-3333-3333-3333-333333333333', 'CUST-003', 'Aravind Synthetic Fibers Corp.', 'Senthil Nathan', 'snathan@aravindsynth.in', '+91 98422 55662', 'SIPCOT Industrial Complex, Perundurai', 'Erode', 'India', '33AAACA4567K1Z8'),
('c4444444-4444-4444-4444-444444444444', 'CUST-004', 'Welspun Advanced Technical Fabrics', 'Amitabh Trivedi', 'atrivedi@welspun.com', '+91 98795 11228', 'Anjar Industrial Zone, Kutch', 'Anjar', 'India', '24AAACW8890J1ZT'),
('c5555555-5555-5555-5555-555555555555', 'CUST-005', 'Raymond Woollen & Suiting Unit', 'Sunil Shelar', 'sunil.shelar@raymond.in', '+91 98230 44552', 'MIDC Industrial Area, Butibori', 'Nagpur', 'India', '27AAACR3456L1Z4')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED 10 PROJECTS ACROSS LIFECYCLE
INSERT INTO public.projects (
    id, project_number, project_name, customer_id, customer_name, customer_code,
    contact_person, phone, email, customer_address, site_name, site_address,
    machine_type, machine_model, application, capacity, specification, quantity,
    sales_person, project_manager, technical_person, commercial_person,
    expected_order_value, currency, expected_start_date, target_delivery_date, machine_required_date,
    priority, current_stage, project_status, overall_completion_percent, health, delay_days, is_site_ready
) VALUES
(
    'p1111111-1111-1111-1111-111111111111', 'PRJ-2026-00001', '8-Chamber Gas Heated Stenter Line',
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
    'p2222222-2222-2222-2222-222222222222', 'PRJ-2026-00002', 'High-Speed Rotary Screen Printing Machine',
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
    'p3333333-3333-3333-3333-333333333333', 'PRJ-2026-00003', 'Eco-Soft Softflow High Temperature Fabric Dyeing Vessel',
    'c3333333-3333-3333-3333-333333333333', 'Aravind Synthetic Fibers Corp.', 'CUST-003',
    'Senthil Nathan', '+91 98422 55662', 'snathan@aravindsynth.in', 'SIPCOT Industrial Complex, Perundurai',
    'Perundurai Dyeing Shed A', 'Plot 104, SIPCOT, Perundurai',
    'HTHP Fabric Dyeing Vessel', 'ECO-HT-4T-1000', 'Polyester micro-filament & blended knit dyeing',
    '1000 kg/batch', 'SS 316Ti pressure vessel, Liquor ratio 1:3.8, Internal plaiting', 2,
    'Vikram Malhotra', 'Rajesh Kulkarni', 'Dr. Arvind Joshi', 'Anita Desai',
    215000.00, 'USD', '2025-11-10', '2026-03-25', '2026-04-10',
    'Urgent', 'COMMISSIONING', 'Active', 88.00, 'Green', 0, true
),
(
    'p4444444-4444-4444-4444-444444444444', 'PRJ-2026-00004', 'Continuous Open Width Bleaching Range',
    'c4444444-4444-4444-4444-444444444444', 'Welspun Advanced Technical Fabrics', 'CUST-004',
    'Amitabh Trivedi', '+91 98795 11228', 'atrivedi@welspun.com', 'Anjar Industrial Zone',
    'Anjar Technical Textile Bay 3', 'Survey 112, Anjar-Galpadar Road, Kutch',
    'Continuous Bleaching Range', 'CBR-PRO-3400', 'Medical & technical non-woven pre-treatment',
    '120 meters/minute', 'Roller width 3600mm, Steam saturator with combi-steamer', 1,
    'Vikram Malhotra', 'Sunil Pawar', 'Dr. Arvind Joshi', 'Anita Desai',
    750000.00, 'USD', '2026-03-01', '2026-10-30', '2026-11-20',
    'High', 'WORK_ORDER', 'Active', 25.00, 'Green', 0, false
),
(
    'p5555555-5555-5555-5555-555555555555', 'PRJ-2026-00005', 'High Pressure Package Yarn Dyeing Machine',
    'c5555555-5555-5555-5555-555555555555', 'Raymond Woollen & Suiting Unit', 'CUST-005',
    'Sunil Shelar', '+91 98230 44552', 'sunil.shelar@raymond.in', 'MIDC Butibori, Nagpur',
    'Yarn Dyeing Mill No. 4', 'Plot C-14, Butibori MIDC, Nagpur',
    'Package Yarn Dyeing Machine', 'YRN-500-HT', 'Wool & Wool-blend spun yarn package dyeing',
    '500 kg/charge', 'Air pad system, Variable frequency pump, Automatic dosing', 2,
    'Vikram Malhotra', 'Rajesh Kulkarni', 'Dr. Arvind Joshi', 'Anita Desai',
    195000.00, 'USD', '2025-08-01', '2026-01-20', '2026-02-15',
    'Normal', 'AFTER_SALES_SERVICE', 'Completed', 100.00, 'Green', 0, true
),
(
    'p6666666-6666-6666-6666-666666666666', 'PRJ-2026-00006', 'High-Efficiency Multi-Cylinder Sizing Machine',
    'c1111111-1111-1111-1111-111111111111', 'Yashoda Linen & Textile Mills Ltd.', 'CUST-001',
    'Mr. Harish Chandra', '+91 98220 99881', 'harish@yashodalinen.com', 'Plot 42, GIDC Naroda',
    'Weaving Prep Building 1', 'Plot 42, Naroda, Ahmedabad',
    'Multi-Cylinder Sizing Machine', 'SZ-14CYL-2600', 'Warp preparation for airjet looms',
    '350 meters/minute', '14 Teflon coated cylinders, Double size box, Moisture control', 1,
    'Vikram Malhotra', 'Sunil Pawar', 'Dr. Arvind Joshi', 'Anita Desai',
    340000.00, 'USD', '2026-04-10', '2026-09-15', '2026-10-01',
    'Normal', 'QUOTATION_RECEIVED', 'Active', 15.00, 'Green', 0, false
),
(
    'p7777777-7777-7777-7777-777777777777', 'PRJ-2026-00007', 'Super-Calender Finishing Unit',
    'c2222222-2222-2222-2222-222222222222', 'Vardhman Polytex Industries', 'CUST-002',
    'Rajeev Mehra', '+91 98140 33441', 'rmehra@vardhmanpoly.com', 'Industrial Area A, Ludhiana',
    'Finishing Expansion Phase 2', 'Ludhiana Highway Unit',
    '3-Bowl Hydraulic Calender', 'CAL-3B-2200', 'Glazing and lustering of shirting fabric',
    '150 meters/minute', 'Chilled cast iron bowl + 2 cotton fiber bowls, 50 tons pressure', 1,
    'Vikram Malhotra', 'Dr. Arvind Joshi', 'Dr. Arvind Joshi', 'Anita Desai',
    175000.00, 'USD', '2026-05-01', '2026-11-10', '2026-12-01',
    'Low', 'REQUEST_RECEIVED', 'Draft', 2.00, 'Green', 0, false
),
(
    'p8888888-8888-8888-8888-888888888888', 'PRJ-2026-00008', 'Waste Heat Recovery Boiler System',
    'c3333333-3333-3333-3333-333333333333', 'Aravind Synthetic Fibers Corp.', 'CUST-003',
    'Senthil Nathan', '+91 98422 55662', 'snathan@aravindsynth.in', 'SIPCOT Perundurai',
    'Utilities Boiler House', 'Plot 104, SIPCOT, Perundurai',
    'Waste Heat Recovery Boiler', 'WHRB-8TPH', 'Capturing exhaust from stenters for steam generation',
    '8 Metric Tons/Hour', 'Design pressure 17.5 kg/cm2, Economizer integration', 1,
    'Vikram Malhotra', 'Sunil Pawar', 'Dr. Arvind Joshi', 'Anita Desai',
    290000.00, 'USD', '2026-01-20', '2026-05-15', '2026-06-01',
    'High', 'APPROVAL', 'Active', 22.00, 'Red', 12, false
),
(
    'p9999999-9999-9999-9999-999999999999', 'PRJ-2026-00009', 'Continuous Fabric Tumbler Dryer',
    'c4444444-4444-4444-4444-444444444444', 'Welspun Advanced Technical Fabrics', 'CUST-004',
    'Amitabh Trivedi', '+91 98795 11228', 'atrivedi@welspun.com', 'Anjar Industrial Zone',
    'Towel & Terry Finishing Wing', 'Anjar-Galpadar Road, Kutch',
    'Air-Flow Tumbler Dryer', 'TMB-AIR-2800', 'Soft hand-feel and volume generation in terry fabrics',
    '45 meters/minute', 'Dual inverter blowers, Stainless steel mesh conveyors', 1,
    'Vikram Malhotra', 'Rajesh Kulkarni', 'Dr. Arvind Joshi', 'Anita Desai',
    310000.00, 'USD', '2025-12-01', '2026-04-18', '2026-05-05',
    'Urgent', 'INSTALLATION_ERECTION', 'Active', 75.00, 'Amber', 6, true
),
(
    'paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PRJ-2026-00010', 'Fully Automatic Color Kitchen Dispensing System',
    'c5555555-5555-5555-5555-555555555555', 'Raymond Woollen & Suiting Unit', 'CUST-005',
    'Sunil Shelar', '+91 98230 44552', 'sunil.shelar@raymond.in', 'MIDC Butibori, Nagpur',
    'Printing Lab & Color Kitchen', 'Plot C-14, MIDC Butibori',
    'Automated Dye Dispenser', 'COLORDISP-32', 'Robotic liquid & powder dyestuff dispensing',
    '32 color heads, 0.01g precision', 'High-accuracy scales, Automatic water rinse, CIP system', 1,
    'Vikram Malhotra', 'Dr. Arvind Joshi', 'Dr. Arvind Joshi', 'Anita Desai',
    165000.00, 'USD', '2026-04-01', '2026-09-01', '2026-09-20',
    'Normal', 'COMMERCIAL_NEGOTIATION', 'Active', 18.00, 'Green', 0, false
)
ON CONFLICT (id) DO NOTHING;
