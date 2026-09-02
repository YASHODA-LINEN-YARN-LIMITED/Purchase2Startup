import React, { useState } from 'react';
import {
  Users,
  Building,
  History,
  Settings,
  Shield,
  Plus,
  CheckCircle2,
  Lock,
  Sliders,
  Search,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STAGE_MAP } from '../../constants/stages';

interface AdminViewProps {
  viewId: 'users' | 'departments' | 'audit-logs' | 'settings';
}

export const AdminView: React.FC<AdminViewProps> = ({ viewId }) => {
  const { auditLogs, stageConfigs } = useData();
  const [search, setSearch] = useState('');

  const sampleUsers = [
    { name: 'System Administrator', email: 'admin@yashodalinen.com', role: 'Super Admin', department: 'Executive Management' },
    { name: 'MIS Dept Head', email: 'mis@yashodalinen.com', role: 'System Admin', department: 'MIS & Digital Control' },
    { name: 'Rajesh Kumar', email: 'rajesh.k@p2s.com', role: 'Field Service Lead', department: 'Erection & Site Support' },
    { name: 'Suresh Patel', email: 'suresh.p@p2s.com', role: 'Quality Control Lead', department: 'Quality Assurance (QA)' },
    { name: 'Anita Sharma', email: 'anita.s@p2s.com', role: 'Sales Manager', department: 'Sales & Marketing' },
  ];

  const sampleDepts = [
    { name: 'Sales & Commercial', code: 'SALES', head: 'Anita Sharma', activeProjects: 10 },
    { name: 'Design & Engineering', code: 'ENG', head: 'Vikram Mehta', activeProjects: 8 },
    { name: 'Production & Shopfloor', code: 'PROD', head: 'Manoj Singh', activeProjects: 6 },
    { name: 'Quality Control (QC)', code: 'QC', head: 'Suresh Patel', activeProjects: 5 },
    { name: 'Logistics & Dispatch', code: 'LOG', head: 'Ramesh Shah', activeProjects: 3 },
    { name: 'Erection & Site Support', code: 'SITE', head: 'Rajesh Kumar', activeProjects: 4 },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            {viewId === 'users' && <Users className="w-8 h-8" />}
            {viewId === 'departments' && <Building className="w-8 h-8" />}
            {viewId === 'audit-logs' && <History className="w-8 h-8" />}
            {viewId === 'settings' && <Settings className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {viewId === 'users' && 'Users & Role-Based Access Control (RBAC)'}
              {viewId === 'departments' && 'Department Directory & Assignments'}
              {viewId === 'audit-logs' && 'Immutable Audit Trail & System Logs'}
              {viewId === 'settings' && 'Process Stage Weightages & Configuration'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {viewId === 'users' && 'Manage team permissions, department roles, user profiles, and security clearances.'}
              {viewId === 'departments' && 'Define functional enterprise departments, department leads, and pending task routing.'}
              {viewId === 'audit-logs' && 'Tamper-proof record of all machine state changes, stage transitions, and approvals.'}
              {viewId === 'settings' && 'Configure stage completion weight percentages contributing to overall machine progress.'}
            </p>
          </div>
        </div>
      </div>

      {/* VIEW: USERS */}
      {viewId === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Authorized Users ({sampleUsers.length})</h3>
            <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add User
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{u.department}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: DEPARTMENTS */}
      {viewId === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleDepts.map((d, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {d.code}
                </span>
                <span className="text-xs text-slate-400">{d.activeProjects} Machines Active</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Lead: <strong>{d.head}</strong></p>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: AUDIT LOGS */}
      {viewId === 'audit-logs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Audit Trail Log History ({auditLogs.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600">{log.action}</td>
                    <td className="px-4 py-3 text-slate-800">{log.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: STAGE WEIGHTS & CONFIG */}
      {viewId === 'settings' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Process Stage Progress Weight Configuration</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust the weight percentage assigned to each stage. Total must sum up to 100%.
            </p>
          </div>

          <div className="space-y-3">
            {stageConfigs.map((cfg) => {
              const stageName = STAGE_MAP[cfg.id]?.name || cfg.name;
              return (
                <div key={cfg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">{stageName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-20 px-2.5 py-1 text-sm font-bold text-right text-slate-700 font-mono">
                      {cfg.weightPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
