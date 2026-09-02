import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Project, PaymentMilestone, FinalPaymentRecord } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectPaymentsTab: React.FC<Props> = ({ project }) => {
  const {
    paymentMilestones,
    addPaymentMilestone,
    updatePaymentMilestone,
    finalPayments,
    saveFinalPayment,
  } = useData();
  const { currentUser } = useAuth();

  const milestones = paymentMilestones.filter((m) => m.projectId === project.id);
  const currentFinal = finalPayments.find((f) => f.projectId === project.id);

  // Calculate totals
  const totalPercentage = milestones.reduce((acc, m) => acc + m.percentage, 0);
  const totalMilestoneAmount = milestones.reduce((acc, m) => acc + m.amount, 0);
  const totalCollected = milestones.reduce((acc, m) => acc + (m.amountReceived || 0), 0);
  const totalOutstanding = Math.max(0, project.expectedOrderValue - totalCollected);

  // New milestone form
  const [showNewMilestone, setShowNewMilestone] = useState(false);
  const [mForm, setMForm] = useState({
    milestoneName: '',
    percentage: 20,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
  });

  // Record payment inline state
  const [payingMilestoneId, setPayingMilestoneId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentRef, setPaymentRef] = useState('');

  // Final payment form
  const [finalForm, setFinalForm] = useState<Partial<FinalPaymentRecord>>({
    finalInvoiceNumber: currentFinal?.finalInvoiceNumber || `INV-FIN-${project.projectNumber.slice(-4)}`,
    finalInvoiceDate: currentFinal?.finalInvoiceDate || new Date().toISOString().substring(0, 10),
    finalInvoiceAmount: currentFinal?.finalInvoiceAmount || Math.round(project.expectedOrderValue * 0.1),
    amountReceived: currentFinal?.amountReceived || Math.round(project.expectedOrderValue * 0.1),
    paymentDueDate: currentFinal?.paymentDueDate || '',
  });

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Math.round((project.expectedOrderValue * Number(mForm.percentage)) / 100);
    addPaymentMilestone({
      projectId: project.id,
      milestoneName: mForm.milestoneName,
      percentage: Number(mForm.percentage),
      amount,
      dueCondition: 'Against Milestone Trigger Event',
      dueDate: mForm.dueDate,
      amountReceived: 0,
      paymentStatus: 'Not Due',
    });
    setShowNewMilestone(false);
    setMForm({ milestoneName: '', percentage: 10, dueDate: '' });
  };

  const handleRecordPayment = (id: string) => {
    const target = milestones.find((m) => m.id === id);
    if (!target) return;

    const newAmount = Number(target.amountReceived || 0) + Number(paymentAmount);
    updatePaymentMilestone(id, {
      amountReceived: newAmount,
      receivedDate: new Date().toISOString().substring(0, 10),
      paymentStatus: newAmount >= target.amount ? 'Paid' : 'Partially Paid',
    });

    setPayingMilestoneId(null);
    setPaymentAmount(0);
    setPaymentRef('');
  };

  const handleSaveFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    saveFinalPayment({
      projectId: project.id,
      ...finalForm,
      receivedDate: new Date().toISOString().substring(0, 10),
    });
    alert('Final payment and dues clearance record updated.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 font-medium text-xs">Total Order Value</span>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {project.currency} {project.expectedOrderValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Contract PO Amount</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 font-medium text-xs">Total Invoiced</span>
          <div className="text-lg font-bold text-blue-700 mt-1">
            {project.currency} {totalMilestoneAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">
            {Math.round((totalMilestoneAmount / (project.expectedOrderValue || 1)) * 100)}% of Contract
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 font-medium text-xs">Total Collected</span>
          <div className="text-lg font-bold text-emerald-700 mt-1">
            {project.currency} {totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {Math.round((totalCollected / (project.expectedOrderValue || 1)) * 100)}% Received
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-slate-400 font-medium text-xs">Outstanding Balance</span>
          <div className={`text-lg font-bold mt-1 ${totalOutstanding > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {project.currency} {totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalOutstanding === 0 ? 'Fully Cleared' : 'Pending Realization'}
          </span>
        </div>
      </div>

      {/* 2. Milestone Validation Banner */}
      {totalPercentage !== 100 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Milestones total is currently {totalPercentage}%. </span>
              Under commercial compliance guidelines, the sum of all milestone percentages must equal exactly 100%.
            </div>
          </div>
          <span className="font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
            Diff: {100 - totalPercentage}%
          </span>
        </div>
      )}

      {/* 3. Payment Milestones Management Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Payment Milestones Breakdown
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configurable commercial milestone schedule with automated amount calculations.
            </p>
          </div>

          <button
            onClick={() => setShowNewMilestone(!showNewMilestone)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        {/* Add Milestone Form */}
        {showNewMilestone && (
          <form
            onSubmit={handleAddMilestone}
            className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3"
          >
            <div className="font-semibold text-slate-900">Define New Commercial Milestone</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Milestone Name / Stage</label>
                <input
                  type="text"
                  placeholder="e.g. 10% Against Successful Commissioning"
                  value={mForm.milestoneName}
                  onChange={(e) => setMForm({ ...mForm, milestoneName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Percentage (%)</label>
                <input
                  type="number"
                  value={mForm.percentage}
                  onChange={(e) => setMForm({ ...mForm, percentage: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={mForm.dueDate}
                  onChange={(e) => setMForm({ ...mForm, dueDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewMilestone(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
              >
                Save Milestone
              </button>
            </div>
          </form>
        )}

        {/* Milestones Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Milestone Name</th>
                <th className="p-3">%</th>
                <th className="p-3">Calculated Value</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Amount Received</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milestones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-400">
                    No milestones defined. Click "Add Milestone" above.
                  </td>
                </tr>
              ) : (
                milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">{m.milestoneName}</td>
                    <td className="p-3 font-bold text-blue-600">{m.percentage}%</td>
                    <td className="p-3 text-slate-900 font-medium">
                      {project.currency} {m.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-600">{m.dueDate || 'Upon Milestone'}</td>
                    <td className="p-3 font-semibold text-emerald-700">
                      {project.currency} {m.amountReceived.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={m.paymentStatus} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      {m.paymentStatus !== 'Paid' ? (
                        <button
                          onClick={() => {
                            setPayingMilestoneId(m.id);
                            setPaymentAmount(m.amount - m.amountReceived);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200"
                        >
                          Record Receipt
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">Paid Full</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Record Payment Inline Form */}
        {payingMilestoneId && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
            <div className="font-semibold text-emerald-900 mb-2">
              Record Collection for Milestone
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Received Amount ({project.currency})</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Bank Reference / UTR</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-AXIS-9920194"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setPayingMilestoneId(null)}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRecordPayment(payingMilestoneId)}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Stage 20: Final Payment & Dues Clearance */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 20: Final Commercial Settlement & Dues Clearance
              </h3>
              <p className="text-xs text-slate-500">
                Final invoice reconciliation, retention release, and zero-balance clearance certificate.
              </p>
            </div>
          </div>
          <StatusBadge status={currentFinal?.duesClearanceStatus || 'Pending'} size="md" />
        </div>

        <form onSubmit={handleSaveFinalPayment} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Final Invoice Number</label>
              <input
                type="text"
                value={finalForm.finalInvoiceNumber}
                onChange={(e) => setFinalForm({ ...finalForm, finalInvoiceNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Invoice Amount ({project.currency})</label>
              <input
                type="number"
                value={finalForm.finalInvoiceAmount}
                onChange={(e) => setFinalForm({ ...finalForm, finalInvoiceAmount: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Amount Realized</label>
              <input
                type="number"
                value={finalForm.amountReceived}
                onChange={(e) => setFinalForm({ ...finalForm, amountReceived: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Pending Amount</label>
              <div className="py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800">
                {project.currency}{' '}
                {Math.max(0, (finalForm.finalInvoiceAmount || 0) - (finalForm.amountReceived || 0)).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Update Final Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
