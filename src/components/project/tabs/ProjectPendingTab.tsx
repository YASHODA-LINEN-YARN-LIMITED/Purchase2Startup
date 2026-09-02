import React, { useState } from 'react';
import {
  ListTodo,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ShieldCheck,
  Tag,
  User,
  Calendar,
} from 'lucide-react';
import { Project, PendingTask, PendingWorkCategory } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectPendingTab: React.FC<Props> = ({ project }) => {
  const { pendingTasks, addPendingTask, updatePendingTask, resolvePendingTask } = useData();
  const { currentUser } = useAuth();

  const works = pendingTasks.filter((p) => p.projectId === project.id);
  const openWorks = works.filter((p) => p.status !== 'Closed');
  const highPriorityOpen = openWorks.filter((p) => p.priority === 'High' || p.priority === 'Urgent');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add work form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [workForm, setWorkForm] = useState({
    description: '',
    category: 'Mechanical Pending' as PendingWorkCategory,
    priority: 'High' as const,
    responsibleDepartment: 'Service / Erection',
    responsiblePerson: 'Rajesh Kulkarni',
    targetDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
  });

  // Resolve modal state
  const [resolvingItem, setResolvingItem] = useState<PendingTask | null>(null);
  const [completionRemarks, setCompletionRemarks] = useState('');

  const filteredWorks = works.filter((w) => {
    if (categoryFilter !== 'ALL' && w.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
    return true;
  });

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    addPendingTask({
      projectId: project.id,
      projectNumber: project.projectNumber,
      description: workForm.description,
      category: workForm.category,
      relatedStage: project.currentStage,
      priority: workForm.priority,
      responsibleDepartment: workForm.responsibleDepartment,
      responsiblePerson: workForm.responsiblePerson,
      createdDate: new Date().toISOString().substring(0, 10),
      targetDate: workForm.targetDate,
      status: 'Open',
      delayDays: 0,
    });
    setShowAddForm(false);
    setWorkForm({ ...workForm, description: '' });
  };

  const handleConfirmResolve = () => {
    if (!resolvingItem) return;
    resolvePendingTask(
      resolvingItem.id,
      completionRemarks || 'Punchlist item verified on site and closed successfully.'
    );
    setResolvingItem(null);
    setCompletionRemarks('');
  };

  const isOverdue = (targetDate: string, status: string) => {
    if (status === 'Closed') return false;
    return new Date(targetDate).getTime() < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-rose-600" />
              <h2 className="font-bold text-slate-900 text-base">
                Centralized Punchlist & Pending Works
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unified registry for all pending installation, civil, electrical, mechanical, and documentation actions.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Punch Item</span>
          </button>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Total Punch Items</span>
            <span className="text-lg font-bold text-slate-900">{works.length}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-amber-800 text-[11px] block">Open / In Progress</span>
            <span className="text-lg font-bold text-amber-900">{openWorks.length}</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
            <span className="text-rose-800 text-[11px] block">High Priority Blocking</span>
            <span className="text-lg font-bold text-rose-900">{highPriorityOpen.length}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-emerald-800 text-[11px] block">Resolved & Closed</span>
            <span className="text-lg font-bold text-emerald-900">
              {works.filter((w) => w.status === 'Closed').length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter By:</span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Civil Pending">Civil Pending</option>
            <option value="Electrical Pending">Electrical Pending</option>
            <option value="Mechanical Pending">Mechanical Pending</option>
            <option value="Utilities Pending">Utilities Pending</option>
            <option value="Documentation Pending">Documentation Pending</option>
            <option value="Commercial Pending">Commercial Pending</option>
            <option value="Manufacturing Pending">Manufacturing Pending</option>
            <option value="Customer Pending">Customer Pending</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <span className="text-slate-400 text-[11px]">
          Showing {filteredWorks.length} of {works.length} items
        </span>
      </div>

      {/* 3. Punch List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">ID & Category</th>
                <th className="p-3">Work Description</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Target Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No punchlist items recorded for this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorks.map((item) => {
                  const overdue = isOverdue(item.targetDate, item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <div className="font-mono font-bold text-blue-600">{item.id}</div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px] mt-0.5 inline-block">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900 max-w-sm">
                        {item.description}
                        {item.closureRemarks && (
                          <div className="text-[11px] text-emerald-700 font-normal mt-1 bg-emerald-50/60 p-1.5 rounded border border-emerald-200">
                            <strong>Closure:</strong> {item.closureRemarks}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={item.priority} size="sm" />
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{item.responsiblePerson}</div>
                        <div className="text-[10px] text-slate-400">{item.responsibleDepartment}</div>
                      </td>
                      <td className="p-3">
                        <div className={`font-medium ${overdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                          {item.targetDate}
                        </div>
                        {overdue && (
                          <span className="text-[10px] text-rose-600 font-bold block">Overdue</span>
                        )}
                      </td>
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
                            Resolve & Close
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Closed</span>
                          </span>
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

      {/* Add Punch Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Punchlist Work Item</h3>
              </div>
            </div>

            <form onSubmit={handleAddWork} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={workForm.category}
                  onChange={(e) => setWorkForm({ ...workForm, category: e.target.value as PendingWorkCategory })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Mechanical Pending">Mechanical Pending</option>
                  <option value="Electrical Pending">Electrical Pending</option>
                  <option value="Civil Pending">Civil Pending</option>
                  <option value="Utilities Pending">Utilities Pending</option>
                  <option value="Documentation Pending">Documentation Pending</option>
                  <option value="Commercial Pending">Commercial Pending</option>
                  <option value="Customer Pending">Customer Pending</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Work Description</label>
                <textarea
                  rows={2}
                  placeholder="Specify exact deficiency, missing bracket, or rectification needed..."
                  value={workForm.description}
                  onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={workForm.priority}
                    onChange={(e) => setWorkForm({ ...workForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={workForm.targetDate}
                    onChange={(e) => setWorkForm({ ...workForm, targetDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Responsible Person</label>
                  <input
                    type="text"
                    value={workForm.responsiblePerson}
                    onChange={(e) => setWorkForm({ ...workForm, responsiblePerson: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={workForm.responsibleDepartment}
                    onChange={(e) => setWorkForm({ ...workForm, responsibleDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Punch Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
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
                Verification & Closure Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Detail the physical fix or engineering verification completed..."
                value={completionRemarks}
                onChange={(e) => setCompletionRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setResolvingItem(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
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
