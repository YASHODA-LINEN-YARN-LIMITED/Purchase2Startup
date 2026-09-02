import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { QCInspectionRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const QualityTestingModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { qcInspections, projects, addQCInspection, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    inspectionNumber: 'QC-2026-104',
    inspectionDate: new Date().toISOString().substring(0, 10),
    inspectionType: 'Final Assembly' as const,
    item: 'Main Frame Structure & Hydraulic Motor Assembly',
    specification: 'ISO 9001 Alignment Tolerance < 0.05mm',
    actualResult: 'Alignment 0.02mm confirmed. All hydrostatic tests passed.',
    passFail: 'Pass' as const,
    inspectedBy: 'Ramesh Patel, Senior QC Lead',
    reinspectionRequired: false,
    finalStatus: 'Closed' as const,
  });

  const filteredChecks = qcInspections.filter((q) => {
    const proj = projects.find((p) => p.id === q.projectId);
    return (
      q.inspectionNumber.toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQCInspection({
      projectId: form.projectId,
      inspectionNumber: form.inspectionNumber,
      inspectionDate: form.inspectionDate,
      inspectionType: form.inspectionType,
      item: form.item,
      specification: form.specification,
      actualResult: form.actualResult,
      passFail: form.passFail,
      inspectedBy: form.inspectedBy,
      reinspectionRequired: form.reinspectionRequired,
      finalStatus: form.finalStatus,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Quality & Testing (QC)</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Incoming material inspection, fabrication QC, assembly trial run & performance signoff.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('QC_Checks_Export', qcInspections)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + New QC Inspection Log
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
              placeholder="Search by QC #, project, or inspector..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <th className="px-4 py-3">Inspection #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">QC Type</th>
                <th className="px-4 py-3">Item / Scope</th>
                <th className="px-4 py-3">Inspector</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChecks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No quality inspection reports recorded.
                  </td>
                </tr>
              ) : (
                filteredChecks.map((q) => {
                  const proj = projects.find((p) => p.id === q.projectId);
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">{q.inspectionNumber}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{q.inspectionDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{q.inspectionType}</td>
                      <td className="px-4 py-3 text-slate-800">{q.item}</td>
                      <td className="px-4 py-3 text-slate-800">{q.inspectedBy}</td>
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            q.passFail === 'Pass'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {q.passFail}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.finalStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(q.projectId, 'quality')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100"
                        >
                          Report &rarr;
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
              <h3 className="text-base font-bold text-slate-900">New QC & Testing Report</h3>
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
                  <label className="font-semibold text-slate-700">Inspection # *</label>
                  <input
                    type="text"
                    required
                    value={form.inspectionNumber}
                    onChange={(e) => setForm({ ...form, inspectionNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Inspection Date</label>
                  <input
                    type="date"
                    value={form.inspectionDate}
                    onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">QC Stage Category</label>
                  <select
                    value={form.stageCategory}
                    onChange={(e) => setForm({ ...form, stageCategory: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded text-xs bg-white"
                  >
                    <option value="Incoming Raw Material">Incoming Raw Material</option>
                    <option value="Fabrication QC">Fabrication QC</option>
                    <option value="Machining QC">Machining QC</option>
                    <option value="Sub-assembly QC">Sub-assembly QC</option>
                    <option value="Final Trial">Final Trial</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Inspection Result</label>
                  <select
                    value={form.inspectionResult}
                    onChange={(e) => setForm({ ...form, inspectionResult: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded text-xs bg-white font-bold"
                  >
                    <option value="Pass">Pass</option>
                    <option value="Conditional Pass">Conditional Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Defects / Observations (if any)</label>
                <textarea
                  rows={2}
                  value={form.defectNotes}
                  onChange={(e) => setForm({ ...form, defectNotes: e.target.value })}
                  placeholder="Note any alignment tolerance deviations..."
                  className="w-full mt-1 p-2 border rounded text-xs"
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
                  className="px-5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Save Quality Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
