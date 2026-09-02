import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderGit2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApprovalRequestRecord } from '../../types';

interface Props {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const ApprovalsCenterView: React.FC<Props> = ({ onSelectProject }) => {
  const { approvalRequests, processApproval, projects } = useData();
  const { currentUser, canPerform } = useAuth();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rejectingItem, setRejectingItem] = useState<ApprovalRequestRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filtered = approvalRequests.filter((a) => {
    if (statusFilter !== 'ALL' && a.approvalStatus !== statusFilter) return false;
    return true;
  });

  const getProject = (pId: string) => projects.find((p) => p.id === pId);

  const handleApprove = (record: ApprovalRequestRecord) => {
    processApproval(
      record.projectId,
      'Approved',
      currentUser.fullName,
      'Approved by authorized management authority in Approvals Center.'
    );
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    processApproval(
      rejectingItem.projectId,
      'Rejected',
      currentUser.fullName,
      rejectionReason || 'Commercial margin below acceptable hurdle rate. Returned to negotiation.'
    );
    setRejectingItem(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Commercial & Engineering Approvals Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage 6 multi-level authorization workflow for customer purchase orders, discount thresholds, and technical specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending Approvals</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Revision Required">Revision Required</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            No approval requests found matching filter.
          </div>
        ) : (
          filtered.map((item) => {
            const project = getProject(item.projectId);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{item.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                      PO: {item.poNumber || 'Draft Approval'}
                    </span>
                    <StatusBadge status={item.approvalStatus} size="sm" />
                  </div>

                  {project && (
                    <button
                      onClick={() => onSelectProject(project.id, 'commercial')}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
                    >
                      <span>{project.projectNumber} - {project.projectName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block">Requested Date:</span>
                    <span className="font-medium text-slate-700">{item.approvalRequestedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Requested By:</span>
                    <span className="font-medium text-slate-700">{item.requestedBy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PO Value:</span>
                    <span className="font-semibold text-slate-800">
                      {item.poValue ? `$${item.poValue.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Approver:</span>
                    <span className="font-medium text-slate-700">{item.approvedBy || 'Pending'}</span>
                  </div>
                </div>

                {item.remarks && (
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 text-[11px]">
                    <span className="font-bold">Remarks: </span>
                    {item.remarks}
                  </div>
                )}

                {item.approvalStatus === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setRejectingItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject & Request Revision</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Purchase Order</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reject Approval Request</h3>
              </div>
            </div>

            <p className="text-slate-600">
              Rejecting this request will mark it as rejected and notify commercial stakeholders to revise terms.
            </p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mandatory Rejection Reason:
              </label>
              <textarea
                rows={3}
                placeholder="State specific commercial or technical reasons for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
