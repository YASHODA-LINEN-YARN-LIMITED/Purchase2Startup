import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SiteReadinessModal } from './SiteReadinessModal';
import { Project } from '../../types';

interface Props {
  onSelectProject: (projectId: string, tab?: string) => void;
}

export const SiteReadinessOverview: React.FC<Props> = ({ onSelectProject }) => {
  const { projects, siteTasks, setSiteReadyDecision, siteCertificates } = useData();

  const [selectedCertProject, setSelectedCertProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Site Readiness & Clearance Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage 12 verification: Civil foundation, electrical power, and mechanical crane readiness gates.
          </p>
        </div>
      </div>

      {/* Grid of Projects Site Status */}
      <div className="space-y-4">
        {projects.map((project) => {
          const tasks = siteTasks.filter((t) => t.projectId === project.id);
          const civilTasks = tasks.filter((t) => t.category === 'CIVIL');
          const electricalTasks = tasks.filter((t) => t.category === 'ELECTRICAL');
          const mechanicalTasks = tasks.filter((t) => t.category === 'MECHANICAL');

          const civilPct =
            civilTasks.length > 0
              ? Math.round((civilTasks.filter((t) => t.status === 'Completed').length / civilTasks.length) * 100)
              : 100;
          const electricalPct =
            electricalTasks.length > 0
              ? Math.round((electricalTasks.filter((t) => t.status === 'Completed').length / electricalTasks.length) * 100)
              : 100;
          const mechanicalPct =
            mechanicalTasks.length > 0
              ? Math.round((mechanicalTasks.filter((t) => t.status === 'Completed').length / mechanicalTasks.length) * 100)
              : 100;

          const overallPct = Math.round((civilPct + electricalPct + mechanicalPct) / 3);
          const cert = siteCertificates.find((c) => c.projectId === project.id);

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {project.projectNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{project.projectName}</h3>
                    {project.isSiteReady ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        SITE READY (DISPATCH ALLOWED)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                        SITE NOT READY (MATERIAL HELD)
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 mt-1">
                    Client: <strong className="text-slate-700">{project.customerName}</strong> • Plant Location: {project.siteAddress || project.siteName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCertProject(project)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>{cert ? 'View Certificate' : 'Issue Certificate'}</span>
                  </button>

                  <button
                    onClick={() => setSiteReadyDecision(project.id, !project.isSiteReady)}
                    className={`px-3 py-1.5 rounded-lg font-bold shadow-xs transition-colors ${
                      project.isSiteReady
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {project.isSiteReady ? 'Revoke Site Readiness' : 'Authorize Site Ready'}
                  </button>

                  <button
                    onClick={() => onSelectProject(project.id, 'site')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <span>Checklists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Civil Foundation
                    </span>
                    <span className="font-bold">{civilPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${civilPct}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Electrical Power 415V
                    </span>
                    <span className="font-bold">{electricalPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${electricalPct}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-purple-600" />
                      Mechanical & Crane
                    </span>
                    <span className="font-bold">{mechanicalPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${mechanicalPct}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span className="font-bold text-slate-800">Overall Site Readiness</span>
                    <span className="font-bold text-blue-600">{overallPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${overallPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCertProject && (
        <SiteReadinessModal
          project={selectedCertProject}
          isOpen={!!selectedCertProject}
          onClose={() => setSelectedCertProject(null)}
        />
      )}
    </div>
  );
};
