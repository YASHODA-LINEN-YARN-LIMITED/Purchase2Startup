import React, { useState } from 'react';
import {
  Hammer,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { InstallationActivity } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const InstallationErectionModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { installationActivities, projects, addInstallationActivity, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    category: 'Mechanical' as const,
    task: 'Main Frame Structure Erection & Levelling',
    responsibleTeam: 'Erection Team Alpha',
    supervisor: 'Suresh Patel',
    plannedStart: new Date().toISOString().substring(0, 10),
    plannedCompletion: '2026-05-20',
    progressPercent: 90,
    status: 'In Progress' as const,
    remarks: 'Erection in progress, mechanical structure aligned.',
  });

  const filteredInstallations = installationActivities.filter((i) => {
    const proj = projects.find((p) => p.id === i.projectId);
    return (
      (i.task || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.supervisor || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInstallationActivity({
      projectId: form.projectId,
      category: form.category,
      task: form.task,
      responsibleTeam: form.responsibleTeam,
      supervisor: form.supervisor,
      plannedStart: form.plannedStart,
      plannedCompletion: form.plannedCompletion,
      progressPercent: Number(form.progressPercent),
      status: form.status,
      remarks: form.remarks,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 14: Installation & Erection</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                On-site mechanical erection, electrical wiring, piping assembly & erection supervisor logs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Installation_Export', installationActivities)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Update Installation Log
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, engineer, or customer..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Task / Activity</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Target Completion</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstallations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No installation records found.
                  </td>
                </tr>
              ) : (
                filteredInstallations.map((i) => {
                  const proj = projects.find((p) => p.id === i.projectId);
                  return (
                    <tr key={i.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-medium text-slate-900">{i.task}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">{i.category}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{i.supervisor}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${i.progressPercent}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold">{i.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{i.plannedCompletion}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={i.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(i.projectId, 'installation')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100"
                        >
                          Erection Log &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Erection Progress</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Project *</label>
                <select
                  required
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectNumber} - {p.projectName} ({p.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Mechanical %</label>
                  <input
                    type="number"
                    max={100}
                    value={form.mechanicalErectionPercent}
                    onChange={(e) => setForm({ ...form, mechanicalErectionPercent: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Electrical %</label>
                  <input
                    type="number"
                    max={100}
                    value={form.electricalPipingPercent}
                    onChange={(e) => setForm({ ...form, electricalPipingPercent: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Overall Erection Completion %</label>
                <input
                  type="number"
                  max={100}
                  value={form.overallErectionPercent}
                  onChange={(e) => setForm({ ...form, overallErectionPercent: Number(e.target.value) })}
                  className="w-full mt-1 p-2 border rounded text-xs font-mono font-bold text-indigo-700"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
