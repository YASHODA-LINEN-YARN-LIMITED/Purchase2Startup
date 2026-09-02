import React, { useState } from 'react';
import {
  Factory,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Boxes,
  Truck,
  Building,
  Plus,
  X,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { ManufacturingActivityRecord, ProcurementItem } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const ManufacturingModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { manufacturingActivities, procurementItems, projects, addManufacturingActivity, addProcurementItem, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'progress' | 'procurement'>('progress');
  const [isProcModalOpen, setIsProcModalOpen] = useState(false);

  const [procForm, setProcForm] = useState({
    projectId: projects[0]?.id || '',
    materialCode: 'RAW-SS-304-SHEET',
    materialDescription: '3mm SS304 Hot Rolled Sheet Plate',
    bomQuantity: 50,
    requiredQuantity: 50,
    unit: 'Sheets',
    supplier: 'Jindal Stainless Ltd',
    poNumber: 'PO-MAT-2026-001',
    expectedDelivery: '2026-04-10',
    status: 'Ordered' as any,
  });

  const filteredRecords = manufacturingActivities.filter((m) => {
    const proj = projects.find((p) => p.id === m.projectId);
    return (
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredProcurement = procurementItems.filter((item) => {
    const proj = projects.find((p) => p.id === item.projectId);
    return (
      item.materialCode.toLowerCase().includes(search.toLowerCase()) ||
      item.materialDescription.toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectNumber || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddProcurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProcurementItem({
      projectId: procForm.projectId,
      materialCode: procForm.materialCode,
      materialDescription: procForm.materialDescription,
      bomQuantity: procForm.bomQuantity,
      requiredQuantity: Number(procForm.requiredQuantity),
      unit: procForm.unit,
      supplier: procForm.supplier,
      poNumber: procForm.poNumber,
      expectedDelivery: procForm.expectedDelivery,
      receivedQuantity: 0,
      pendingQuantity: Number(procForm.requiredQuantity),
      inspectionRequired: true,
      status: procForm.status,
    });
    setIsProcModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 text-slate-800 rounded-lg">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 8-9: Manufacturing & Material Procurement</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Track fabrication, machining, assembly, testing completion % & raw material procurement status.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Mfg_Export', manufacturingActivities)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsProcModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Add Material PO / GRN
            </button>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-2 border-b sm:border-b-0 border-slate-200">
            <button
              onClick={() => setActiveTab('progress')}
              className={`pb-2 sm:pb-0 px-3 py-1.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'progress'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Machine Progress Breakdown ({manufacturingActivities.length})
            </button>
            <button
              onClick={() => setActiveTab('procurement')}
              className={`pb-2 sm:pb-0 px-3 py-1.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'procurement'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Material Procurement Tracker ({procurementItems.length})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>
      </div>

      {/* PROGRESS TAB */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Machine #</th>
                  <th className="px-4 py-3">Project & Customer</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Completion %</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No active manufacturing progress logs found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((m) => {
                    const proj = projects.find((p) => p.id === m.projectId);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{proj?.projectNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{proj?.projectName}</div>
                          <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{m.category}</td>
                        <td className="px-4 py-3 text-slate-800">{m.activity}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${m.completionPercent}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold">{m.completionPercent}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={m.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onSelectProject(m.projectId, 'manufacturing')}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 rounded hover:bg-slate-200"
                          >
                            Update Mfg &rarr;
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
      )}

      {/* PROCUREMENT TAB */}
      {activeTab === 'procurement' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Material Code</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">PO Number</th>
                  <th className="px-4 py-3">Expected Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProcurement.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No procurement items recorded.
                    </td>
                  </tr>
                ) : (
                  filteredProcurement.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{p.materialCode}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{p.materialDescription}</td>
                      <td className="px-4 py-3 font-mono">
                        {p.requiredQuantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{p.supplier}</td>
                      <td className="px-4 py-3 font-mono text-blue-600">{p.poNumber || 'N/A'}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{p.expectedDelivery}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROCUREMENT MODAL */}
      {isProcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Material Procurement Record</h3>
              <button onClick={() => setIsProcModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProcurementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Project *</label>
                <select
                  required
                  value={procForm.projectId}
                  onChange={(e) => setProcForm({ ...procForm, projectId: e.target.value })}
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
                  <label className="font-semibold text-slate-700">Material Code *</label>
                  <input
                    type="text"
                    required
                    value={procForm.materialCode}
                    onChange={(e) => setProcForm({ ...procForm, materialCode: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Material Spec</label>
                  <input
                    type="text"
                    value={procForm.materialSpecification}
                    onChange={(e) => setProcForm({ ...procForm, materialSpecification: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Quantity Required</label>
                  <input
                    type="number"
                    value={procForm.quantityRequired}
                    onChange={(e) => setProcForm({ ...procForm, quantityRequired: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Supplier Name</label>
                  <input
                    type="text"
                    value={procForm.supplierName}
                    onChange={(e) => setProcForm({ ...procForm, supplierName: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">PO Number</label>
                  <input
                    type="text"
                    value={procForm.poNumber}
                    onChange={(e) => setProcForm({ ...procForm, poNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Expected Delivery</label>
                  <input
                    type="date"
                    value={procForm.expectedDeliveryDate}
                    onChange={(e) => setProcForm({ ...procForm, expectedDeliveryDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProcModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-800 text-white rounded font-semibold hover:bg-slate-900 shadow-xs"
                >
                  Save Material PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
