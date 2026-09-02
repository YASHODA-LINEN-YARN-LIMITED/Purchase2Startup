import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Project, ProcessStageId, StageStatus } from '../../types';
import { PROCESS_STAGES, STAGE_MAP, getStageOrder } from '../../constants/stages';

interface ProcessFlowChartProps {
  project: Project;
  onSelectStage?: (stageId: ProcessStageId) => void;
  activeStageId?: ProcessStageId;
}

export const ProcessFlowChart: React.FC<ProcessFlowChartProps> = ({
  project,
  onSelectStage,
  activeStageId,
}) => {
  const currentOrder = getStageOrder(project.currentStage);

  // Helper to determine stage status for visual color-coding
  const getStageDisplayStatus = (stageId: ProcessStageId): StageStatus => {
    const stageOrder = getStageOrder(stageId);

    if (stageOrder < currentOrder) {
      return 'Completed';
    }
    if (stageOrder === currentOrder) {
      if (project.delayDays > 0) return 'Delayed';
      if (stageId === 'APPROVAL') return 'Approval Required';
      if (stageId === 'SITE_READINESS' && !project.isSiteReady) return 'Pending';
      return 'In Progress';
    }
    // Future stages
    return 'Not Started';
  };

  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-300 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          border: 'border-emerald-400',
          pill: 'bg-emerald-500 text-white',
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100/70 border-blue-400 text-blue-900 ring-2 ring-blue-500/20',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-600 animate-ping',
          border: 'border-blue-500',
          pill: 'bg-blue-600 text-white',
        };
      case 'Approval Required':
        return {
          bg: 'bg-purple-50 hover:bg-purple-100/70 border-purple-400 text-purple-900 ring-2 ring-purple-500/20',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
          border: 'border-purple-500',
          pill: 'bg-purple-600 text-white',
        };
      case 'Pending':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-300 text-amber-900',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-amber-400',
          pill: 'bg-amber-500 text-white',
        };
      case 'Delayed':
      case 'Rejected':
        return {
          bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-300 text-rose-900',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          border: 'border-rose-400',
          pill: 'bg-rose-600 text-white',
        };
      case 'Not Started':
      default:
        return {
          bg: 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-600',
          badge: 'bg-slate-100 text-slate-500 border-slate-200',
          dot: 'bg-slate-300',
          border: 'border-slate-200',
          pill: 'bg-slate-300 text-slate-700',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs">
      {/* Header & Legend */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 text-base">
              Interactive 21-Stage Business Process Flow
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Active: {project.currentStage.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click on any process node to open its details, checklist, approvals, or entry forms.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-slate-600">Not Started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="text-slate-600">Approval Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-600">Delayed / Rejected</span>
          </div>
        </div>
      </div>

      {/* Process Flow Grid / Node Timeline */}
      <div className="space-y-6">
        {/* Phase 1: Commercial & Engineering (Stages 1-6 + Decision) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Phase 1: Inception, Engineering & Commercial Agreement (Stages 1 - 6)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROCESS_STAGES.slice(0, 6).map((stage) => {
              const status = getStageDisplayStatus(stage.id);
              const color = getStatusColor(status);
              const isCurrent = project.currentStage === stage.id;
              const isSelected = activeStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    color.bg
                  } ${isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
                        #{stage.order}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${color.badge}`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 leading-snug">
                      {stage.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span>{stage.responsibleDepartment}</span>
                    <span>{stage.weightPercent}% Wt</span>
                  </div>

                  {isCurrent && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[9px] font-bold shadow-xs whitespace-nowrap">
                      CURRENT STAGE
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Decision Rule Callout: PO Approval */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-800">Stage 6 Approval Rule:</span>
              <span>If Approved → Progress to Work Order & Manufacturing. If Rejected → Return to Commercial Negotiation.</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">Management Authorized</span>
          </div>
        </div>

        {/* Phase 2: Execution & Manufacturing (Stages 7-11) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Phase 2: Work Order, Advance Payment & Manufacturing (Stages 7 - 11)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {PROCESS_STAGES.slice(6, 11).map((stage) => {
              const status = getStageDisplayStatus(stage.id);
              const color = getStatusColor(status);
              const isCurrent = project.currentStage === stage.id;
              const isSelected = activeStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    color.bg
                  } ${isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
                        #{stage.order}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${color.badge}`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 leading-snug">
                      {stage.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span>{stage.responsibleDepartment}</span>
                    <span>{stage.weightPercent}% Wt</span>
                  </div>

                  {isCurrent && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[9px] font-bold shadow-xs whitespace-nowrap">
                      CURRENT STAGE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 3: Site Readiness, Installation & Commissioning (Stages 12-18) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Phase 3: Site Readiness, Erection & Commissioning (Stages 12 - 18)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
            {PROCESS_STAGES.slice(11, 18).map((stage) => {
              const status = getStageDisplayStatus(stage.id);
              const color = getStatusColor(status);
              const isCurrent = project.currentStage === stage.id;
              const isSelected = activeStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`relative p-2.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    color.bg
                  } ${isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
                        #{stage.order}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${color.badge}`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-[11px] text-slate-900 leading-snug">
                      {stage.shortName}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[9px] font-medium text-slate-500">
                    <span>{stage.responsibleDepartment}</span>
                    <span>{stage.weightPercent}%</span>
                  </div>

                  {isCurrent && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[8px] font-bold shadow-xs whitespace-nowrap">
                      ACTIVE
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Decision Rule Callout: Site Ready */}
          <div className={`mt-3 p-3 rounded-lg border text-xs flex items-center justify-between ${
            project.isSiteReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span className="font-semibold">Site Ready Decision Check:</span>
              <span>
                {project.isSiteReady
                  ? 'SITE READY: Civil, Electrical and Mechanical verified 100%. Material unload and installation allowed.'
                  : 'SITE NOT READY: Machine receipt may be held. Unfinished tasks moved to Centralized Pending Works.'}
              </span>
            </div>
            <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-white border">
              {project.isSiteReady ? 'VERIFIED READY' : 'GATE HOLD'}
            </span>
          </div>
        </div>

        {/* Phase 4: Documentation, Final Payment & Service (Stages 19-21) */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Phase 4: Handover, Final Settlement & After Sales (Stages 19 - 21)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROCESS_STAGES.slice(18, 21).map((stage) => {
              const status = getStageDisplayStatus(stage.id);
              const color = getStatusColor(status);
              const isCurrent = project.currentStage === stage.id;
              const isSelected = activeStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    color.bg
                  } ${isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
                        #{stage.order}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${color.badge}`}>
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 leading-snug">
                      {stage.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span>{stage.responsibleDepartment}</span>
                    <span>{stage.weightPercent > 0 ? `${stage.weightPercent}% Wt` : 'Continuous'}</span>
                  </div>

                  {isCurrent && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[9px] font-bold shadow-xs whitespace-nowrap">
                      CURRENT STAGE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
