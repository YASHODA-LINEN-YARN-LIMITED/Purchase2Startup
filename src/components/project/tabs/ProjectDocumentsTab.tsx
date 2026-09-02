import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Download,
  Plus,
  Wrench,
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Project, ProjectDocument, ServiceTicket } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectDocumentsTab: React.FC<Props> = ({ project }) => {
  const {
    documents,
    addDocument,
    serviceTickets,
    addServiceTicket,
    updateServiceTicket,
  } = useData();

  const { currentUser } = useAuth();

  const docs = documents.filter((d) => d.projectId === project.id);
  const tickets = serviceTickets.filter((v) => v.projectId === project.id);

  // New doc state
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [docForm, setDocForm] = useState({
    documentType: 'O&M Manual' as ProjectDocument['documentType'],
    documentNumber: `DOC-${Date.now().toString().slice(-4)}`,
    fileName: '',
    revision: '1.0',
    remarks: 'Official handover dossier',
  });

  // New service ticket state
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    complaintDate: new Date().toISOString().substring(0, 10),
    complaintType: 'Routine Maintenance' as ServiceTicket['complaintType'],
    problemDescription: 'First 30-day scheduled mechanical health check. Drive chain lubrication and alignment verification.',
    priority: 'Medium' as const,
    assignedEngineer: 'Rajesh Kulkarni',
    visitRequired: true,
    visitDate: new Date().toISOString().substring(0, 10),
    actionTaken: 'All drive points lubricated, tensioning checked and passed.',
  });

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      projectId: project.id,
      documentType: docForm.documentType,
      documentNumber: docForm.documentNumber || `DOC-${Date.now().toString().slice(-4)}`,
      fileName: docForm.fileName || `${docForm.documentType}.pdf`,
      fileSize: '2.4 MB',
      revision: docForm.revision,
      uploadedBy: currentUser.fullName,
      customerAccepted: true,
      remarks: docForm.remarks,
      fileUrl: '#',
    });
    setShowNewDoc(false);
    setDocForm({ ...docForm, fileName: '' });
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceTicket({
      projectId: project.id,
      projectNumber: project.projectNumber,
      customerName: project.customerName,
      machineModel: project.machineModel,
      complaintDate: ticketForm.complaintDate,
      complaintType: ticketForm.complaintType,
      problemDescription: ticketForm.problemDescription,
      priority: ticketForm.priority,
      assignedEngineer: ticketForm.assignedEngineer,
      visitRequired: ticketForm.visitRequired,
      visitDate: ticketForm.visitDate,
      actionTaken: ticketForm.actionTaken,
      ticketStatus: 'Resolved',
    });
    setShowNewTicket(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. Stage 19: Handover Documentation Pack */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 19: Handover Documentation & Engineering Dossier
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory manuals, electrical schematics, test certificates, and warranty documentation.
            </p>
          </div>

          <button
            onClick={() => setShowNewDoc(!showNewDoc)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Document</span>
          </button>
        </div>

        {/* Add Document Form */}
        {showNewDoc && (
          <form
            onSubmit={handleAddDoc}
            className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3"
          >
            <div className="font-semibold text-slate-900">Add Handover Document Record</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Document Type</label>
                <select
                  value={docForm.documentType}
                  onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="O&M Manual">O&M Manual</option>
                  <option value="Test Certificates">Test Certificates</option>
                  <option value="Warranty Document">Warranty Document</option>
                  <option value="Training Documents">Training Documents</option>
                  <option value="Electrical Drawings">Electrical Drawings</option>
                  <option value="Mechanical Drawings">Mechanical Drawings</option>
                  <option value="Spare Parts List">Spare Parts List</option>
                  <option value="Commissioning Report">Commissioning Report</option>
                  <option value="Customer Acceptance">Customer Acceptance</option>
                  <option value="Other Documents">Other Documents</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. As-Built-Drawings-Rev1.pdf"
                  value={docForm.fileName}
                  onChange={(e) => setDocForm({ ...docForm, fileName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Revision / Number</label>
                <input
                  type="text"
                  value={docForm.revision}
                  onChange={(e) => setDocForm({ ...docForm, revision: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewDoc(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg"
              >
                Save Handover Document
              </button>
            </div>
          </form>
        )}

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">File Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Doc #</th>
                <th className="p-3">Rev</th>
                <th className="p-3">Uploaded Date</th>
                <th className="p-3">Uploaded By</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-400">
                    No handover documents logged yet.
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{doc.fileName}</span>
                    </td>
                    <td className="p-3 text-slate-600">{doc.documentType}</td>
                    <td className="p-3 font-mono text-slate-500">{doc.documentNumber}</td>
                    <td className="p-3 font-mono text-slate-500">v{doc.revision}</td>
                    <td className="p-3 text-slate-600">{doc.uploadedDate}</td>
                    <td className="p-3 text-slate-800">{doc.uploadedBy}</td>
                    <td className="p-3">
                      {doc.customerAccepted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Accepted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Accessing signed document: ${doc.fileName}`)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Stage 21: After-Sales Service & Maintenance Visits */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 21: After-Sales Support & Service Tickets
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks scheduled maintenance, warranty support visits, and service tickets.
            </p>
          </div>

          <button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Service Ticket</span>
          </button>
        </div>

        {/* Add Service Ticket Form */}
        {showNewTicket && (
          <form
            onSubmit={handleAddTicket}
            className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs space-y-3"
          >
            <div className="font-semibold text-indigo-900">Record Field Service Ticket</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Complaint / Visit Date</label>
                <input
                  type="date"
                  value={ticketForm.complaintDate}
                  onChange={(e) => setTicketForm({ ...ticketForm, complaintDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Ticket Type</label>
                <select
                  value={ticketForm.complaintType}
                  onChange={(e) => setTicketForm({ ...ticketForm, complaintType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Routine Maintenance">Routine Maintenance</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Parts Replacement">Parts Replacement</option>
                  <option value="Operational Guidance">Operational Guidance</option>
                  <option value="Electrical Fault">Electrical Fault</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Assigned Engineer</label>
                <input
                  type="text"
                  value={ticketForm.assignedEngineer}
                  onChange={(e) => setTicketForm({ ...ticketForm, assignedEngineer: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Work Done & Maintenance Activity</label>
              <textarea
                rows={2}
                value={ticketForm.actionTaken}
                onChange={(e) => setTicketForm({ ...ticketForm, actionTaken: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTicket(false)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                Save Service Ticket
              </button>
            </div>
          </form>
        )}

        {/* Service Tickets List */}
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              No service tickets logged yet for this project.
            </div>
          ) : (
            tickets.map((v) => (
              <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{v.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                      {v.complaintType}
                    </span>
                    <span className="text-slate-500 text-[11px]">Engineer: {v.assignedEngineer}</span>
                    <span className="text-slate-400 text-[11px]">Date: {v.complaintDate}</span>
                  </div>

                  <StatusBadge status={v.ticketStatus} size="sm" />
                </div>

                <p className="text-slate-800 font-medium mb-1">{v.problemDescription}</p>

                {v.actionTaken && (
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Action Taken: {v.actionTaken}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
