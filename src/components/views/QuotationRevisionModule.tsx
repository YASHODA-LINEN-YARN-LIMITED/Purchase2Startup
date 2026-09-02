import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Download,
  Eye,
  FileSpreadsheet,
  History,
  CheckCircle,
  X,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { QuotationRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const QuotationRevisionModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { quotations, projects, createQuotationRevision, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRecord | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  // Revision Modal Form
  const [revNotes, setRevNotes] = useState('');
  const [revPrice, setRevPrice] = useState(0);

  const filteredQuotations = quotations.filter((q) => {
    const proj = projects.find((p) => p.id === q.projectId);
    return (
      q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.customerName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOpenRevisionModal = (q: QuotationRecord) => {
    setSelectedQuotation(q);
    setRevPrice(q.totalAmount || 0);
    setRevNotes('');
    setIsRevisionModalOpen(true);
  };

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotation) return;

    createQuotationRevision(selectedQuotation.id, {
      totalAmount: Number(revPrice),
    });

    setIsRevisionModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 4: Quotations & Revision Control</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Generate official offers, track Rev 0/1/2 history, commercial breakdowns & customer approvals.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Quotations_Export', quotations)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by QT #, project, or customer..."
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
                <th className="px-4 py-3">Quotation #</th>
                <th className="px-4 py-3">Rev #</th>
                <th className="px-4 py-3">Project / Customer</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Validity Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((q) => {
                  const proj = projects.find((p) => p.id === q.projectId);
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{q.quotationNumber}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          Rev {q.revisionNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{proj?.projectName || 'Machine Project'}</div>
                        <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono text-slate-900">
                        ${(q.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{q.quotationDate}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenRevisionModal(q)}
                          className="inline-flex items-center px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded hover:bg-amber-100"
                        >
                          <Layers className="w-3.5 h-3.5 mr-1" />
                          + Revise Offer
                        </button>
                        <button
                          onClick={() => onSelectProject(q.projectId, 'quotation')}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          Full Quotation &rarr;
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

      {/* REVISION MODAL */}
      {isRevisionModalOpen && selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Create Quotation Revision (Rev {selectedQuotation.revisionNumber + 1})
              </h3>
              <button onClick={() => setIsRevisionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRevision} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Base Quotation</label>
                <div className="mt-1 p-2 bg-slate-50 border rounded font-mono font-bold text-slate-800">
                  {selectedQuotation.quotationNumber} (Current: Rev {selectedQuotation.revisionNumber})
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Revised Total Price (USD) *</label>
                <input
                  type="number"
                  required
                  value={revPrice}
                  onChange={(e) => setRevPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded font-mono font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Revision Summary / Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={revNotes}
                  onChange={(e) => setRevNotes(e.target.value)}
                  placeholder="e.g. Applied 5% special executive discount and included additional spare parts kit..."
                  className="w-full mt-1 p-2 border rounded text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700 shadow-xs"
                >
                  Save Rev {selectedQuotation.revisionNumber + 1}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
