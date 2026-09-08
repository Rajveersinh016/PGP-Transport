import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  AppState, Vehicle, VehicleStatus, Trip, TripStatus, TransportRequest, RequestStatus,
  TripEvent, TripException, AuditEntry, AppNotification, AppSettings, UserRole, OperatorNote, NoteCategory
} from '../types';
import { INITIAL_STATE } from '../data/mockData';
import { hasPermission, tripActionPermission, roleUserNames } from '../auth/permissions';

// ============================================================
// ACTION TYPES
// ============================================================
type Action =
  | { type: 'ASSIGN_VEHICLE'; requestId: string; vehicleId: string; tripId: string }
  | { type: 'UPDATE_TRIP_STATUS'; tripId: string; newStatus: TripStatus; checkpoint: string; checkpointCode: string; operator: string; operatorRole: string; location: string; action: string; remark?: string }
  | { type: 'ADD_REQUEST'; request: TransportRequest }
  | { type: 'CANCEL_REQUEST'; requestId: string }
  | { type: 'RESOLVE_EXCEPTION'; exceptionId: string; remark: string }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SWITCH_ROLE'; role: UserRole }
  | { type: 'RESET_DEMO' }
  | { type: 'ADD_EXCEPTION_REMARK'; exceptionId: string; remark: string }
  | { type: 'ADD_OPERATOR_NOTE'; note: OperatorNote }
  | { type: 'DELETE_OPERATOR_NOTE'; noteId: string };

// ============================================================
// UTILITY
// ============================================================
const nowISO = () => new Date().toISOString();

const makeAuditEntry = (
  operator: string, role: string, module_: string, action: string,
  entityType: string, entityId: string, entityLabel: string,
  oldValue: string | null, newValue: string | null, location: string
): AuditEntry => ({
  id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  timestamp: nowISO(),
  operator,
  operatorRole: role,
  module: module_,
  action,
  entityType,
  entityId,
  entityLabel,
  oldValue,
  newValue,
  location,
  ipAddress: '192.168.1.10',
});

const makeNotification = (
  type: AppNotification['type'], title: string, body: string,
  vehicleId: string | null = null, tripId: string | null = null, link: string | null = null
): AppNotification => ({
  id: `NOT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  timestamp: nowISO(),
  type,
  title,
  body,
  read: false,
  link,
  vehicleId,
  tripId,
});

const vehicleStatusForTripStatus = (tripStatus: TripStatus): VehicleStatus => {
  const map: Record<TripStatus, VehicleStatus> = {
    REQUESTED: 'ASSIGNED',
    ASSIGNED: 'ASSIGNED',
    AT_PLANT: 'AT_PLANT',
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    GATE_OUT: 'IN_TRANSIT',
    IN_TRANSIT: 'IN_TRANSIT',
    AT_WAREHOUSE: 'AT_WAREHOUSE',
    UNLOADING: 'UNLOADING',
    UNLOADED: 'EMPTY',
    COMPLETED: 'AVAILABLE',
    CANCELLED: 'AVAILABLE',
  };
  return map[tripStatus] || 'AVAILABLE';
};

const STORAGE_KEY = 'TRANSITFLOW_STATE_V2';

const getInitialState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.vehicles) && Array.isArray(parsed.trips)) {
        // Ensure operatorNotes exists in persisted state (migration)
        if (!Array.isArray(parsed.operatorNotes)) parsed.operatorNotes = [];
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read state from localStorage', err);
  }
  return INITIAL_STATE;
};

// ============================================================
// REDUCER
// ============================================================
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ASSIGN_VEHICLE': {
      const { requestId, vehicleId, tripId } = action;
      const vehicle = state.vehicles.find(v => v.id === vehicleId);
      const request = state.requests.find(r => r.id === requestId);
      if (!vehicle || !request) return state;

      // PERMISSION CHECK — must be ADMIN or TRANSPORT_PLANNER
      if (!hasPermission(state.settings.currentRole, 'ASSIGN_VEHICLE')) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted ASSIGN_VEHICLE — BLOCKED`);
        return state;
      }

      // RULE 1, 2, 3: Cannot assign if vehicle is not AVAILABLE or EMPTY, or already has active trip
      if ((vehicle.status !== 'AVAILABLE' && vehicle.status !== 'EMPTY') || vehicle.currentTripId) {
        return state;
      }

      // RULE 14: Vehicle capacity must be sufficient
      if (vehicle.capacityMT < request.requiredCapacityMT || vehicle.capacityMT < request.quantityMT) {
        return state;
      }

      // RULE 13: Cancelled requests cannot be executed
      if (request.status !== 'PENDING') {
        return state;
      }

      const now = nowISO();
      const newTripEvent: TripEvent = {
        id: `EVT-${tripId}-ASSIGNED-${Date.now()}`,
        tripId,
        timestamp: now,
        status: 'ASSIGNED',
        checkpoint: 'Transport Office',
        checkpointCode: 'OFFICE',
        operator: state.settings.currentUser,
        operatorRole: state.settings.currentRole,
        location: 'Head Office',
        remark: '',
        action: `Vehicle ${vehicle.vehicleNumber} assigned`,
      };

      const newTrip: Trip = {
        id: tripId,
        requestId,
        vehicleId,
        vehicleNumber: vehicle.vehicleNumber,
        transporterId: vehicle.transporterId,
        transporterName: vehicle.transporterName,
        driverId: vehicle.driverId,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        sourcePlantId: request.sourcePlantId,
        sourcePlantName: request.sourcePlantName,
        destinationWarehouseId: request.destinationWarehouseId,
        destinationWarehouseName: request.destinationWarehouseName,
        material: request.material,
        quantityMT: request.quantityMT,
        priority: request.priority,
        status: 'ASSIGNED',
        lastConfirmedCheckpoint: 'Transport Office',
        lastConfirmedCheckpointCode: 'OFFICE',
        lastConfirmedAt: now,
        startedAt: now,
        expectedCompletionAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
        delayMinutes: 0,
        isDelayed: false,
        events: [
          {
            id: `EVT-${tripId}-REQUESTED-${Date.now() - 1000}`,
            tripId,
            timestamp: request.requestDate || now,
            status: 'REQUESTED',
            checkpoint: `${request.sourcePlantName} Office`,
            checkpointCode: `${request.sourcePlantId}-OFFICE`,
            operator: request.createdBy || state.settings.currentUser,
            operatorRole: 'TRANSPORT_PLANNER',
            location: 'Head Office',
            remark: request.remarks || 'Request Created',
            action: 'Request Created',
          },
          newTripEvent
        ],
      };

      const audit = makeAuditEntry(
        state.settings.currentUser, state.settings.currentRole,
        'Vehicle Assignment', 'Vehicle Assigned', 'Trip', tripId,
        `${tripId} → ${vehicle.vehicleNumber}`, 'PENDING', 'ASSIGNED', 'Head Office'
      );

      const notification = makeNotification(
        'SUCCESS', 'Vehicle Assigned',
        `${vehicle.vehicleNumber} assigned to ${requestId}`,
        vehicleId, tripId, `/vehicles/${vehicleId}`
      );

      return {
        ...state,
        vehicles: state.vehicles.map(v =>
          v.id === vehicleId
            ? { ...v, status: 'ASSIGNED', currentTripId: tripId, availableSince: null, lastUpdated: now }
            : v
        ),
        requests: state.requests.map(r =>
          r.id === requestId
            ? { ...r, status: 'ASSIGNED', assignedVehicleId: vehicleId, assignedVehicleNumber: vehicle.vehicleNumber, tripId }
            : r
        ),
        trips: [newTrip, ...state.trips],
        auditLog: [audit, ...state.auditLog],
        notifications: [notification, ...state.notifications],
      };
    }

    case 'UPDATE_TRIP_STATUS': {
      const { tripId, newStatus, checkpoint, checkpointCode, operator, operatorRole, location, action: actionLabel, remark = '' } = action;
      const trip = state.trips.find(t => t.id === tripId);
      if (!trip) return state;

      // PERMISSION CHECK — verify the role can perform this specific transition
      const requiredPerm = tripActionPermission[newStatus];
      if (requiredPerm && !hasPermission(state.settings.currentRole, requiredPerm)) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted ${newStatus} — BLOCKED. Required: ${requiredPerm}`);
        return state;
      }

      const now = nowISO();
      const generatedEvents: TripEvent[] = [];

      // If completing Gate Out -> IN_TRANSIT, ensure GATE_OUT event is recorded first
      if (newStatus === 'IN_TRANSIT' && trip.status === 'LOADED') {
        generatedEvents.push({
          id: `EVT-${tripId}-GATE_OUT-${Date.now() - 500}`,
          tripId,
          timestamp: now,
          status: 'GATE_OUT',
          checkpoint: `${trip.sourcePlantName} Gate`,
          checkpointCode: `${trip.sourcePlantId}-GATE`,
          operator,
          operatorRole,
          location,
          remark: remark || 'Plant Gate Out Confirmed',
          action: 'Gate Out',
        });
      }

      generatedEvents.push({
        id: `EVT-${tripId}-${newStatus}-${Date.now()}`,
        tripId,
        timestamp: now,
        status: newStatus,
        checkpoint,
        checkpointCode,
        operator,
        operatorRole,
        location,
        remark,
        action: actionLabel,
      });

      const isCompleted = newStatus === 'COMPLETED';
      const isUnloaded = newStatus === 'UNLOADED';
      const newVehicleStatus = vehicleStatusForTripStatus(newStatus);

      // Determine request status
      let newRequestStatus: RequestStatus = 'IN_PROGRESS';
      if (newStatus === 'ASSIGNED') newRequestStatus = 'ASSIGNED';
      if (isCompleted) newRequestStatus = 'COMPLETED';

      const audit = makeAuditEntry(
        operator, operatorRole, 'Trip Execution', actionLabel,
        'Trip', tripId, trip.vehicleNumber,
        trip.status, newStatus, location
      );

      const notification = makeNotification(
        isCompleted ? 'SUCCESS' : 'INFO',
        actionLabel, `${trip.vehicleNumber}: ${actionLabel}`,
        trip.vehicleId, tripId, `/vehicles/${trip.vehicleId}`
      );

      return {
        ...state,
        trips: state.trips.map(t =>
          t.id === tripId
            ? {
                ...t,
                status: newStatus,
                lastConfirmedCheckpoint: checkpoint,
                lastConfirmedCheckpointCode: checkpointCode,
                lastConfirmedAt: now,
                completedAt: isCompleted ? now : t.completedAt,
                events: [...t.events, ...generatedEvents],
              }
            : t
        ),
        vehicles: state.vehicles.map(v =>
          v.id === trip.vehicleId
            ? {
                ...v,
                status: newVehicleStatus,
                lastConfirmedLocation: checkpoint,
                lastConfirmedLocationCode: checkpointCode,
                lastUpdated: now,
                // RULE 4 & 5: When unloaded or completed, vehicle is freed and availableSince is set
                currentTripId: isCompleted ? null : (isUnloaded ? null : trip.id),
                availableSince: (isUnloaded || isCompleted) ? (v.availableSince || now) : null,
              }
            : v
        ),
        requests: state.requests.map(r =>
          r.id === trip.requestId
            ? { ...r, status: newRequestStatus }
            : r
        ),
        auditLog: [audit, ...state.auditLog],
        notifications: [notification, ...state.notifications],
      };
    }

    case 'ADD_REQUEST': {
      // PERMISSION CHECK
      if (!hasPermission(state.settings.currentRole, 'CREATE_REQUEST')) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted CREATE_REQUEST — BLOCKED`);
        return state;
      }
      const audit = makeAuditEntry(
        state.settings.currentUser, state.settings.currentRole,
        'Transport Requests', 'Request Created', 'TransportRequest',
        action.request.id, `${action.request.id} (${action.request.material} - ${action.request.quantityMT} MT)`, null, 'PENDING', 'Head Office'
      );
      return {
        ...state,
        requests: [action.request, ...state.requests],
        auditLog: [audit, ...state.auditLog],
      };
    }

    case 'CANCEL_REQUEST': {
      // PERMISSION CHECK
      if (!hasPermission(state.settings.currentRole, 'CANCEL_REQUEST')) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted CANCEL_REQUEST — BLOCKED`);
        return state;
      }
      const audit = makeAuditEntry(
        state.settings.currentUser, state.settings.currentRole,
        'Transport Requests', 'Request Cancelled', 'TransportRequest',
        action.requestId, action.requestId, 'PENDING', 'CANCELLED', 'Head Office'
      );
      return {
        ...state,
        requests: state.requests.map(r =>
          r.id === action.requestId ? { ...r, status: 'CANCELLED' } : r
        ),
        auditLog: [audit, ...state.auditLog],
      };
    }

    case 'RESOLVE_EXCEPTION': {
      // PERMISSION CHECK
      if (!hasPermission(state.settings.currentRole, 'RESOLVE_EXCEPTION')) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted RESOLVE_EXCEPTION — BLOCKED`);
        return state;
      }
      const ex = state.exceptions.find(e => e.id === action.exceptionId);
      const audit = makeAuditEntry(
        state.settings.currentUser, state.settings.currentRole,
        'Exception Management', 'Exception Resolved', 'TripException',
        action.exceptionId, ex?.title || action.exceptionId, 'OPEN', 'RESOLVED', 'Control Center'
      );
      return {
        ...state,
        exceptions: state.exceptions.map(e =>
          e.id === action.exceptionId
            ? { ...e, resolved: true, resolvedAt: nowISO(), remarks: [...e.remarks, action.remark] }
            : e
        ),
        auditLog: [audit, ...state.auditLog],
      };
    }

    case 'ADD_EXCEPTION_REMARK': {
      return {
        ...state,
        exceptions: state.exceptions.map(e =>
          e.id === action.exceptionId
            ? { ...e, remarks: [...e.remarks, action.remark] }
            : e
        ),
      };
    }

    case 'ADD_OPERATOR_NOTE': {
      // PERMISSION CHECK
      if (!hasPermission(state.settings.currentRole, 'ADD_NOTE')) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted ADD_NOTE — BLOCKED`);
        return state;
      }
      return {
        ...state,
        operatorNotes: [action.note, ...state.operatorNotes],
      };
    }

    case 'DELETE_OPERATOR_NOTE': {
      // Only ADMIN can delete any note; authors can delete their own
      const note = state.operatorNotes.find(n => n.id === action.noteId);
      if (!note) return state;
      const isAdmin = state.settings.currentRole === 'ADMIN';
      const isAuthor = note.author === state.settings.currentUser;
      if (!isAdmin && !isAuthor) {
        console.warn(`[RBAC] Role ${state.settings.currentRole} attempted DELETE_NOTE — BLOCKED`);
        return state;
      }
      return {
        ...state,
        operatorNotes: state.operatorNotes.filter(n => n.id !== action.noteId),
      };
    }

    case 'MARK_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    }

    case 'MARK_NOTIFICATION_READ': {
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    }

    case 'SWITCH_ROLE': {
      return {
        ...state,
        settings: {
          ...state.settings,
          currentRole: action.role,
          currentUser: roleUserNames[action.role],
        },
      };
    }

    case 'RESET_DEMO': {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helper actions
  assignVehicle: (requestId: string, vehicleId: string) => void;
  updateTripStatus: (
    tripId: string, newStatus: TripStatus,
    checkpoint: string, checkpointCode: string,
    action: string, remark?: string
  ) => void;
  addRequest: (request: TransportRequest) => void;
  cancelRequest: (requestId: string) => void;
  resolveException: (exceptionId: string, remark: string) => void;
  switchRole: (role: UserRole) => void;
  resetDemo: () => void;
  markAllRead: () => void;
  addOperatorNote: (
    text: string, entityType: OperatorNote['entityType'], entityId: string | null,
    category: NoteCategory, location: string
  ) => void;
  deleteOperatorNote: (noteId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not save state to localStorage', err);
    }
  }, [state]);

  const assignVehicle = useCallback((requestId: string, vehicleId: string) => {
    const tripId = `TRIP-${Date.now().toString().slice(-6)}`;
    dispatch({ type: 'ASSIGN_VEHICLE', requestId, vehicleId, tripId });
  }, []);

  const updateTripStatus = useCallback((
    tripId: string, newStatus: TripStatus,
    checkpoint: string, checkpointCode: string,
    actionLabel: string, remark = ''
  ) => {
    const state_ = (window as unknown as { __appState__: AppState }).__appState__;
    const settings = state_?.settings;
    dispatch({
      type: 'UPDATE_TRIP_STATUS',
      tripId, newStatus, checkpoint, checkpointCode,
      operator: settings?.currentUser ?? 'Operator',
      operatorRole: settings?.currentRole ?? 'PLANT_OPERATOR',
      location: checkpoint,
      action: actionLabel,
      remark,
    });
  }, []);

  const addRequest = useCallback((request: TransportRequest) => {
    dispatch({ type: 'ADD_REQUEST', request });
  }, []);

  const cancelRequest = useCallback((requestId: string) => {
    dispatch({ type: 'CANCEL_REQUEST', requestId });
  }, []);

  const resolveException = useCallback((exceptionId: string, remark: string) => {
    dispatch({ type: 'RESOLVE_EXCEPTION', exceptionId, remark });
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    dispatch({ type: 'SWITCH_ROLE', role });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
  }, []);

  const markAllRead = useCallback(() => {
    dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
  }, []);

  const addOperatorNote = useCallback((
    text: string, entityType: OperatorNote['entityType'], entityId: string | null,
    category: NoteCategory, location: string
  ) => {
    const state_ = (window as unknown as { __appState__: AppState }).__appState__;
    const settings = state_?.settings;
    const note: OperatorNote = {
      id: `NOTE-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      author: settings?.currentUser ?? 'Operator',
      authorRole: settings?.currentRole ?? 'PLANT_OPERATOR',
      createdAt: new Date().toISOString(),
      entityType,
      entityId,
      category,
      location,
    };
    dispatch({ type: 'ADD_OPERATOR_NOTE', note });
  }, []);

  const deleteOperatorNote = useCallback((noteId: string) => {
    dispatch({ type: 'DELETE_OPERATOR_NOTE', noteId });
  }, []);

  // Expose state globally so updateTripStatus can access current user
  React.useEffect(() => {
    (window as unknown as { __appState__: AppState }).__appState__ = state;
  }, [state]);

  return (
    <AppContext.Provider value={{
      state, dispatch,
      assignVehicle, updateTripStatus, addRequest, cancelRequest,
      resolveException, switchRole, resetDemo, markAllRead,
      addOperatorNote, deleteOperatorNote,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ============================================================
// DERIVED STATE HOOKS
// ============================================================
export function useVehicleStats() {
  const { state } = useApp();
  const { vehicles } = state;
  return {
    total: vehicles.length,
    inTransit: vehicles.filter(v => v.status === 'IN_TRANSIT').length,
    atPlant: vehicles.filter(v => v.status === 'AT_PLANT' || v.status === 'LOADING' || v.status === 'LOADED').length,
    atWarehouse: vehicles.filter(v => v.status === 'AT_WAREHOUSE' || v.status === 'UNLOADING').length,
    available: vehicles.filter(v => v.status === 'AVAILABLE' || v.status === 'EMPTY').length,
    assigned: vehicles.filter(v => v.status === 'ASSIGNED').length,
    delayed: state.exceptions.filter(e => !e.resolved && e.type === 'DELAYED_TRIP').length,
    completedToday: state.trips.filter(t => t.status === 'COMPLETED').length,
    offline: vehicles.filter(v => v.status === 'OFFLINE').length,
  };
}

export function useActiveTrips() {
  const { state } = useApp();
  return state.trips.filter(t =>
    t.status !== 'COMPLETED' && t.status !== 'CANCELLED'
  );
}

export function useUnreadNotifications() {
  const { state } = useApp();
  return state.notifications.filter(n => !n.read).length;
}
