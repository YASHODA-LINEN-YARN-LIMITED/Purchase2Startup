import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Table as TableIcon,
  Layers,
  Search,
  UploadCloud,
  DownloadCloud,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Flame,
  Server,
  Code2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { firebaseConfig } from '../../lib/firebase';
import { SCHEMA_TABLES } from '../../data/schemaDefinitions';

export const DatabaseManagerView: React.FC = () => {
  const {
    projects,
    customers,
    requests,
    quotations,
    negotiations,
    workOrders,
    qcInspections,
    pendingTasks,
    serviceTickets,
    auditLogs,
    firebaseSyncStatus,
    pushAllToFirestore,
    pullAllFromFirestore,
  } = useData();

  const [activeTab, setActiveTab] = useState<'collections' | 'sync' | 'info'>('collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTable, setExpandedTable] = useState<string | null>('projects');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePushData = async () => {
    setSyncFeedback(null);
    const res = await pushAllToFirestore();
    setSyncFeedback(res);
  };

  const handlePullData = async () => {
    setSyncFeedback(null);
    const res = await pullAllFromFirestore();
    setSyncFeedback(res);
  };

  const categories = [
    'All',
    'Core Master',
    'Commercial & Quotations',
    'Engineering & Production',
    'Site & Installation',
    'Governance & Service',
  ];

  const getCollectionRecordCount = (colName: string): number => {
    switch (colName) {
      case 'projects':
        return projects.length;
      case 'customers':
        return customers.length;
      case 'requests':
        return requests.length;
      case 'quotations':
        return quotations.length;
      case 'negotiations':
        return negotiations.length;
      case 'work_orders':
        return workOrders.length;
      case 'qc_inspections':
        return qcInspections.length;
      case 'pending_tasks':
        return pendingTasks.length;
      case 'service_tickets':
        return serviceTickets.length;
      case 'audit_logs':
        return auditLogs.length;
      default:
        return 0;
    }
  };

  const filteredTables = SCHEMA_TABLES.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Firebase Firestore Database & Persistence Center
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Firestore Connected
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Real-time Firebase Firestore database backing all 30 normalized machine procurement collections, project lifecycle documents, and audit logs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePushData}
              disabled={firebaseSyncStatus.isSyncing}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              {firebaseSyncStatus.isSyncing ? 'Syncing...' : 'Sync All to Firestore'}
            </button>
            <button
              onClick={handlePullData}
              disabled={firebaseSyncStatus.isSyncing}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              {firebaseSyncStatus.isSyncing ? 'Fetching...' : 'Reload From Firestore'}
            </button>
          </div>
        </div>

        {/* Firebase Config Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Firebase Project ID
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-mono text-slate-800 truncate select-all">
                {firebaseConfig.projectId || 'gen-lang-client-0214187863'}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(firebaseConfig.projectId || 'gen-lang-client-0214187863', 'projectId')
                }
                className="text-slate-400 hover:text-slate-600 ml-2"
                title="Copy Project ID"
              >
                {copiedType === 'projectId' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Firestore Database ID
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-mono text-slate-800 truncate">
                ai-studio-machinepurchaset-e7af497f
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Firestore Sync & Rules Status
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center text-sm font-medium text-emerald-700">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                Firestore Rules Deployed & Ready
              </span>
              {firebaseSyncStatus.lastSyncTime && (
                <span className="text-xs text-slate-400 font-mono">
                  ({firebaseSyncStatus.lastSyncTime})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            syncFeedback.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {syncFeedback.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
            <span className="text-sm font-medium">{syncFeedback.message}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('collections')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'collections'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Firestore Collections & Schemas ({SCHEMA_TABLES.length} Collections)</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'sync'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Real-time Sync Operations</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'info'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Firebase Project Architecture</span>
        </button>
      </div>

      {/* TAB 1: COLLECTIONS & SCHEMAS */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections or fields (e.g. project_number, quotation_date, capacity)..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTables.map((table) => {
              const isExpanded = expandedTable === table.name;
              const count = getCollectionRecordCount(table.name);

              return (
                <div
                  key={table.name}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition"
                >
                  <div
                    onClick={() => setExpandedTable(isExpanded ? null : table.name)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition select-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold text-slate-900">{table.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {table.displayName}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                            {table.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{table.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {count > 0 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {count} Records Live
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {table.columns.length} Fields
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {table.stage}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                            <tr>
                              <th className="px-3 py-2.5">Field Name</th>
                              <th className="px-3 py-2.5">Document Data Type</th>
                              <th className="px-3 py-2.5">Constraints</th>
                              <th className="px-3 py-2.5">Description & Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {table.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-slate-50/50">
                                <td className="px-3 py-2 font-mono font-semibold text-slate-900 flex items-center space-x-1.5">
                                  <span>{col.name}</span>
                                  {col.primaryKey && (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                      Document ID
                                    </span>
                                  )}
                                  {col.foreignKey && (
                                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-medium px-1.5 py-0.2 rounded">
                                      Ref &rarr; {col.foreignKey}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 font-mono text-amber-700">{col.type}</td>
                                <td className="px-3 py-2">
                                  {col.nullable === false ? (
                                    <span className="text-rose-600 font-medium">Required</span>
                                  ) : (
                                    <span className="text-slate-400">Optional</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-slate-600">{col.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SYNC OPERATIONS */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Sync App Data &rarr; Firebase Firestore</h3>
                    <p className="text-xs text-slate-500">
                      Persist all current projects, customer masters, quotations, and site readiness records to Firestore
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-1 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p>&bull; <strong>{projects.length}</strong> Machine Projects ready to persist</p>
                  <p>&bull; <strong>{customers.length}</strong> Industrial Clients</p>
                  <p>&bull; <strong>{pendingTasks.length}</strong> Punchlist & Pending Tasks</p>
                </div>
              </div>

              <button
                onClick={handlePushData}
                disabled={firebaseSyncStatus.isSyncing}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                {firebaseSyncStatus.isSyncing ? 'Syncing...' : 'Sync All Records to Firestore'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <DownloadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Reload Firebase Firestore &rarr; App State</h3>
                    <p className="text-xs text-slate-500">Fetch latest document snapshots directly from Firebase Firestore</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-1 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p>&bull; Last sync time: <strong>{firebaseSyncStatus.lastSyncTime || 'Active'}</strong></p>
                  <p>&bull; Connection status: <strong>{firebaseSyncStatus.isConnected ? 'Online & Live' : 'Offline'}</strong></p>
                  <p>&bull; Security rules: <strong>firestore.rules Deployed</strong></p>
                </div>
              </div>

              <button
                onClick={handlePullData}
                disabled={firebaseSyncStatus.isSyncing}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4 mr-2" />
                {firebaseSyncStatus.isSyncing ? 'Fetching...' : 'Fetch Latest Documents'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT INFO */}
      {activeTab === 'info' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>Firebase Cloud Architecture Details</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Configuration details for the provisioned Firebase project and Firestore database instance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Project ID</span>
              <p className="text-sm font-mono text-slate-800 font-bold mt-1">
                {firebaseConfig.projectId || 'gen-lang-client-0214187863'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Database ID</span>
              <p className="text-sm font-mono text-slate-800 font-bold mt-1">
                ai-studio-machinepurchaset-e7af497f-862a-4856-8c94-01b78950aa36
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Auth Domain</span>
              <p className="text-sm font-mono text-slate-800 font-bold mt-1">
                {firebaseConfig.authDomain || 'gen-lang-client-0214187863.firebaseapp.com'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Storage Bucket</span>
              <p className="text-sm font-mono text-slate-800 font-bold mt-1">
                {firebaseConfig.storageBucket || 'gen-lang-client-0214187863.firebasestorage.app'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
