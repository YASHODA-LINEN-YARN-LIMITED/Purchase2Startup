import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  Grid,
  List as ListIcon,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { STAGE_MAP, PROCESS_STAGES, getStageOrder } from '../../constants/stages';
import { ProcessStageId, ProjectStatus } from '../../types';

interface Props {
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectListView: React.FC<Props> = ({ onSelectProject, onNewProject }) => {
  const { projects, calculateProjectProgress } = useData();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredProjects = projects.filter((p) => {
    if (stageFilter !== 'ALL' && p.currentStage !== stageFilter) return false;
    if (statusFilter !== 'ALL' && p.projectStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.projectNumber.toLowerCase().includes(q) ||
        p.projectName.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.machineModel.toLowerCase().includes(q) ||
        p.projectManager.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Machines Master Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full registry of all mill equipment procurement, fabrication, and start-up machines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewProject}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Machine</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by machine #, customer, model, engineer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">All Stages (1-21)</option>
            {PROCESS_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                Stage {s.order}: {s.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
              title="Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Machines Display */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Machine # & Name</th>
                  <th className="p-3">Customer & Location</th>
                  <th className="p-3">Machine Model</th>
                  <th className="p-3">Current Stage</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Target Date</th>
                  <th className="p-3">Site Status</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No machines found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const order = getStageOrder(p.currentStage);
                    const stageInfo = STAGE_MAP[p.currentStage];
                    const progress = calculateProjectProgress(p.id);

                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectProject(p.id)}
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-mono font-bold text-blue-600">{p.projectNumber}</div>
                          <div className="font-bold text-slate-900 mt-0.5">{p.projectName}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-900">{p.customerName}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{p.siteAddress || p.siteName}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800 font-semibold">{p.machineModel}</div>
                          <div className="text-[11px] text-slate-500">{p.capacity}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium text-[11px]">
                            {order}. {stageInfo?.name}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">{progress}%</span>
                        </td>
                        <td className="p-3 text-slate-600">
                          <div>{p.targetDeliveryDate}</div>
                          {p.delayDays > 0 && (
                            <span className="text-[10px] text-rose-600 font-bold">
                              +{p.delayDays}d delayed
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {p.isSiteReady ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Ready
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Hold
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={p.projectStatus} size="sm" />
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-blue-600 font-semibold text-xs inline-flex items-center gap-0.5">
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const order = getStageOrder(p.currentStage);
            const stageInfo = STAGE_MAP[p.currentStage];
            const progress = calculateProjectProgress(p.id);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer text-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {p.projectNumber}
                  </span>
                  <StatusBadge status={p.projectStatus} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{p.projectName}</h3>
                  <div className="text-slate-500 mt-0.5">{p.customerName} • {p.siteAddress || p.siteName}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Machine:</span>
                    <span className="font-semibold text-slate-800">{p.machineModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Delivery:</span>
                    <span className="font-medium text-slate-700">{p.targetDeliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stage {order}/21:</span>
                    <span className="font-semibold text-blue-700">{stageInfo?.name}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Lifecycle Completion</span>
                    <span className="font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
