// ============================================================
// CORE TYPES — TransitFlow Transport & Vehicle Visibility System
// ============================================================

export type VehicleStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'AT_PLANT'
  | 'LOADING'
  | 'LOADED'
  | 'IN_TRANSIT'
  | 'AT_WAREHOUSE'
  | 'UNLOADING'
  | 'EMPTY'
  | 'DELAYED'
  | 'OFFLINE';

export type TripStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'AT_PLANT'
  | 'LOADING'
  | 'LOADED'
  | 'GATE_OUT'
  | 'IN_TRANSIT'
  | 'AT_WAREHOUSE'
  | 'UNLOADING'
  | 'UNLOADED'
  | 'COMPLETED'
  | 'CANCELLED';

export type RequestStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type UserRole =
  | 'ADMIN'
  | 'TRANSPORT_PLANNER'
  | 'PLANT_OPERATOR'
  | 'WAREHOUSE_OPERATOR'
  | 'MANAGEMENT';

export type NoteCategory =
  | 'DELAY'
  | 'LOADING'
  | 'UNLOADING'
  | 'GATE'
  | 'VEHICLE'
  | 'WAREHOUSE'
  | 'PLANT'
  | 'GENERAL';

// ---- Operator Note ----
export interface OperatorNote {
  id: string;
  text: string;
  author: string;
  authorRole: UserRole;
  createdAt: string; // ISO
  entityType: 'TRIP' | 'VEHICLE' | 'REQUEST' | 'GENERAL';
  entityId: string | null;
  category: NoteCategory;
  location: string;
}

export type ExceptionType =
  | 'DELAYED_TRIP'
  | 'WAITING_TOO_LONG'
  | 'MISSING_CHECKPOINT'
  | 'OVERDUE_ARRIVAL'
  | 'TRACKING_MISSING'
  | 'UNASSIGNED_REQUEST';

export type ExceptionSeverity = 'WARNING' | 'CRITICAL' | 'INFO';

export type MaterialType = 'FG' | 'RM' | 'OW' | 'PGP' | 'PM' | 'SFG';

export type VehicleType = 'TRUCK_14T' | 'TRUCK_20T' | 'TRUCK_40T' | 'TRUCK_SMALL' | 'TANKER';

// ---- Plant ----
export interface Plant {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  active: boolean;
}

// ---- Warehouse ----
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacity: number; // MT
  active: boolean;
}

// ---- Transporter ----
export interface Transporter {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  active: boolean;
}

// ---- Driver ----
export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  transporterId: string;
  transporterName: string;
  active: boolean;
}

// ---- Vehicle ----
export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacityMT: number;
  transporterId: string;
  transporterName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: VehicleStatus;
  lastConfirmedLocation: string;
  lastConfirmedLocationCode: string;
  lastUpdated: string; // ISO
  currentTripId: string | null;
  availableSince: string | null; // ISO
}

// ---- Transport Request ----
export interface TransportRequest {
  id: string;
  requestDate: string; // ISO
  sourcePlantId: string;
  sourcePlantName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  material: MaterialType;
  quantityMT: number;
  requiredVehicleType: VehicleType;
  requiredCapacityMT: number;
  priority: Priority;
  requiredDate: string; // ISO date
  requiredTime: string; // HH:mm
  remarks: string;
  status: RequestStatus;
  assignedVehicleId: string | null;
  assignedVehicleNumber: string | null;
  tripId: string | null;
  createdBy: string;
}

// ---- Trip Event ----
export interface TripEvent {
  id: string;
  tripId: string;
  timestamp: string; // ISO
  status: TripStatus;
  checkpoint: string;
  checkpointCode: string;
  operator: string;
  operatorRole: string;
  location: string;
  remark: string;
  action: string;
}

// ---- Trip ----
export interface Trip {
  id: string;
  requestId: string;
  vehicleId: string;
  vehicleNumber: string;
  transporterId: string;
  transporterName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  sourcePlantId: string;
  sourcePlantName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  material: MaterialType;
  quantityMT: number;
  priority: Priority;
  status: TripStatus;
  lastConfirmedCheckpoint: string;
  lastConfirmedCheckpointCode: string;
  lastConfirmedAt: string; // ISO
  startedAt: string; // ISO
  expectedCompletionAt: string; // ISO
  completedAt: string | null; // ISO
  events: TripEvent[];
  delayMinutes: number;
  isDelayed: boolean;
}

// ---- Exception ----
export interface TripException {
  id: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  tripId: string | null;
  vehicleId: string | null;
  vehicleNumber: string | null;
  requestId: string | null;
  title: string;
  description: string;
  detectedAt: string; // ISO
  resolvedAt: string | null;
  resolved: boolean;
  assignedTo: string | null;
  remarks: string[];
}

// ---- Audit Log Entry ----
export interface AuditEntry {
  id: string;
  timestamp: string; // ISO
  operator: string;
  operatorRole: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  oldValue: string | null;
  newValue: string | null;
  location: string;
  ipAddress: string;
}

// ---- Notification ----
export interface AppNotification {
  id: string;
  timestamp: string; // ISO
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  body: string;
  read: boolean;
  link: string | null;
  vehicleId: string | null;
  tripId: string | null;
}

// ---- Settings ----
export interface AppSettings {
  waitingThresholdMinutes: number;
  loadingThresholdMinutes: number;
  unloadingThresholdMinutes: number;
  transitThresholdMinutes: number;
  notificationsEnabled: boolean;
  demoMode: boolean;
  currentRole: UserRole;
  currentUser: string;
}

// ---- App State ----
export interface AppState {
  plants: Plant[];
  warehouses: Warehouse[];
  transporters: Transporter[];
  drivers: Driver[];
  vehicles: Vehicle[];
  requests: TransportRequest[];
  trips: Trip[];
  exceptions: TripException[];
  auditLog: AuditEntry[];
  notifications: AppNotification[];
  operatorNotes: OperatorNote[];
  settings: AppSettings;
}
