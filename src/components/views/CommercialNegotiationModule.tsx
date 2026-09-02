import React, { useState } from 'react';
import {
  Handshake,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  DollarSign,
  Calendar,
  MessageSquare,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { CommercialNegotiationRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const CommercialNegotiationModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { negotiations, projects, addNegotiation, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    negotiationDate: new Date().toISOString().substring(0, 10),
    meetingType: 'In-person Meeting' as const,
    priceDiscussed: 240000,
    negotiatedPrice: 235000,
    discount: 5000,
    finalPrice: 235000,
    paymentTerms: '20% Advance, 70% against Proforma Invoice, 10% post Installation',
    deliveryTerms: 'Ex-works Factory',
    taxesAndDuties: '18% GST extra',
    warranty: '12 Months standard warranty',
    otherTerms: 'Standard SLA applies',
    discussionNotes: 'Final commercial alignment completed.',
    customerRepresentative: 'Mr. Rajesh Shah (Director)',
    companyRepresentative: 'Anita Sharma (Sales VP)',
    status: 'Final Terms Agreed' as const,
  });

  const filteredNegotiations = negotiations.filter((n) => {
    const proj = projects.find((p) => p.id === n.projectId);
    return (
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (n.customerRepresentative || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNegotiation({
      projectId: form.projectId,
      negotiationDate: form.negotiationDate,
      meetingType: form.meetingType,
      priceDiscussed: Number(form.priceDiscussed),
      negotiatedPrice: Number(form.negotiatedPrice),
      discount: Number(form.discount),
      finalPrice: Number(form.finalPrice),
      paymentTerms: form.paymentTerms,
      deliveryTerms: form.deliveryTerms,
      taxesAndDuties: form.taxesAndDuties,
      warranty: form.warranty,
      otherTerms: form.otherTerms,
      discussionNotes: form.discussionNotes,
      customerRepresentative: form.customerRepresentative,
      companyRepresentative: form.companyRepresentative,
      status: form.status,
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
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 5: Commercial Negotiation</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Log commercial discussions, final negotiated terms, payment milestones, and discount approvals.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Negotiation_Export', negotiations)}
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
              + Log Negotiation Meeting
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or project..."
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
                <th className="px-4 py-3">Meeting Date</th>
                <th className="px-4 py-3">Project / Customer</th>
                <th className="px-4 py-3">Attendees</th>
                <th className="px-4 py-3">Initial vs Final Agreed</th>
                <th className="px-4 py-3">Agreed Payment Terms</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNegotiations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No commercial negotiation logs found.
                  </td>
                </tr>
              ) : (
                filteredNegotiations.map((n) => {
                  const proj = projects.find((p) => p.id === n.projectId);
                  return (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono text-slate-500">{n.negotiationDate}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{n.customerRepresentative || 'Executive Meeting'}</td>
                      <td className="px-4 py-3 font-mono">
                        <span className="line-through text-slate-400 mr-2">${(n.priceDiscussed || 0).toLocaleString()}</span>
                        <span className="font-bold text-emerald-700">${(n.finalPrice || n.negotiatedPrice || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{n.paymentTerms}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {n.meetingType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectProject(n.projectId, 'negotiation')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100"
                        >
                          Details &rarr;
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

      {/* LOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Commercial Negotiation Meeting</h3>
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
                  <label className="font-semibold text-slate-700">Initial Quoted Price ($)</label>
                  <input
                    type="number"
                    value={form.priceDiscussed}
                    onChange={(e) => setForm({ ...form, priceDiscussed: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Final Agreed Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={form.finalPriceAgreed}
                    onChange={(e) => setForm({ ...form, finalPriceAgreed: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border rounded text-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Agreed Payment Terms *</label>
                <input
                  type="text"
                  required
                  value={form.paymentTermsAgreed}
                  onChange={(e) => setForm({ ...form, paymentTermsAgreed: e.target.value })}
                  placeholder="e.g. 20% Advance, 70% against PI, 10% after Start"
                  className="w-full mt-1 p-2 border rounded text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Negotiation Summary & Remarks</label>
                <textarea
                  rows={3}
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
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
                  className="px-5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Save Negotiation Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
