import React, { useState } from 'react';
import {
  LifeBuoy,
  HeadphonesIcon,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Plus,
  UserCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ServiceViewProps {
  viewId: 'service-tickets' | 'warranty';
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const ServiceView: React.FC<ServiceViewProps> = ({ viewId, onSelectProject }) => {
  const { projects } = useData();
  const [search, setSearch] = useState('');

  const sampleTickets = [
    {
      id: 'ST-101',
      projectNumber: 'P2S-2024-001',
      customer: 'Yashoda Linens Pvt Ltd',
      machine: '10-Chamber Stenter',
      issue: 'Temperature fluctuation in Chamber 4 burner sensor',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Rajesh Kumar (Sr. Field Engineer)',
      createdDate: '2024-03-12',
    },
    {
      id: 'ST-102',
      projectNumber: 'P2S-2024-003',
      customer: 'Raymond Apparel Ltd',
      machine: 'Continuous Sizing Range',
      issue: 'Squeeze roll pneumatic pressure calibration check',
      priority: 'Normal',
      status: 'Open',
      assignedTo: 'Amit Verma (Service Specialist)',
      createdDate: '2024-03-14',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              {viewId === 'service-tickets' ? <LifeBuoy className="w-8 h-8" /> : <HeadphonesIcon className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {viewId === 'service-tickets' ? 'Customer Service Tickets & SLA Engine' : 'Machine Warranty & AMC Contracts'}
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {viewId === 'service-tickets'
                  ? 'Field service requests, breakdown dispatch, engineer assignments, spare parts consumption, and SLA compliance.'
                  : 'Manage 12-month standard warranty coverage, annual maintenance contracts (AMC), and preventive maintenance visits.'}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets, machines, or field engineers..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewId === 'service-tickets' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Breakdown Tickets</span>
              <div className="text-2xl font-bold text-rose-600 mt-1">2 Active</div>
              <span className="text-xs text-rose-600 font-medium mt-1 block">Engineers Deployed</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average SLA Response Time</span>
              <div className="text-2xl font-bold text-blue-600 mt-1">1.8 Hours</div>
              <span className="text-xs text-emerald-600 font-medium mt-1 block">&check; 98.5% On-Time SLA</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved This Month</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">14 Tickets</div>
              <span className="text-xs text-slate-500 mt-1 block">Client Sign-Off Done</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Service Tickets Register</h3>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Machine & Customer</th>
                  <th className="px-4 py-3">Issue Description</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assigned Engineer</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{t.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{t.customer}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.projectNumber} &bull; {t.machine}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-800">{t.issue}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{t.assignedTo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Active Machine Warranty & AMC Register</h3>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Machine #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Warranty Period</th>
                  <th className="px-4 py-3">AMC Status</th>
                  <th className="px-4 py-3">Preventive Visit Due</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{p.projectNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{p.customerName}</td>
                    <td className="px-4 py-3 text-emerald-700 font-medium">12 Months Standard Coverage</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                        Comprehensive AMC
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">Q2 Preventive Inspection</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onSelectProject(p.id, 'flow')}
                        className="inline-flex items-center px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                      >
                        Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
