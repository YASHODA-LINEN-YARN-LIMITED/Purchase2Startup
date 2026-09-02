import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  User,
  ChevronDown,
  Database,
  ExternalLink,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { UserRole } from '../../types';

interface NavbarProps {
  onSelectProject?: (projectId: string) => void;
  onOpenGlobalSearch?: () => void;
  onNavigate?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectProject, onNavigate }) => {
  const { currentUser, availableUsers, switchUser, switchRole } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, projects } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Search across projects, customers, machines, and numbers
  const filteredProjects = searchQuery.trim()
    ? projects.filter(
        (p) =>
          p.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.machineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.machineModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.projectManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.salesPerson.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const roles: UserRole[] = [
    'SUPER_ADMIN',
    'MANAGEMENT',
    'SALES',
    'COMMERCIAL',
    'TECHNICAL',
    'PRODUCTION',
    'QUALITY',
    'PROJECT',
    'SERVICE',
    'VIEWER',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate?.('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold text-base tracking-wider">
              YLY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 tracking-tight text-base">
                  Yashoda Linen & Yarn Ltd.
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  P2S Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Mill Machinery Purchase to Start-up Lifecycle</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="relative flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Global Search (Project #, Customer, Machine, PO #, Person)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Matching Projects ({filteredProjects.length})</span>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredProjects.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No matching records found for "{searchQuery}"
                  </div>
                ) : (
                  filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProject?.(p.id);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600 text-xs">
                          {p.projectNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {p.currentStage.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-900 mt-0.5">
                        {p.projectName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span>{p.customerName}</span>
                        <span>•</span>
                        <span>{p.machineModel}</span>
                        <span>•</span>
                        <span>PM: {p.projectManager}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase Status Indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700"
            title={
              isSupabaseConfigured
                ? 'Connected to configured Supabase Project'
                : 'Using Local Storage & In-Memory Data Store (Configure Supabase credentials in .env to connect live backend)'
            }
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'P2S Data Ready'}</span>
          </div>

          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
              title="Switch role to preview role-based permissions"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  Role: {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {unreadNotifications.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.projectId) {
                            onSelectProject?.(n.projectId);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === 'error' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          ) : n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 text-left rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden xl:block text-xs">
                <div className="font-semibold text-slate-900 truncate max-w-[130px]">
                  {currentUser.fullName}
                </div>
                <div className="text-slate-500 truncate">{currentUser.department}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 text-sm">{currentUser.fullName}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                      {currentUser.role}
                    </span>
                    <span className="text-xs text-slate-500">{currentUser.department}</span>
                  </div>
                </div>

                <div className="p-2 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Switch Personnel
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                          u.id === currentUser.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{u.fullName}</span>
                        <span className="text-[10px] text-slate-400">{u.role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      onNavigate?.('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    System Settings & Stage Weights
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
