import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Boxes,
  Calendar,
  X,
  Hammer,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { WorkOrderRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const WorkOrderModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { workOrders, projects, saveWorkOrder, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    internalWorkOrderNumber: 'WO-2026-088',
    workOrderDate: new Date().toISOString().substring(0, 10),
    bomStatus: 'Finalized' as const,
    resourcePlanningStatus: 'Allocated' as const,
    projectEngineer: 'Suresh Patel',
    productionManager: 'Rajesh Sharma',
    planningEngineer: 'Anit Kumar',
    supplierFinalizationStatus: 'Finalized' as const,
    targetManufacturingStart: '2026-04-01',
    targetManufacturingCompletion: '2026-06-15',
    remarks: 'Ensure SS304 grade for all internal chamber ducts',
    isChecklistComplete: true,
  });

  const filteredOrders = workOrders.filter((w) => {
    const proj = projects.find((p) => p.id === w.projectId);
    return (
      (w.internalWorkOrderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWorkOrder({
      projectId: form.projectId,
      internalWorkOrderNumber: form.internalWorkOrderNumber,
      workOrderDate: form.workOrderDate,
      bomStatus: form.bomStatus,
      resourcePlanningStatus: form.resourcePlanningStatus,
      projectEngineer: form.projectEngineer,
      productionManager: form.productionManager,
      planningEngineer: form.planningEngineer,
      supplierFinalizationStatus: form.supplierFinalizationStatus,
      targetManufacturingStart: form.targetManufacturingStart,
      targetManufacturingCompletion: form.targetManufacturingCompletion,
      remarks: form.remarks,
      isChecklistComplete: form.isChecklistComplete,
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
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 7: Internal Work Orders (WO)</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Issue shop-floor work orders, BOM allocations, resource planning & shopfloor release.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('WorkOrders_Export', workOrders)}
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
              + Release Work Order
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
              placeholder="Search by WO #, project, or customer..."
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
                <th className="px-4 py-3">Internal WO #</th>
                <th className="px-4 py-3">WO Date</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">BOM Status</th>
                <th className="px-4 py-3">Mfg Target Dates</th>
                <th className="px-4 py-3">Project Engineer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No work orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((w) => {
                  const proj = projects.find((p) => p.id === w.projectId);
                  return (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{w.internalWorkOrderNumber}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{w.workOrderDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            w.bomStatus === 'Finalized' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.bomStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {w.targetManufacturingStart} &rarr; {w.targetManufacturingCompletion}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{w.projectEngineer || 'Unassigned'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={w.bomStatus === 'Finalized' ? 'Approved' : 'In Progress'} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(w.projectId, 'work-order')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          View WO &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Release Internal Work Order (WO)</h3>
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
                  <label className="font-semibold text-slate-700">Internal WO # *</label>
                  <input
                    type="text"
                    required
                    value={form.internalWoNumber}
                    onChange={(e) => setForm({ ...form, internalWoNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Shopfloor Lead</label>
                  <input
                    type="text"
                    value={form.assignedShopfloorLead}
                    onChange={(e) => setForm({ ...form, assignedShopfloorLead: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Target Start Date</label>
                  <input
                    type="date"
                    value={form.targetManufacturingStart}
                    onChange={(e) => setForm({ ...form, targetManufacturingStart: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Target Completion Date</label>
                  <input
                    type="date"
                    value={form.targetManufacturingCompletion}
                    onChange={(e) => setForm({ ...form, targetManufacturingCompletion: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Special Shopfloor Instructions</label>
                <textarea
                  rows={2}
                  value={form.specialInstructions}
                  onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Issue & Release Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
