import React, { useState } from 'react';
import {
  PlayCircle,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Award,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { MachineStartRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const OfficialMachineStartModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { machineStartRecords, projects, recordMachineStart, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    officialMachineStartDate: new Date().toISOString().substring(0, 10),
    startTime: '10:00 AM',
    commissioningReference: 'COMM-REF-2026-001',
    recordedBy: 'Rajesh Kumar (Project Lead)',
    customerAcceptanceReference: 'CUST-ACC-2026-001',
    machineStatus: 'Commercial Production' as const,
    productionStarted: true,
    handoverToCustomer: true,
    handoverDate: new Date().toISOString().substring(0, 10),
    remarks: 'Machine handed over in 100% commercial running condition.',
  });

  const filteredStarts = machineStartRecords.filter((m) => {
    const proj = projects.find((p) => p.id === m.projectId);
    return (
      m.customerAcceptanceReference.toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordMachineStart({
      projectId: form.projectId,
      officialMachineStartDate: form.officialMachineStartDate,
      startTime: form.startTime,
      commissioningReference: form.commissioningReference,
      recordedBy: form.recordedBy,
      customerAcceptanceReference: form.customerAcceptanceReference,
      machineStatus: form.machineStatus,
      productionStarted: form.productionStarted,
      handoverToCustomer: form.handoverToCustomer,
      handoverDate: form.handoverDate,
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 18: Official Machine Start & Handover</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Official commercial machine production launch, warranty commencement & Handover Certificate issuing.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Machine_Start_Export', machineStartRecords)}
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
              + Issue Official Handover Cert.
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
              placeholder="Search handover certificates..."
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
                <th className="px-4 py-3">Customer Accept Ref #</th>
                <th className="px-4 py-3">Official Start Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Recorded By</th>
                <th className="px-4 py-3">Machine Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStarts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No official machine start certificates issued yet.
                  </td>
                </tr>
              ) : (
                filteredStarts.map((m) => {
                  const proj = projects.find((p) => p.id === m.projectId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">{m.customerAcceptanceReference}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{m.officialMachineStartDate} {m.startTime}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{m.recordedBy}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.machineStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(m.projectId, 'start')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100"
                        >
                          Certificate &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Issue Official Handover Certificate</h3>
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
                  <label className="font-semibold text-slate-700">Certificate # *</label>
                  <input
                    type="text"
                    required
                    value={form.officialHandoverCertificateNumber}
                    onChange={(e) => setForm({ ...form, officialHandoverCertificateNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Customer Signatory Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerSignatoryName}
                    onChange={(e) => setForm({ ...form, customerSignatoryName: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Warranty Start Date</label>
                  <input
                    type="date"
                    value={form.warrantyStartDate}
                    onChange={(e) => setForm({ ...form, warrantyStartDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Warranty End Date</label>
                  <input
                    type="date"
                    value={form.warrantyEndDate}
                    onChange={(e) => setForm({ ...form, warrantyEndDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
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
                  className="px-5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Issue Handover Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
