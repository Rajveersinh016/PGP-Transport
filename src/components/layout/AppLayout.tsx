import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Package, MapPin, Users, BarChart2, Settings, ChevronLeft,
  ChevronRight, AlertTriangle, ClipboardList, Navigation, Warehouse, Factory,
  UserCheck, Building2, FileText, History, Shield, Database, Bell, Search,
  Plus, ChevronDown, RefreshCw, Menu, X, TrendingUp, HelpCircle, LogIn,
  CheckCircle2, Info
} from 'lucide-react';
import { useApp, useUnreadNotifications } from '../../context/AppContext';
import { StatusBadge } from '../ui';
import type { UserRole } from '../../types';
import { roleLabels, roleColors, roleAssignment } from '../../auth/permissions';
import { hasPermission } from '../../auth/permissions';

// ============================================================
// NAV ITEM TYPE
// ============================================================
interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  badge?: number;
  section?: string;
}

// ============================================================
// ROLE-SPECIFIC NAVIGATION
// ============================================================
function getRoleNav(role: UserRole): Array<{ section?: string; items: NavItem[] }> {
  switch (role) {
    // ── ADMIN ───────────────────────────────────────────────
    case 'ADMIN':
      return [
        {
          items: [
            { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
          ]
        },
        {
          section: 'Operations',
          items: [
            { label: 'Active Transit', path: '/transit', icon: <Navigation size={16} /> },
            { label: 'Transport Requests', path: '/requests', icon: <ClipboardList size={16} /> },
            { label: 'Vehicle Assignment', path: '/assignment', icon: <UserCheck size={16} /> },
            { label: 'All Vehicles', path: '/vehicles', icon: <Truck size={16} /> },
            { label: 'Empty Vehicles', path: '/vehicles/empty', icon: <Package size={16} /> },
            { label: 'Exceptions', path: '/exceptions', icon: <AlertTriangle size={16} /> },
          ]
        },
        {
          section: 'Masters',
          items: [
            { label: 'Plants', path: '/plants', icon: <Factory size={16} /> },
            { label: 'Warehouses', path: '/warehouses', icon: <Warehouse size={16} /> },
            { label: 'Drivers', path: '/drivers', icon: <Users size={16} /> },
            { label: 'Transporters', path: '/transporters', icon: <Building2 size={16} /> },
          ]
        },
        {
          section: 'Reports',
          items: [
            { label: 'Performance', path: '/reports/performance', icon: <TrendingUp size={16} /> },
            { label: 'Vehicle Utilization', path: '/reports/utilization', icon: <Truck size={16} /> },
            { label: 'Warehouse Report', path: '/reports/warehouse', icon: <Warehouse size={16} /> },
            { label: 'Trip History', path: '/reports/history', icon: <History size={16} /> },
          ]
        },
        {
          section: 'Administration',
          items: [
            { label: 'Users & Roles', path: '/admin/users', icon: <Users size={16} /> },
            { label: 'Master Data', path: '/admin/master', icon: <Database size={16} /> },
            { label: 'Audit Log', path: '/admin/audit', icon: <FileText size={16} /> },
            { label: 'Settings', path: '/admin/settings', icon: <Settings size={16} /> },
          ]
        },
        {
          items: [
            { label: 'Help & Manual', path: '/help', icon: <HelpCircle size={16} /> },
          ]
        },
      ];

    // ── TRANSPORT PLANNER ───────────────────────────────────
    case 'TRANSPORT_PLANNER':
      return [
        {
          items: [
            { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
          ]
        },
        {
          section: 'Planning',
          items: [
            { label: 'Transport Requests', path: '/requests', icon: <ClipboardList size={16} /> },
            { label: 'Vehicle Assignment', path: '/assignment', icon: <UserCheck size={16} /> },
            { label: 'Active Transit', path: '/transit', icon: <Navigation size={16} /> },
          ]
        },
        {
          section: 'Vehicles',
          items: [
            { label: 'All Vehicles', path: '/vehicles', icon: <Truck size={16} /> },
            { label: 'Empty / Available', path: '/vehicles/empty', icon: <Package size={16} /> },
          ]
        },
        {
          section: 'Monitor',
          items: [
            { label: 'Exceptions', path: '/exceptions', icon: <AlertTriangle size={16} /> },
            { label: 'Reports', path: '/reports/performance', icon: <BarChart2 size={16} /> },
            { label: 'Trip History', path: '/reports/history', icon: <History size={16} /> },
          ]
        },
        {
          items: [
            { label: 'Help & Manual', path: '/help', icon: <HelpCircle size={16} /> },
          ]
        },
      ];

    // ── PLANT OPERATOR ──────────────────────────────────────
    case 'PLANT_OPERATOR':
      return [
        {
          items: [
            { label: 'My Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
          ]
        },
        {
          section: 'Operations',
          items: [
            { label: "Today's Vehicles", path: '/vehicles/at-plant', icon: <Truck size={16} /> },
            { label: 'Exceptions', path: '/exceptions', icon: <AlertTriangle size={16} /> },
          ]
        },
        {
          items: [
            { label: 'Help', path: '/help', icon: <HelpCircle size={16} /> },
          ]
        },
      ];

    // ── WAREHOUSE OPERATOR ──────────────────────────────────
    case 'WAREHOUSE_OPERATOR':
      return [
        {
          items: [
            { label: 'My Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
          ]
        },
        {
          section: 'Operations',
          items: [
            { label: 'Incoming Vehicles', path: '/vehicles/at-warehouse', icon: <Truck size={16} /> },
            { label: 'Exceptions', path: '/exceptions', icon: <AlertTriangle size={16} /> },
          ]
        },
        {
          items: [
            { label: 'Help', path: '/help', icon: <HelpCircle size={16} /> },
          ]
        },
      ];

    // ── MANAGEMENT ──────────────────────────────────────────
    case 'MANAGEMENT':
    default:
      return [
        {
          items: [
            { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
          ]
        },
        {
          section: 'Overview',
          items: [
            { label: 'Active Transit', path: '/transit', icon: <Navigation size={16} /> },
            { label: 'All Vehicles', path: '/vehicles', icon: <Truck size={16} /> },
            { label: 'Exceptions', path: '/exceptions', icon: <AlertTriangle size={16} /> },
          ]
        },
        {
          section: 'Reports',
          items: [
            { label: 'Performance', path: '/reports/performance', icon: <TrendingUp size={16} /> },
            { label: 'Vehicle Utilization', path: '/reports/utilization', icon: <Truck size={16} /> },
            { label: 'Warehouse Report', path: '/reports/warehouse', icon: <Warehouse size={16} /> },
            { label: 'Trip History', path: '/reports/history', icon: <History size={16} /> },
            { label: 'Audit Log', path: '/admin/audit', icon: <FileText size={16} /> },
          ]
        },
        {
          items: [
            { label: 'Help', path: '/help', icon: <HelpCircle size={16} /> },
          ]
        },
      ];
  }
}

// ============================================================
// SINGLE NAV ITEM BUTTON
// ============================================================
function NavItemButton({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = item.path && location.pathname === item.path;

  return (
    <button
      onClick={() => item.path && navigate(item.path)}
      title={collapsed ? item.label : undefined}
      id={`nav-${(item.label || '').replace(/\s+/g, '-').toLowerCase()}`}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150
        ${isActive
          ? 'bg-[#F4511E] text-white shadow-sm font-semibold'
          : 'text-[#8E9CA8] hover:bg-[#17232B] hover:text-white'}`}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ collapsed, onToggle, onRoleChange }: {
  collapsed: boolean;
  onToggle: () => void;
  onRoleChange: (role: UserRole, name: string) => void;
}) {
  const { state, switchRole, resetDemo } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const currentRole = state.settings.currentRole;
  const navGroups = getRoleNav(currentRole);
  const roles: UserRole[] = ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'];
  const color = roleColors[currentRole];

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
    onRoleChange(role, roleLabels[role]);
  };

  return (
    <aside
      className={`flex-shrink-0 flex flex-col bg-[#101820] text-white transition-all duration-200 h-screen sticky top-0 z-40 border-r border-[#17232B]
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-[#17232B] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-[10px] bg-[#F4511E] flex items-center justify-center flex-shrink-0 shadow-sm">
          <Truck size={17} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1">
              Transit<span className="text-[#F4511E]">Flow</span>
            </div>
            <div className="text-[10px] text-[#8E9CA8] tracking-wider uppercase font-semibold">Visibility Control</div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`${collapsed ? 'hidden' : 'ml-auto'} text-[#8E9CA8] hover:text-white transition-colors p-1 rounded hover:bg-[#17232B]`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <button onClick={onToggle} className="p-3 flex justify-center text-[#8E9CA8] hover:text-white" aria-label="Expand sidebar">
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation — role-specific */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-2' : ''}>
            {/* Section header */}
            {group.section && !collapsed && (
              <div className="px-3 py-1.5 text-[10px] text-[#8E9CA8]/60 uppercase tracking-widest font-bold">
                {group.section}
              </div>
            )}
            {group.section && collapsed && (
              <div className="my-1 mx-3 h-px bg-[#17232B]" />
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItemButton key={item.label} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Prototype Role Switcher */}
      {!collapsed && (
        <div className="px-3 py-2.5 mx-2.5 mb-2 bg-[#17232B] border border-[#101820] rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Prototype Role Switcher</span>
            </div>
          </div>
          <button
            id="role-switcher-btn"
            onClick={() => setShowRoleMenu(m => !m)}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${color.bg} ${color.text} ${color.border}`}
          >
            <span>{roleLabels[currentRole]}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="mt-1.5 bg-[#101820] rounded-lg border border-[#17232B] overflow-hidden shadow-xl">
              {roles.map(role => {
                const rc = roleColors[role];
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center gap-2
                      ${currentRole === role ? `${rc.text} ${rc.bg} font-bold` : 'text-[#8E9CA8] hover:bg-[#17232B] hover:text-white'}`}
                  >
                    {currentRole === role && <CheckCircle2 size={12} />}
                    {roleLabels[role]}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={resetDemo}
            className="mt-2 flex items-center gap-1.5 text-[11px] text-[#8E9CA8] hover:text-[#F4511E] transition-colors font-medium w-full"
            id="reset-demo-btn"
          >
            <RefreshCw size={11} /> Reset Demo Data
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-[#17232B] p-3 bg-[#101820]">
        <div className={`flex items-center gap-3 rounded-[10px] p-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-8 h-8 rounded-[10px] border flex items-center justify-center flex-shrink-0 text-xs font-bold ${roleColors[currentRole].bg} ${roleColors[currentRole].text} ${roleColors[currentRole].border}`}>
            {state.settings.currentUser.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs font-semibold text-white truncate">{state.settings.currentUser}</div>
              <div className="text-[10px] text-[#8E9CA8] truncate">{roleLabels[currentRole]}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// ROLE CONTEXT BANNER (for Plant / Warehouse operators)
// ============================================================
function RoleContextBanner({ role }: { role: UserRole }) {
  const assignment = roleAssignment[role];
  if (!assignment) return null;

  const color = roleColors[role];

  return (
    <div className={`${color.bg} ${color.border} border-b px-6 py-2 flex items-center gap-3`}>
      <Info size={14} className={color.text} />
      <span className={`text-xs font-semibold ${color.text}`}>
        Logged in as: <strong>{roleLabels[role]}</strong>
        &nbsp;·&nbsp;
        {assignment.type}: <strong>{assignment.name}</strong>
      </span>
      <span className={`ml-auto text-[10px] ${color.text} opacity-60 font-medium uppercase tracking-wider`}>
        Operational View
      </span>
    </div>
  );
}

// ============================================================
// ROLE CHANGE TOAST
// ============================================================
function RoleChangeToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 bg-[#101820] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#17232B] animate-[slide-up_0.3s_ease]">
      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ onMobileMenu, searchQuery, onSearchChange }: {
  onMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
}) {
  const navigate = useNavigate();
  const { state, markAllRead } = useApp();
  const unread = useUnreadNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const currentRole = state.settings.currentRole;
  const canCreateRequest = hasPermission(currentRole, 'CREATE_REQUEST');
  const canViewSettings = hasPermission(currentRole, 'MANAGE_SETTINGS');
  const canViewAudit = hasPermission(currentRole, 'VIEW_AUDIT_LOG');

  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const q = searchQuery.trim().toLowerCase();
  const matchingVehicles = q ? state.vehicles.filter(v => v.vehicleNumber.toLowerCase().includes(q) || v.driverName.toLowerCase().includes(q)) : [];
  const matchingTrips = q ? state.trips.filter(t => t.id.toLowerCase().includes(q) || t.vehicleNumber.toLowerCase().includes(q)) : [];
  const matchingRequests = (q && canCreateRequest) ? state.requests.filter(r => r.id.toLowerCase().includes(q) || r.material.toLowerCase().includes(q)) : [];
  const totalMatches = matchingVehicles.length + matchingTrips.length + matchingRequests.length;

  const handleSearchSubmit = () => {
    if (matchingVehicles.length > 0) navigate(`/vehicles/${matchingVehicles[0].id}`);
    else if (matchingTrips.length > 0) navigate('/transit');
    else if (matchingRequests.length > 0) navigate(`/requests?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E5E0] h-16 flex items-center px-6 gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <button onClick={onMobileMenu} className="lg:hidden text-[#101820] hover:text-[#F4511E] p-1.5 rounded-lg hover:bg-[#F6F5F2]" aria-label="Open menu">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9CA8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchQuery && handleSearchSubmit()}
          placeholder="Search vehicles, trips, drivers..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E8E5E0] rounded-[10px] placeholder-[#8E9CA8] text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          aria-label="Global search"
        />
        {searchQuery.trim().length > 1 && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white border border-[#E8E5E0] rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
            <div className="px-4 py-2 bg-[#F6F5F2] border-b border-[#E8E5E0] flex justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-[#101820]">Results ({totalMatches})</span>
              <button onClick={() => onSearchChange('')} className="text-[#8E9CA8] hover:text-[#101820] font-bold">✕</button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-[#F0EDE8]">
              {matchingVehicles.slice(0, 4).map(v => (
                <button key={v.id} onClick={() => { navigate(`/vehicles/${v.id}`); onSearchChange(''); }}
                  className="w-full text-left p-3 hover:bg-[#FFF0E9]/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#101820] font-mono">{v.vehicleNumber}</div>
                    <div className="text-[11px] text-[#555E68]">{v.driverName}</div>
                  </div>
                  <span className="text-[10px] bg-[#FFF0E9] text-[#F4511E] font-bold px-2 py-0.5 rounded-full border border-[#FFE1D4]">Vehicle</span>
                </button>
              ))}
              {matchingRequests.slice(0, 3).map(r => (
                <button key={r.id} onClick={() => { navigate(`/requests?search=${r.id}`); onSearchChange(''); }}
                  className="w-full text-left p-3 hover:bg-[#FFF0E9]/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#101820] font-mono">{r.id}</div>
                    <div className="text-[11px] text-[#555E68]">{r.material} · {r.quantityMT} MT</div>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">Request</span>
                </button>
              ))}
              {totalMatches === 0 && (
                <div className="p-4 text-center text-[#8E9CA8] text-xs">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Date/time */}
      <div className="hidden md:block text-xs text-right leading-tight ml-auto pr-2">
        <div className="font-semibold text-[#101820]">{currentDate}</div>
        <div className="text-[#8E9CA8] mt-0.5">{currentTime}</div>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(n => !n); setShowProfile(false); }}
          className="relative p-2 text-[#101820] hover:text-[#F4511E] hover:bg-[#FFF0E9] rounded-[10px] transition-colors"
          aria-label={`Notifications — ${unread} unread`}
        >
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#F4511E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E8E5E0] rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EDE8] bg-[#F6F5F2]">
              <span className="text-xs font-bold text-[#101820] uppercase tracking-wider">Notifications</span>
              <button onClick={() => { markAllRead(); setShowNotifs(false); }} className="text-xs text-[#F4511E] hover:underline font-semibold">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {state.notifications.slice(0, 10).map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-[#F0EDE8] hover:bg-[#FFF0E9]/40 cursor-pointer ${!n.read ? 'bg-[#FFF0E9]/20' : ''}`}
                  onClick={() => { markAllRead(); setShowNotifs(false); if (n.link) navigate(n.link); }}>
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'SUCCESS' ? 'bg-emerald-500' : n.type === 'WARNING' ? 'bg-amber-500' : n.type === 'ERROR' ? 'bg-rose-500' : 'bg-[#F4511E]'}`} />
                    <div>
                      <p className="text-xs font-bold text-[#101820]">{n.title}</p>
                      <p className="text-xs text-[#555E68] mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-[#8E9CA8] mt-1">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              ))}
              {state.notifications.length === 0 && (
                <div className="py-8 text-center text-xs text-[#8E9CA8]">No notifications</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(p => !p); setShowNotifs(false); }}
          className="flex items-center gap-2.5 p-1.5 rounded-[10px] hover:bg-[#F6F5F2] transition-colors"
          aria-label="User profile"
        >
          <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-bold ${roleColors[currentRole].bg} ${roleColors[currentRole].text}`}>
            {state.settings.currentUser.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-[#101820]">{state.settings.currentUser}</div>
            <div className="text-[10px] text-[#8E9CA8] font-medium">{roleLabels[currentRole]}</div>
          </div>
          <ChevronDown size={14} className="text-[#8E9CA8] hidden sm:block" />
        </button>
        {showProfile && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E8E5E0] rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0EDE8] bg-[#F6F5F2]">
              <p className="text-xs font-bold text-[#101820]">{state.settings.currentUser}</p>
              <p className="text-[10px] text-[#8E9CA8] font-medium">{roleLabels[currentRole]}</p>
            </div>
            {canViewSettings && (
              <button onClick={() => { navigate('/admin/settings'); setShowProfile(false); }}
                className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#101820] hover:bg-[#FFF0E9] hover:text-[#F4511E] flex items-center gap-2 transition-colors">
                <Settings size={14} /> Settings
              </button>
            )}
            {canViewAudit && (
              <button onClick={() => { navigate('/admin/audit'); setShowProfile(false); }}
                className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#101820] hover:bg-[#FFF0E9] hover:text-[#F4511E] flex items-center gap-2 transition-colors">
                <FileText size={14} /> Audit Log
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Request button — only for roles that can create requests */}
      {canCreateRequest && (
        <button
          onClick={() => navigate('/requests?new=1')}
          id="btn-new-request"
          className="flex items-center gap-2 px-3.5 py-2 bg-[#F4511E] hover:bg-[#D84315] text-white text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-sm hover:shadow transition-all"
          aria-label="Create new transport request"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Request</span>
        </button>
      )}
    </header>
  );
}

// ============================================================
// LAYOUT
// ============================================================
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleToast, setRoleToast] = useState<string | null>(null);
  const { state } = useApp();

  const handleRoleChange = (_role: UserRole, name: string) => {
    setRoleToast(`Demo role changed to ${name}.`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFDFC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} onRoleChange={handleRoleChange} />
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-[#101820]/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-50 w-64 h-full">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} onRoleChange={handleRoleChange} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-3 text-[#8E9CA8] hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FFFDFC]">
        <Header
          onMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Context banner for operational roles */}
        <RoleContextBanner role={state.settings.currentRole} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#FFFDFC]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Role change toast */}
      {roleToast && (
        <RoleChangeToast message={roleToast} onDone={() => setRoleToast(null)} />
      )}
    </div>
  );
}
