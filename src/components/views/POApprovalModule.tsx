import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertOctagon,
  FileText,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApprovalRequestRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const POApprovalModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { approvalRequests, projects, requestApproval, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    poNumber: 'PO-RAY-2026-99',
    poDate: new Date().toISOString().substring(0, 10),
    poValue: 235000,
    requestedBy: 'Commercial Team',
    remarks: 'PO matches commercial terms.',
  });

  const filteredApprovals = approvalRequests.filter((a) => {
    const proj = projects.find((p) => p.id === a.projectId);
    return (
      (a.poNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestApproval({
      projectId: form.projectId,
      approvalRequestedDate: new Date().toISOString().substring(0, 10),
      poReceived: true,
      poNumber: form.poNumber,
      poDate: form.poDate,
      poValue: Number(form.poValue),
      approvalStatus: 'Pending',
      requestedBy: form.requestedBy,
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
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 6: PO & Approval Engine</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Verify Customer PO against final quotation, analyze discrepancies & trigger production release.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Approvals_Export', approvalRequests)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Process Customer PO
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
              placeholder="Search by PO #, project, or customer..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <th className="px-4 py-3">Customer PO #</th>
                <th className="px-4 py-3">PO Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">PO Amount</th>
                <th className="px-4 py-3">Requested By</th>
                <th className="px-4 py-3">Approver</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No PO approvals found.
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((a) => {
                  const proj = projects.find((p) => p.id === a.projectId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-purple-700">{a.poNumber || 'N/A'}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{a.poDate || a.approvalRequestedDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono text-slate-900">
                        ${(a.poValue || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{a.requestedBy}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{a.approvedBy || 'Pending Management'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.approvalStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(a.projectId, 'approval')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded hover:bg-purple-100"
                        >
                          Review &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Process Customer PO & Approval</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Machine Project *</label>
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
                  <label className="font-semibold text-slate-700">Customer PO # *</label>
                  <input
                    type="text"
                    required
                    value={form.customerPoNumber}
                    onChange={(e) => setForm({ ...form, customerPoNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">PO Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={form.poAmount}
                    onChange={(e) => setForm({ ...form, poAmount: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={form.technicalSpecsMatched}
                    onChange={(e) => setForm({ ...form, technicalSpecsMatched: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <span className="font-semibold text-slate-800">Tech Specs Match Offer</span>
                </label>
                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={form.commercialTermsMatched}
                    onChange={(e) => setForm({ ...form, commercialTermsMatched: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <span className="font-semibold text-slate-800">Commercial Terms Match</span>
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Discrepancy Notes / Comments</label>
                <textarea
                  rows={2}
                  value={form.discrepancyNotes}
                  onChange={(e) => setForm({ ...form, discrepancyNotes: e.target.value })}
                  placeholder="Note any deviations in delivery timeline or payment milestones..."
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
                  className="px-5 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 shadow-xs"
                >
                  Approve PO & Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
