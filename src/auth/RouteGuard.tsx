import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import type { UserRole } from '../types';
import { routeAccess, roleLabels, roleColors, defaultRoute } from './permissions';

// ============================================================
// ACCESS DENIED PAGE
// ============================================================
function AccessDenied({ role, path }: { role: UserRole; path: string }) {
  const navigate = useNavigate();
  const color = roleColors[role];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-sm">
            <ShieldOff size={36} className="text-rose-500" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#101820]">Access Restricted</h1>
          <p className="text-[#555E68] text-sm leading-relaxed">
            You do not have permission to access this page.
          </p>
        </div>

        {/* Role badge */}
        <div className="flex justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${color.bg} ${color.text} ${color.border} text-sm font-semibold`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-70" />
            Logged in as: {roleLabels[role]}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] text-left space-y-2">
          <p className="text-xs font-semibold text-[#101820] uppercase tracking-wider">Restricted Page</p>
          <p className="text-sm font-mono text-[#555E68] break-all">{path}</p>
          <p className="text-xs text-[#8E9CA8] mt-2">
            This area is not part of your role's workflow. If you believe this is an error, 
            please contact your system administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E8E5E0] rounded-[10px] text-sm font-semibold text-[#101820] hover:bg-[#F6F5F2] transition-colors"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <button
            onClick={() => navigate(defaultRoute[role])}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F4511E] rounded-[10px] text-sm font-bold text-white hover:bg-[#D84315] shadow-sm transition-colors"
          >
            <Home size={15} />
            My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROUTE GUARD
// Wraps a page component and checks if current role has access.
// ============================================================
interface RouteGuardProps {
  role: UserRole;
  path: string;
  children: React.ReactNode;
}

export function RouteGuard({ role, path, children }: RouteGuardProps) {
  const allowed = routeAccess[path];
  // If path not in routeAccess, default to allow (e.g. /vehicles/:id)
  if (!allowed || allowed.includes(role)) {
    return <>{children}</>;
  }
  return <AccessDenied role={role} path={path} />;
}

// ============================================================
// VEHICLE DETAIL GUARD
// Vehicle detail pages have dynamic IDs — check by vehicle type
// ============================================================
export function VehicleDetailGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  // Admins, Planners, Management can see any vehicle detail
  // Plant operators see vehicles at-plant, Warehouse operators see vehicles at-warehouse
  // We allow all roles to view vehicle detail (content is filtered inside the page)
  const allowedRoles: UserRole[] = ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'];
  if (allowedRoles.includes(role)) return <>{children}</>;
  return <AccessDenied role={role} path="/vehicles/:id" />;
}
