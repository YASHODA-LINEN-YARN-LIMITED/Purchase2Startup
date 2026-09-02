import React, { useState } from 'react';
import {
  ListTodo,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronRight,
  FolderGit2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PendingTask } from '../../types';

interface Props {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const CentralizedPendingWorksView: React.FC<Props> = ({ onSelectProject }) => {
  const { pendingTasks, projects, resolvePendingTask } = useData();

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Resolve modal state
  const [resolvingItem, setResolvingItem] = useState<PendingTask | null>(null);
  const [completionRemarks, setCompletionRemarks] = useState('');

  const filtered = pendingTasks.filter((w) => {
    if (projectFilter !== 'ALL' && w.projectId !== projectFilter) return false;
    if (categoryFilter !== 'ALL' && w.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && w.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        w.description.toLowerCase().includes(q) ||
        w.responsiblePerson.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmResolve = () => {
    if (!resolvingItem) return;
    resolvePendingTask(
      resolvingItem.id,
      completionRemarks || 'Punchlist item verified on site and closed.'
    );
    setResolvingItem(null);
    setCompletionRemarks('');
  };

  const getProjectNumber = (pId: string) => {
    const p = projects.find((proj) => proj.id === pId);
    return p ? p.projectNumber : pId;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Centralized Pending Works & Punchlist Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-machine punch items from Site Readiness, Installation, and Commissioning trials.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search punchlist description, engineer, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
        >
          <option value="ALL">All Machines</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectNumber} - {p.projectName}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
        >
          <option value="ALL">All Categories</option>
          <option value="Civil Pending">Civil</option>
          <option value="Electrical Pending">Electrical</option>
          <option value="Mechanical Pending">Mechanical</option>
          <option value="Utilities Pending">Utilities</option>
          <option value="Documentation Pending">Documentation</option>
          <option value="Commercial Pending">Commercial</option>
          <option value="Customer Pending">Customer</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
        >
          <option value="ALL">All Priorities</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
        >
          <option value="ALL">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">ID & Machine</th>
                <th className="p-3">Category</th>
                <th className="p-3">Work Description</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Responsible</th>
                <th className="p-3">Target Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No pending items match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const projNum = getProjectNumber(item.projectId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <div className="font-mono font-bold text-blue-600">{item.id}</div>
                        <button
                          onClick={() => onSelectProject(item.projectId, 'pending')}
                          className="text-[11px] text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 mt-0.5"
                        >
                          <FolderGit2 className="w-3 h-3" />
                          <span>{projNum}</span>
                        </button>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900 max-w-xs">
                        {item.description}
                        {item.closureRemarks && (
                          <div className="text-[11px] text-emerald-700 font-normal mt-0.5">
                            Closed: {item.closureRemarks}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={item.priority} size="sm" />
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        <div>{item.responsiblePerson}</div>
                        <div className="text-[10px] text-slate-400">{item.responsibleDepartment}</div>
                      </td>
                      <td className="p-3 text-slate-600">{item.targetDate}</td>
                      <td className="p-3">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="p-3 text-right">
                        {item.status !== 'Closed' ? (
                          <button
                            onClick={() => {
                              setResolvingItem(item);
                              setCompletionRemarks('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs"
                          >
                            Close
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px]">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Modal */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Close Punchlist Item</h3>
              </div>
              <span className="font-mono text-slate-400">{resolvingItem.id}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-slate-800 font-medium">
              {resolvingItem.description}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Closure & Verification Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Detail verification result..."
                value={completionRemarks}
                onChange={(e) => setCompletionRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setResolvingItem(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
