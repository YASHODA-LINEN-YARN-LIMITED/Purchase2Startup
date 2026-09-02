import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Printer,
  Download,
  Building2,
} from 'lucide-react';
import { Project, SiteReadinessCertificate } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface SiteReadinessModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const SiteReadinessModal: React.FC<SiteReadinessModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { siteTasks, siteCertificates, generateSiteCertificate, setSiteReadyDecision } = useData();
  const { currentUser } = useAuth();

  // Find tasks for this project
  const tasks = siteTasks.filter((t) => t.projectId === project.id);
  const civilTasks = tasks.filter((t) => t.category === 'CIVIL');
  const electricalTasks = tasks.filter((t) => t.category === 'ELECTRICAL');
  const mechanicalTasks = tasks.filter((t) => t.category === 'MECHANICAL');

  const civilPct =
    civilTasks.length > 0
      ? Math.round(
          (civilTasks.filter((t) => t.status === 'Completed').length / civilTasks.length) * 100
        )
      : 100;
  const electricalPct =
    electricalTasks.length > 0
      ? Math.round(
          (electricalTasks.filter((t) => t.status === 'Completed').length /
            electricalTasks.length) *
            100
        )
      : 100;
  const mechanicalPct =
    mechanicalTasks.length > 0
      ? Math.round(
          (mechanicalTasks.filter((t) => t.status === 'Completed').length /
            mechanicalTasks.length) *
            100
        )
      : 100;

  const overallPct = Math.round((civilPct + electricalPct + mechanicalPct) / 3);
  const is100Percent = overallPct === 100;

  // Existing certificate if any
  const existingCert = siteCertificates.find((c) => c.projectId === project.id);

  // Form states for generating new certificate
  const [civilApprovedBy, setCivilApprovedBy] = useState('Praveen Joshi (Civil Head)');
  const [electricalApprovedBy, setElectricalApprovedBy] = useState('Anand Verma (Electrical Lead)');
  const [mechanicalApprovedBy, setMechanicalApprovedBy] = useState('Suresh Patil (Mechanical Lead)');
  const [projectApprovedBy, setProjectApprovedBy] = useState(currentUser.fullName);
  const [overrideReason, setOverrideReason] = useState('');
  const [useOverride, setUseOverride] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCertificate = () => {
    if (!is100Percent && !overrideReason.trim()) {
      alert('Readiness is not 100%. You must provide an authorized management override justification.');
      return;
    }

    generateSiteCertificate(
      project.id,
      {
        civil: civilApprovedBy,
        electrical: electricalApprovedBy,
        mechanical: mechanicalApprovedBy,
        project: projectApprovedBy,
      },
      !is100Percent ? overrideReason : undefined
    );
  };

  const handleDecision = (isReady: boolean) => {
    setSiteReadyDecision(project.id, isReady);
    if (isReady) {
      alert(`Machine ${project.projectNumber} is verified SITE READY. Material unloading is permitted.`);
    } else {
      alert(`Site marked NOT READY. Pending tasks have been transferred to Centralized Pending Works.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Official Site Readiness Certificate
              </h3>
              <p className="text-xs text-slate-500">
                {project.projectNumber} • {project.projectName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Readiness Percentage Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-xs font-semibold text-slate-500">Civil Work</div>
              <div
                className={`text-xl font-bold mt-1 ${
                  civilPct === 100 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {civilPct}%
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-xs font-semibold text-slate-500">Electrical</div>
              <div
                className={`text-xl font-bold mt-1 ${
                  electricalPct === 100 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {electricalPct}%
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-xs font-semibold text-slate-500">Mechanical</div>
              <div
                className={`text-xl font-bold mt-1 ${
                  mechanicalPct === 100 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {mechanicalPct}%
              </div>
            </div>
            <div
              className={`p-3 rounded-xl border text-center ${
                overallPct === 100
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider">Overall</div>
              <div className="text-xl font-bold mt-1">{overallPct}%</div>
            </div>
          </div>

          {/* Certificate Display or Generator */}
          {existingCert ? (
            <div className="p-5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>OFFICIAL CERTIFICATE ISSUED</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Certificate No:</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {existingCert.certificateNumber}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Issued Date:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {existingCert.certificateDate}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Customer & Site:</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {project.customerName} ({existingCert.siteName})
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Overall Readiness:</span>
                  <div className="font-bold text-emerald-700 mt-0.5">
                    {existingCert.overallReadinessPercent}% Complete
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-white/70 rounded-lg border border-emerald-100">
                  <span className="text-slate-400 block">Civil Lead:</span>
                  <span className="font-semibold text-slate-800">{existingCert.civilApprovedBy}</span>
                </div>
                <div className="p-2 bg-white/70 rounded-lg border border-emerald-100">
                  <span className="text-slate-400 block">Electrical Lead:</span>
                  <span className="font-semibold text-slate-800">
                    {existingCert.electricalApprovedBy}
                  </span>
                </div>
                <div className="p-2 bg-white/70 rounded-lg border border-emerald-100">
                  <span className="text-slate-400 block">Mechanical Lead:</span>
                  <span className="font-semibold text-slate-800">
                    {existingCert.mechanicalApprovedBy}
                  </span>
                </div>
                <div className="p-2 bg-white/70 rounded-lg border border-emerald-100">
                  <span className="text-slate-400 block">Package Lead:</span>
                  <span className="font-semibold text-slate-800">
                    {existingCert.projectApprovedBy}
                  </span>
                </div>
              </div>

              {existingCert.managementOverrideReason && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Management Override Reason: </span>
                  {existingCert.managementOverrideReason}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!is100Percent && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Readiness is currently {overallPct}%. </span>
                    Under standard compliance rules, a certificate cannot be generated unless 100% of tasks are verified complete, or an authorized management override is logged.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Civil Lead Sign-off
                  </label>
                  <input
                    type="text"
                    value={civilApprovedBy}
                    onChange={(e) => setCivilApprovedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Electrical Lead Sign-off
                  </label>
                  <input
                    type="text"
                    value={electricalApprovedBy}
                    onChange={(e) => setElectricalApprovedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Mechanical Lead Sign-off
                  </label>
                  <input
                    type="text"
                    value={mechanicalApprovedBy}
                    onChange={(e) => setMechanicalApprovedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Package Lead Sign-off
                  </label>
                  <input
                    type="text"
                    value={projectApprovedBy}
                    onChange={(e) => setProjectApprovedBy(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {!is100Percent && (
                <div className="pt-2">
                  <label className="font-semibold text-slate-800 text-xs flex items-center gap-2 mb-1">
                    <span>Authorized Management Override Justification</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific justification (e.g., civil foundation is cured, customer has arranged backup power, management approval by Director Ops)..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              )}

              <button
                onClick={handleGenerateCertificate}
                disabled={!is100Percent && !overrideReason.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Generate Official Site Readiness Certificate</span>
              </button>
            </div>
          )}

          {/* Site Ready Decision Controls */}
          <div className="pt-4 border-t border-slate-200">
            <div className="font-bold text-slate-900 text-xs mb-2">
              Site Readiness Gate Decision:
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDecision(true)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  project.isSiteReady
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Site Ready (YES)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Authorize material unloading and start installation.
                </p>
              </button>

              <button
                onClick={() => handleDecision(false)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !project.isSiteReady
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Site Not Ready (NO)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hold material arrival and log pending tasks.
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
