import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  MapPin,
  FileText,
  X,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { DeliveryScheduledRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const DeliveryTransitModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { deliveryRecords, projects, saveDeliveryRecord, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    plannedDeliveryDate: new Date().toISOString().substring(0, 10),
    confirmedDeliveryDate: new Date().toISOString().substring(0, 10),
    transporter: 'VRL Logistics India',
    vehicleNumber: 'MH-12-Q-8899',
    lrNumber: 'LR-2026-904',
    lrDate: new Date().toISOString().substring(0, 10),
    driverName: 'Sanjay Yadav',
    driverPhone: '+91 98111 22233',
    dispatchDate: new Date().toISOString().substring(0, 10),
    expectedSiteArrival: '2026-04-18',
    transportStatus: 'In Transit' as const,
    siteReadinessConfirmed: true,
    remarks: 'Dispatched from factory floor; driver assigned.',
  });

  const filteredDeliveries = deliveryRecords.filter((d) => {
    const proj = projects.find((p) => p.id === d.projectId);
    return (
      (d.transporter || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.lrNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.vehicleNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDeliveryRecord({
      projectId: form.projectId,
      plannedDeliveryDate: form.plannedDeliveryDate,
      confirmedDeliveryDate: form.confirmedDeliveryDate,
      transporter: form.transporter,
      vehicleNumber: form.vehicleNumber,
      lrNumber: form.lrNumber,
      lrDate: form.lrDate,
      driverName: form.driverName,
      driverPhone: form.driverPhone,
      dispatchDate: form.dispatchDate,
      expectedSiteArrival: form.expectedSiteArrival,
      transportStatus: form.transportStatus,
      siteReadinessConfirmed: form.siteReadinessConfirmed,
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
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 11: Delivery & Transit Logistics</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                LR track, E-Way bills, vehicle assignment, driver details & site arrival verification.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Delivery_Export', deliveryRecords)}
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
              + Log Vehicle & LR
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
              placeholder="Search by LR #, Vehicle #, Transporter..."
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
                <th className="px-4 py-3">LR Number</th>
                <th className="px-4 py-3">Transporter & Vehicle</th>
                <th className="px-4 py-3">Project & Customer</th>
                <th className="px-4 py-3">Driver Contact</th>
                <th className="px-4 py-3">Dates (Dispatch &rarr; ETA)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No active transit shipments found.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((d) => {
                  const proj = projects.find((p) => p.id === d.projectId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{d.lrNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{d.transporter}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{d.vehicleNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">{d.driverName} ({d.driverPhone})</td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {d.dispatchDate} &rarr; <span className="font-bold text-slate-900">{d.expectedSiteArrival}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={d.transportStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(d.projectId, 'delivery')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          Track Transit &rarr;
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
              <h3 className="text-base font-bold text-slate-900">Log Transit Shipment Details</h3>
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
                  <label className="font-semibold text-slate-700">Transporter Name *</label>
                  <input
                    type="text"
                    required
                    value={form.transporterName}
                    onChange={(e) => setForm({ ...form, transporterName: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Vehicle Number</label>
                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">LR Number *</label>
                  <input
                    type="text"
                    required
                    value={form.lrNumber}
                    onChange={(e) => setForm({ ...form, lrNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">E-Way Bill #</label>
                  <input
                    type="text"
                    value={form.eWayBillNumber}
                    onChange={(e) => setForm({ ...form, eWayBillNumber: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Dispatch Date</label>
                  <input
                    type="date"
                    value={form.dispatchDate}
                    onChange={(e) => setForm({ ...form, dispatchDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Estimated Site Arrival</label>
                  <input
                    type="date"
                    value={form.estimatedArrivalDate}
                    onChange={(e) => setForm({ ...form, estimatedArrivalDate: e.target.value })}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 shadow-xs"
                >
                  Save Transit Logistics Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
