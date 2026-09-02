import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  X,
  FileCheck,
  AlertOctagon,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { MaterialReceiptRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const SiteMaterialGRNModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { materialReceipts, projects, saveMaterialReceipt, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    grnNumber: 'GRN-SITE-2026-11',
    grnDate: new Date().toISOString().substring(0, 10),
    receivedDate: new Date().toISOString().substring(0, 10),
    transporter: 'VRL Logistics India',
    vehicleNumber: 'MH-12-Q-8899',
    receivedBy: 'Suresh Patel',
    packageCount: 6,
    materialCondition: 'Intact & Undamaged' as const,
    shortageFound: false,
    damageFound: false,
    inspectionDate: new Date().toISOString().substring(0, 10),
    inspectionResult: 'Accepted' as const,
    storageLocation: 'Main Plant Storage Yard',
    handlingInstructions: 'Store under covered shed with VCI protection.',
    remarks: 'All 6 crates received in sound condition.',
  });

  const filteredGRNs = materialReceipts.filter((g) => {
    const proj = projects.find((p) => p.id === g.projectId);
    return (
      (g.grnNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMaterialReceipt({
      projectId: form.projectId,
      grnNumber: form.grnNumber,
      grnDate: form.grnDate,
      receivedDate: form.receivedDate,
      transporter: form.transporter,
      vehicleNumber: form.vehicleNumber,
      receivedBy: form.receivedBy,
      packageCount: Number(form.packageCount),
      materialCondition: form.materialCondition,
      shortageFound: form.shortageFound,
      damageFound: form.damageFound,
      inspectionDate: form.inspectionDate,
      inspectionResult: form.inspectionResult,
      storageLocation: form.storageLocation,
      handlingInstructions: form.handlingInstructions,
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
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 13: Site Material Receipt (GRN)</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Goods Receipt Note (GRN) at customer site, package condition verification (Intact / Damage / Shortage).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('GRN_Export', materialReceipts)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Issue Site GRN
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
              placeholder="Search by GRN #, project, or customer..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <th className="px-4 py-3">GRN #</th>
                <th className="px-4 py-3">Receipt Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Packages (Recv / Exp)</th>
                <th className="px-4 py-3">Package Condition</th>
                <th className="px-4 py-3">Verified By</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGRNs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No site material GRN records found.
                  </td>
                </tr>
              ) : (
                filteredGRNs.map((g) => {
                  const proj = projects.find((p) => p.id === g.projectId);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{g.grnNumber}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{g.receivedDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {g.packageCount} Crates
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={g.materialCondition} />
                      </td>
                      <td className="px-4 py-3 text-slate-800">{g.receivedBy}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(g.projectId, 'grn')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          GRN Details &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Issue Site Material GRN</h3>
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
                  <label className="font-semibold text-slate-700">GRN Number *</label>
                  <input
                    type="text"
                    required
                    value={form.grnNumber}
                    onChange={(e) => setForm({ ...form, grnNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Condition Status</label>
                  <select
                    value={form.conditionStatus}
                    onChange={(e) => setForm({ ...form, conditionStatus: e.target.value as any })}
                    className="w-full mt-1 p-2 border rounded text-xs bg-white font-bold"
                  >
                    <option value="Intact">Intact</option>
                    <option value="Damage">Damage</option>
                    <option value="Shortage">Shortage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Packages Received</label>
                  <input
                    type="number"
                    value={form.packagesReceived}
                    onChange={(e) => setForm({ ...form, packagesReceived: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Packages Expected</label>
                  <input
                    type="number"
                    value={form.packagesExpected}
                    onChange={(e) => setForm({ ...form, packagesExpected: Number(e.target.value) })}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Save Site GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
