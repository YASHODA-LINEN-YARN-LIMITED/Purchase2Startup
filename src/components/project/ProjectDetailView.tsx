import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  CreditCard,
  History,
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  PlayCircle,
  Hammer,
  Truck,
  Boxes,
  Zap,
} from 'lucide-react';
import { Project, ProcessStageId } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PROCESS_STAGES, STAGE_MAP, getStageOrder } from '../../constants/stages';
import { StatusBadge } from '../common/StatusBadge';
import { ProcessFlowChart } from '../process/ProcessFlowChart';
import { SiteReadinessModal } from '../site/SiteReadinessModal';

// Subtabs
import { ProjectCommercialTab } from './tabs/ProjectCommercialTab';
import { ProjectTechnicalTab } from './tabs/ProjectTechnicalTab';
import { ProjectManufacturingTab } from './tabs/ProjectManufacturingTab';
import { ProjectSiteTab } from './tabs/ProjectSiteTab';
import { ProjectErectionTab } from './tabs/ProjectErectionTab';
import { ProjectPaymentsTab } from './tabs/ProjectPaymentsTab';
import { ProjectPendingTab } from './tabs/ProjectPendingTab';
import { ProjectDocumentsTab } from './tabs/ProjectDocumentsTab';
import { ProjectAuditTab } from './tabs/ProjectAuditTab';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  initialTab?: string;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onBack,
  initialTab = 'flow',
}) => {
  const { projects, advanceProjectStage, updateProject, calculateProjectProgress } = useData();
  const { currentUser, canPerform } = useAuth();

  const project = projects.find((p) => p.id === projectId);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedNextStage, setSelectedNextStage] = useState<ProcessStageId>('REQUEST_RECEIVED');

  if (!project) {
    return (
      <div className="p-8 text-center">
        <div className="text-slate-500 mb-4">Project not found or may have been removed.</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to All Projects
        </button>
      </div>
    );
  }

  const currentOrder = getStageOrder(project.currentStage);
  const currentStageInfo = STAGE_MAP[project.currentStage];
  const progressPercent = calculateProjectProgress(project.id);

  // Find next logical stage
  const nextLogicalStage = PROCESS_STAGES.find((s) => s.order === currentOrder + 1);

  const tabs = [
    { id: 'flow', label: 'Process Flow' },
    { id: 'commercial', label: 'Commercial & Sales' },
    { id: 'technical', label: 'Technical Review' },
    { id: 'manufacturing', label: 'Manufacturing & QC' },
    { id: 'site', label: 'Site Readiness' },
    { id: 'erection', label: 'Erection & Commissioning' },
    { id: 'payments', label: 'Payment Milestones' },
    { id: 'pending', label: 'Pending Works' },
    { id: 'documents', label: 'Documents' },
    { id: 'audit', label: 'Audit Trail & Notes' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & top status strip */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          {project.delayDays > 0 ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Project Delayed: +{project.delayDays} days</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>On Schedule (Health: Green)</span>
            </span>
          )}

          {project.isSiteReady ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Site Ready Verified</span>
            </span>
          ) : (
            <button
              onClick={() => setShowCertModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Site Not Ready (Pending Verification)</span>
            </button>
          )}
        </div>
      </div>

      {/* Critical Project Header Card (Section 6) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                {project.projectNumber}
              </span>
              <StatusBadge status={project.projectStatus} size="md" />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                Stage {currentOrder}/21: {currentStageInfo?.name}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
              {project.projectName}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{project.customerName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span>{project.machineType} ({project.machineModel})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Qty: {project.quantity} unit(s)</span>
              </div>
              <span>•</span>
              <div>
                <span>PM: </span>
                <span className="font-medium text-slate-700">{project.projectManager}</span>
              </div>
            </div>
          </div>

          {/* Action: Advance Stage Button */}
          <div className="flex items-center gap-3 shrink-0">
            {nextLogicalStage && (
              <button
                onClick={() => {
                  advanceProjectStage(project.id, nextLogicalStage.id, currentUser.fullName);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Advance to Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                setSelectedNextStage(project.currentStage);
                setShowAdvanceModal(true);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
            >
              Change Stage Manually
            </button>
          </div>
        </div>

        {/* Header KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Target Delivery Date</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{project.targetDeliveryDate || 'Not Scheduled'}</span>
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Order Value / Currency</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">
              {project.currency} {project.expectedOrderValue.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Overall Progress</div>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-slate-900 text-xs">{progressPercent}%</span>
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Site Readiness Status</div>
            <div className="mt-0.5 flex items-center justify-between">
              <span
                className={`font-semibold text-xs ${
                  project.isSiteReady ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {project.isSiteReady ? 'Site Ready Verified' : 'Pending Verification'}
              </span>
              <button
                onClick={() => setShowCertModal(true)}
                className="text-[11px] text-blue-600 hover:underline font-medium"
              >
                Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'flow' && (
          <ProcessFlowChart
            project={project}
            onSelectStage={(stageId) => {
              // Map stage clicked to appropriate tab
              const order = getStageOrder(stageId);
              if (order <= 6) setActiveTab('commercial');
              else if (order <= 7) setActiveTab('manufacturing');
              else if (order <= 11) setActiveTab('manufacturing');
              else if (order === 12) setActiveTab('site');
              else if (order <= 18) setActiveTab('erection');
              else if (order === 19) setActiveTab('documents');
              else if (order === 20) setActiveTab('payments');
              else setActiveTab('erection');
            }}
          />
        )}

        {activeTab === 'commercial' && <ProjectCommercialTab project={project} />}
        {activeTab === 'technical' && <ProjectTechnicalTab project={project} />}
        {activeTab === 'manufacturing' && <ProjectManufacturingTab project={project} />}
        {activeTab === 'site' && <ProjectSiteTab project={project} onOpenCertificate={() => setShowCertModal(true)} />}
        {activeTab === 'erection' && <ProjectErectionTab project={project} />}
        {activeTab === 'payments' && <ProjectPaymentsTab project={project} />}
        {activeTab === 'pending' && <ProjectPendingTab project={project} />}
        {activeTab === 'documents' && <ProjectDocumentsTab project={project} />}
        {activeTab === 'audit' && <ProjectAuditTab project={project} />}
      </div>

      {/* Manual Change Stage Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Change Project Stage
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the active stage for {project.projectNumber}. The system will update completion % and record an audit entry.
            </p>
            <select
              value={selectedNextStage}
              onChange={(e) => setSelectedNextStage(e.target.value as ProcessStageId)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white mb-4"
            >
              {PROCESS_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  Stage {s.order}: {s.name} ({s.responsibleDepartment})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAdvanceModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  advanceProjectStage(project.id, selectedNextStage, currentUser.fullName);
                  setShowAdvanceModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Readiness Certificate Modal */}
      <SiteReadinessModal
        project={project}
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </div>
  );
};
