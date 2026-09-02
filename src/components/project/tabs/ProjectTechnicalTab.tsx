import React, { useState } from 'react';
import {
  Cpu,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Zap,
  Wrench,
  Layers,
  FileText,
} from 'lucide-react';
import { Project, ClarificationRecord, TechnicalReviewRecord } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectTechnicalTab: React.FC<Props> = ({ project }) => {
  const {
    clarifications,
    addClarification,
    updateClarification,
    technicalReviews,
    saveTechnicalReview,
  } = useData();
  const { currentUser } = useAuth();

  // Filter clarifications
  const projectClarifications = clarifications.filter((c) => c.projectId === project.id);
  const openClarifications = projectClarifications.filter((c) => c.status === 'Open');

  // Technical review
  const currentReview = technicalReviews.find((r) => r.projectId === project.id);

  // New clarification modal/form
  const [showNewClar, setShowNewClar] = useState(false);
  const [clarForm, setClarForm] = useState({
    question: '',
    askedBy: 'Sales Team',
    responsibleDepartment: 'Technical',
  });

  // Answer inline state
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  // Technical review form state
  const [reviewForm, setReviewForm] = useState<Partial<TechnicalReviewRecord>>({
    requirementStudy: currentReview?.requirementStudy || 'Customer requires continuous 24x7 heavy duty operation. High tensile steel processing line.',
    feasibilityCheck: currentReview?.feasibilityCheck || 'Feasible',
    technicalDiscussionNotes: currentReview?.technicalDiscussionNotes || 'Joint review completed with mechanical design team. Drive train capacity validated.',
    solutionProposal: currentReview?.solutionProposal || 'Custom heavy duty drive with hardened helical gearboxes and automated PLC synchronization.',
    capacityConfirmation: currentReview?.capacityConfirmation || '500 Tons/Hour validated at 1450 RPM.',
    utilityRequirement: currentReview?.utilityRequirement || 'Electric Power: 180 kW, 415V 3-Phase 50Hz; Compressed Air: 6 Bar, 25 CFM dry air; Cooling Water: 500 LPH closed loop.',
    siteRequirement: currentReview?.siteRequirement || 'RCC Foundation with M30 grade concrete, 300mm depth. Overhead EOT crane minimum 15-ton capacity required for erection.',
    proposedConfiguration: currentReview?.proposedConfiguration || 'Model P2S-9500-HD with Siemens S7-1500 PLC and SCADA integration.',
    technicalRisks: currentReview?.technicalRisks || 'Peak ambient site temperature up to 48C requires upgraded panel air conditioning.',
    responsibleEngineer: currentReview?.responsibleEngineer || 'Dr. Arvind Joshi (CTO)',
    isApproved: currentReview?.isApproved ?? true,
  });

  const handleAddClarification = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().substring(0, 10);
    addClarification({
      projectId: project.id,
      clarificationDate: today,
      clarificationType: 'Technical',
      question: clarForm.question,
      responsiblePerson: clarForm.askedBy,
      responsibleDepartment: clarForm.responsibleDepartment,
      requiredByDate: today,
      status: 'Open',
      isMandatory: false,
    });
    setClarForm({ question: '', askedBy: 'Sales Team', responsibleDepartment: 'Technical' });
    setShowNewClar(false);
  };

  const handleSaveAnswer = (id: string) => {
    updateClarification(id, {
      responseDate: new Date().toISOString().substring(0, 10),
      responsiblePerson: currentUser.fullName,
      customerResponse: answerText,
      status: 'Closed',
    });
    setAnsweringId(null);
    setAnswerText('');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    saveTechnicalReview({
      projectId: project.id,
      ...reviewForm,
      completionDate: new Date().toISOString().substring(0, 10),
    });
    alert('Technical review & engineering feasibility study saved successfully.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Stage 2: Clarification & Technical Queries Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 2: Technical Queries & Clarification Tracker
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rule: All mandatory technical queries must be closed before final quotation release.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {openClarifications.length > 0 ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{openClarifications.length} Query Open</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Queries Closed</span>
              </span>
            )}

            <button
              onClick={() => setShowNewClar(!showNewClar)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Query</span>
            </button>
          </div>
        </div>

        {showNewClar && (
          <form
            onSubmit={handleAddClarification}
            className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="font-semibold text-slate-900">New Technical Query / Clarification</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-medium text-slate-600 block mb-1">Technical Question / Requirement</label>
                <input
                  type="text"
                  placeholder="e.g. Confirm raw material feed thickness tolerance and electrical supply harmonic limits..."
                  value={clarForm.question}
                  onChange={(e) => setClarForm({ ...clarForm, question: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Target Department</label>
                <select
                  value={clarForm.responsibleDepartment}
                  onChange={(e) => setClarForm({ ...clarForm, responsibleDepartment: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Technical">Technical / Design</option>
                  <option value="Electrical">Electrical & Automation</option>
                  <option value="Civil">Civil / Structural</option>
                  <option value="Customer">Customer Engineering</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewClar(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Submit Query
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {projectClarifications.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              No clarifications recorded for this project yet.
            </div>
          ) : (
            projectClarifications.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 text-[11px]">{c.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                      Dept: {c.responsibleDepartment}
                    </span>
                    <span className="text-slate-400 text-[11px]">Asked on {c.clarificationDate}</span>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                </div>

                <div className="font-semibold text-slate-900 text-xs mb-2">
                  Q: {c.question}
                </div>

                {c.customerResponse ? (
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Response by {c.responsiblePerson}</span>
                      <span>{c.responseDate}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.customerResponse}</p>
                  </div>
                ) : (
                  <div>
                    {answeringId === c.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Provide verified technical answer..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setAnsweringId(null)}
                            className="px-2.5 py-1 text-slate-500 border border-slate-200 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveAnswer(c.id)}
                            className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg"
                          >
                            Submit Answer & Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAnsweringId(c.id);
                          setAnswerText('');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs mt-1"
                      >
                        + Provide Technical Answer & Close Query
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Stage 3: Technical Review & Feasibility Study */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 3: Technical Review & Engineering Feasibility Study
              </h3>
              <p className="text-xs text-slate-500">
                Detailed application engineering, utility constraints, site criteria and capacity validation.
              </p>
            </div>
          </div>
          <StatusBadge status={reviewForm.feasibilityCheck || 'Feasible'} size="md" />
        </div>

        <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Feasibility Status</label>
              <select
                value={reviewForm.feasibilityCheck}
                onChange={(e) => setReviewForm({ ...reviewForm, feasibilityCheck: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="Feasible">Feasible (Meets all performance criteria)</option>
                <option value="Feasible With Modification">Feasible With Modification</option>
                <option value="Not Feasible">Not Feasible (Reject enquiry)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Capacity Confirmation</label>
              <input
                type="text"
                value={reviewForm.capacityConfirmation}
                onChange={(e) => setReviewForm({ ...reviewForm, capacityConfirmation: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Chief Engineer Sign-off</label>
              <input
                type="text"
                value={reviewForm.responsibleEngineer}
                onChange={(e) => setReviewForm({ ...reviewForm, responsibleEngineer: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Customer Requirement Study & Scope</label>
            <textarea
              rows={2}
              value={reviewForm.requirementStudy}
              onChange={(e) => setReviewForm({ ...reviewForm, requirementStudy: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Utility Requirements (Power, Air, Water)</span>
              </label>
              <textarea
                rows={3}
                value={reviewForm.utilityRequirement}
                onChange={(e) => setReviewForm({ ...reviewForm, utilityRequirement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                <span>Site & Civil Requirements (Foundation, EOT Crane, Area)</span>
              </label>
              <textarea
                rows={3}
                value={reviewForm.siteRequirement}
                onChange={(e) => setReviewForm({ ...reviewForm, siteRequirement: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Proposed Machine Configuration</label>
              <input
                type="text"
                value={reviewForm.proposedConfiguration}
                onChange={(e) => setReviewForm({ ...reviewForm, proposedConfiguration: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Technical Risks & Mitigations</label>
              <input
                type="text"
                value={reviewForm.technicalRisks}
                onChange={(e) => setReviewForm({ ...reviewForm, technicalRisks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="techApprovedCheck"
                checked={reviewForm.isApproved}
                onChange={(e) => setReviewForm({ ...reviewForm, isApproved: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <label htmlFor="techApprovedCheck" className="text-xs font-semibold text-slate-800">
                Mark Technical Feasibility Study as Officially Approved
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Technical Study</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
