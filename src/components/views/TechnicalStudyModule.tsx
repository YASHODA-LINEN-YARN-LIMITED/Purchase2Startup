import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  MessageSquareShare,
  ShieldCheck,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { TechnicalReviewRecord, ClarificationRecord } from '../../types';

interface ModuleProps {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const TechnicalStudyModule: React.FC<ModuleProps> = ({ onSelectProject }) => {
  const { technicalReviews, clarifications, projects, saveTechnicalReview, addClarification, exportToCsv } = useData();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'clarifications'>('reviews');
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);

  // New Clarification state
  const [clarForm, setClarForm] = useState({
    projectId: projects[0]?.id || '',
    clarificationType: 'Technical' as any,
    question: '',
    responsibleDepartment: 'Design & Engineering',
    responsiblePerson: 'Rajesh Kumar',
    requiredByDate: new Date().toISOString().substring(0, 10),
  });

  const filteredReviews = technicalReviews.filter((r) => {
    const proj = projects.find((p) => p.id === r.projectId);
    return (
      (proj?.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      (proj?.projectNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.feasibilityCheck || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredClarifications = clarifications.filter((c) => {
    const proj = projects.find((p) => p.id === c.projectId);
    return (
      (proj?.projectNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.question || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.clarificationType || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClarification({
      projectId: clarForm.projectId,
      clarificationDate: new Date().toISOString().substring(0, 10),
      clarificationType: clarForm.clarificationType,
      question: clarForm.question,
      responsibleDepartment: clarForm.responsibleDepartment,
      responsiblePerson: clarForm.responsiblePerson,
      requiredByDate: clarForm.requiredByDate,
      status: 'Awaiting Customer',
      isMandatory: true,
    });
    setIsClarificationModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Stage 2-3: Technical Feasibility & Study</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Requirement comprehension, power/load calculations, feasibility reviews & technical clarifications.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportToCsv('Technical_Study_Export', technicalReviews)}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button
              onClick={() => setIsClarificationModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Raise Technical Clarification
            </button>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-2 border-b border-slate-200 sm:border-b-0">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 sm:pb-0 px-3 py-1.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Feasibility Reviews ({technicalReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('clarifications')}
              className={`pb-2 sm:pb-0 px-3 py-1.5 text-xs font-bold transition border-b-2 ${
                activeTab === 'clarifications'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Clarifications ({clarifications.length})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by machine # or question..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Machine #</th>
                  <th className="px-4 py-3">Project & Customer</th>
                  <th className="px-4 py-3">Feasibility Status</th>
                  <th className="px-4 py-3">Solution Proposal</th>
                  <th className="px-4 py-3">Responsible Lead</th>
                  <th className="px-4 py-3">Review Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No technical study records found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r) => {
                    const proj = projects.find((p) => p.id === r.projectId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-indigo-600">{proj?.projectNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{proj?.projectName}</div>
                          <div className="text-[11px] text-slate-500">{proj?.customerName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.feasibilityCheck} />
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{r.solutionProposal}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{r.responsibleEngineer || 'Vikram Mehta'}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{r.reviewDate}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onSelectProject(r.projectId, 'technical')}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                          >
                            Study Detail &rarr;
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

      {/* CLARIFICATIONS TABLE */}
      {activeTab === 'clarifications' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Machine #</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Clarification / Question</th>
                  <th className="px-4 py-3">Assigned Lead</th>
                  <th className="px-4 py-3">Required Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClarifications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No open clarifications found.
                    </td>
                  </tr>
                ) : (
                  filteredClarifications.map((c) => {
                    const proj = projects.find((p) => p.id === c.projectId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-indigo-600">{proj?.projectNumber}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{c.clarificationType}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium max-w-sm truncate">{c.question}</td>
                        <td className="px-4 py-3 text-slate-700">{c.responsiblePerson}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{c.requiredByDate}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onSelectProject(c.projectId, 'technical')}
                            className="inline-flex items-center px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100"
                          >
                            Resolve &rarr;
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

      {/* CLARIFICATION MODAL */}
      {isClarificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Raise Technical Clarification</h3>
              <button onClick={() => setIsClarificationModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClarificationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Target Machine Package *</label>
                <select
                  required
                  value={clarForm.projectId}
                  onChange={(e) => setClarForm({ ...clarForm, projectId: e.target.value })}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectNumber} - {p.projectName} ({p.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Clarification Category</label>
                <select
                  value={clarForm.clarificationType}
                  onChange={(e) => setClarForm({ ...clarForm, clarificationType: e.target.value as any })}
                  className="w-full mt-1 p-2 border rounded text-xs bg-white"
                >
                  <option value="Technical">Technical</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Site">Site</option>
                  <option value="Utility">Utility</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Question / Technical Query *</label>
                <textarea
                  required
                  rows={3}
                  value={clarForm.question}
                  onChange={(e) => setClarForm({ ...clarForm, question: e.target.value })}
                  placeholder="e.g. Please confirm total thermal power input requirement (Natural Gas vs LPG)..."
                  className="w-full mt-1 p-2 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Responsible Person</label>
                  <input
                    type="text"
                    value={clarForm.responsiblePerson}
                    onChange={(e) => setClarForm({ ...clarForm, responsiblePerson: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Target Response Date</label>
                  <input
                    type="date"
                    value={clarForm.requiredByDate}
                    onChange={(e) => setClarForm({ ...clarForm, requiredByDate: e.target.value })}
                    className="w-full mt-1 p-2 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsClarificationModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs"
                >
                  Save & Send Clarification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
