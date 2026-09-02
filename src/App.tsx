import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectListView } from './components/project/ProjectListView';
import { ProjectDetailView } from './components/project/ProjectDetailView';
import { AttentionRequiredView } from './components/attention/AttentionRequiredView';
import { CentralizedPendingWorksView } from './components/pending/CentralizedPendingWorksView';
import { SiteReadinessOverview } from './components/site/SiteReadinessOverview';
import { ApprovalsCenterView } from './components/commercial/ApprovalsCenterView';
import { CreateProjectModal } from './components/project/CreateProjectModal';
import { DatabaseManagerView } from './components/database/DatabaseManagerView';
import { StageProcessView } from './components/views/StageProcessView';
import { FinanceView } from './components/views/FinanceView';
import { ServiceView } from './components/views/ServiceView';
import { ReportsView } from './components/views/ReportsView';
import { AdminView } from './components/views/AdminView';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('p1');
  const [initialProjectTab, setInitialProjectTab] = useState<string>('flow');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectProject = (projectId: string, tab: string = 'flow') => {
    setSelectedProjectId(projectId);
    setInitialProjectTab(tab);
    setCurrentView('project-detail');
  };

  const handleNavigate = (view: string) => {
    if (view === 'create-project') {
      setShowCreateModal(true);
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        onSelectProject={(pId) => handleSelectProject(pId, 'flow')}
        onNavigate={handleNavigate}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <ExecutiveDashboard
              onSelectProject={(pId) => handleSelectProject(pId, 'flow')}
              onNavigate={handleNavigate}
              onNewProject={() => setShowCreateModal(true)}
            />
          )}

          {currentView === 'attention' && (
            <AttentionRequiredView
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'flow')}
            />
          )}

          {currentView === 'projects' && (
            <ProjectListView
              onSelectProject={(pId) => handleSelectProject(pId, 'flow')}
              onNewProject={() => setShowCreateModal(true)}
            />
          )}

          {currentView === 'project-detail' && selectedProjectId && (
            <ProjectDetailView
              projectId={selectedProjectId}
              initialTab={initialProjectTab}
              onBack={() => setCurrentView('projects')}
            />
          )}

          {currentView === 'site-readiness' && (
            <SiteReadinessOverview
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'site')}
            />
          )}

          {currentView === 'pending-works' && (
            <CentralizedPendingWorksView
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'pending')}
            />
          )}

          {(currentView === 'approvals' || currentView === 'stage-approval') && (
            <ApprovalsCenterView
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'commercial')}
            />
          )}

          {currentView === 'database' && (
            <DatabaseManagerView />
          )}

          {/* Process Stage Views */}
          {currentView.startsWith('stage-') && currentView !== 'stage-approval' && (
            <StageProcessView
              stageKey={currentView}
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'flow')}
            />
          )}

          {/* Finance Views */}
          {(currentView === 'payments' || currentView === 'outstanding') && (
            <FinanceView
              viewId={currentView}
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'payments')}
            />
          )}

          {/* Service Views */}
          {(currentView === 'service-tickets' || currentView === 'warranty') && (
            <ServiceView
              viewId={currentView}
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'flow')}
            />
          )}

          {/* Reports & Documents Views */}
          {(currentView === 'documents' || currentView === 'reports') && (
            <ReportsView
              viewId={currentView}
              onSelectProject={(pId, tab) => handleSelectProject(pId, tab || 'flow')}
            />
          )}

          {/* System Administration Views */}
          {(currentView === 'users' || currentView === 'departments' || currentView === 'audit-logs' || currentView === 'settings') && (
            <AdminView
              viewId={currentView as 'users' | 'departments' | 'audit-logs' | 'settings'}
            />
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newId) => handleSelectProject(newId, 'flow')}
      />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
