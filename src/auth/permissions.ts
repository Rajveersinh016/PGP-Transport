// ============================================================
// CENTRAL PERMISSION SYSTEM — TransitFlow RBAC
// Single source of truth. DO NOT scatter role checks elsewhere.
// Use hasPermission(role, permission) or can(role, action) everywhere.
// ============================================================
import type { UserRole } from '../types';

// ---- All Granular Permissions ----
export type Permission =
  // Dashboard
  | 'VIEW_DASHBOARD'
  | 'VIEW_MANAGEMENT_DASHBOARD'
  | 'VIEW_PLANT_DASHBOARD'
  | 'VIEW_WAREHOUSE_DASHBOARD'
  // Requests
  | 'VIEW_REQUESTS'
  | 'CREATE_REQUEST'
  | 'CANCEL_REQUEST'
  // Vehicle Assignment
  | 'VIEW_ASSIGNMENT'
  | 'ASSIGN_VEHICLE'
  | 'REASSIGN_VEHICLE'
  // Vehicles
  | 'VIEW_ALL_VEHICLES'
  | 'VIEW_PLANT_VEHICLES'
  | 'VIEW_WAREHOUSE_VEHICLES'
  // Trip Actions — Plant side
  | 'ACTION_PLANT_ARRIVAL'
  | 'ACTION_START_LOADING'
  | 'ACTION_COMPLETE_LOADING'
  | 'ACTION_GATE_OUT'
  // Trip Actions — Warehouse side
  | 'ACTION_WAREHOUSE_ARRIVAL'
  | 'ACTION_START_UNLOADING'
  | 'ACTION_COMPLETE_UNLOADING'
  | 'ACTION_MARK_EMPTY'
  // Exceptions
  | 'VIEW_EXCEPTIONS'
  | 'RESOLVE_EXCEPTION'
  // Reports
  | 'VIEW_REPORTS'
  | 'VIEW_CHARTS'
  // Active Transit
  | 'VIEW_ACTIVE_TRANSIT'
  // Master Data
  | 'VIEW_PLANTS'
  | 'VIEW_WAREHOUSES'
  | 'VIEW_DRIVERS'
  | 'VIEW_TRANSPORTERS'
  | 'MANAGE_MASTER_DATA'
  // Administration
  | 'VIEW_USERS'
  | 'MANAGE_USERS'
  | 'VIEW_AUDIT_LOG'
  | 'VIEW_SETTINGS'
  | 'MANAGE_SETTINGS'
  // Notes
  | 'ADD_NOTE'
  | 'VIEW_NOTES'
  | 'EDIT_OWN_NOTE'
  | 'DELETE_ANY_NOTE';

// ---- Role → Permission Mapping ----
const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    'VIEW_DASHBOARD', 'VIEW_MANAGEMENT_DASHBOARD', 'VIEW_PLANT_DASHBOARD', 'VIEW_WAREHOUSE_DASHBOARD',
    'VIEW_REQUESTS', 'CREATE_REQUEST', 'CANCEL_REQUEST',
    'VIEW_ASSIGNMENT', 'ASSIGN_VEHICLE', 'REASSIGN_VEHICLE',
    'VIEW_ALL_VEHICLES', 'VIEW_PLANT_VEHICLES', 'VIEW_WAREHOUSE_VEHICLES',
    'ACTION_PLANT_ARRIVAL', 'ACTION_START_LOADING', 'ACTION_COMPLETE_LOADING', 'ACTION_GATE_OUT',
    'ACTION_WAREHOUSE_ARRIVAL', 'ACTION_START_UNLOADING', 'ACTION_COMPLETE_UNLOADING', 'ACTION_MARK_EMPTY',
    'VIEW_EXCEPTIONS', 'RESOLVE_EXCEPTION',
    'VIEW_REPORTS', 'VIEW_CHARTS', 'VIEW_ACTIVE_TRANSIT',
    'VIEW_PLANTS', 'VIEW_WAREHOUSES', 'VIEW_DRIVERS', 'VIEW_TRANSPORTERS', 'MANAGE_MASTER_DATA',
    'VIEW_USERS', 'MANAGE_USERS', 'VIEW_AUDIT_LOG', 'VIEW_SETTINGS', 'MANAGE_SETTINGS',
    'ADD_NOTE', 'VIEW_NOTES', 'EDIT_OWN_NOTE', 'DELETE_ANY_NOTE',
  ],

  TRANSPORT_PLANNER: [
    'VIEW_DASHBOARD',
    'VIEW_REQUESTS', 'CREATE_REQUEST', 'CANCEL_REQUEST',
    'VIEW_ASSIGNMENT', 'ASSIGN_VEHICLE', 'REASSIGN_VEHICLE',
    'VIEW_ALL_VEHICLES', 'VIEW_PLANT_VEHICLES', 'VIEW_WAREHOUSE_VEHICLES',
    'VIEW_EXCEPTIONS', 'RESOLVE_EXCEPTION',
    'VIEW_REPORTS', 'VIEW_CHARTS', 'VIEW_ACTIVE_TRANSIT',
    'VIEW_PLANTS', 'VIEW_WAREHOUSES', 'VIEW_DRIVERS', 'VIEW_TRANSPORTERS',
    'ADD_NOTE', 'VIEW_NOTES', 'EDIT_OWN_NOTE',
  ],

  PLANT_OPERATOR: [
    'VIEW_DASHBOARD', 'VIEW_PLANT_DASHBOARD',
    'VIEW_PLANT_VEHICLES',
    'ACTION_PLANT_ARRIVAL', 'ACTION_START_LOADING', 'ACTION_COMPLETE_LOADING', 'ACTION_GATE_OUT',
    'VIEW_EXCEPTIONS', 'RESOLVE_EXCEPTION',
    'ADD_NOTE', 'VIEW_NOTES', 'EDIT_OWN_NOTE',
  ],

  WAREHOUSE_OPERATOR: [
    'VIEW_DASHBOARD', 'VIEW_WAREHOUSE_DASHBOARD',
    'VIEW_WAREHOUSE_VEHICLES',
    'ACTION_WAREHOUSE_ARRIVAL', 'ACTION_START_UNLOADING', 'ACTION_COMPLETE_UNLOADING', 'ACTION_MARK_EMPTY',
    'VIEW_EXCEPTIONS', 'RESOLVE_EXCEPTION',
    'ADD_NOTE', 'VIEW_NOTES', 'EDIT_OWN_NOTE',
  ],

  MANAGEMENT: [
    'VIEW_DASHBOARD', 'VIEW_MANAGEMENT_DASHBOARD',
    'VIEW_REQUESTS',          // read-only
    'VIEW_ALL_VEHICLES',
    'VIEW_EXCEPTIONS',        // read-only (no resolve)
    'VIEW_REPORTS', 'VIEW_CHARTS', 'VIEW_ACTIVE_TRANSIT',
    'VIEW_PLANTS', 'VIEW_WAREHOUSES',
    'VIEW_AUDIT_LOG',         // read-only
    'VIEW_NOTES',             // read-only
  ],
};

// ---- Core Check Function ----
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

// Alias for readability
export const can = hasPermission;

// ---- Route Access Configuration ----
// Maps path patterns to allowed roles (empty = all roles allowed)
export const routeAccess: Record<string, UserRole[]> = {
  '/':                       ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'],
  '/transit':                ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/requests':               ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/assignment':             ['ADMIN', 'TRANSPORT_PLANNER'],
  '/exceptions':             ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'],
  '/vehicles':               ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/vehicles/empty':         ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/vehicles/at-plant':      ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'MANAGEMENT'],
  '/vehicles/at-warehouse':  ['ADMIN', 'TRANSPORT_PLANNER', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'],
  '/vehicles/in-transit':    ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/plants':                 ['ADMIN', 'TRANSPORT_PLANNER'],
  '/warehouses':             ['ADMIN', 'TRANSPORT_PLANNER'],
  '/drivers':                ['ADMIN', 'TRANSPORT_PLANNER'],
  '/transporters':           ['ADMIN', 'TRANSPORT_PLANNER'],
  '/reports/performance':    ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/reports/utilization':    ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/reports/warehouse':      ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/reports/history':        ['ADMIN', 'TRANSPORT_PLANNER', 'MANAGEMENT'],
  '/admin/users':            ['ADMIN'],
  '/admin/master':           ['ADMIN'],
  '/admin/audit':            ['ADMIN', 'MANAGEMENT'],
  '/admin/settings':         ['ADMIN'],
  '/help':                   ['ADMIN', 'TRANSPORT_PLANNER', 'PLANT_OPERATOR', 'WAREHOUSE_OPERATOR', 'MANAGEMENT'],
};

// ---- Default Route Per Role ----
export const defaultRoute: Record<UserRole, string> = {
  ADMIN:               '/',
  TRANSPORT_PLANNER:   '/',
  PLANT_OPERATOR:      '/',
  WAREHOUSE_OPERATOR:  '/',
  MANAGEMENT:          '/',
};

// ---- Role Metadata ----
export const roleLabels: Record<UserRole, string> = {
  ADMIN:               'Admin',
  TRANSPORT_PLANNER:   'Transport Planner',
  PLANT_OPERATOR:      'Plant Operator',
  WAREHOUSE_OPERATOR:  'Warehouse Operator',
  MANAGEMENT:          'Management',
};

export const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
  ADMIN:               { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  TRANSPORT_PLANNER:   { bg: 'bg-sky-100',  text: 'text-sky-700',  border: 'border-sky-200' },
  PLANT_OPERATOR:      { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  WAREHOUSE_OPERATOR:  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  MANAGEMENT:          { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
};

// Demo user names per role
export const roleUserNames: Record<UserRole, string> = {
  ADMIN:               'System Admin',
  TRANSPORT_PLANNER:   'Priya Sharma',
  PLANT_OPERATOR:      'Amit Kumar',
  WAREHOUSE_OPERATOR:  'Ravi Patel',
  MANAGEMENT:          'Director Singh',
};

// Assigned entity per role (for context banner)
export const roleAssignment: Record<UserRole, { type: string; name: string } | null> = {
  ADMIN:               null,
  TRANSPORT_PLANNER:   null,
  PLANT_OPERATOR:      { type: 'Plant', name: 'Plant-01' },
  WAREHOUSE_OPERATOR:  { type: 'Warehouse', name: 'WH-02' },
  MANAGEMENT:          null,
};

// ---- Trip Action → Required Permission ----
import type { TripStatus } from '../types';

export const tripActionPermission: Partial<Record<TripStatus, Permission>> = {
  AT_PLANT:      'ACTION_PLANT_ARRIVAL',
  LOADING:       'ACTION_START_LOADING',
  LOADED:        'ACTION_COMPLETE_LOADING',
  IN_TRANSIT:    'ACTION_GATE_OUT',
  AT_WAREHOUSE:  'ACTION_WAREHOUSE_ARRIVAL',
  UNLOADING:     'ACTION_START_UNLOADING',
  UNLOADED:      'ACTION_COMPLETE_UNLOADING',
  COMPLETED:     'ACTION_MARK_EMPTY',
};
