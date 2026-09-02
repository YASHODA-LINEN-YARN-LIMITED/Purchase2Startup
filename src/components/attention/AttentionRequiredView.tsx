import React from 'react';
import {
  AlertTriangle,
  Building2,
  Clock,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STAGE_MAP, getStageOrder } from '../../constants/stages';

interface Props {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const AttentionRequiredView: React.FC<Props> = ({ onSelectProject }) => {
  const { projects, pendingTasks, approvalRequests } = useData();

  const delayedProjects = projects.filter((p) => p.delayDays > 0);
  const siteNotReadyProjects = projects.filter((p) => !p.isSiteReady);
  const pendingApprovals = approvalRequests.filter((a) => a.approvalStatus === 'Pending');
  const highPriorityPunches = pendingTasks.filter(
    (w) => (w.priority === 'High' || w.priority === 'Urgent') && w.status !== 'Closed'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Attention Required & Critical Risk Center
            </h1>
            <p className="text-xs text-rose-700 mt-0.5">
              Automated escalation highlighting schedule overruns, site readiness blocks, and pending commercial approvals.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Schedule Delays */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Schedule Overruns ({delayedProjects.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Target Delivery Breached</span>
        </div>

        {delayedProjects.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs">
            No projects are currently experiencing schedule delays. All timelines on track!
          </div>
        ) : (
          <div className="space-y-3">
            {delayedProjects.map((p) => {
              const currentStageInfo = STAGE_MAP[p.currentStage];
              const order = getStageOrder(p.currentStage);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/50 transition-colors cursor-pointer text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-rose-700">{p.projectNumber}</span>
                      <span className="font-bold text-slate-900">{p.projectName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        +{p.delayDays} Days Overdue
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Customer: <strong className="text-slate-800">{p.customerName}</strong> • Target: {p.targetDeliveryDate}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Blocked at: Stage {order} ({currentStageInfo?.name}) • Project Manager: {p.projectManager}
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 shrink-0 self-start sm:self-center">
                    <span>Resolve Delay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Site Readiness Blocks */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Site Readiness Hold ({siteNotReadyProjects.length})
            </h3>
          </div>
          <span className="text-xs text-amber-700 font-semibold">Material Arrival Gate: BLOCKED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteNotReadyProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p.id, 'site')}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/50 cursor-pointer transition-colors text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-800">{p.projectNumber}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  Site Not Ready
                </span>
              </div>
              <div className="font-bold text-slate-900">{p.projectName}</div>
              <p className="text-slate-600 text-[11px]">
                Material dispatch / unloading held. Foundations, 415V power or crane clearance pending customer completion.
              </p>
              <div className="pt-2 flex justify-end">
                <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                  <span>Inspect Site Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. High-Priority Punch Items */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Critical High-Priority Punch Items ({highPriorityPunches.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Blocking Acceptance</span>
        </div>

        <div className="space-y-2">
          {highPriorityPunches.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProject(item.projectId, 'pending')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-colors text-xs flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-purple-700">{item.id}</span>
                  <span className="font-semibold text-slate-900">{item.description}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Category: {item.category} • Assigned: {item.responsiblePerson} • Target: {item.targetDate}
                </div>
              </div>

              <span className="text-purple-600 font-semibold flex items-center gap-0.5 shrink-0 text-xs">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
