import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Handshake,
  CheckSquare,
  Plus,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  Download,
  Copy,
  Clock,
  User,
} from 'lucide-react';
import { Project, QuotationRecord, CommercialNegotiationRecord } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectCommercialTab: React.FC<Props> = ({ project }) => {
  const {
    requests,
    saveRequest,
    quotations,
    createQuotation,
    createQuotationRevision,
    negotiations,
    addNegotiation,
    approvalRequests,
    approvalHistory,
    processApproval,
    requestApproval,
  } = useData();

  const { currentUser, canPerform } = useAuth();

  // Requests
  const currentRequest = requests.find((r) => r.projectId === project.id);

  // Quotations for this project
  const projectQuotations = quotations.filter((q) => q.projectId === project.id);
  // Sort by revision desc
  const sortedQuotations = [...projectQuotations].sort((a, b) => b.revisionNumber - a.revisionNumber);

  // Negotiations
  const projectNegotiations = negotiations.filter((n) => n.projectId === project.id);

  // Current Approval Request
  const currentApproval = approvalRequests.find((a) => a.projectId === project.id);
  const projectApprovalHistory = approvalHistory.filter((h) => h.projectId === project.id);

  // New Quotation Form state
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    basicPrice: project.expectedOrderValue || 5000000,
    taxes: 900000,
    duties: 0,
    freight: 150000,
    installationCharges: 250000,
    commissioningCharges: 150000,
    otherCharges: 50000,
    paymentTerms: '30% Advance with PO, 60% Against Proforma Invoice prior to dispatch, 10% after Commissioning',
    deliveryWeeks: 12,
    validityDays: 30,
    warrantyMonths: 12,
    preparedBy: currentUser.fullName,
    currency: project.currency || 'INR',
  });

  // Revision Form state
  const [revisionQuoteId, setRevisionQuoteId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Negotiation Form state
  const [showNewNeg, setShowNewNeg] = useState(false);
  const [negForm, setNegForm] = useState({
    meetingDate: new Date().toISOString().substring(0, 10),
    customerAttendees: project.contactPerson || 'Client Team',
    internalAttendees: currentUser.fullName,
    discussionPoints: '',
    customerTargetPrice: project.expectedOrderValue,
    commercialAgreedTerms: '',
    status: 'Final Terms Agreed' as const,
  });

  // Approval Process state
  const [approvalDecision, setApprovalDecision] = useState<'Approved' | 'Rejected' | 'Revision Required'>('Approved');
  const [approvalComments, setApprovalComments] = useState('');
  const [poNumberInput, setPoNumberInput] = useState(currentApproval?.poNumber || 'PO-2026-CLIENT-09');
  const [poValueInput, setPoValueInput] = useState(currentApproval?.poValue || project.expectedOrderValue);

  // Request Approval Form
  const [showRequestApprovalModal, setShowRequestApprovalModal] = useState(false);
  const [reqApprForm, setReqApprForm] = useState({
    poNumber: `PO-${project.customerName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()}-01`,
    poDate: new Date().toISOString().substring(0, 10),
    poValue: project.expectedOrderValue,
    paymentTerms: '30% Adv / 60% Dispatch / 10% Comm',
    deliveryCommitmentDate: project.targetDeliveryDate || '',
    scopeExceptions: 'None. As per approved technical spec Rev 01.',
    grossMarginPercent: 24.5,
  });

  const quoteTotal =
    Number(quoteForm.basicPrice) +
    Number(quoteForm.taxes) +
    Number(quoteForm.duties) +
    Number(quoteForm.freight) +
    Number(quoteForm.installationCharges) +
    Number(quoteForm.commissioningCharges) +
    Number(quoteForm.otherCharges);

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    createQuotation({
      projectId: project.id,
      quotationDate: new Date().toISOString().substring(0, 10),
      validUntil: new Date(Date.now() + Number(quoteForm.validityDays) * 86400000).toISOString().substring(0, 10),
      technicalSpecification: 'Technical specification conforming to proposal',
      commercialOffer: 'Standard commercial equipment supply and start-up offer',
      basicPrice: Number(quoteForm.basicPrice),
      taxes: Number(quoteForm.taxes),
      duties: Number(quoteForm.duties),
      freight: Number(quoteForm.freight),
      installationCharges: Number(quoteForm.installationCharges),
      commissioningCharges: Number(quoteForm.commissioningCharges),
      otherCharges: Number(quoteForm.otherCharges),
      currency: quoteForm.currency,
      deliverySchedule: `${quoteForm.deliveryWeeks} Weeks from advance payment & approved layout`,
      paymentTerms: quoteForm.paymentTerms,
      warrantyTerms: `${quoteForm.warrantyMonths} Months standard warranty`,
      specialConditions: 'Subject to timely civil readiness and utility availability at site',
      preparedBy: quoteForm.preparedBy,
      status: 'Sent',
    });
    setShowNewQuotation(false);
  };

  const handleCreateRevision = (baseId: string) => {
    createQuotationRevision(baseId, {
      specialConditions: revisionNotes || 'Revised commercial terms per client alignment',
      preparedBy: currentUser.fullName,
    });
    setRevisionQuoteId(null);
    setRevisionNotes('');
  };

  const handleAddNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    addNegotiation({
      projectId: project.id,
      negotiationDate: negForm.meetingDate,
      meetingType: 'In-person Meeting',
      priceDiscussed: Number(negForm.customerTargetPrice),
      negotiatedPrice: Number(negForm.customerTargetPrice),
      discount: 0,
      finalPrice: Number(negForm.customerTargetPrice),
      paymentTerms: 'Standard terms',
      deliveryTerms: 'Ex-works / CIF site',
      taxesAndDuties: 'Standard GST / VAT',
      warranty: '12 Months standard',
      otherTerms: negForm.commercialAgreedTerms || '',
      discussionNotes: negForm.discussionPoints || '',
      customerRepresentative: negForm.customerAttendees || 'Customer Lead',
      companyRepresentative: negForm.internalAttendees || currentUser.fullName,
      status: 'Negotiation Open',
    });
    setShowNewNeg(false);
  };

  const handleRequestApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestApproval({
      projectId: project.id,
      approvalRequestedDate: new Date().toISOString().substring(0, 10),
      poReceived: true,
      poNumber: reqApprForm.poNumber,
      poDate: reqApprForm.poDate,
      poValue: Number(reqApprForm.poValue),
      approvalStatus: 'Pending',
      requestedBy: currentUser.fullName,
      remarks: reqApprForm.scopeExceptions || 'PO received, requested management sign-off.',
    });
    setShowRequestApprovalModal(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. Stage 1: Request Received Record */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Stage 1: Customer Enquiry & Request Received
            </h3>
          </div>
          <StatusBadge status={currentRequest?.status || 'Completed'} size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Customer Requirement:</span>
            <p className="text-slate-800 font-medium mt-0.5">
              {currentRequest?.customerRequirement || project.application || 'Standard heavy industrial requirement'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Machine & Spec:</span>
            <p className="text-slate-800 font-medium mt-0.5">
              {project.machineType} • {project.machineModel} ({project.specification})
            </p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Quantity & Timeline:</span>
            <p className="text-slate-800 font-medium mt-0.5">
              {project.quantity} unit(s) • Req Delivery: {currentRequest?.requiredDeliveryDate || project.targetDeliveryDate}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Customer Contact:</span>
            <p className="text-slate-800 mt-0.5">{currentRequest?.customerContact || project.contactPerson}</p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Sales Executive:</span>
            <p className="text-slate-800 mt-0.5">{currentRequest?.salesPerson || project.salesPerson}</p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Enquiry Source:</span>
            <p className="text-slate-800 mt-0.5">{currentRequest?.sourceOfEnquiry || 'Direct Sales'}</p>
          </div>
        </div>
      </div>

      {/* 2. Stage 4: Quotation Management & Versioning */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 4: Quotations & Revision Tracking
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates Rev 0, Rev 1, Rev 2 with full cost breakdown without overwriting previous versions.
            </p>
          </div>

          <button
            onClick={() => setShowNewQuotation(!showNewQuotation)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Quotation</span>
          </button>
        </div>

        {/* Create Quotation Form */}
        {showNewQuotation && (
          <form
            onSubmit={handleCreateQuotation}
            className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs"
          >
            <div className="font-semibold text-slate-900 text-xs">New Commercial Quotation</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Basic Price ({quoteForm.currency})</label>
                <input
                  type="number"
                  value={quoteForm.basicPrice}
                  onChange={(e) => setQuoteForm({ ...quoteForm, basicPrice: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Taxes / GST</label>
                <input
                  type="number"
                  value={quoteForm.taxes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, taxes: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Freight & Insurance</label>
                <input
                  type="number"
                  value={quoteForm.freight}
                  onChange={(e) => setQuoteForm({ ...quoteForm, freight: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Installation Charges</label>
                <input
                  type="number"
                  value={quoteForm.installationCharges}
                  onChange={(e) => setQuoteForm({ ...quoteForm, installationCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Commissioning Charges</label>
                <input
                  type="number"
                  value={quoteForm.commissioningCharges}
                  onChange={(e) => setQuoteForm({ ...quoteForm, commissioningCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Other Charges</label>
                <input
                  type="number"
                  value={quoteForm.otherCharges}
                  onChange={(e) => setQuoteForm({ ...quoteForm, otherCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Delivery Lead Time (Weeks)</label>
                <input
                  type="number"
                  value={quoteForm.deliveryWeeks}
                  onChange={(e) => setQuoteForm({ ...quoteForm, deliveryWeeks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Calculated Total</label>
                <div className="font-bold text-sm text-emerald-700 py-1.5 px-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  {quoteForm.currency} {quoteTotal.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={quoteForm.paymentTerms}
                  onChange={(e) => setQuoteForm({ ...quoteForm, paymentTerms: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Prepared By</label>
                <input
                  type="text"
                  value={quoteForm.preparedBy}
                  onChange={(e) => setQuoteForm({ ...quoteForm, preparedBy: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewQuotation(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Save & Issue Quotation
              </button>
            </div>
          </form>
        )}

        {/* Quotations List with Revisions */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Quote #</th>
                <th className="p-3">Revision</th>
                <th className="p-3">Date</th>
                <th className="p-3">Basic Price</th>
                <th className="p-3">Taxes & Charges</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Lead Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-400">
                    No quotation generated yet. Click "Create Quotation" above.
                  </td>
                </tr>
              ) : (
                sortedQuotations.map((q) => {
                  const taxesAndCharges =
                    q.taxes + q.duties + q.freight + q.installationCharges + q.commissioningCharges + q.otherCharges;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-600">{q.quotationNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Rev {q.revisionNumber}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{q.createdAt}</td>
                      <td className="p-3 text-slate-900 font-medium">
                        {q.currency} {q.basicPrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-500">
                        {q.currency} {taxesAndCharges.toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {q.currency} {q.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-600">{q.deliverySchedule || 'Standard Delivery'}</td>
                      <td className="p-3">
                        <StatusBadge status={q.status} size="sm" />
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setRevisionQuoteId(q.id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                          title="Generate new revision without modifying this version"
                        >
                          + New Rev
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal / Inline to generate revision */}
        {revisionQuoteId && (
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs">
            <div className="font-semibold text-purple-900 mb-1">
              Create New Revision for Quotation
            </div>
            <p className="text-slate-600 mb-2">
              The existing revision will remain intact for audit compliance. Enter revision justification:
            </p>
            <input
              type="text"
              placeholder="e.g. Revised after commercial negotiation, 5% price adjustment & included freight..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRevisionQuoteId(null)}
                className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateRevision(revisionQuoteId)}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg font-semibold shadow-xs"
              >
                Generate Next Revision
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Stage 5: Commercial Negotiation Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 5: Commercial Negotiation Record
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks minutes of negotiation meetings, price revisions, and final agreed terms.
            </p>
          </div>

          <button
            onClick={() => setShowNewNeg(!showNewNeg)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Negotiation Log</span>
          </button>
        </div>

        {showNewNeg && (
          <form
            onSubmit={handleAddNegotiation}
            className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Meeting Date</label>
                <input
                  type="date"
                  value={negForm.meetingDate}
                  onChange={(e) => setNegForm({ ...negForm, meetingDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Customer Attendees</label>
                <input
                  type="text"
                  value={negForm.customerAttendees}
                  onChange={(e) => setNegForm({ ...negForm, customerAttendees: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Customer Target Price</label>
                <input
                  type="number"
                  value={negForm.customerTargetPrice}
                  onChange={(e) => setNegForm({ ...negForm, customerTargetPrice: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-600 block mb-1">Discussion Points & Concessions</label>
              <textarea
                rows={2}
                value={negForm.discussionPoints}
                onChange={(e) => setNegForm({ ...negForm, discussionPoints: e.target.value })}
                placeholder="Details of commercial terms negotiated, scope changes discussed..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="font-medium text-slate-600 block mb-1">Agreed Terms & Conditions</label>
              <input
                type="text"
                value={negForm.commercialAgreedTerms}
                onChange={(e) => setNegForm({ ...negForm, commercialAgreedTerms: e.target.value })}
                placeholder="Final agreed milestone terms, warranty period..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewNeg(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Save Negotiation
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {projectNegotiations.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              No negotiation logs recorded for this project yet.
            </div>
          ) : (
            projectNegotiations.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{n.negotiationDate} ({n.meetingType})</span>
                  <StatusBadge status={n.status} size="sm" />
                </div>
                <div className="text-slate-600 mb-2">
                  <span className="font-medium text-slate-700">Representatives: </span>
                  Customer: {n.customerRepresentative} | Company: {n.companyRepresentative}
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800">
                  <span className="font-semibold text-slate-900">Discussion: </span>
                  {n.discussionNotes}
                </div>
                {n.otherTerms && (
                  <div className="mt-2 text-emerald-800 font-medium">
                    <span className="font-semibold">Agreed Terms: </span>
                    {n.otherTerms}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Stage 6: Purchase Order & Management Approval Engine */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Stage 6: Customer PO Verification & Management Approval Engine
              </h3>
              <p className="text-xs text-slate-500">
                Rule: If Approved → Proceed to Work Order. If Rejected → Return to Commercial Negotiation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!currentApproval ? (
              <button
                onClick={() => setShowRequestApprovalModal(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Request PO Approval
              </button>
            ) : (
              <StatusBadge status={currentApproval.approvalStatus} size="md" />
            )}
          </div>
        </div>

        {/* Request Approval Form Modal */}
        {showRequestApprovalModal && (
          <form
            onSubmit={handleRequestApprovalSubmit}
            className="mb-4 p-4 rounded-xl bg-purple-50/50 border border-purple-200 text-xs space-y-3"
          >
            <div className="font-bold text-purple-900">Submit PO for Management Sanction</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Customer PO Number</label>
                <input
                  type="text"
                  value={reqApprForm.poNumber}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, poNumber: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">PO Date</label>
                <input
                  type="date"
                  value={reqApprForm.poDate}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, poDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">PO Value ({project.currency})</label>
                <input
                  type="number"
                  value={reqApprForm.poValue}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, poValue: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Gross Margin (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={reqApprForm.grossMarginPercent}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, grossMarginPercent: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Commercial Payment Terms</label>
                <input
                  type="text"
                  value={reqApprForm.paymentTerms}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, paymentTerms: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Delivery Commitment</label>
                <input
                  type="date"
                  value={reqApprForm.deliveryCommitmentDate}
                  onChange={(e) => setReqApprForm({ ...reqApprForm, deliveryCommitmentDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRequestApprovalModal(false)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Submit for Approval
              </button>
            </div>
          </form>
        )}

        {/* Active Approval Card & Decision Action */}
        {currentApproval && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block font-medium">Customer PO Number:</span>
                <span className="font-mono font-bold text-slate-900">{currentApproval.poNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">PO Value:</span>
                <span className="font-bold text-emerald-700">
                  {project.currency} {currentApproval.poValue?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Approval Status:</span>
                <span className="font-semibold text-purple-700">{currentApproval.approvalStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Requested By:</span>
                <span className="text-slate-700">{currentApproval.requestedBy} ({currentApproval.approvalRequestedDate})</span>
              </div>
            </div>

            {/* Management Approver Actions */}
            <div className="p-3.5 rounded-xl bg-white border border-purple-200 mt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 text-xs">
                  Executive Approval Decision Panel
                </span>
                <span className="text-[11px] text-slate-500">
                  Acting as: <span className="font-bold text-purple-700">{currentUser.fullName}</span> ({currentUser.role})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="font-medium text-slate-600 block mb-1">Decision</label>
                  <select
                    value={approvalDecision}
                    onChange={(e) => setApprovalDecision(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs"
                  >
                    <option value="Approved">Approve (Proceed to Work Order)</option>
                    <option value="Rejected">Reject (Return to Commercial Negotiation)</option>
                    <option value="Revision Required">Revision Required</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-medium text-slate-600 block mb-1">Approval Remarks / Conditions</label>
                  <input
                    type="text"
                    placeholder="Enter management notes, LD clause confirmation, margin signoff..."
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    processApproval(
                      project.id,
                      approvalDecision,
                      currentUser.fullName,
                      approvalComments || `Sanctioned by ${currentUser.fullName}`,
                      poNumberInput,
                      poValueInput
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors ${
                    approvalDecision === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : approvalDecision === 'Rejected'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Decision: {approvalDecision}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Immutable Approval History */}
        {projectApprovalHistory.length > 0 && (
          <div className="mt-4 pt-3 border-t border-purple-100">
            <div className="font-bold text-slate-900 text-xs mb-2">Immutable Approval History</div>
            <div className="space-y-1.5 text-xs">
              {projectApprovalHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800">{h.approver}</span>
                    <span className="text-slate-500"> marked </span>
                    <span
                      className={`font-bold ${
                        h.decision === 'Approved'
                          ? 'text-emerald-700'
                          : h.decision === 'Rejected'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {h.decision}
                    </span>
                    <span className="text-slate-500 text-[11px]"> on {h.decisionDate?.substring(0, 10)}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{h.comments}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{h.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
