import type {
  Plant, Warehouse, Transporter, Driver, Vehicle, TransportRequest,
  Trip, TripEvent, TripException, AuditEntry, AppNotification, AppSettings, AppState, OperatorNote
} from '../types';

// ============================================================
// INITIAL OPERATOR NOTES
// ============================================================
export const OPERATOR_NOTES: OperatorNote[] = [];

// ============================================================
// REFERENCE DATE — deterministic, relative to prototype launch
// ============================================================
const BASE_DATE = '2026-09-05';
const ts = (h: number, m: number, s = 0) =>
  `${BASE_DATE}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}+05:30`;

// ============================================================
// PLANTS
// ============================================================
export const PLANTS: Plant[] = [
  { id: 'PLT-01', name: 'Plant Ahmedabad', code: 'PLT-01', city: 'Ahmedabad', address: 'GIDC Naroda, Ahmedabad - 382330', contactPerson: 'Suresh Mehta', contactPhone: '9876543210', active: true },
  { id: 'PLT-02', name: 'Plant Vadodara', code: 'PLT-02', city: 'Vadodara', address: 'GIDC Manjusar, Vadodara - 391775', contactPerson: 'Ramesh Shah', contactPhone: '9876543211', active: true },
  { id: 'PLT-03', name: 'Plant Surat', code: 'PLT-03', city: 'Surat', address: 'Sachin GIDC, Surat - 394230', contactPerson: 'Naresh Patel', contactPhone: '9876543212', active: true },
  { id: 'PLT-04', name: 'Plant Rajkot', code: 'PLT-04', city: 'Rajkot', address: 'GIDC Shapar, Rajkot - 360002', contactPerson: 'Hitesh Joshi', contactPhone: '9876543213', active: true },
  { id: 'PLT-05', name: 'Plant Gandhinagar', code: 'PLT-05', city: 'Gandhinagar', address: 'Pharma SEZ, Gandhinagar - 382355', contactPerson: 'Vijay Rana', contactPhone: '9876543214', active: true },
];

// ============================================================
// WAREHOUSES
// ============================================================
export const WAREHOUSES: Warehouse[] = [
  { id: 'WH-01', name: 'Warehouse Mumbai Central', code: 'WH-01', city: 'Mumbai', address: 'Bhiwandi Logistics Park, Thane - 421302', contactPerson: 'Anil Desai', contactPhone: '9876500001', capacity: 5000, active: true },
  { id: 'WH-02', name: 'Warehouse Pune', code: 'WH-02', city: 'Pune', address: 'Chakan Industrial Area, Pune - 410501', contactPerson: 'Priya Joshi', contactPhone: '9876500002', capacity: 3500, active: true },
  { id: 'WH-03', name: 'Warehouse Delhi NCR', code: 'WH-03', city: 'Delhi NCR', address: 'Kundli Industrial Area, Haryana - 131028', contactPerson: 'Mukesh Gupta', contactPhone: '9876500003', capacity: 6000, active: true },
  { id: 'WH-04', name: 'Warehouse Hyderabad', code: 'WH-04', city: 'Hyderabad', address: 'IDA Pashamylaram, Hyderabad - 502307', contactPerson: 'Srinivas Rao', contactPhone: '9876500004', capacity: 4000, active: true },
  { id: 'WH-05', name: 'Warehouse Chennai', code: 'WH-05', city: 'Chennai', address: 'Ambattur Industrial Estate, Chennai - 600058', contactPerson: 'Kannan Pillai', contactPhone: '9876500005', capacity: 3000, active: true },
  { id: 'WH-06', name: 'Warehouse Kolkata', code: 'WH-06', city: 'Kolkata', address: 'Dankuni Industrial Area, Kolkata - 712311', contactPerson: 'Sanjay Roy', contactPhone: '9876500006', capacity: 3500, active: true },
  { id: 'WH-07', name: 'Warehouse Bangalore', code: 'WH-07', city: 'Bangalore', address: 'Peenya Industrial Area, Bangalore - 560058', contactPerson: 'Ravi Kumar', contactPhone: '9876500007', capacity: 2500, active: true },
  { id: 'WH-08', name: 'Warehouse Jaipur', code: 'WH-08', city: 'Jaipur', address: 'Sitapura Industrial Area, Jaipur - 302022', contactPerson: 'Govind Sharma', contactPhone: '9876500008', capacity: 2000, active: true },
  { id: 'WH-09', name: 'Warehouse Lucknow', code: 'WH-09', city: 'Lucknow', address: 'Amausi Industrial Area, Lucknow - 226001', contactPerson: 'Dinesh Verma', contactPhone: '9876500009', capacity: 1800, active: true },
  { id: 'WH-10', name: 'Warehouse Indore', code: 'WH-10', city: 'Indore', address: 'Pithampur Industrial Area, Indore - 454775', contactPerson: 'Ashok Tiwari', contactPhone: '9876500010', capacity: 2200, active: true },
];

// ============================================================
// TRANSPORTERS
// ============================================================
export const TRANSPORTERS: Transporter[] = [
  { id: 'TR-001', name: 'ABC Logistics Pvt Ltd', code: 'ABC', contactPerson: 'Arvind Bhai', contactPhone: '9800001111', email: 'abc@logistics.in', active: true },
  { id: 'TR-002', name: 'Gujarat Road Carriers', code: 'GRC', contactPerson: 'Bharat Patel', contactPhone: '9800002222', email: 'grc@carriers.in', active: true },
  { id: 'TR-003', name: 'National Express Transport', code: 'NET', contactPerson: 'Chirag Shah', contactPhone: '9800003333', email: 'net@express.in', active: true },
  { id: 'TR-004', name: 'Reliance Fleet Services', code: 'RFS', contactPerson: 'Dinesh Kumar', contactPhone: '9800004444', email: 'rfs@fleet.in', active: true },
  { id: 'TR-005', name: 'Speedway Transport Co', code: 'STC', contactPerson: 'Eknath Rao', contactPhone: '9800005555', email: 'stc@speedway.in', active: true },
  { id: 'TR-006', name: 'Western India Movers', code: 'WIM', contactPerson: 'Farhan Sheikh', contactPhone: '9800006666', email: 'wim@movers.in', active: true },
  { id: 'TR-007', name: 'Pioneer Road Lines', code: 'PRL', contactPerson: 'Ganesh Iyer', contactPhone: '9800007777', email: 'prl@pioneer.in', active: true },
  { id: 'TR-008', name: 'Shree Ram Transport', code: 'SRT', contactPerson: 'Harish Trivedi', contactPhone: '9800008888', email: 'srt@shree.in', active: true },
  { id: 'TR-009', name: 'Horizon Cargo Services', code: 'HCS', contactPerson: 'Irfan Malik', contactPhone: '9800009999', email: 'hcs@horizon.in', active: true },
  { id: 'TR-010', name: 'Supreme Road Transport', code: 'SRT2', contactPerson: 'Jayesh Nair', contactPhone: '9800010101', email: 'supreme@road.in', active: true },
  { id: 'TR-011', name: 'PATEL ROADWAYS', code: 'PTL', contactPerson: 'Kamlesh Patel', contactPhone: '9800011111', email: 'ptl@roadways.in', active: true },
  { id: 'TR-012', name: 'Krishi Transport Agency', code: 'KTA', contactPerson: 'Laxmi Narayana', contactPhone: '9800012121', email: 'kta@krishi.in', active: true },
];

// ============================================================
// DRIVERS
// ============================================================
export const DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'Rajesh Patel', phone: '9711001001', licenseNumber: 'GJ01-20150012345', transporterId: 'TR-001', transporterName: 'ABC Logistics Pvt Ltd', active: true },
  { id: 'DRV-002', name: 'Sunil Kumar', phone: '9711001002', licenseNumber: 'GJ01-20140023456', transporterId: 'TR-001', transporterName: 'ABC Logistics Pvt Ltd', active: true },
  { id: 'DRV-003', name: 'Mahesh Yadav', phone: '9711001003', licenseNumber: 'GJ05-20160034567', transporterId: 'TR-002', transporterName: 'Gujarat Road Carriers', active: true },
  { id: 'DRV-004', name: 'Ramesh Sharma', phone: '9711001004', licenseNumber: 'GJ05-20130045678', transporterId: 'TR-002', transporterName: 'Gujarat Road Carriers', active: true },
  { id: 'DRV-005', name: 'Pradeep Singh', phone: '9711001005', licenseNumber: 'GJ06-20170056789', transporterId: 'TR-003', transporterName: 'National Express Transport', active: true },
  { id: 'DRV-006', name: 'Vijay Tiwari', phone: '9711001006', licenseNumber: 'GJ06-20120067890', transporterId: 'TR-003', transporterName: 'National Express Transport', active: true },
  { id: 'DRV-007', name: 'Anil Joshi', phone: '9711001007', licenseNumber: 'GJ18-20180078901', transporterId: 'TR-004', transporterName: 'Reliance Fleet Services', active: true },
  { id: 'DRV-008', name: 'Santosh Meena', phone: '9711001008', licenseNumber: 'GJ18-20110089012', transporterId: 'TR-004', transporterName: 'Reliance Fleet Services', active: true },
  { id: 'DRV-009', name: 'Raju Bhatt', phone: '9711001009', licenseNumber: 'GJ09-20190090123', transporterId: 'TR-005', transporterName: 'Speedway Transport Co', active: true },
  { id: 'DRV-010', name: 'Deepak Verma', phone: '9711001010', licenseNumber: 'GJ09-20100001234', transporterId: 'TR-005', transporterName: 'Speedway Transport Co', active: true },
  { id: 'DRV-011', name: 'Ashok Chauhan', phone: '9711001011', licenseNumber: 'GJ15-20150012346', transporterId: 'TR-006', transporterName: 'Western India Movers', active: true },
  { id: 'DRV-012', name: 'Mohan Rao', phone: '9711001012', licenseNumber: 'GJ15-20140023457', transporterId: 'TR-006', transporterName: 'Western India Movers', active: true },
  { id: 'DRV-013', name: 'Naresh Gupta', phone: '9711001013', licenseNumber: 'GJ17-20160034568', transporterId: 'TR-007', transporterName: 'Pioneer Road Lines', active: true },
  { id: 'DRV-014', name: 'Bharat Mishra', phone: '9711001014', licenseNumber: 'GJ17-20130045679', transporterId: 'TR-007', transporterName: 'Pioneer Road Lines', active: true },
  { id: 'DRV-015', name: 'Hitesh Trivedi', phone: '9711001015', licenseNumber: 'GJ02-20170056780', transporterId: 'TR-008', transporterName: 'Shree Ram Transport', active: true },
  { id: 'DRV-016', name: 'Karan Shah', phone: '9711001016', licenseNumber: 'GJ02-20120067891', transporterId: 'TR-008', transporterName: 'Shree Ram Transport', active: true },
  { id: 'DRV-017', name: 'Jignesh Desai', phone: '9711001017', licenseNumber: 'GJ04-20180078902', transporterId: 'TR-009', transporterName: 'Horizon Cargo Services', active: true },
  { id: 'DRV-018', name: 'Tejas Parmar', phone: '9711001018', licenseNumber: 'GJ04-20110089013', transporterId: 'TR-009', transporterName: 'Horizon Cargo Services', active: true },
  { id: 'DRV-019', name: 'Yogesh Panchal', phone: '9711001019', licenseNumber: 'GJ22-20190090124', transporterId: 'TR-010', transporterName: 'Supreme Road Transport', active: true },
  { id: 'DRV-020', name: 'Bhushan Patel', phone: '9711001020', licenseNumber: 'GJ22-20100001235', transporterId: 'TR-010', transporterName: 'Supreme Road Transport', active: true },
  { id: 'DRV-021', name: 'Chirag Rana', phone: '9711001021', licenseNumber: 'GJ07-20150012347', transporterId: 'TR-011', transporterName: 'PATEL ROADWAYS', active: true },
  { id: 'DRV-022', name: 'Dhruv Solanki', phone: '9711001022', licenseNumber: 'GJ07-20140023458', transporterId: 'TR-011', transporterName: 'PATEL ROADWAYS', active: true },
  { id: 'DRV-023', name: 'Nilesh Makwana', phone: '9711001023', licenseNumber: 'GJ12-20160034569', transporterId: 'TR-012', transporterName: 'Krishi Transport Agency', active: true },
  { id: 'DRV-024', name: 'Vishal Chavda', phone: '9711001024', licenseNumber: 'GJ12-20130045670', transporterId: 'TR-012', transporterName: 'Krishi Transport Agency', active: true },
  { id: 'DRV-025', name: 'Rakesh Barot', phone: '9711001025', licenseNumber: 'GJ01-20170056781', transporterId: 'TR-001', transporterName: 'ABC Logistics Pvt Ltd', active: true },
  { id: 'DRV-026', name: 'Dinesh Katara', phone: '9711001026', licenseNumber: 'GJ05-20120067892', transporterId: 'TR-002', transporterName: 'Gujarat Road Carriers', active: true },
  { id: 'DRV-027', name: 'Paresh Vaghela', phone: '9711001027', licenseNumber: 'GJ06-20180078903', transporterId: 'TR-003', transporterName: 'National Express Transport', active: true },
  { id: 'DRV-028', name: 'Saurabh Rajput', phone: '9711001028', licenseNumber: 'GJ18-20110089014', transporterId: 'TR-004', transporterName: 'Reliance Fleet Services', active: true },
  { id: 'DRV-029', name: 'Tushar Gamit', phone: '9711001029', licenseNumber: 'GJ09-20190090125', transporterId: 'TR-005', transporterName: 'Speedway Transport Co', active: true },
  { id: 'DRV-030', name: 'Uday Prajapati', phone: '9711001030', licenseNumber: 'GJ15-20100001236', transporterId: 'TR-006', transporterName: 'Western India Movers', active: true },
];

// ============================================================
// VEHICLES (100 vehicles)
// ============================================================
const vehicleRaw: Array<{
  id: string; num: string; type: 'TRUCK_14T'|'TRUCK_20T'|'TRUCK_40T'|'TRUCK_SMALL'|'TANKER';
  cap: number; trId: string; trName: string; drvId: string; drvName: string; drvPh: string;
  status: Vehicle['status']; loc: string; locCode: string; lu: string; tripId: string|null; availSince: string|null;
}> = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  const transporterIds = ['TR-001','TR-002','TR-003','TR-004','TR-005','TR-006','TR-007','TR-008','TR-009','TR-010','TR-011','TR-012'];
  const transporterNames = ['ABC Logistics Pvt Ltd','Gujarat Road Carriers','National Express Transport','Reliance Fleet Services','Speedway Transport Co','Western India Movers','Pioneer Road Lines','Shree Ram Transport','Horizon Cargo Services','Supreme Road Transport','PATEL ROADWAYS','Krishi Transport Agency'];
  const trIdx = (idx - 1) % transporterIds.length;
  const drvIdx = (idx - 1) % DRIVERS.length;
  const drv = DRIVERS[drvIdx] || DRIVERS[0];
  const prefixes = ['GJ01','GJ05','GJ06','GJ18','GJ09','GJ15','GJ17','GJ02','GJ04','GJ22','GJ07','GJ12'];
  const letters = ['AB','CD','EF','GH','IJ','KL','MN','OP','QR','ST'];
  const prefix = prefixes[(idx - 1) % prefixes.length];
  const letter = letters[(idx - 1) % letters.length];
  const numPart = String(1000 + idx * 37).slice(-4);
  const locations = ['Plant Ahmedabad','Plant Vadodara','Warehouse Pune','Warehouse Mumbai Central','Warehouse Delhi NCR','Plant Surat','Warehouse Hyderabad','Plant Rajkot'];
  const locCodes = ['PLT-01','PLT-02','WH-02','WH-01','WH-03','PLT-03','WH-04','PLT-04'];
  const locIdx = (idx - 1) % locations.length;
  const caps = [14, 20, 40, 40, 20, 14, 40, 20];
  const cap = caps[(idx - 1) % caps.length];
  const types: Vehicle['vehicleType'][] = ['TRUCK_14T','TRUCK_20T','TRUCK_40T','TRUCK_40T','TRUCK_20T','TRUCK_14T','TANKER','TRUCK_SMALL'];
  return {
    id: `VEH-${String(idx).padStart(3, '0')}`,
    num: idx === 1 ? 'GJ01AB1234' : `${prefix}${letter}${numPart}`,
    type: idx === 1 ? 'TRUCK_40T' : types[(idx - 1) % types.length],
    cap: idx === 1 ? 40 : cap,
    trId: transporterIds[trIdx],
    trName: transporterNames[trIdx],
    drvId: drv.id,
    drvName: drv.name,
    drvPh: drv.phone,
    status: 'AVAILABLE' as const,
    loc: locations[locIdx],
    locCode: locCodes[locIdx],
    lu: ts(8, 0),
    tripId: null,
    availSince: ts(8, 0),
  };
});

export const VEHICLES: Vehicle[] = vehicleRaw.map(v => ({
  id: v.id,
  vehicleNumber: v.num,
  vehicleType: v.type,
  capacityMT: v.cap,
  transporterId: v.trId,
  transporterName: v.trName,
  driverId: v.drvId,
  driverName: v.drvName,
  driverPhone: v.drvPh,
  status: v.status,
  lastConfirmedLocation: v.loc,
  lastConfirmedLocationCode: v.locCode,
  lastUpdated: v.lu,
  currentTripId: v.tripId,
  availableSince: v.availSince,
}));

// ============================================================
// TRANSPORT REQUESTS (Clean Initial State)
// ============================================================
export const TRANSPORT_REQUESTS: TransportRequest[] = [];

// ============================================================
// TRIPS (Clean Initial State)
// ============================================================
export const TRIPS: Trip[] = [];

// ============================================================
// EXCEPTIONS (Clean Initial State)
// ============================================================
export const EXCEPTIONS: TripException[] = [];

// ============================================================
// AUDIT LOG (Clean Initial State)
// ============================================================
export const AUDIT_LOG: AuditEntry[] = [];

// ============================================================
// NOTIFICATIONS (Clean Initial State)
// ============================================================
export const NOTIFICATIONS: AppNotification[] = [];

// ============================================================
// SETTINGS
// ============================================================
export const DEFAULT_SETTINGS: AppSettings = {
  waitingThresholdMinutes: 45,
  loadingThresholdMinutes: 60,
  unloadingThresholdMinutes: 60,
  transitThresholdMinutes: 120,
  notificationsEnabled: true,
  demoMode: true,
  currentRole: 'TRANSPORT_PLANNER',
  currentUser: 'Priya Sharma',
};

// ============================================================
// INITIAL APP STATE
// ============================================================
export const INITIAL_STATE: AppState = {
  plants: PLANTS,
  warehouses: WAREHOUSES,
  transporters: TRANSPORTERS,
  drivers: DRIVERS,
  vehicles: VEHICLES,
  requests: TRANSPORT_REQUESTS,
  trips: TRIPS,
  exceptions: EXCEPTIONS,
  auditLog: AUDIT_LOG,
  notifications: NOTIFICATIONS,
  operatorNotes: OPERATOR_NOTES,
  settings: DEFAULT_SETTINGS,
};
