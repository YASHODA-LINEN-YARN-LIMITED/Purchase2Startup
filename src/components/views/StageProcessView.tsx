import React, { useState } from 'react';
import {
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
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STAGE_MAP, getStageOrder } from '../../constants/stages';
import { StatusBadge } from '../common/StatusBadge';
import { ProcessStageId, Project } from '../../types';

interface StageProcessViewProps {
  stageKey: string;
  onSelectProject: (projectId: string, tab?: string) => void;
}

const STAGE_META: Record<
  string,
  {
    title: string;
    stageId: ProcessStageId;
    icon: React.ElementType;
    description: string;
    targetTab: string;
    color: string;
  }
> = {
  'stage-request': {
    title: 'Stage 1: Customer Inquiry & Specification Request',
    stageId: 'REQUEST_RECEIVED',
    icon: FileText,
    description: 'Initial customer inquiries, preliminary requirements, capacity and application definitions.',
    targetTab: 'flow',
    color: 'border-blue-500 text-blue-600 bg-blue-50',
  },
  'stage-technical': {
    title: 'Stage 2-3: Technical Feasibility & Study',
    stageId: 'TECHNICAL_COMPREHENSION',
    icon: Cpu,
    description: 'Engineering study, technical clarification, power calculations, and drawing preparation.',
    targetTab: 'technical',
    color: 'border-indigo-500 text-indigo-600 bg-indigo-50',
  },
  'stage-quotation': {
    title: 'Stage 4: Quotation & Commercial Proposal',
    stageId: 'QUOTATION_RECEIVED',
    icon: FileCheck,
    description: 'Offer preparation, terms of payment, price revision tracking, and proposal submissions.',
    targetTab: 'commercial',
    color: 'border-sky-500 text-sky-600 bg-sky-50',
  },
  'stage-negotiation': {
    title: 'Stage 5: Commercial Negotiation & Final Terms',
    stageId: 'COMMERCIAL_NEGOTIATION',
    icon: Handshake,
    description: 'Client negotiations, discount approvals, scope adjustments, and final technical sign-off.',
    targetTab: 'commercial',
    color: 'border-amber-500 text-amber-600 bg-amber-50',
  },
  'stage-approval': {
    title: 'Stage 6: Purchase Order & Internal Approval',
    stageId: 'APPROVAL',
    icon: CheckSquare,
    description: 'Official PO validation, advance payment confirmation, and management approval engine.',
    targetTab: 'commercial',
    color: 'border-purple-500 text-purple-600 bg-purple-50',
  },
  'stage-work-order': {
    title: 'Stage 7: Internal Work Order & BOM Release',
    stageId: 'WORK_ORDER',
    icon: Wrench,
    description: 'Work order generation, department assignments, bill of materials (BOM), and factory release.',
    targetTab: 'manufacturing',
    color: 'border-cyan-500 text-cyan-600 bg-cyan-50',
  },
  'stage-manufacturing': {
    title: 'Stage 8-9: Production & Fabrication Tracking',
    stageId: 'MANUFACTURING',
    icon: Factory,
    description: 'Shopfloor assembly, structural fabrication, sub-assembly testing, and progress tracking.',
    targetTab: 'manufacturing',
    color: 'border-orange-500 text-orange-600 bg-orange-50',
  },
  'stage-quality': {
    title: 'Stage 9.5: Quality Inspection & Pre-Dispatch QC',
    stageId: 'MANUFACTURING',
    icon: ShieldCheck,
    description: 'FAT (Factory Acceptance Testing), quality sign-off, pressure testing, and inspection certs.',
    targetTab: 'manufacturing',
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
  },
  'stage-dispatch': {
    title: 'Stage 10: Ready for Dispatch & Packing',
    stageId: 'READY_FOR_DISPATCH',
    icon: PackageCheck,
    description: 'Wooden crating, sea-worthy packing, transport allocation, and dispatch clearance.',
    targetTab: 'dispatch',
    color: 'border-teal-500 text-teal-600 bg-teal-50',
  },
  'stage-delivery': {
    title: 'Stage 11: In-Transit & Site Delivery',
    stageId: 'DELIVERY_SCHEDULED',
    icon: Truck,
    description: 'Consignment tracking, LR / Waybill documentation, insurance, and site arrival.',
    targetTab: 'dispatch',
    color: 'border-blue-600 text-blue-700 bg-blue-50',
  },
  'stage-site-readiness': {
    title: 'Stage 12: Customer Site Readiness Clearance',
    stageId: 'SITE_READINESS',
    icon: Building2,
    description: 'Civil foundation, electrical power, piping, air supply, and site readiness certification.',
    targetTab: 'site',
    color: 'border-emerald-600 text-emerald-700 bg-emerald-50',
  },
  'stage-material-receipt': {
    title: 'Stage 13: Site Material Unloading & GRN',
    stageId: 'MATERIAL_RECEIVED',
    icon: Boxes,
    description: 'Goods receipt note at client site, box inspection, damage report, and unboxing.',
    targetTab: 'site',
    color: 'border-violet-500 text-violet-600 bg-violet-50',
  },
  'stage-installation': {
    title: 'Stage 14: Mechanical & Electrical Erection',
    stageId: 'INSTALLATION_ERECTION',
    icon: Hammer,
    description: 'Engineers deployment, alignment, leveling, piping connection, and electrical cabling.',
    targetTab: 'erection',
    color: 'border-amber-600 text-amber-700 bg-amber-50',
  },
  'stage-daily-progress': {
    title: 'Stage 15: Daily Site Erection Progress Logging',
    stageId: 'WORK_PROGRESS',
    icon: Activity,
    description: 'Day-to-day site log entries, safety checklist, resource logs, and customer sign-off.',
    targetTab: 'erection',
    color: 'border-blue-500 text-blue-600 bg-blue-50',
  },
  'stage-commissioning': {
    title: 'Stage 16-17: Dry Run & Wet Testing Commissioning',
    stageId: 'COMMISSIONING',
    icon: Zap,
    description: 'No-load dry run, trial production runs, process parameter tuning, and speed tests.',
    targetTab: 'erection',
    color: 'border-rose-500 text-rose-600 bg-rose-50',
  },
  'stage-machine-start': {
    title: 'Stage 18: Handover & Official Machine Start',
    stageId: 'MACHINE_START',
    icon: PlayCircle,
    description: 'Commercial production start, customer acceptance sign-off, and warranty activation.',
    targetTab: 'erection',
    color: 'border-emerald-600 text-emerald-700 bg-emerald-50',
  },
};

export const StageProcessView: React.FC<StageProcessViewProps> = ({ stageKey, onSelectProject }) => {
  const { projects, pendingTasks } = useData();
  const [search, setSearch] = useState('');

  const meta = STAGE_META[stageKey] || {
    title: 'Process Stage View',
    stageId: 'REQUEST_RECEIVED',
    icon: FileText,
    description: 'Process stage management overview.',
    targetTab: 'flow',
    color: 'border-blue-500 text-blue-600 bg-blue-50',
  };

  const IconComponent = meta.icon;

  // Filter machines in this stage or nearby
  const stageOrder = getStageOrder(meta.stageId);

  const stageProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.machineType.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const exactStageProjects = stageProjects.filter((p) => p.currentStage === meta.stageId);
  const otherProjects = stageProjects.filter((p) => p.currentStage !== meta.stageId);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl border ${meta.color}`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{meta.title}</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {exactStageProjects.length} Active Machines
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{meta.description}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search machine #, client, or model..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {exactStageProjects.length} machines currently at this stage out of {projects.length} total.
          </span>
        </div>
      </div>

      {/* Machines at this exact stage */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <span>Machines Currently At This Stage ({exactStageProjects.length})</span>
        </h2>

        {exactStageProjects.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-sm text-slate-500 font-medium">No machines currently sitting at this exact stage.</p>
            <p className="text-xs text-slate-400 mt-1">Select any machine below to inspect or advance its stage workflow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exactStageProjects.map((proj) => {
              const projTasks = pendingTasks.filter((t) => t.projectId === proj.id && t.status !== 'Closed');
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id, meta.targetTab)}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {proj.projectNumber}
                      </span>
                      <StatusBadge status={proj.projectStatus} />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{proj.projectName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{proj.customerName}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Machine Model:</span>
                        <span className="font-medium text-slate-800">{proj.machineModel} ({proj.capacity})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Delivery:</span>
                        <span className="font-medium text-slate-800">{proj.targetDeliveryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Progress:</span>
                        <span className="font-bold text-blue-600">{proj.overallCompletionPercent}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {projTasks.length} pending tasks
                    </span>
                    <span className="text-blue-600 font-semibold inline-flex items-center hover:underline">
                      Open Stage Detail &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Other Machine Packages */}
      <div className="pt-4">
        <h2 className="text-base font-bold text-slate-900 mb-3">
          All Machine Packages ({otherProjects.length})
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Project #</th>
                <th className="px-4 py-3">Machine & Customer</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Target Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {otherProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{p.projectNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{p.projectName}</div>
                    <div className="text-slate-500 text-[11px]">{p.customerName} &bull; {p.machineModel}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {STAGE_MAP[p.currentStage]?.name || p.currentStage}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${p.overallCompletionPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{p.overallCompletionPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.targetDeliveryDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectProject(p.id, meta.targetTab)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
