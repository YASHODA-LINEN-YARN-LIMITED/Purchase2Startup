import React, { useState } from 'react';
import {
  Boxes,
  Hammer,
  Activity,
  Zap,
  PlayCircle,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
} from 'lucide-react';
import {
  Project,
  MaterialReceiptRecord,
  InstallationActivity,
  DailyProgressEntry,
  PreCommissioningCheckItem,
  CommissioningRecord,
  MachineStartRecord,
} from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectErectionTab: React.FC<Props> = ({ project }) => {
  const {
    materialReceipts,
    saveMaterialReceipt,
    installationActivities,
    addInstallationActivity,
    updateInstallationActivity,
    dailyProgress,
    addDailyProgress,
    precommissioningChecks,
    addPrecommissioningCheck,
    updatePrecommissioningCheck,
    commissioningRecords,
    saveCommissioningRecord,
    machineStartRecords,
    recordMachineStart,
  } = useData();

  const { currentUser } = useAuth();

  // Project records
  const currentReceipt = materialReceipts.find((r) => r.projectId === project.id);
  const projectInstallActs = installationActivities.filter((i) => i.projectId === project.id);
  const projectDaily = dailyProgress.filter((d) => d.projectId === project.id);
  const projectChecks = precommissioningChecks.filter((c) => c.projectId === project.id);
  const currentComm = commissioningRecords.find((c) => c.projectId === project.id);
  const currentMachineStart = machineStartRecords.find((m) => m.projectId === project.id);

  // Material receipt form
  const [grnForm, setGrnForm] = useState<Partial<MaterialReceiptRecord>>({
    grnNumber: currentReceipt?.grnNumber || `GRN-2026-${project.projectNumber.slice(-4)}`,
    grnDate: currentReceipt?.grnDate || new Date().toISOString().substring(0, 10),
    receivedDate: currentReceipt?.receivedDate || new Date().toISOString().substring(0, 10),
    vehicleNumber: currentReceipt?.vehicleNumber || 'MH-12-RN-8899',
    transporter: currentReceipt?.transporter || 'Express Heavy Logistics Ltd',
    packageCount: currentReceipt?.packageCount || 8,
    materialCondition: currentReceipt?.materialCondition || 'Intact & Undamaged',
    shortageFound: currentReceipt?.shortageFound || false,
    damageFound: currentReceipt?.damageFound || false,
    inspectionDate: currentReceipt?.inspectionDate || new Date().toISOString().substring(0, 10),
    inspectionResult: currentReceipt?.inspectionResult || 'Accepted',
    storageLocation: currentReceipt?.storageLocation || 'Bay-3 Covered Storage Facility',
    handlingInstructions: currentReceipt?.handlingInstructions || 'Keep dry, store in indoor bay',
    receivedBy: currentReceipt?.receivedBy || 'Rajesh Kulkarni (Site In-Charge)',
    remarks: currentReceipt?.remarks || 'All crated boxes intact.',
  });

  // Daily progress form state
  const [showDailyForm, setShowDailyForm] = useState(false);
  const [dailyForm, setDailyForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    installationCategory: 'Mechanical' as const,
    workActivity: 'Base frame grouting and precision laser leveling with optical surveyor.',
    description: 'Alignment and anchoring complete',
    manpower: 8,
    workingHours: 10,
    progressTodayPercent: 65,
    overallProgressPercent: 70,
    problems: '',
    pendingItems: '',
    responsiblePerson: 'Rajesh Kulkarni',
  });

  // Machine start form state
  const [showMachineStartForm, setShowMachineStartForm] = useState(false);
  const [startForm, setStartForm] = useState({
    officialMachineStartDate: currentMachineStart?.officialMachineStartDate || new Date().toISOString().substring(0, 10),
    startTime: currentMachineStart?.startTime || '11:00 AM',
    commissioningReference: currentMachineStart?.commissioningReference || 'COMM-REF-001',
    customerAcceptanceReference: currentMachineStart?.customerAcceptanceReference || 'CAR-2026-001',
    machineStatus: 'Commercial Production' as const,
    productionStarted: true,
    handoverToCustomer: true,
    remarks: currentMachineStart?.remarks || 'Handed over in continuous commercial production mode. Client signoff complete.',
  });

  const handleSaveGRN = (e: React.FormEvent) => {
    e.preventDefault();
    saveMaterialReceipt({
      projectId: project.id,
      grnNumber: grnForm.grnNumber || 'GRN-001',
      grnDate: grnForm.grnDate || new Date().toISOString().substring(0, 10),
      receivedDate: grnForm.receivedDate || new Date().toISOString().substring(0, 10),
      transporter: grnForm.transporter || 'Express Logistics',
      vehicleNumber: grnForm.vehicleNumber || 'MH-12-0000',
      receivedBy: grnForm.receivedBy || currentUser.fullName,
      packageCount: grnForm.packageCount || 1,
      materialCondition: grnForm.materialCondition || 'Intact & Undamaged',
      shortageFound: grnForm.shortageFound || false,
      damageFound: grnForm.damageFound || false,
      inspectionDate: grnForm.inspectionDate || new Date().toISOString().substring(0, 10),
      inspectionResult: grnForm.inspectionResult || 'Accepted',
      storageLocation: grnForm.storageLocation || 'Bay-3',
      handlingInstructions: grnForm.handlingInstructions || 'Standard storage',
      remarks: grnForm.remarks,
    });
    alert('Site Goods Receipt Note (GRN) saved.');
  };

  const handleAddDailyProgress = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyProgress({
      projectId: project.id,
      date: dailyForm.date,
      installationCategory: dailyForm.installationCategory,
      workActivity: dailyForm.workActivity,
      description: dailyForm.description,
      manpower: Number(dailyForm.manpower),
      workingHours: Number(dailyForm.workingHours),
      progressTodayPercent: Number(dailyForm.progressTodayPercent),
      overallProgressPercent: Number(dailyForm.overallProgressPercent),
      problems: dailyForm.problems,
      pendingItems: dailyForm.pendingItems,
      responsiblePerson: dailyForm.responsiblePerson,
      enteredBy: currentUser.fullName,
    });
    setShowDailyForm(false);
  };

  const handleSaveCommissioning = (updates: Partial<CommissioningRecord>) => {
    saveCommissioningRecord({
      projectId: project.id,
      ...updates,
    });
  };

  const handleRecordMachineStart = (e: React.FormEvent) => {
    e.preventDefault();
    recordMachineStart({
      projectId: project.id,
      officialMachineStartDate: startForm.officialMachineStartDate,
      startTime: startForm.startTime,
      commissioningReference: startForm.commissioningReference,
      customerAcceptanceReference: startForm.customerAcceptanceReference,
      machineStatus: startForm.machineStatus,
      productionStarted: startForm.productionStarted,
      handoverToCustomer: startForm.handoverToCustomer,
      remarks: startForm.remarks,
      recordedBy: currentUser.fullName,
    });
    setShowMachineStartForm(false);
    alert('Official Commercial Machine Start Date logged and audited.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Stage 13: Site Material Receipt (GRN) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 13: Site Material Receipt & GRN
              </h3>
              <p className="text-xs text-slate-500">
                Verifies safe offloading at site, physical condition, shortage and damage inspection.
              </p>
            </div>
          </div>
          <StatusBadge status={grnForm.unloadingCompleted ? 'Received' : 'Pending'} size="md" />
        </div>

        <form onSubmit={handleSaveGRN} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">GRN Number</label>
              <input
                type="text"
                value={grnForm.grnNumber}
                onChange={(e) => setGrnForm({ ...grnForm, grnNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Receipt Date</label>
              <input
                type="date"
                value={grnForm.receiptDate}
                onChange={(e) => setGrnForm({ ...grnForm, receiptDate: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Physical Condition</label>
              <select
                value={grnForm.physicalCondition}
                onChange={(e) => setGrnForm({ ...grnForm, physicalCondition: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="Good">Good (Intact, no damage)</option>
                <option value="Minor Damage">Minor Damage (Touchup required)</option>
                <option value="Major Damage">Major Damage (Insurance Claim)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Unloading Status</label>
              <select
                value={grnForm.unloadingCompleted ? 'yes' : 'no'}
                onChange={(e) => setGrnForm({ ...grnForm, unloadingCompleted: e.target.value === 'yes' })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="yes">Unloading Completed</option>
                <option value="no">Vehicle In Yard / Pending</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Shortage / Damage Details</label>
              <input
                type="text"
                value={grnForm.shortageOrDamageDetails}
                onChange={(e) => setGrnForm({ ...grnForm, shortageOrDamageDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Storage Location on Site</label>
              <input
                type="text"
                value={grnForm.storageLocation}
                onChange={(e) => setGrnForm({ ...grnForm, storageLocation: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Update Site GRN
            </button>
          </div>
        </form>
      </div>

      {/* 2. Stage 14 & 15: Installation Activities & Daily Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stages 14-15: Installation, Erection & Daily Progress Logging
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track daily site manpower, machine assembly, optical alignment, and issues encountered.
            </p>
          </div>

          <button
            onClick={() => setShowDailyForm(!showDailyForm)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Daily Site Progress</span>
          </button>
        </div>

        {/* Daily Progress Form */}
        {showDailyForm && (
          <form
            onSubmit={handleAddDailyProgress}
            className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3 text-xs"
          >
            <div className="font-semibold text-indigo-900">New Daily Site Activity Log</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={dailyForm.date}
                  onChange={(e) => setDailyForm({ ...dailyForm, date: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Category</label>
                <select
                  value={dailyForm.installationCategory}
                  onChange={(e) => setDailyForm({ ...dailyForm, installationCategory: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Civil">Civil / Structural</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Manpower Deployed</label>
                <input
                  type="number"
                  value={dailyForm.manpowerDeployed}
                  onChange={(e) => setDailyForm({ ...dailyForm, manpowerDeployed: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Hours Worked</label>
                <input
                  type="number"
                  value={dailyForm.workingHours}
                  onChange={(e) => setDailyForm({ ...dailyForm, workingHours: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Work Activity Completed</label>
              <textarea
                rows={2}
                value={dailyForm.workActivity}
                onChange={(e) => setDailyForm({ ...dailyForm, workActivity: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Problems / Obstacles Encountered</label>
                <input
                  type="text"
                  placeholder="e.g. Crane breakdown for 2 hrs, client crane unavailable..."
                  value={dailyForm.problems}
                  onChange={(e) => setDailyForm({ ...dailyForm, problems: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Pending Items</label>
                <input
                  type="text"
                  placeholder="Items to follow up tomorrow or transfer to pending works..."
                  value={dailyForm.pendingItems}
                  onChange={(e) => setDailyForm({ ...dailyForm, pendingItems: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDailyForm(false)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-xs"
              >
                Save Daily Report
              </button>
            </div>
          </form>
        )}

        {/* Installation Activities Overview */}
        <div className="space-y-2 mb-6">
          <div className="font-bold text-slate-800 text-xs mb-1">Installation Milestones</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {projectInstallActs.map((act) => (
              <div key={act.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">{act.task}</span>
                  <StatusBadge status={act.status} size="sm" />
                </div>
                <div className="text-[11px] text-slate-500 mb-2">
                  Category: {act.category} • Target: {act.plannedCompletion}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${act.progressPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900">{act.progressPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Progress Logs List */}
        <div>
          <div className="font-bold text-slate-800 text-xs mb-2">Daily Site Progress Reports ({projectDaily.length})</div>
          <div className="space-y-2">
            {projectDaily.map((d) => (
              <div key={d.id} className="p-3 rounded-lg border border-slate-200 bg-white text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.date}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {d.installationCategory}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {d.manpower} Workers • {d.workingHours} Hours
                    </span>
                  </div>
                  <span className="font-bold text-indigo-700">{d.progressTodayPercent}% Stage Progress</span>
                </div>
                <p className="text-slate-800 font-medium">{d.workActivity}</p>
                {(d.problems || d.pendingItems) && (
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                    {d.problems && <div><span className="font-semibold">Issues: </span>{d.problems}</div>}
                    {d.pendingItems && <div><span className="font-semibold">Pending: </span>{d.pendingItems}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Stage 16 & 17: Pre-Commissioning & Commissioning */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stages 16-17: Pre-Commissioning & Machine Commissioning
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Checks electrical wiring, motor rotation, safety interlocks, trial run, and customer acceptance.
            </p>
          </div>
          <StatusBadge status={currentComm?.finalCommissioningStatus || 'Trial Running'} size="md" />
        </div>

        {/* Pre-Commissioning Checks Grid */}
        <div className="mb-6">
          <div className="font-bold text-slate-800 text-xs mb-2">Pre-Commissioning Clearance Items</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {projectChecks.map((chk) => (
              <div
                key={chk.id}
                onClick={() =>
                  updatePrecommissioningCheck(chk.id, {
                    result: chk.result === 'Pass' ? 'Fail' : 'Pass',
                  })
                }
                className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                  chk.result === 'Pass' ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900">{chk.checkItem}</div>
                  <div className="text-[10px] text-slate-400">
                    Category: {chk.category} • Checked By: {chk.checkedBy}
                  </div>
                </div>
                <StatusBadge status={chk.result} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Commissioning Trial Run Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="font-bold text-slate-900">Commissioning Trial Run & Acceptance Record</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block">Trial Run Duration:</span>
              <span className="font-bold text-slate-800">{currentComm?.trialDurationHours || 72} Hours continuous</span>
            </div>
            <div>
              <span className="text-slate-400 block">Machine Running Hours:</span>
              <span className="font-bold text-slate-800">{currentComm?.machineRunningHours || 74.5} Hours</span>
            </div>
            <div>
              <span className="text-slate-400 block">Performance Result:</span>
              <span className="font-bold text-emerald-700">{currentComm?.performanceResult || 'Achieved 102% rated output'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Customer Sign-off:</span>
              <span className="font-bold text-slate-800">{currentComm?.customerAcceptanceDate || 'Pending Sign-off'}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() =>
                handleSaveCommissioning({
                  finalCommissioningStatus: 'Customer Accepted',
                  customerAcceptanceDate: new Date().toISOString().substring(0, 10),
                })
              }
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Official Customer Acceptance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Stage 18: Official Machine Start Date */}
      <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Stage 18: Official Machine Start Date & Commercial Production
              </h3>
              <p className="text-xs text-slate-500">
                Official milestone marking commercial plant commissioning and warranty period commencement.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMachineStartForm(!showMachineStartForm)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>{currentMachineStart ? 'Update Start Record' : 'Record Machine Start Date'}</span>
          </button>
        </div>

        {showMachineStartForm && (
          <form
            onSubmit={handleRecordMachineStart}
            className="mb-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-3"
          >
            <div className="font-bold text-emerald-900">Log Official Commercial Machine Start</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Machine Start Date</label>
                <input
                  type="date"
                  value={startForm.officialMachineStartDate}
                  onChange={(e) => setStartForm({ ...startForm, officialMachineStartDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                <input
                  type="text"
                  value={startForm.startTime}
                  onChange={(e) => setStartForm({ ...startForm, startTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recorded By</label>
                <input
                  type="text"
                  value={currentUser.fullName}
                  readOnly
                  className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Handover & Performance Notes</label>
              <input
                type="text"
                value={startForm.remarks}
                onChange={(e) => setStartForm({ ...startForm, remarks: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMachineStartForm(false)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg shadow-xs"
              >
                Confirm Machine Start Date
              </button>
            </div>
          </form>
        )}

        {currentMachineStart ? (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
              <CheckCircle2 className="w-5 h-5" />
              <span>OFFICIAL COMMERCIAL START DATE CONFIRMED</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block font-medium">Machine Start Date:</span>
                <span className="font-bold text-slate-900 text-sm">{currentMachineStart.officialMachineStartDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Start Time:</span>
                <span className="font-semibold text-slate-900">{currentMachineStart.startTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Commercial Production:</span>
                <span className="font-bold text-emerald-700">Active</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Recorded By:</span>
                <span className="text-slate-700">{currentMachineStart.recordedBy}</span>
              </div>
            </div>
            <p className="text-slate-600 mt-2 text-[11px]">{currentMachineStart.remarks}</p>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Official machine start date not yet recorded. Click "Record Machine Start Date" once customer trials are completed.
          </div>
        )}
      </div>
    </div>
  );
};
