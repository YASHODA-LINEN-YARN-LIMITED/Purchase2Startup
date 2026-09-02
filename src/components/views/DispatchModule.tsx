import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Boxes,
  Truck,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { DispatchClearanceRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const DispatchModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { dispatchRecords, projects, saveDispatchRecord, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    finalInspectionDate: new Date().toISOString().substring(0, 10),
    inspectionResult: 'Pass' as const,
    packingDate: new Date().toISOString().substring(0, 10),
    packingDetails: 'Wooden Crating with VCI Anti-Corrosion Film Wrap',
    numberOfPackages: 6,
    grossWeight: 14500,
    netWeight: 12800,
    dimensions: '68 CBM',
    dispatchClearanceStatus: 'Approved for Dispatch' as const,
    remarks: 'Pre-dispatch QC inspection verified; cleared for transport booking.',
  });

  const filteredDispatches = dispatchRecords.filter((d) => {
    const proj = projects.find((p) => p.id === d.projectId);
    return (
      (d.packingDetails || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDispatchRecord({
      projectId: form.projectId,
      finalInspectionDate: form.finalInspectionDate,
      inspectionResult: form.inspectionResult,
      packingDate: form.packingDate,
      packingDetails: form.packingDetails,
      numberOfPackages: Number(form.numberOfPackages),
      grossWeight: Number(form.grossWeight),
      netWeight: Number(form.netWeight),
      dimensions: form.dimensions,
      dispatchClearanceStatus: form.dispatchClearanceStatus,
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
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 10: Ready for Dispatch & Clearances</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Packing lists, gross weights, multi-dept dispatch clearances (QC, Production, Accounts, Logistics).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Dispatch_Export', dispatchRecords)}
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
              + Create Packing List & Clearance
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
              placeholder="Search by Packing List #, project, or customer..."
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
                <th className="px-4 py-3">Inspection Date</th>
                <th className="px-4 py-3">Packing Details</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Packages & Weight</th>
                <th className="px-4 py-3">QC Result</th>
                <th className="px-4 py-3">Clearance Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDispatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No dispatch records found.
                  </td>
                </tr>
              ) : (
                filteredDispatches.map((d) => {
                  const proj = projects.find((p) => p.id === d.projectId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{d.finalInspectionDate}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{d.packingDetails}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {d.numberOfPackages} Crates ({d.grossWeight.toLocaleString()} kg)
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.inspectionResult === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.inspectionResult}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={d.dispatchClearanceStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(d.projectId, 'dispatch')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          Packing &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Create Packing List & Clearances</h3>
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
                  <label className="font-semibold text-slate-700">Packing List # *</label>
                  <input
                    type="text"
                    required
                    value={form.packingListNumber}
                    onChange={(e) => setForm({ ...form, packingListNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Packages Count</label>
                  <input
                    type="number"
                    value={form.numberOfPackages}
                    onChange={(e) => setForm({ ...form, numberOfPackages: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Gross Weight (kg)</label>
                  <input
                    type="number"
                    value={form.grossWeightKg}
                    onChange={(e) => setForm({ ...form, grossWeightKg: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Dimensions (CBM)</label>
                  <input
                    type="text"
                    value={form.dimensionsCbm}
                    onChange={(e) => setForm({ ...form, dimensionsCbm: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                  Department Signoff Clearances
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.productionCleared}
                      onChange={(e) => setForm({ ...form, productionCleared: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Production Release</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.qcCleared}
                      onChange={(e) => setForm({ ...form, qcCleared: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">QC Inspection Cleared</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.commercialAccountsCleared}
                      onChange={(e) => setForm({ ...form, commercialAccountsCleared: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Accounts Dues Cleared</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={form.logisticsCleared}
                      onChange={(e) => setForm({ ...form, logisticsCleared: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-700">Logistics Cleared</span>
                  </label>
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
                  Save Dispatch Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
