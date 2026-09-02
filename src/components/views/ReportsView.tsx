import React, { useState } from 'react';
import {
  FileSpreadsheet,
  BarChart3,
  FileText,
  Download,
  Search,
  FolderOpen,
  CheckCircle2,
  PieChart,
  TrendingUp,
  FileCode,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ReportsViewProps {
  viewId: 'documents' | 'reports';
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ viewId, onSelectProject }) => {
  const { projects } = useData();
  const [search, setSearch] = useState('');

  const sampleDocs = [
    { name: 'P2S-2024-001_General_Layout_GA_Drawing.dwg', type: 'CAD Drawing', machine: '10-Chamber Stenter', category: 'Engineering' },
    { name: 'P2S-2024-001_Signed_Purchase_Order.pdf', type: 'PO PDF', machine: '10-Chamber Stenter', category: 'Commercial' },
    { name: 'P2S-2024-002_Electrical_Single_Line_Diagram.pdf', type: 'Wiring Diagram', machine: 'Yarn Dyeing Vessel', category: 'Technical' },
    { name: 'P2S-2024-003_Factory_Acceptance_Test_Report.pdf', type: 'QC Report', machine: 'Sizing Machine', category: 'Quality' },
    { name: 'P2S-2024-004_Goods_Receipt_Note_GRN.pdf', type: 'GRN Document', machine: 'Heavy Calender', category: 'Site' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              {viewId === 'documents' ? <FileSpreadsheet className="w-8 h-8" /> : <BarChart3 className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {viewId === 'documents' ? 'Documents & Drawings Central Vault' : 'Executive Portfolio Reports & Analytics'}
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {viewId === 'documents'
                  ? 'Centralized repository of GA drawings, wiring diagrams, PO copies, FAT reports, GRN, and handover certificates.'
                  : 'Portfolio delivery performance, stage milestone cycle times, revenue realization, and delay diagnostics.'}
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
              placeholder="Search documents or reports..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {viewId === 'documents' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Central Documents Vault</h3>
          </div>
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Document Type</th>
                <th className="px-4 py-3">Machine Package</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleDocs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{doc.type}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{doc.machine}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On-Time Machine Delivery</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">92.4% Rate</div>
              <span className="text-xs text-slate-500 mt-1 block">Based on last 20 projects</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Manufacturing Cycle</span>
              <div className="text-2xl font-bold text-blue-600 mt-1">48 Days</div>
              <span className="text-xs text-blue-600 font-medium mt-1 block">PO to Ready for Dispatch</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Site Installation Lead Time</span>
              <div className="text-2xl font-bold text-purple-600 mt-1">12 Days</div>
              <span className="text-xs text-purple-600 font-medium mt-1 block">Unloading to Machine Start</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-2">Executive Export Reports</h3>
            <p className="text-xs text-slate-500 mb-4">Export customized Excel & PDF reports for management meetings.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button className="p-4 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Monthly Revenue Realization</div>
                  <div className="text-xs text-slate-500 mt-0.5">XLSX Export</div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-4 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Stage Bottleneck Analysis</div>
                  <div className="text-xs text-slate-500 mt-0.5">PDF Summary</div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-4 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Customer Punchlist & Pending</div>
                  <div className="text-xs text-slate-500 mt-0.5">XLSX Export</div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
