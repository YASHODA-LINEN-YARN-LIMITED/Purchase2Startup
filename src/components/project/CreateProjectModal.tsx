import React, { useState } from 'react';
import { X, FolderPlus, Building2, Calendar, User, DollarSign, Cpu } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export const CreateProjectModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const { addProject, projects } = useData();
  const { currentUser } = useAuth();

  const nextSeq = String(projects.length + 1).padStart(3, '0');
  const defaultProjectNumber = `PRJ-2026-${nextSeq}`;

  const [form, setForm] = useState({
    projectNumber: defaultProjectNumber,
    projectName: '',
    customerName: '',
    contactPerson: '',
    customerEmail: '',
    customerPhone: '',
    plantLocation: '',
    machineType: 'Heavy Industrial Machinery',
    machineModel: '',
    machineCapacity: '',
    technicalSpecifications: '',
    targetDeliveryDate: new Date(Date.now() + 120 * 86400000).toISOString().substring(0, 10),
    projectManager: 'Rohan Mehta',
    salesPerson: currentUser.fullName,
    currency: 'USD',
    expectedOrderValue: 450000,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().substring(0, 10);
    const newProj = addProject({
      projectName: form.projectName,
      customerId: `cust-${Date.now()}`,
      customerName: form.customerName,
      customerCode: form.customerName.substring(0, 4).toUpperCase(),
      contactPerson: form.contactPerson || 'Key Contact',
      phone: form.customerPhone || '+1 555-0199',
      email: form.customerEmail || 'contact@client.com',
      customerAddress: form.plantLocation,
      siteName: `${form.customerName} Plant Site`,
      siteAddress: form.plantLocation,
      machineType: form.machineType,
      machineModel: form.machineModel,
      application: 'Industrial Manufacturing Process',
      capacity: form.machineCapacity || 'Standard Capacity',
      specification: form.technicalSpecifications || 'Standard Technical Spec',
      quantity: 1,
      salesPerson: form.salesPerson,
      projectManager: form.projectManager,
      technicalPerson: 'Engineering Lead',
      commercialPerson: 'Commercial Lead',
      expectedOrderValue: Number(form.expectedOrderValue),
      currency: form.currency,
      expectedStartDate: today,
      targetDeliveryDate: form.targetDeliveryDate,
      machineRequiredDate: form.targetDeliveryDate,
      priority: 'Normal',
      currentStage: 'REQUEST_RECEIVED',
      projectStatus: 'Active',
      overallCompletionPercent: 5,
      health: 'Green',
      delayDays: 0,
      isSiteReady: false,
      createdBy: currentUser.fullName,
      lastModifiedBy: currentUser.fullName,
    });

    onCreated(newProj.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Create New Equipment Project</h2>
              <p className="text-slate-500 text-[11px]">Initialize project lifecycle across 21 stages.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Number</label>
              <input
                type="text"
                value={form.projectNumber}
                onChange={(e) => setForm({ ...form, projectNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Name / Description</label>
              <input
                type="text"
                placeholder="e.g. 500 TPH Continuous Heavy Duty Line"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer / Client Name</label>
              <input
                type="text"
                placeholder="e.g. Tata Steel Global"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. VP Procurement"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Plant Location</label>
              <input
                type="text"
                placeholder="e.g. Jamshedpur Works, Bay 4"
                value={form.plantLocation}
                onChange={(e) => setForm({ ...form, plantLocation: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Machine Model</label>
              <input
                type="text"
                placeholder="e.g. P2S-9500-HD Heavy Mill"
                value={form.machineModel}
                onChange={(e) => setForm({ ...form, machineModel: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Rated Capacity</label>
              <input
                type="text"
                placeholder="e.g. 500 Tons / Hour"
                value={form.machineCapacity}
                onChange={(e) => setForm({ ...form, machineCapacity: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Delivery Date</label>
              <input
                type="date"
                value={form.targetDeliveryDate}
                onChange={(e) => setForm({ ...form, targetDeliveryDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assigned Project Manager</label>
              <input
                type="text"
                value={form.projectManager}
                onChange={(e) => setForm({ ...form, projectManager: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contract Value ({form.currency})</label>
              <input
                type="number"
                value={form.expectedOrderValue}
                onChange={(e) => setForm({ ...form, expectedOrderValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
            >
              Initialize Project & Open Lifecycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
