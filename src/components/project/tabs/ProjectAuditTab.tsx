import React, { useState } from 'react';
import { Shield, Filter, Search, Calendar, User, FileText } from 'lucide-react';
import { Project } from '../../../types';
import { useData } from '../../../context/DataContext';

interface Props {
  project: Project;
}

export const ProjectAuditTab: React.FC<Props> = ({ project }) => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const logs = auditLogs.filter(
    (l) => l.projectId === project.id || (l.recordId && l.recordId.includes(project.id))
  );

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionColor = (action: string) => {
    if (action === 'APPROVE') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (action === 'REJECT') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (action === 'CREATE') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (action === 'UPDATE' || action === 'STATUS_CHANGE') return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Compliance & Security Audit Trail
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system logs capturing stage changes, engineering approvals, certificates, and commercial modifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="REJECT">REJECT</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
          </select>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-xs">
            No audit records matching criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="relative group text-xs">
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white border border-blue-400" />
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900">{log.userName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                      {log.userRole}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] border border-blue-200">
                      {log.module}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-slate-700 text-xs font-medium">{log.summary}</p>
                {log.recordId && (
                  <div className="mt-1 text-[10px] text-slate-400 font-mono">
                    Record ID: {log.recordId}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
