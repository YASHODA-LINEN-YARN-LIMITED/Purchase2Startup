import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Table as TableIcon,
  Code2,
  Server,
  Layers,
  Search,
  UploadCloud,
  DownloadCloud,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  KeyRound,
  Settings2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
  projectRef,
  testSupabaseConnection,
  ConnectionTestResult,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  getStoredSupabaseUrl,
  getStoredSupabaseKey,
} from '../../lib/supabase';
import { SCHEMA_TABLES, COMPLETE_SCHEMA_SQL, COMPLETE_SEED_SQL, TableDefinition } from '../../data/schemaDefinitions';

export const DatabaseManagerView: React.FC = () => {
  const {
    projects,
    customers,
    pendingTasks,
    supabaseSyncStatus,
    pushLocalToSupabase,
    pullSupabaseToLocal,
    checkTablesStatus,
  } = useData();

  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'seed' | 'sync' | 'config'>('tables');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTable, setExpandedTable] = useState<string | null>('projects');
  const [copiedType, setCopiedType] = useState<'schema' | 'seed' | 'url' | null>(null);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Custom credentials state
  const [inputUrl, setInputUrl] = useState(getStoredSupabaseUrl() || '');
  const [inputKey, setInputKey] = useState(getStoredSupabaseKey() || '');
  const [configMsg, setConfigMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const runConnectionTest = async () => {
    setIsTesting(true);
    setSyncFeedback(null);
    try {
      const activeUrl = getStoredSupabaseUrl();
      const activeKey = getStoredSupabaseKey();
      const res = await testSupabaseConnection(activeUrl, activeKey);
      setTestResult(res);
      await checkTablesStatus();
    } catch (err: any) {
      setTestResult({
        connected: false,
        tablesFound: false,
        missingTables: [],
        existingTables: [],
        latencyMs: 0,
        error: err.message,
        projectUrl: getStoredSupabaseUrl(),
        projectRef: projectRef,
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      setConfigMsg({ type: 'error', text: 'Please enter both Supabase Project URL and Anon Public Key.' });
      return;
    }

    try {
      saveSupabaseCredentials(inputUrl.trim(), inputKey.trim());
      setConfigMsg({ type: 'success', text: 'Supabase credentials saved successfully!' });
      await runConnectionTest();
      setTimeout(() => setConfigMsg(null), 3500);
    } catch (err: any) {
      setConfigMsg({ type: 'error', text: err.message || 'Failed to save credentials' });
    }
  };

  const handleResetCredentials = async () => {
    clearSupabaseCredentials();
    setInputUrl('');
    setInputKey('');
    setConfigMsg({ type: 'success', text: 'Credentials reset to defaults.' });
    await runConnectionTest();
    setTimeout(() => setConfigMsg(null), 3500);
  };

  const copyToClipboard = (text: string, type: 'schema' | 'seed' | 'url') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePushData = async () => {
    setSyncFeedback(null);
    const activeUrl = getStoredSupabaseUrl();
    const activeKey = getStoredSupabaseKey();

    if (!activeUrl || !activeKey || activeUrl.includes('your-project')) {
      setActiveTab('config');
      setSyncFeedback({
        success: false,
        message: 'Please configure your Supabase Project URL and Anon Public Key below before pushing data.',
      });
      return;
    }

    const res = await pushLocalToSupabase();
    setSyncFeedback(res);
    runConnectionTest();
  };

  const handlePullData = async () => {
    setSyncFeedback(null);
    const activeUrl = getStoredSupabaseUrl();
    const activeKey = getStoredSupabaseKey();

    if (!activeUrl || !activeKey || activeUrl.includes('your-project')) {
      setActiveTab('config');
      setSyncFeedback({
        success: false,
        message: 'Please configure your Supabase Project URL and Anon Public Key below before fetching data.',
      });
      return;
    }

    const res = await pullSupabaseToLocal();
    setSyncFeedback(res);
    runConnectionTest();
  };

  // Filtered tables
  const categories = ['All', 'Core Master', 'Commercial & Quotations', 'Engineering & Production', 'Site & Installation', 'Governance & Service'];

  const filteredTables = SCHEMA_TABLES.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeRef = projectRef || 'mplutsdsmkmioyrkroez';

  const sqlEditorUrl = activeRef
    ? `https://supabase.com/dashboard/project/${activeRef}/sql`
    : 'https://supabase.com/dashboard';

  const tableEditorUrl = activeRef
    ? `https://supabase.com/dashboard/project/${activeRef}/editor`
    : 'https://supabase.com/dashboard';

  const currentConfigured = Boolean(getStoredSupabaseUrl() && getStoredSupabaseKey() && !getStoredSupabaseUrl().includes('your-project'));

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supabase Live Database & Schema Center</h1>
                {currentConfigured ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Credentials Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Credentials Needed
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Full PostgreSQL relational schema, normalized tables, field specifications, and live two-way synchronization engine.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('config')}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <KeyRound className="w-4 h-4 mr-1.5 text-slate-600" />
              Configure Credentials
            </button>
            <button
              onClick={runConnectionTest}
              disabled={isTesting}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isTesting ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              {isTesting ? 'Testing Connection...' : 'Test Connection'}
            </button>
            <a
              href={sqlEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open Supabase SQL Editor
            </a>
          </div>
        </div>

        {/* Credentials Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Supabase Project URL</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-mono text-slate-800 truncate select-all">{getStoredSupabaseUrl() || 'Not configured'}</span>
              {getStoredSupabaseUrl() && (
                <button
                  onClick={() => copyToClipboard(getStoredSupabaseUrl(), 'url')}
                  className="text-slate-400 hover:text-slate-600 ml-2"
                  title="Copy URL"
                >
                  {copiedType === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Anon Public Key</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-mono text-slate-800">
                {getStoredSupabaseKey() ? `${getStoredSupabaseKey().substring(0, 12)}••••••••••••${getStoredSupabaseKey().slice(-6)}` : 'Not configured'}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Database Tables Status</span>
            <div className="flex items-center space-x-2 mt-1">
              {testResult?.connected || testResult?.tablesFound || supabaseSyncStatus.tablesReady ? (
                <span className="inline-flex items-center text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  Live Tables Connected & Active
                </span>
              ) : (
                <span className="inline-flex items-center text-sm font-medium text-amber-700">
                  <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                  {testResult?.error ? 'Connection / Schema Issue' : 'Setup Credentials / Tables'}
                </span>
              )}
              {testResult?.latencyMs ? (
                <span className="text-xs text-slate-400 font-mono">({testResult.latencyMs}ms)</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Action Guidance if Tables Need Setup or Credentials missing */}
      {(!currentConfigured || (!testResult?.tablesFound && !supabaseSyncStatus.tablesReady)) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-blue-900">
                Complete Your Live Supabase Database Setup (30 Seconds)
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                To create all 30 PostgreSQL tables, relations, and fields in your Supabase project:
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-blue-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase">Step 1</span>
                    <p className="text-sm font-medium text-slate-800">Copy full migration SQL script</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(COMPLETE_SCHEMA_SQL, 'schema')}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition"
                  >
                    {copiedType === 'schema' ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy SQL
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-lg border border-blue-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase">Step 2</span>
                    <p className="text-sm font-medium text-slate-800">Paste in Supabase SQL Editor & click RUN</p>
                  </div>
                  <a
                    href={sqlEditorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Open Editor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Feedback Toast if any */}
      {syncFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            syncFeedback.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {syncFeedback.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
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
          onClick={() => setActiveTab('tables')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'tables'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Tables & Schema Explorer ({SCHEMA_TABLES.length} Tables)</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'config'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Connection Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Full Migration SQL Script</span>
        </button>

        <button
          onClick={() => setActiveTab('seed')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'seed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Machine Seed Dataset SQL</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`pb-3 text-sm font-medium border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
            activeTab === 'sync'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Live Two-Way Sync Studio</span>
        </button>
      </div>

      {/* TAB: CONFIG CREDENTIALS */}
      {activeTab === 'config' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <span>Configure Supabase Project Credentials</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Enter or update your project's REST API URL and Anon Public Key from your Supabase Dashboard &gt; Project Settings &gt; API.
            </p>
          </div>

          {configMsg && (
            <div
              className={`p-4 rounded-lg border text-sm font-medium flex items-center space-x-2 ${
                configMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {configMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{configMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Example: <code>https://mplutsdsmkmioyrkroez.supabase.co</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Supabase Anon Public API Key
              </label>
              <textarea
                rows={3}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Credentials & Connect
              </button>

              <button
                type="button"
                onClick={handleResetCredentials}
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: TABLES & SCHEMA EXPLORER */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables, fields (e.g. project_number, quotation_date, capacity)..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tables List */}
          <div className="space-y-3">
            {filteredTables.map((table) => {
              const isExpanded = expandedTable === table.name;
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
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {table.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{table.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400">
                        {table.columns.length} columns / fields
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
                              <th className="px-3 py-2.5">Field / Column Name</th>
                              <th className="px-3 py-2.5">PostgreSQL Type</th>
                              <th className="px-3 py-2.5">Constraints</th>
                              <th className="px-3 py-2.5">Default</th>
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
                                      PK
                                    </span>
                                  )}
                                  {col.foreignKey && (
                                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-medium px-1.5 py-0.2 rounded">
                                      FK &rarr; {col.foreignKey}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 font-mono text-blue-700">{col.type}</td>
                                <td className="px-3 py-2">
                                  {col.nullable === false ? (
                                    <span className="text-rose-600 font-medium">NOT NULL</span>
                                  ) : (
                                    <span className="text-slate-400">NULL</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 font-mono text-slate-500">{col.defaultValue || '-'}</td>
                                <td className="px-3 py-2 text-slate-600">{col.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>Row Level Security: Enabled (Full anon/authenticated read-write permitted)</span>
                        <a
                          href={`${tableEditorUrl}?table=${table.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Table in Supabase Dashboard
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FULL MIGRATION SQL */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">0001_initial_schema.sql (Production DDL)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contains all 30 table definitions, indexes, relations, UUID defaults, and open access RLS policies.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(COMPLETE_SCHEMA_SQL, 'schema')}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  {copiedType === 'schema' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Complete SQL
                    </>
                  )}
                </button>
                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open SQL Editor
                </a>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed select-all">
                {COMPLETE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MACHINE SEED DATASET */}
      {activeTab === 'seed' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">seed.sql (Initial Machines & Industrial Clients)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Populates 5 enterprise customers and 10 realistic machine packages across Stenters, Dyeing Vessels, Sizing Machines, and Calenders.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(COMPLETE_SEED_SQL, 'seed')}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  {copiedType === 'seed' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied Seed Data!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Seed SQL
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed select-all">
                {COMPLETE_SEED_SQL}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TWO-WAY SYNC STUDIO */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Push Local to Supabase */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Push App Data &rarr; Supabase Live DB</h3>
                    <p className="text-xs text-slate-500">Synchronize local machines, customers, and punchlist tasks to Supabase</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-1 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p>&bull; <strong>{projects.length}</strong> Machine Packages ready to push</p>
                  <p>&bull; <strong>{customers.length}</strong> Industrial Clients</p>
                  <p>&bull; <strong>{pendingTasks.length}</strong> Punchlist & Pending items</p>
                </div>
              </div>

              <button
                onClick={handlePushData}
                disabled={supabaseSyncStatus.isSyncing}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                {supabaseSyncStatus.isSyncing ? 'Synchronizing...' : 'Push All Data to Supabase'}
              </button>
            </div>

            {/* Pull Supabase to Local */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <DownloadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Pull Supabase Live DB &rarr; App</h3>
                    <p className="text-xs text-slate-500">Fetch latest cloud records from your Supabase PostgreSQL database</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-1 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p>&bull; Last cloud sync: <strong>{supabaseSyncStatus.lastSyncTime || 'Never'}</strong></p>
                  <p>&bull; Real-time status: <strong>{supabaseSyncStatus.isConnected ? 'Connected' : 'Offline'}</strong></p>
                  <p>&bull; Tables ready: <strong>{supabaseSyncStatus.tablesReady ? 'Yes' : 'Pending SQL Execution'}</strong></p>
                </div>
              </div>

              <button
                onClick={handlePullData}
                disabled={supabaseSyncStatus.isSyncing}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4 mr-2" />
                {supabaseSyncStatus.isSyncing ? 'Fetching...' : 'Fetch Latest Cloud Records'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

