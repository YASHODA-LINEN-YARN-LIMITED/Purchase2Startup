import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface FinanceViewProps {
  viewId: 'payments' | 'outstanding';
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ viewId, onSelectProject }) => {
  const { projects } = useData();
  const [search, setSearch] = useState('');

  // Sample calculations based on projects
  const totalContractValue = projects.reduce((acc, p) => acc + p.expectedOrderValue, 0);

  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              {viewId === 'payments' ? <CreditCard className="w-8 h-8" /> : <Receipt className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {viewId === 'payments' ? 'Payment Milestones & Invoicing' : 'Outstanding Dues & Receivables'}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Total Contract Value: ${totalContractValue.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {viewId === 'payments'
                  ? 'Track advance payments, delivery milestone invoicing, erection progress payments, and warranty retention.'
                  : 'Monitor overdue customer receivables, milestone payment delays, aging buckets, and collection efforts.'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter / Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, machine #, or model..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Portfolio Value</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">${totalContractValue.toLocaleString()}</div>
          <span className="text-xs text-slate-500 mt-1 block">{projects.length} Active Contracts</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collected Advance (20%)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">${(totalContractValue * 0.2).toLocaleString()}</div>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">PO Received & Cleared</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dispatch Milestones (70%)</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">${(totalContractValue * 0.7).toLocaleString()}</div>
          <span className="text-xs text-blue-600 font-medium mt-1 block">Pre-Dispatch Clearance</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Retention / Erection (10%)</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">${(totalContractValue * 0.1).toLocaleString()}</div>
          <span className="text-xs text-amber-600 font-medium mt-1 block">Post-Commissioning Due</span>
        </div>
      </div>

      {/* Contract & Payment Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            {viewId === 'payments' ? 'Contract Payment Schedules' : 'Receivables & Collections Tracking'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Machine #</th>
                <th className="px-4 py-3">Client Name</th>
                <th className="px-4 py-3">Total Value</th>
                <th className="px-4 py-3">Advance (20%)</th>
                <th className="px-4 py-3">Dispatch (70%)</th>
                <th className="px-4 py-3">Commissioning (10%)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => {
                const total = p.expectedOrderValue || 250000;
                const adv = total * 0.2;
                const disp = total * 0.7;
                const comm = total * 0.1;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{p.projectNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{p.machineModel}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">${total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-700 font-medium">
                      ${adv.toLocaleString()} <span className="text-[10px] text-emerald-600 font-bold block">&check; Received</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      ${disp.toLocaleString()}
                      <span className="text-[10px] text-blue-600 font-medium block">Due at Dispatch</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      ${comm.toLocaleString()}
                      <span className="text-[10px] text-amber-600 font-medium block">Due Post Start</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        In Compliance
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onSelectProject(p.id, 'payments')}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
                      >
                        Payment Ledger &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
