import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Plus,
  GitBranch,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Project, SiteReadinessTask } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
  onOpenCertificate: () => void;
}

export const ProjectSiteTab: React.FC<Props> = ({ project, onOpenCertificate }) => {
  const { siteTasks, addSiteTask, updateSiteTask, setSiteReadyDecision, siteCertificates } = useData();
  const { currentUser } = useAuth();

  const tasks = siteTasks.filter((t) => t.projectId === project.id);
  const civilTasks = tasks.filter((t) => t.category === 'CIVIL');
  const electricalTasks = tasks.filter((t) => t.category === 'ELECTRICAL');
  const mechanicalTasks = tasks.filter((t) => t.category === 'MECHANICAL');

  const civilPct =
    civilTasks.length > 0
      ? Math.round(
          (civilTasks.filter((t) => t.status === 'Completed').length / civilTasks.length) * 100
        )
      : 100;
  const electricalPct =
    electricalTasks.length > 0
      ? Math.round(
          (electricalTasks.filter((t) => t.status === 'Completed').length /
            electricalTasks.length) *
            100
        )
      : 100;
  const mechanicalPct =
    mechanicalTasks.length > 0
      ? Math.round(
          (mechanicalTasks.filter((t) => t.status === 'Completed').length /
            mechanicalTasks.length) *
            100
        )
      : 100;

  const overallPct = Math.round((civilPct + electricalPct + mechanicalPct) / 3);
  const existingCert = siteCertificates.find((c) => c.projectId === project.id);

  // New task form state
  const [showNewTask, setShowNewTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    category: 'CIVIL' as const,
    task: '',
    responsibleDepartment: 'Civil',
    responsiblePerson: 'Praveen Joshi',
    targetDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addSiteTask({
      projectId: project.id,
      category: taskForm.category,
      task: taskForm.task,
      responsiblePerson: taskForm.responsiblePerson,
      targetDate: taskForm.targetDate,
      status: 'In Progress',
      required: true,
    });
    setTaskForm({ ...taskForm, task: '' });
    setShowNewTask(false);
  };

  const toggleTaskStatus = (task: SiteReadinessTask) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    updateSiteTask(task.id, {
      status: nextStatus,
      completedDate: nextStatus === 'Completed' ? new Date().toISOString().substring(0, 10) : undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Site Readiness Header & Percentage Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 12: Site Readiness Assessment & Verification
              </h3>
              {project.isSiteReady ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SITE READY VERIFIED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  SITE NOT READY (HOLD GATE)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify foundation curing, main power 415V, earthing, crane availability, and unloading clearance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewTask(!showNewTask)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Checklist Task</span>
            </button>
            <button
              onClick={onOpenCertificate}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>{existingCert ? 'View Certificate' : 'Issue Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Readiness % Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Civil Readiness
              </span>
              <span className="font-bold text-slate-800">{civilPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  civilPct === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${civilPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5">
              {civilTasks.filter((t) => t.status === 'Completed').length}/{civilTasks.length} tasks complete
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Electrical Readiness
              </span>
              <span className="font-bold text-slate-800">{electricalPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  electricalPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${electricalPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5">
              {electricalTasks.filter((t) => t.status === 'Completed').length}/{electricalTasks.length} tasks complete
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-purple-600" />
                Mechanical Readiness
              </span>
              <span className="font-bold text-slate-800">{mechanicalPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  mechanicalPct === 100 ? 'bg-emerald-500' : 'bg-purple-600'
                }`}
                style={{ width: `${mechanicalPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5">
              {mechanicalTasks.filter((t) => t.status === 'Completed').length}/{mechanicalTasks.length} tasks complete
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              overallPct === 100
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/80 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Overall Readiness</span>
              <span>{overallPct}%</span>
            </div>
            <div className="w-full h-2 bg-black/10 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  overallPct === 100 ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold mt-1.5">
              {overallPct === 100
                ? 'Site 100% verified. Certificate ready.'
                : 'Not 100%. Management override required for cert.'}
            </div>
          </div>
        </div>

        {/* Gate Decision Notice */}
        <div className={`mt-5 p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          project.isSiteReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <GitBranch className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">
                Site Readiness Gate: {project.isSiteReady ? 'AUTHORIZED FOR MATERIAL UNLOADING' : 'HOLD MATERIAL ARRIVAL'}
              </span>
              <p className="text-[11px] mt-0.5 opacity-90">
                {project.isSiteReady
                  ? 'All foundations and utilities verified. Consignment unloading and mechanical leveling permitted.'
                  : 'Site incomplete. Unchecked items auto-transferred to Centralized Pending Works.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSiteReadyDecision(project.id, !project.isSiteReady)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-xs ${
              project.isSiteReady
                ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
          >
            {project.isSiteReady ? 'Set to Not Ready' : 'Authorize Site Ready'}
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showNewTask && (
        <form
          onSubmit={handleAddTask}
          className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3"
        >
          <div className="font-semibold text-slate-900">Add Site Readiness Inspection Item</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-medium text-slate-600 block mb-1">Category</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              >
                <option value="CIVIL">Civil</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="MECHANICAL">Mechanical</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-medium text-slate-600 block mb-1">Task / Criteria Description</label>
              <input
                type="text"
                placeholder="e.g. Earthing resistance measurement below 2.0 Ohms..."
                value={taskForm.task}
                onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">Target Date</label>
              <input
                type="date"
                value={taskForm.targetDate}
                onChange={(e) => setTaskForm({ ...taskForm, targetDate: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewTask(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Checklists Split into 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Civil Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-xs">Civil Checklist ({civilTasks.length})</h4>
            </div>
            <span className="font-bold text-xs text-blue-600">{civilPct}%</span>
          </div>

          <div className="space-y-2">
            {civilTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTaskStatus(t)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                  t.status === 'Completed'
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.status === 'Completed'}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-emerald-600 mt-0.5 shrink-0 pointer-events-none"
                />
                <div className="flex-1">
                  <div className={`font-medium ${t.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                    {t.task}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>Resp: {t.responsiblePerson}</span>
                    <span>{t.completedDate || t.targetDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Electrical Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-slate-900 text-xs">Electrical Checklist ({electricalTasks.length})</h4>
            </div>
            <span className="font-bold text-xs text-amber-600">{electricalPct}%</span>
          </div>

          <div className="space-y-2">
            {electricalTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTaskStatus(t)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                  t.status === 'Completed'
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.status === 'Completed'}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-emerald-600 mt-0.5 shrink-0 pointer-events-none"
                />
                <div className="flex-1">
                  <div className={`font-medium ${t.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                    {t.task}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>Resp: {t.responsiblePerson}</span>
                    <span>{t.completedDate || t.targetDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mechanical Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-600" />
              <h4 className="font-bold text-slate-900 text-xs">Mechanical Checklist ({mechanicalTasks.length})</h4>
            </div>
            <span className="font-bold text-xs text-purple-600">{mechanicalPct}%</span>
          </div>

          <div className="space-y-2">
            {mechanicalTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTaskStatus(t)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                  t.status === 'Completed'
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={t.status === 'Completed'}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-emerald-600 mt-0.5 shrink-0 pointer-events-none"
                />
                <div className="flex-1">
                  <div className={`font-medium ${t.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                    {t.task}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>Resp: {t.responsiblePerson}</span>
                    <span>{t.completedDate || t.targetDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
