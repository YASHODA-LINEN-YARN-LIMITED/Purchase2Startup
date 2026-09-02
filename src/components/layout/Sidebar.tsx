import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  Clock,
  FileText,
  Cpu,
  FileCheck,
  Handshake,
  CheckSquare,
  Wrench,
  Factory,
  ShieldCheck,
  PackageCheck,
  Truck,
  Building2,
  Boxes,
  Hammer,
  Activity,
  Zap,
  PlayCircle,
  CreditCard,
  Receipt,
  HeadphonesIcon,
  LifeBuoy,
  ListTodo,
  FileSpreadsheet,
  BarChart3,
  Users,
  Building,
  Settings,
  History,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { pendingTasks, projects, notifications } = useData();

  const openPendingCount = pendingTasks.filter((t) => t.status !== 'Closed').length;
  const delayedProjectsCount = projects.filter((p) => p.delayDays > 0).length;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projects: true,
    process: true,
    execution: false,
    site: false,
    finance: false,
    service: false,
    admin: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navItemClass = (viewId: string) =>
    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      currentView === viewId
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const navContent = (
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-4">
      {/* 1. Main Dashboard */}
      <div>
        <button
          onClick={() => {
            onNavigate('dashboard');
            setIsMobileOpen(false);
          }}
          className={navItemClass('dashboard')}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => {
            onNavigate('attention');
            setIsMobileOpen(false);
          }}
          className={`mt-1 w-full ${navItemClass('attention')}`}
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>Attention Required</span>
          </div>
          {delayedProjectsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              {delayedProjectsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            onNavigate('pending-works');
            setIsMobileOpen(false);
          }}
          className={`mt-1 w-full ${navItemClass('pending-works')}`}
        >
          <div className="flex items-center gap-2.5">
            <ListTodo className="w-4 h-4 text-amber-500" />
            <span>Pending Works</span>
          </div>
          {openPendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {openPendingCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. Projects Section */}
      <div>
        <div
          onClick={() => toggleSection('projects')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>Projects Master</span>
          {expandedSections.projects ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.projects && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('projects');
                setIsMobileOpen(false);
              }}
              className={navItemClass('projects')}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>All Projects</span>
              </div>
              <span className="text-[11px] text-slate-400">{projects.length}</span>
            </button>
            <button
              onClick={() => {
                onNavigate('create-project');
                setIsMobileOpen(false);
              }}
              className={navItemClass('create-project')}
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4" />
                <span>Create New Project</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 3. Process Flow Stages */}
      <div>
        <div
          onClick={() => toggleSection('process')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>Process & Commercial</span>
          {expandedSections.process ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.process && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('stage-request');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-request')}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>1. Request & Inquiries</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-technical');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-technical')}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" />
                <span>2-3. Technical Study</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-quotation');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-quotation')}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4" />
                <span>4. Quotations & Revisions</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-negotiation');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-negotiation')}
            >
              <div className="flex items-center gap-2.5">
                <Handshake className="w-4 h-4" />
                <span>5. Commercial Negotiation</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-approval');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-approval')}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-purple-600" />
                <span>6. PO & Approval Engine</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-work-order');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-work-order')}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4" />
                <span>7. Internal Work Orders</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 4. Execution & Manufacturing */}
      <div>
        <div
          onClick={() => toggleSection('execution')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>Manufacturing & Logistics</span>
          {expandedSections.execution ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.execution && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('stage-manufacturing');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-manufacturing')}
            >
              <div className="flex items-center gap-2.5">
                <Factory className="w-4 h-4" />
                <span>8-9. Manufacturing Tracker</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-quality');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-quality')}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Quality & Testing (QC)</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-dispatch');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-dispatch')}
            >
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4" />
                <span>10. Ready for Dispatch</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-delivery');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-delivery')}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>11. Delivery & Transit</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 5. Site & Installation */}
      <div>
        <div
          onClick={() => toggleSection('site')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>Site Readiness & Erection</span>
          {expandedSections.site ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.site && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('stage-site-readiness');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-site-readiness')}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>12. Site Readiness & Cert.</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-material-receipt');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-material-receipt')}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4" />
                <span>13. Site Material Receipt (GRN)</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-installation');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-installation')}
            >
              <div className="flex items-center gap-2.5">
                <Hammer className="w-4 h-4" />
                <span>14. Installation & Erection</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-daily-progress');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-daily-progress')}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>15. Daily Progress Logging</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-commissioning');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-commissioning')}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4" />
                <span>16-17. Commissioning & Start</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('stage-machine-start');
                setIsMobileOpen(false);
              }}
              className={navItemClass('stage-machine-start')}
            >
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span>18. Official Machine Start</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 6. Finance & Payments */}
      <div>
        <div
          onClick={() => toggleSection('finance')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>Finance & Commercial</span>
          {expandedSections.finance ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.finance && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('payments');
                setIsMobileOpen(false);
              }}
              className={navItemClass('payments')}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>Payment Milestones</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('outstanding');
                setIsMobileOpen(false);
              }}
              className={navItemClass('outstanding')}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4" />
                <span>Outstanding Dues</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 7. Service & After Sales */}
      <div>
        <div
          onClick={() => toggleSection('service')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>After Sales Service</span>
          {expandedSections.service ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.service && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('service-tickets');
                setIsMobileOpen(false);
              }}
              className={navItemClass('service-tickets')}
            >
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-4 h-4" />
                <span>Service Tickets</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('warranty');
                setIsMobileOpen(false);
              }}
              className={navItemClass('warranty')}
            >
              <div className="flex items-center gap-2.5">
                <HeadphonesIcon className="w-4 h-4" />
                <span>Warranty & AMC</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 8. Documents & Reports */}
      <div>
        <button
          onClick={() => {
            onNavigate('documents');
            setIsMobileOpen(false);
          }}
          className={navItemClass('documents')}
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Documents Vault</span>
          </div>
        </button>

        <button
          onClick={() => {
            onNavigate('reports');
            setIsMobileOpen(false);
          }}
          className={`mt-1 w-full ${navItemClass('reports')}`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Reports</span>
          </div>
        </button>
      </div>

      {/* 9. Administration */}
      <div>
        <div
          onClick={() => toggleSection('admin')}
          className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 cursor-pointer hover:text-slate-600"
        >
          <span>System Administration</span>
          {expandedSections.admin ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
        {expandedSections.admin && (
          <div className="mt-1 space-y-0.5">
            <button
              onClick={() => {
                onNavigate('users');
                setIsMobileOpen(false);
              }}
              className={navItemClass('users')}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Users & Roles</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('departments');
                setIsMobileOpen(false);
              }}
              className={navItemClass('departments')}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4" />
                <span>Departments</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('audit-logs');
                setIsMobileOpen(false);
              }}
              className={navItemClass('audit-logs')}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4" />
                <span>Immutable Audit Trail</span>
              </div>
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setIsMobileOpen(false);
              }}
              className={navItemClass('settings')}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Stage Weights & Config</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-2xl z-50">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-sm">Navigation Menu</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
