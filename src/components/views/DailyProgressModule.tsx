import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Search,
  Download,
  Eye,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DailyProgressEntry } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const DailyProgressModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { dailyProgress, projects, addDailyProgress, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    date: new Date().toISOString().substring(0, 10),
    installationCategory: 'Mechanical' as const,
    workActivity: 'Chamber Mechanical Alignment',
    description: 'Completed chamber 1 to 4 mechanical alignment and motor mounting.',
    manpower: 8,
    workingHours: 9,
    progressTodayPercent: 5,
    overallProgressPercent: 75,
    problems: 'Minor delay due to crane availability during afternoon shift.',
    responsiblePerson: 'Suresh Patel',
    enteredBy: 'Suresh Patel',
  });

  const filteredLogs = dailyProgress.filter((d) => {
    const proj = projects.find((p) => p.id === d.projectId);
    return (
      (d.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.enteredBy || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyProgress({
      projectId: form.projectId,
      date: form.date,
      installationCategory: form.installationCategory,
      workActivity: form.workActivity,
      description: form.description,
      manpower: Number(form.manpower),
      workingHours: Number(form.workingHours),
      progressTodayPercent: Number(form.progressTodayPercent),
      overallProgressPercent: Number(form.overallProgressPercent),
      problems: form.problems,
      responsiblePerson: form.responsiblePerson,
      enteredBy: form.enteredBy,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 15: Daily Progress Logging (DPR)</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Site daily log reports, manpower headcount, working hours, obstacles & tomorrow plans.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('DPR_Export', dailyProgress)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Submit DPR Entry
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
              placeholder="Search daily logs by work description, supervisor..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                <th className="px-4 py-3">Log Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Work Description</th>
                <th className="px-4 py-3">Manpower & Hours</th>
                <th className="px-4 py-3">Logged By</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No DPR logs submitted today.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((d) => {
                  const proj = projects.find((p) => p.id === d.projectId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{d.date}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {d.installationCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium max-w-sm truncate">{d.description || d.workActivity}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {d.manpower} Workers ({d.workingHours} hrs)
                      </td>
                      <td className="px-4 py-3 text-slate-800">{d.enteredBy}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(d.projectId, 'dpr')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 rounded hover:bg-rose-100"
                        >
                          Full DPR &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Submit Daily Progress Report (DPR)</h3>
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
                  <label className="font-semibold text-slate-700">Log Date *</label>
                  <input
                    type="date"
                    required
                    value={form.logDate}
                    onChange={(e) => setForm({ ...form, logDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded text-xs bg-white"
                  >
                    <option value="Civil Work">Civil Work</option>
                    <option value="Mechanical Erection">Mechanical Erection</option>
                    <option value="Electrical & Piping">Electrical & Piping</option>
                    <option value="Commissioning Trial">Commissioning Trial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Work Done Description *</label>
                <textarea
                  required
                  rows={2}
                  value={form.workDescription}
                  onChange={(e) => setForm({ ...form, workDescription: e.target.value })}
                  className="w-full mt-1 p-2 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Manpower Headcount</label>
                  <input
                    type="number"
                    value={form.manpowerCount}
                    onChange={(e) => setForm({ ...form, manpowerCount: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Working Hours</label>
                  <input
                    type="number"
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
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
                  className="px-5 py-2 bg-rose-600 text-white rounded font-semibold hover:bg-rose-700 shadow-xs"
                >
                  Submit DPR Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
