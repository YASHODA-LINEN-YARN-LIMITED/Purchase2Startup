import React from 'react';
import {
  FolderGit2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Building2,
  Wrench,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { STAGE_MAP, getStageOrder } from '../../constants/stages';

interface Props {
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
  onNewProject: () => void;
}

export const ExecutiveDashboard: React.FC<Props> = ({
  onSelectProject,
  onNavigate,
  onNewProject,
}) => {
  const {
    projects,
    pendingTasks,
    approvalRequests,
    calculateProjectProgress,
  } = useData();

  const { currentUser } = useAuth();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.projectStatus === 'Active').length;
  const delayedProjects = projects.filter((p) => p.delayDays > 0);
  const completedProjects = projects.filter((p) => p.projectStatus === 'Completed').length;
  const siteNotReadyProjects = projects.filter((p) => !p.isSiteReady);
  const pendingApprovals = approvalRequests.filter((a) => a.approvalStatus === 'Pending');
  const openPunchItems = pendingTasks.filter((w) => w.status !== 'Closed');

  const totalPortfolioValue = projects.reduce((acc, p) => acc + p.expectedOrderValue, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Executive Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yashoda Linen & Yarn Ltd. • P2S Mill Control Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Machinery Purchase to Start-up Management
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              End-to-end tracking for all plant machinery purchases across 21 stages—from enquiry & technical clearance to site erection, commissioning, and commercial start-up.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewProject}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              + Add New Machine
            </button>
          </div>
        </div>
      </div>

      {/* 2. Portfolio KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('projects')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Machines</span>
            <FolderGit2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalProjects}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{activeProjects} In Active Execution</span>
            <span className="text-emerald-600 font-semibold">{completedProjects} Done</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('attention')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-rose-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Delayed Machines</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{delayedProjects.length}</div>
          <div className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
            <span>Attention required on schedule</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('site-readiness')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Site Readiness Gate</span>
            <Building2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">{siteNotReadyProjects.length}</div>
          <div className="text-[11px] text-amber-600 mt-1">
            Sites currently holding material dispatch
          </div>
        </div>

        <div
          onClick={() => onNavigate('pending-works')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-purple-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Open Punch Items</span>
            <Wrench className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{openPunchItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Centralized pending work items
          </div>
        </div>
      </div>

      {/* 3. Red Alert / Attention Required Widget (Section 45 & 46) */}
      {delayedProjects.length > 0 || siteNotReadyProjects.length > 0 ? (
        <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Attention Required: Critical Bottlenecks & Delayed Machines
              </h3>
            </div>
            <button
              onClick={() => onNavigate('attention')}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {delayedProjects.map((p) => {
              const currentStageInfo = STAGE_MAP[p.currentStage];
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="bg-white p-3.5 rounded-xl border border-rose-300 hover:shadow-md cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-rose-700">{p.projectNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                      +{p.delayDays} Days Delayed
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 truncate mb-1">{p.projectName}</div>
                  <div className="text-slate-500 text-[11px] mb-2">
                    Customer: <span className="text-slate-700 font-medium">{p.customerName}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg text-[11px] space-y-0.5">
                    <div>
                      <span className="text-slate-400">Current Stage: </span>
                      <span className="font-semibold text-slate-800">{currentStageInfo?.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">In-charge: </span>
                      <span className="text-slate-700">{p.projectManager}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 4. Active Machines Grid with 21-Stage Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Active Machine Lifecycles (21 Stages)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any machine to drill down into technical reviews, work orders, site clearances, and commissioning.
            </p>
          </div>

          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Machines</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((project) => {
            const currentStageInfo = STAGE_MAP[project.currentStage];
            const order = getStageOrder(project.currentStage);
            const progress = calculateProjectProgress(project.id);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {project.projectNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {project.projectName}
                    </h4>
                    <StatusBadge status={project.projectStatus} size="sm" />
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">
                      Client: <strong className="text-slate-800">{project.customerName}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">
                      Target: <strong className="text-slate-800">{project.targetDeliveryDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress bar and stage details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                  <div className="md:col-span-3">
                    <div className="flex items-center justify-between text-slate-500 mb-1 text-[11px]">
                      <span className="font-medium text-slate-700">
                        Stage {order} of 21: {currentStageInfo?.name}
                      </span>
                      <span className="font-bold text-blue-600">{progress}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {project.isSiteReady ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Site Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        Site Pending
                      </span>
                    )}

                    <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5 text-xs">
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
