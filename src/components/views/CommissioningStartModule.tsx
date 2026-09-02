import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  PlayCircle,
  Activity,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { CommissioningRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const CommissioningStartModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { commissioningRecords, projects, saveCommissioningRecord, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    commissioningDate: new Date().toISOString().substring(0, 10),
    trialRunStart: '09:00',
    trialRunEnd: '17:00',
    trialDurationHours: 8,
    machineRunningHours: 24,
    parameterChecks: 'Speed, Temp, Pneumatic Pressure verified',
    adjustmentDetails: 'Brake tension calibrated',
    performanceTest: 'High Speed 150 m/min continuous run',
    performanceResult: '100% Pass without vibration',
    customerRepresentative: 'Mr. Rajesh Shah',
    commissioningEngineer: 'Rajesh Kumar',
    finalCommissioningStatus: 'Customer Accepted' as const,
  });

  const filteredCommissionings = commissioningRecords.filter((c) => {
    const proj = projects.find((p) => p.id === c.projectId);
    return (
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.commissioningEngineer || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCommissioningRecord({
      projectId: form.projectId,
      commissioningDate: form.commissioningDate,
      trialRunStart: form.trialRunStart,
      trialRunEnd: form.trialRunEnd,
      trialDurationHours: Number(form.trialDurationHours),
      machineRunningHours: Number(form.machineRunningHours),
      parameterChecks: form.parameterChecks,
      adjustmentDetails: form.adjustmentDetails,
      performanceTest: form.performanceTest,
      performanceResult: form.performanceResult,
      customerRepresentative: form.customerRepresentative,
      commissioningEngineer: form.commissioningEngineer,
      finalCommissioningStatus: form.finalCommissioningStatus,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 16-17: Commissioning & Trial Start</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Pre-commissioning safety checks, high-speed trial runs, thermal load testing & customer protocol signoff.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Commissioning_Export', commissioningRecords)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Log Trial Run & Protocol
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
              placeholder="Search trial run logs..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <th className="px-4 py-3">Commissioning Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Engineer</th>
                <th className="px-4 py-3">Performance Test</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommissionings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No commissioning trial runs recorded.
                  </td>
                </tr>
              ) : (
                filteredCommissionings.map((c) => {
                  const proj = projects.find((p) => p.id === c.projectId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono text-slate-500">{c.commissioningDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{c.commissioningEngineer}</td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{c.performanceTest}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{c.performanceResult}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.finalCommissioningStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(c.projectId, 'commissioning')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded hover:bg-amber-100"
                        >
                          Protocol &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Log Commissioning & Trial Run</h3>
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
                  <label className="font-semibold text-slate-700">Speed Test (m/min)</label>
                  <input
                    type="number"
                    value={form.speedTestMpm}
                    onChange={(e) => setForm({ ...form, speedTestMpm: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Machine Load %</label>
                  <input
                    type="number"
                    value={form.machineLoadPercent}
                    onChange={(e) => setForm({ ...form, machineLoadPercent: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Customer Acceptance Protocol Reference #</label>
                <input
                  type="text"
                  value={form.customerAcceptanceReference}
                  onChange={(e) => setForm({ ...form, customerAcceptanceReference: e.target.value })}
                  className="w-full mt-1 p-2 border rounded text-xs font-mono"
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
                  className="px-5 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 shadow-xs"
                >
                  Save Trial Run Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
