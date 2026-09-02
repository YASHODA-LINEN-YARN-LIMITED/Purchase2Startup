import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  DollarSign,
  Send,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { RequestReceivedRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const RequestInquiryModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { requests, projects, customers, saveRequest, addProject, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestReceivedRecord | null>(null);

  // Form State
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    customerRequirement: '',
    machineType: '10-Chamber Stenter Frame',
    machineModel: 'YASHODA-ST-10',
    capacity: '150 m/min',
    application: 'Textile Finishing',
    quantity: 1,
    sourceOfEnquiry: 'Email' as any,
    salesPerson: 'Anita Sharma',
    requiredDeliveryDate: '',
    expectedBudget: 250000,
    remarks: '',
  });

  const filteredRequests = requests.filter((r) => {
    const proj = projects.find((p) => p.id === r.projectId);
    const matchesSearch =
      (r.machineType || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.customerContact || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectNumber || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpis = {
    total: requests.length,
    newReq: requests.filter((r) => r.status === 'Draft' || r.status === 'Submitted').length,
    underReview: requests.filter((r) => r.status === 'Draft').length,
    techPending: requests.filter((r) => r.status === 'Submitted').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
  };

  const handleSubmitNewEntry = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create or connect project
    const newProj = addProject({
      projectName: `${form.customerName || 'New Client'} - ${form.machineType}`,
      customerId: form.customerId || 'cust-1',
      customerName: form.customerName || 'New Client Pvt Ltd',
      customerCode: 'CLI-100',
      contactPerson: form.contactPerson || 'Contact Person',
      phone: form.phone || '+91 98765 43210',
      email: form.email || 'client@example.com',
      customerAddress: 'Industrial Zone, India',
      siteName: 'Plant 1 Site',
      siteAddress: 'Industrial Plot 42',
      machineType: form.machineType,
      machineModel: form.machineModel,
      application: form.application,
      capacity: form.capacity,
      specification: form.customerRequirement,
      quantity: Number(form.quantity),
      salesPerson: form.salesPerson,
      projectManager: 'Vikram Mehta',
      technicalPerson: 'Rajesh Kumar',
      commercialPerson: 'Anita Sharma',
      expectedOrderValue: Number(form.expectedBudget),
      currency: 'USD',
      expectedStartDate: new Date().toISOString().substring(0, 10),
      targetDeliveryDate: form.requiredDeliveryDate || '2026-11-30',
      machineRequiredDate: form.requiredDeliveryDate || '2026-11-30',
      priority: 'Normal',
      currentStage: 'REQUEST_RECEIVED',
      projectStatus: 'Active',
      overallCompletionPercent: 5,
      health: 'Green',
      delayDays: 0,
      isSiteReady: false,
      createdBy: 'Sales Team',
      lastModifiedBy: 'Sales Team',
    });

    // 2. Save Stage 1 record
    saveRequest({
      projectId: newProj.id,
      requestDate: new Date().toISOString().substring(0, 10),
      customerRequirement: form.customerRequirement,
      machineType: form.machineType,
      machineModel: form.machineModel,
      capacity: form.capacity,
      specification: form.customerRequirement,
      application: form.application,
      quantity: Number(form.quantity),
      customerContact: form.contactPerson,
      requirementDescription: form.customerRequirement,
      requiredDeliveryDate: form.requiredDeliveryDate,
      sourceOfEnquiry: form.sourceOfEnquiry,
      salesPerson: form.salesPerson,
      remarks: form.remarks,
      status: 'Submitted',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Stage 1: Request & Inquiries</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage incoming customer inquiries, capacity specifications, and project intake.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Requests_Export', requests)}
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
              + New Request Entry
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Inquiries</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{kpis.total}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-600 uppercase">Submitted / New</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">{kpis.newReq}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <span className="text-xs font-semibold text-amber-600 uppercase">Tech Study Pending</span>
            <div className="text-2xl font-bold text-amber-700 mt-1">{kpis.techPending}</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-600 uppercase">Converted</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{kpis.completed}</div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, machine model, or inquiry #"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Inquiry Date</th>
                <th className="px-4 py-3">Project / Machine</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Capacity & Qty</th>
                <th className="px-4 py-3">Enquiry Source</th>
                <th className="px-4 py-3">Sales Person</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No inquiry records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const proj = projects.find((p) => p.id === r.projectId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono text-slate-500">{r.requestDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{r.machineType}</div>
                        <div className="text-[11px] text-blue-600 font-mono">{proj?.projectNumber || 'Unassigned'} &bull; {r.machineModel}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {proj?.customerName || r.customerContact || 'Direct Inquiry'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.capacity} ({r.quantity} Unit)
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {r.sourceOfEnquiry}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{r.salesPerson || 'Sales Team'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(r.projectId, 'flow')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Stage &rarr;
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

      {/* NEW ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">New Customer Inquiry & Specification</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewEntry} className="space-y-4 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-blue-600 border-b pb-1">
                  Section A: Customer & Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="e.g. Raymond Apparel Ltd"
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Contact Person</label>
                    <input
                      type="text"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ramesh@raymond.com"
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-blue-600 border-b pb-1 pt-2">
                  Section B: Machine Requirement & Capacity
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Machine Type *</label>
                    <input
                      type="text"
                      required
                      value={form.machineType}
                      onChange={(e) => setForm({ ...form, machineType: e.target.value })}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Machine Model</label>
                    <input
                      type="text"
                      value={form.machineModel}
                      onChange={(e) => setForm({ ...form, machineModel: e.target.value })}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Capacity Requirement</label>
                    <input
                      type="text"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      placeholder="e.g. 150 m/min"
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Quantity</label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Detailed Customer Requirement / Specification</label>
                  <textarea
                    rows={3}
                    value={form.customerRequirement}
                    onChange={(e) => setForm({ ...form, customerRequirement: e.target.value })}
                    placeholder="Specify thermal capacity, chamber specs, gas burner type, automatic temperature control..."
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Source of Enquiry</label>
                    <select
                      value={form.sourceOfEnquiry}
                      onChange={(e) => setForm({ ...form, sourceOfEnquiry: e.target.value as any })}
                      className="w-full mt-1 p-2 border rounded text-xs bg-white"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Website">Website</option>
                      <option value="Existing Customer">Existing Customer</option>
                      <option value="Reference">Reference</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Assigned Sales Manager</label>
                    <input
                      type="text"
                      value={form.salesPerson}
                      onChange={(e) => setForm({ ...form, salesPerson: e.target.value })}
                      className="w-full mt-1 p-2 border rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
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
                  Submit Inquiry & Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
