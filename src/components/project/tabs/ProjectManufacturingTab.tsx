import React, { useState } from 'react';
import {
  Factory,
  Wrench,
  ShieldCheck,
  PackageCheck,
  Truck,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Boxes,
  FileCheck,
} from 'lucide-react';
import {
  Project,
  WorkOrderRecord,
  AdvancePaymentRecord,
  ManufacturingActivityRecord,
  ProcurementItem,
  QCInspectionRecord,
  DispatchClearanceRecord,
  DeliveryScheduledRecord,
} from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { StatusBadge } from '../../common/StatusBadge';

interface Props {
  project: Project;
}

export const ProjectManufacturingTab: React.FC<Props> = ({ project }) => {
  const {
    workOrders,
    saveWorkOrder,
    advancePayments,
    saveAdvancePayment,
    manufacturingActivities,
    addManufacturingActivity,
    updateManufacturingActivity,
    procurementItems,
    addProcurementItem,
    updateProcurementItem,
    qcInspections,
    addQCInspection,
    dispatchRecords,
    saveDispatchRecord,
    deliveryRecords,
    saveDeliveryRecord,
  } = useData();

  const { currentUser } = useAuth();

  // Records for this project
  const currentWO = workOrders.find((w) => w.projectId === project.id);
  const currentAdv = advancePayments.find((a) => a.projectId === project.id);
  const projectMfgActs = manufacturingActivities.filter((m) => m.projectId === project.id);
  const projectProcurement = procurementItems.filter((p) => p.projectId === project.id);
  const projectQC = qcInspections.filter((q) => q.projectId === project.id);
  const currentDispatch = dispatchRecords.find((d) => d.projectId === project.id);
  const currentDelivery = deliveryRecords.find((d) => d.projectId === project.id);

  // Overall manufacturing progress calculation
  const totalWeight = projectMfgActs.length || 1;
  const overallMfgProgress = projectMfgActs.length
    ? Math.round(projectMfgActs.reduce((acc, a) => acc + a.completionPercent, 0) / totalWeight)
    : 0;

  // New manufacturing activity form
  const [showNewAct, setShowNewAct] = useState(false);
  const [actForm, setActForm] = useState({
    activityName: '',
    plannedStartDate: new Date().toISOString().substring(0, 10),
    plannedEndDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
    responsibleEngineer: 'Sunil Pawar (Production)',
  });

  // New QC form
  const [showNewQC, setShowNewQC] = useState(false);
  const [qcForm, setQcForm] = useState({
    componentName: 'Main Drive & Structural Frame',
    inspectionStage: 'Fabrication & Pre-Assembly',
    testResult: 'Pass' as const,
    remarks: 'NDT tests passed. Welding inspected without cracks or porosity.',
    inspectorName: 'Pradeep Nair (Quality Head)',
  });

  // Work Order Form
  const [woForm, setWoForm] = useState<Partial<WorkOrderRecord>>({
    internalWorkOrderNumber: currentWO?.internalWorkOrderNumber || `WO-2026-${project.projectNumber.slice(-4)}`,
    workOrderDate: currentWO?.workOrderDate || new Date().toISOString().substring(0, 10),
    bomStatus: currentWO?.bomStatus || 'Finalized',
    bomFinalizedDate: currentWO?.bomFinalizedDate || new Date().toISOString().substring(0, 10),
    resourcePlanningStatus: currentWO?.resourcePlanningStatus || 'Allocated',
    projectEngineer: currentWO?.projectEngineer || 'Rohan Mehta',
    productionManager: currentWO?.productionManager || 'Sunil Pawar',
    supplierFinalizationStatus: currentWO?.supplierFinalizationStatus || 'Completed',
    targetManufacturingStart: currentWO?.targetManufacturingStart || new Date().toISOString().substring(0, 10),
    targetManufacturingCompletion: currentWO?.targetManufacturingCompletion || project.targetDeliveryDate,
    isChecklistComplete: currentWO?.isChecklistComplete ?? true,
  });

  // Advance Payment Form
  const [advForm, setAdvForm] = useState<Partial<AdvancePaymentRecord>>({
    advanceRequired: currentAdv?.advanceRequired ?? true,
    advancePercentage: currentAdv?.advancePercentage || 30,
    advanceAmount: currentAdv?.advanceAmount || Math.round(project.expectedOrderValue * 0.3),
    invoiceNumber: currentAdv?.invoiceNumber || `INV-ADV-${project.projectNumber.slice(-4)}`,
    paymentDueDate: currentAdv?.paymentDueDate || '',
    paymentReceived: currentAdv?.paymentReceived ?? true,
    amountReceived: currentAdv?.amountReceived || Math.round(project.expectedOrderValue * 0.3),
    transactionReference: currentAdv?.transactionReference || 'UTR-HDFC-992019482',
    lcApplicable: currentAdv?.lcApplicable || false,
    bgApplicable: currentAdv?.bgApplicable || false,
  });

  // Dispatch Clearance Form
  const [dispForm, setDispForm] = useState<Partial<DispatchClearanceRecord>>({
    finalInspectionDate: currentDispatch?.finalInspectionDate || new Date().toISOString().substring(0, 10),
    inspectionResult: currentDispatch?.inspectionResult || 'Pass',
    packingDate: currentDispatch?.packingDate || new Date().toISOString().substring(0, 10),
    packingDetails: currentDispatch?.packingDetails || 'Heavy duty wooden seaworthy export grade crating with VCI protective moisture barrier.',
    numberOfPackages: currentDispatch?.numberOfPackages || 4,
    grossWeight: currentDispatch?.grossWeight || 18500,
    netWeight: currentDispatch?.netWeight || 17200,
    dimensions: currentDispatch?.dimensions || 'Main Machine: 6.2m x 2.8m x 3.1m; Ancillary: 3.5m x 1.8m x 2.0m',
    dispatchClearanceStatus: currentDispatch?.dispatchClearanceStatus || 'Cleared for Dispatch',
  });

  // Delivery & Transit Form
  const [delForm, setDelForm] = useState<Partial<DeliveryScheduledRecord>>({
    plannedDeliveryDate: currentDelivery?.plannedDeliveryDate || project.targetDeliveryDate,
    confirmedDeliveryDate: currentDelivery?.confirmedDeliveryDate || project.targetDeliveryDate,
    transporter: currentDelivery?.transporter || 'Express Heavy Logistics Ltd',
    vehicleNumber: currentDelivery?.vehicleNumber || 'MH-12-RN-8899 (Low-bed Trailer)',
    lrNumber: currentDelivery?.lrNumber || 'LR-EXP-99120',
    driverName: currentDelivery?.driverName || 'Ramesh Yadav',
    driverPhone: currentDelivery?.driverPhone || '+91 98980 11223',
    dispatchDate: currentDelivery?.dispatchDate || new Date().toISOString().substring(0, 10),
    expectedSiteArrival: currentDelivery?.expectedSiteArrival || project.targetDeliveryDate,
    transportStatus: currentDelivery?.transportStatus || 'Vehicle Arranged',
    siteReadinessConfirmed: currentDelivery?.siteReadinessConfirmed ?? project.isSiteReady,
  });

  const handleSaveWO = (e: React.FormEvent) => {
    e.preventDefault();
    saveWorkOrder({
      projectId: project.id,
      ...woForm,
    });
    alert('Internal Work Order details saved successfully.');
  };

  const handleSaveAdv = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdvancePayment({
      projectId: project.id,
      ...advForm,
    });
    alert('Advance payment configuration and collection record saved.');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    addManufacturingActivity({
      projectId: project.id,
      category: 'Fabrication',
      activity: actForm.activityName,
      description: actForm.activityName,
      responsibleDepartment: 'Production',
      responsiblePerson: actForm.responsibleEngineer,
      plannedStart: actForm.plannedStartDate,
      plannedEnd: actForm.plannedEndDate,
      actualStart: actForm.plannedStartDate,
      completionPercent: 0,
      status: 'In Progress',
      delayDays: 0,
    });
    setShowNewAct(false);
    setActForm({ ...actForm, activityName: '' });
  };

  const handleAddQC = (e: React.FormEvent) => {
    e.preventDefault();
    addQCInspection({
      projectId: project.id,
      inspectionNumber: `QC-${Date.now().toString().slice(-4)}`,
      inspectionDate: new Date().toISOString().substring(0, 10),
      inspectionType: 'In-process Fabrication',
      item: qcForm.componentName,
      specification: 'Standard Engineering Tolerance ISO 2768-m',
      actualResult: qcForm.remarks || 'Dimensions and welds verified within tolerance.',
      passFail: qcForm.testResult === 'Pass' ? 'Pass' : 'Fail',
      inspectedBy: qcForm.inspectorName,
      reinspectionRequired: qcForm.testResult !== 'Pass',
      finalStatus: qcForm.testResult === 'Pass' ? 'Closed' : 'Open',
    });
    setShowNewQC(false);
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    saveDispatchRecord({
      projectId: project.id,
      ...dispForm,
    });
    alert('Dispatch clearance certificate and packing details saved.');
  };

  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    saveDeliveryRecord({
      projectId: project.id,
      ...delForm,
    });
    alert('Delivery & transport logistics details updated.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Stage 7: Work Order & Engineering Finalization */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 7: Internal Work Order (WO) & BOM Finalization
              </h3>
              <p className="text-xs text-slate-500">
                Authorized internal production release with engineering sign-off.
              </p>
            </div>
          </div>
          <StatusBadge status={woForm.bomStatus || 'Finalized'} size="md" />
        </div>

        <form onSubmit={handleSaveWO} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Internal WO Number</label>
              <input
                type="text"
                value={woForm.internalWorkOrderNumber}
                onChange={(e) => setWoForm({ ...woForm, internalWorkOrderNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">BOM Status</label>
              <select
                value={woForm.bomStatus}
                onChange={(e) => setWoForm({ ...woForm, bomStatus: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Finalized">Finalized</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Project Engineer</label>
              <input
                type="text"
                value={woForm.projectEngineer}
                onChange={(e) => setWoForm({ ...woForm, projectEngineer: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Production Manager</label>
              <input
                type="text"
                value={woForm.productionManager}
                onChange={(e) => setWoForm({ ...woForm, productionManager: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="woChecklist"
                checked={woForm.isChecklistComplete}
                onChange={(e) => setWoForm({ ...woForm, isChecklistComplete: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <label htmlFor="woChecklist" className="text-xs font-semibold text-slate-800">
                Confirm: Complete Engineering BOM & Resource Planning checklist verified
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Save Work Order
            </button>
          </div>
        </form>
      </div>

      {/* 2. Stage 8: Advance Payment Clearance */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 8: Advance Payment Clearance
              </h3>
              <p className="text-xs text-slate-500">
                Tracks advance invoice, Bank Guarantee / LC compliance, and received funds.
              </p>
            </div>
          </div>
          <StatusBadge status={advForm.paymentReceived ? 'Received' : 'Pending'} size="md" />
        </div>

        <form onSubmit={handleSaveAdv} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Advance Required (%)</label>
            <input
              type="number"
              value={advForm.advancePercentage}
              onChange={(e) => setAdvForm({ ...advForm, advancePercentage: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Advance Amount ({project.currency})</label>
            <input
              type="number"
              value={advForm.advanceAmount}
              onChange={(e) => setAdvForm({ ...advForm, advanceAmount: Number(e.target.value) })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Invoice Number</label>
            <input
              type="text"
              value={advForm.invoiceNumber}
              onChange={(e) => setAdvForm({ ...advForm, invoiceNumber: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Payment Status</label>
            <select
              value={advForm.paymentReceived ? 'yes' : 'no'}
              onChange={(e) => setAdvForm({ ...advForm, paymentReceived: e.target.value === 'yes' })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="yes">Payment Received (Clearance OK)</option>
              <option value="no">Pending Receipt</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-3">
            <label className="font-semibold text-slate-600 block mb-1">Bank Reference / UTR / Remarks</label>
            <input
              type="text"
              value={advForm.transactionReference}
              onChange={(e) => setAdvForm({ ...advForm, transactionReference: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Update Advance Record
            </button>
          </div>
        </form>
      </div>

      {/* 3. Stage 9: Manufacturing Activities & Quality Inspections */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 9: Manufacturing Activity & Assembly Progress
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current calculated manufacturing completion: <span className="font-bold text-indigo-700">{overallMfgProgress}%</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewQC(!showNewQC)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Log QC Inspection</span>
            </button>
            <button
              onClick={() => setShowNewAct(!showNewAct)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          </div>
        </div>

        {/* Add Activity Modal/Form */}
        {showNewAct && (
          <form
            onSubmit={handleAddActivity}
            className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="font-semibold text-slate-900">Add Production Line Activity</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Activity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical Panel Wiring & Testing"
                  value={actForm.activityName}
                  onChange={(e) => setActForm({ ...actForm, activityName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Planned Start</label>
                <input
                  type="date"
                  value={actForm.plannedStartDate}
                  onChange={(e) => setActForm({ ...actForm, plannedStartDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Planned End</label>
                <input
                  type="date"
                  value={actForm.plannedEndDate}
                  onChange={(e) => setActForm({ ...actForm, plannedEndDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewAct(false)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
              >
                Add Activity
              </button>
            </div>
          </form>
        )}

        {/* Add QC Form */}
        {showNewQC && (
          <form
            onSubmit={handleAddQC}
            className="mb-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs"
          >
            <div className="font-semibold text-emerald-900">Record Quality Control (QC) Inspection</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Component / Assembly</label>
                <input
                  type="text"
                  value={qcForm.componentName}
                  onChange={(e) => setQcForm({ ...qcForm, componentName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Inspection Stage</label>
                <input
                  type="text"
                  value={qcForm.inspectionStage}
                  onChange={(e) => setQcForm({ ...qcForm, inspectionStage: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Result</label>
                <select
                  value={qcForm.testResult}
                  onChange={(e) => setQcForm({ ...qcForm, testResult: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Pass">Pass</option>
                  <option value="Conditional Pass">Conditional Pass</option>
                  <option value="Fail">Fail (Correction Required)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Inspector Notes & Observations</label>
              <input
                type="text"
                value={qcForm.remarks}
                onChange={(e) => setQcForm({ ...qcForm, remarks: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewQC(false)}
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg"
              >
                Log QC Report
              </button>
            </div>
          </form>
        )}

        {/* Manufacturing Activities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Activity</th>
                <th className="p-3">Timeline</th>
                <th className="p-3">Progress %</th>
                <th className="p-3">Status</th>
                <th className="p-3">Delay</th>
                <th className="p-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectMfgActs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    No manufacturing activities logged yet.
                  </td>
                </tr>
              ) : (
                projectMfgActs.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">{act.activity}</td>
                    <td className="p-3 text-slate-600">
                      {act.plannedStart} → {act.plannedEnd}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${act.completionPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{act.completionPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={act.status} size="sm" />
                    </td>
                    <td className="p-3 text-slate-600">
                      {act.delayDays > 0 ? (
                        <span className="text-rose-600 font-bold">+{act.delayDays}d</span>
                      ) : (
                        <span className="text-emerald-600">On Time</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() =>
                          updateManufacturingActivity(act.id, {
                            completionPercent: Math.min(100, act.completionPercent + 25),
                            status: act.completionPercent + 25 >= 100 ? 'Completed' : 'In Progress',
                          })
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        +25%
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quality Control History List */}
        {projectQC.length > 0 && (
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inspection & Quality Sign-offs ({projectQC.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {projectQC.map((q) => (
                <div key={q.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{q.item}</span>
                    <StatusBadge status={q.passFail} size="sm" />
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Type: {q.inspectionType} • Date: {q.inspectionDate}
                  </div>
                  <p className="text-slate-700 text-xs mt-1">{q.actualResult}</p>
                  <div className="text-[10px] text-slate-400 mt-1">Inspector: {q.inspectedBy}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Stage 10 & 11: Dispatch Clearance & Delivery Scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage 10: Dispatch Clearance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 10: Ready for Dispatch
              </h3>
            </div>
            <StatusBadge status={dispForm.dispatchClearanceStatus || 'Pending'} size="sm" />
          </div>

          <form onSubmit={handleSaveDispatch} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Clearance Status</label>
                <select
                  value={dispForm.dispatchClearanceStatus}
                  onChange={(e) => setDispForm({ ...dispForm, dispatchClearanceStatus: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Cleared for Dispatch">Cleared for Dispatch</option>
                  <option value="Pending Inspection">Pending Inspection</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Number of Packages</label>
                <input
                  type="number"
                  value={dispForm.numberOfPackages}
                  onChange={(e) => setDispForm({ ...dispForm, numberOfPackages: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Gross Weight (Kg)</label>
                <input
                  type="number"
                  value={dispForm.grossWeight}
                  onChange={(e) => setDispForm({ ...dispForm, grossWeight: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Net Weight (Kg)</label>
                <input
                  type="number"
                  value={dispForm.netWeight}
                  onChange={(e) => setDispForm({ ...dispForm, netWeight: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">Crating & Packing Details</label>
              <input
                type="text"
                value={dispForm.packingDetails}
                onChange={(e) => setDispForm({ ...dispForm, packingDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
              >
                Update Dispatch Clearance
              </button>
            </div>
          </form>
        </div>

        {/* Stage 11: Delivery & Logistics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Stage 11: Delivery Scheduled & In-Transit
              </h3>
            </div>
            <StatusBadge status={delForm.transportStatus || 'Vehicle Arranged'} size="sm" />
          </div>

          <form onSubmit={handleSaveDelivery} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Transporter Name</label>
                <input
                  type="text"
                  value={delForm.transporter}
                  onChange={(e) => setDelForm({ ...delForm, transporter: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Vehicle / Trailer #</label>
                <input
                  type="text"
                  value={delForm.vehicleNumber}
                  onChange={(e) => setDelForm({ ...delForm, vehicleNumber: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Lorry Receipt (LR) #</label>
                <input
                  type="text"
                  value={delForm.lrNumber}
                  onChange={(e) => setDelForm({ ...delForm, lrNumber: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Driver Name & Contact</label>
                <input
                  type="text"
                  value={delForm.driverName}
                  onChange={(e) => setDelForm({ ...delForm, driverName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Site Readiness Gate: </span>
                <span className={`font-bold ${project.isSiteReady ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {project.isSiteReady ? 'Verified Ready' : 'Pending Verification'}
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Save Transit Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
