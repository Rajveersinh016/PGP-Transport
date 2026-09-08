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
}> = [
  // Demo vehicle — ready for master demo trip TR-2026-00421
  { id: 'VEH-001', num: 'GJ01AB1234', type: 'TRUCK_40T', cap: 40, trId: 'TR-001', trName: 'ABC Logistics Pvt Ltd', drvId: 'DRV-001', drvName: 'Rajesh Patel', drvPh: '9711001001', status: 'AVAILABLE', loc: 'Plant Ahmedabad', locCode: 'PLT-01', lu: ts(7, 30), tripId: null, availSince: ts(7, 30) },
  { id: 'VEH-002', num: 'GJ01AB5678', type: 'TRUCK_40T', cap: 40, trId: 'TR-001', trName: 'ABC Logistics Pvt Ltd', drvId: 'DRV-002', drvName: 'Sunil Kumar', drvPh: '9711001002', status: 'IN_TRANSIT', loc: 'Plant Ahmedabad Gate', locCode: 'PLT-01-GATE', lu: ts(10, 42), tripId: 'TRIP-002', availSince: null },
  { id: 'VEH-003', num: 'GJ05CD4567', type: 'TRUCK_20T', cap: 20, trId: 'TR-002', trName: 'Gujarat Road Carriers', drvId: 'DRV-003', drvName: 'Mahesh Yadav', drvPh: '9711001003', status: 'AT_WAREHOUSE', loc: 'Warehouse Pune', locCode: 'WH-02', lu: ts(11, 18), tripId: 'TRIP-003', availSince: null },
  { id: 'VEH-004', num: 'GJ05CD8901', type: 'TRUCK_20T', cap: 20, trId: 'TR-002', trName: 'Gujarat Road Carriers', drvId: 'DRV-004', drvName: 'Ramesh Sharma', drvPh: '9711001004', status: 'UNLOADING', loc: 'Warehouse Mumbai Central', locCode: 'WH-01', lu: ts(12, 5), tripId: 'TRIP-004', availSince: null },
  { id: 'VEH-005', num: 'GJ06EF7821', type: 'TRUCK_40T', cap: 40, trId: 'TR-003', trName: 'National Express Transport', drvId: 'DRV-005', drvName: 'Pradeep Singh', drvPh: '9711001005', status: 'LOADING', loc: 'Plant Vadodara', locCode: 'PLT-02', lu: ts(9, 30), tripId: 'TRIP-005', availSince: null },
  { id: 'VEH-006', num: 'GJ06EF9012', type: 'TRUCK_40T', cap: 40, trId: 'TR-003', trName: 'National Express Transport', drvId: 'DRV-006', drvName: 'Vijay Tiwari', drvPh: '9711001006', status: 'DELAYED', loc: 'Plant Vadodara Gate', locCode: 'PLT-02-GATE', lu: ts(8, 0), tripId: 'TRIP-006', availSince: null },
  { id: 'VEH-007', num: 'GJ18GH9012', type: 'TRUCK_14T', cap: 14, trId: 'TR-004', trName: 'Reliance Fleet Services', drvId: 'DRV-007', drvName: 'Anil Joshi', drvPh: '9711001007', status: 'IN_TRANSIT', loc: 'Plant Surat Gate', locCode: 'PLT-03-GATE', lu: ts(11, 0), tripId: 'TRIP-007', availSince: null },
  { id: 'VEH-008', num: 'GJ18GH3456', type: 'TRUCK_14T', cap: 14, trId: 'TR-004', trName: 'Reliance Fleet Services', drvId: 'DRV-008', drvName: 'Santosh Meena', drvPh: '9711001008', status: 'EMPTY', loc: 'Warehouse Delhi NCR', locCode: 'WH-03', lu: ts(9, 0), tripId: null, availSince: ts(9, 0) },
  { id: 'VEH-009', num: 'GJ09IJ5678', type: 'TRUCK_40T', cap: 40, trId: 'TR-005', trName: 'Speedway Transport Co', drvId: 'DRV-009', drvName: 'Raju Bhatt', drvPh: '9711001009', status: 'AVAILABLE', loc: 'Plant Ahmedabad', locCode: 'PLT-01', lu: ts(7, 30), tripId: null, availSince: ts(7, 30) },
  { id: 'VEH-010', num: 'GJ09IJ2345', type: 'TRUCK_40T', cap: 40, trId: 'TR-005', trName: 'Speedway Transport Co', drvId: 'DRV-010', drvName: 'Deepak Verma', drvPh: '9711001010', status: 'LOADED', loc: 'Plant Rajkot', locCode: 'PLT-04', lu: ts(10, 15), tripId: 'TRIP-010', availSince: null },
  // Remaining 90 vehicles
  ...Array.from({ length: 90 }, (_, i) => {
    const idx = i + 11;
    const statuses: Vehicle['status'][] = ['AVAILABLE','EMPTY','IN_TRANSIT','AT_WAREHOUSE','LOADING','LOADED','AT_PLANT','ASSIGNED','OFFLINE'];
    const status = statuses[idx % statuses.length];
    const transporterIds = ['TR-001','TR-002','TR-003','TR-004','TR-005','TR-006','TR-007','TR-008','TR-009','TR-010','TR-011','TR-012'];
    const transporterNames = ['ABC Logistics Pvt Ltd','Gujarat Road Carriers','National Express Transport','Reliance Fleet Services','Speedway Transport Co','Western India Movers','Pioneer Road Lines','Shree Ram Transport','Horizon Cargo Services','Supreme Road Transport','PATEL ROADWAYS','Krishi Transport Agency'];
    const trIdx = idx % transporterIds.length;
    const drvIdx = (idx % 30);
    const drv = DRIVERS[drvIdx] || DRIVERS[0];
    const prefixes = ['GJ01','GJ05','GJ06','GJ18','GJ09','GJ15','GJ17','GJ02','GJ04','GJ22','GJ07','GJ12'];
    const letters = ['AB','CD','EF','GH','IJ','KL','MN','OP','QR','ST'];
    const prefix = prefixes[idx % prefixes.length];
    const letter = letters[idx % letters.length];
    const numPart = String(1000 + idx * 37).slice(-4);
    const locations = ['Plant Ahmedabad','Plant Vadodara','Warehouse Pune','Warehouse Mumbai Central','Warehouse Delhi NCR','Plant Surat','Warehouse Hyderabad','Plant Rajkot'];
    const locCodes = ['PLT-01','PLT-02','WH-02','WH-01','WH-03','PLT-03','WH-04','PLT-04'];
    const locIdx = idx % locations.length;
    const caps = [14, 20, 40, 40, 20, 14, 40, 20];
    const cap = caps[idx % caps.length];
    const types: Vehicle['vehicleType'][] = ['TRUCK_14T','TRUCK_20T','TRUCK_40T','TRUCK_40T','TRUCK_20T','TRUCK_14T','TANKER','TRUCK_SMALL'];
    return {
      id: `VEH-${String(idx).padStart(3, '0')}`,
      num: `${prefix}${letter}${numPart}`,
      type: types[idx % types.length],
      cap,
      trId: transporterIds[trIdx],
      trName: transporterNames[trIdx],
      drvId: drv.id,
      drvName: drv.name,
      drvPh: drv.phone,
      status,
      loc: locations[locIdx],
      locCode: locCodes[locIdx],
      lu: ts(6 + (idx % 7), (idx * 7) % 60),
      tripId: null,
      availSince: (status === 'AVAILABLE' || status === 'EMPTY') ? ts(6 + (idx % 5), (idx * 11) % 60) : null,
    };
  })
];

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
// TRANSPORT REQUESTS
// ============================================================
const materials: Array<'FG'|'RM'|'OW'|'PGP'|'PM'|'SFG'> = ['FG','RM','OW','PGP','PM','SFG'];
const priorities: Array<'LOW'|'MEDIUM'|'HIGH'|'URGENT'> = ['LOW','MEDIUM','HIGH','URGENT'];

export const TRANSPORT_REQUESTS: TransportRequest[] = [
  {
    id: 'TR-2026-00422',
    requestDate: ts(7, 30),
    sourcePlantId: 'PLT-01',
    sourcePlantName: 'Plant Ahmedabad',
    destinationWarehouseId: 'WH-02',
    destinationWarehouseName: 'Warehouse Pune',
    material: 'RM',
    quantityMT: 35,
    requiredVehicleType: 'TRUCK_40T',
    requiredCapacityMT: 40,
    priority: 'MEDIUM',
    requiredDate: BASE_DATE,
    requiredTime: '15:00',
    remarks: '',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-002',
    assignedVehicleNumber: 'GJ01AB5678',
    tripId: 'TRIP-002',
    createdBy: 'Amit Shah',
  },
  {
    id: 'TR-2026-00423',
    requestDate: ts(7, 0),
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-02',
    destinationWarehouseName: 'Warehouse Pune',
    material: 'FG',
    quantityMT: 18,
    requiredVehicleType: 'TRUCK_20T',
    requiredCapacityMT: 20,
    priority: 'HIGH',
    requiredDate: BASE_DATE,
    requiredTime: '13:00',
    remarks: 'Priority shipment — special order',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-003',
    assignedVehicleNumber: 'GJ05CD4567',
    tripId: 'TRIP-003',
    createdBy: 'Ops Manager',
  },
  {
    id: 'TR-2026-00424',
    requestDate: ts(6, 30),
    sourcePlantId: 'PLT-01',
    sourcePlantName: 'Plant Ahmedabad',
    destinationWarehouseId: 'WH-01',
    destinationWarehouseName: 'Warehouse Mumbai Central',
    material: 'PGP',
    quantityMT: 19,
    requiredVehicleType: 'TRUCK_20T',
    requiredCapacityMT: 20,
    priority: 'URGENT',
    requiredDate: BASE_DATE,
    requiredTime: '12:30',
    remarks: 'Urgent — client delivery deadline',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-004',
    assignedVehicleNumber: 'GJ05CD8901',
    tripId: 'TRIP-004',
    createdBy: 'Suresh Mehta',
  },
  {
    id: 'TR-2026-00425',
    requestDate: ts(8, 30),
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-03',
    destinationWarehouseName: 'Warehouse Delhi NCR',
    material: 'RM',
    quantityMT: 38,
    requiredVehicleType: 'TRUCK_40T',
    requiredCapacityMT: 40,
    priority: 'MEDIUM',
    requiredDate: BASE_DATE,
    requiredTime: '18:00',
    remarks: '',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-005',
    assignedVehicleNumber: 'GJ06EF7821',
    tripId: 'TRIP-005',
    createdBy: 'Ramesh Shah',
  },
  {
    id: 'TR-2026-00426',
    requestDate: ts(6, 0),
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-04',
    destinationWarehouseName: 'Warehouse Hyderabad',
    material: 'FG',
    quantityMT: 37,
    requiredVehicleType: 'TRUCK_40T',
    requiredCapacityMT: 40,
    priority: 'HIGH',
    requiredDate: BASE_DATE,
    requiredTime: '14:00',
    remarks: 'Delayed — vehicle breakdown en route',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-006',
    assignedVehicleNumber: 'GJ06EF9012',
    tripId: 'TRIP-006',
    createdBy: 'Ops Manager',
  },
  {
    id: 'TR-2026-00427',
    requestDate: ts(9, 0),
    sourcePlantId: 'PLT-03',
    sourcePlantName: 'Plant Surat',
    destinationWarehouseId: 'WH-05',
    destinationWarehouseName: 'Warehouse Chennai',
    material: 'PM',
    quantityMT: 12,
    requiredVehicleType: 'TRUCK_14T',
    requiredCapacityMT: 14,
    priority: 'LOW',
    requiredDate: BASE_DATE,
    requiredTime: '20:00',
    remarks: '',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-007',
    assignedVehicleNumber: 'GJ18GH9012',
    tripId: 'TRIP-007',
    createdBy: 'Naresh Patel',
  },
  {
    id: 'TR-2026-00428',
    requestDate: ts(9, 30),
    sourcePlantId: 'PLT-04',
    sourcePlantName: 'Plant Rajkot',
    destinationWarehouseId: 'WH-06',
    destinationWarehouseName: 'Warehouse Kolkata',
    material: 'SFG',
    quantityMT: 38,
    requiredVehicleType: 'TRUCK_40T',
    requiredCapacityMT: 40,
    priority: 'MEDIUM',
    requiredDate: BASE_DATE,
    requiredTime: '22:00',
    remarks: '',
    status: 'IN_PROGRESS',
    assignedVehicleId: 'VEH-010',
    assignedVehicleNumber: 'GJ09IJ2345',
    tripId: 'TRIP-010',
    createdBy: 'Hitesh Joshi',
  },
  // Pending requests
  ...Array.from({ length: 12 }, (_, i) => {
    const idx = i + 429;
    const plt = PLANTS[idx % PLANTS.length];
    const wh = WAREHOUSES[(idx + 2) % WAREHOUSES.length];
    return {
      id: `TR-2026-00${idx}`,
      requestDate: ts(9 + (idx % 3), (idx * 17) % 60),
      sourcePlantId: plt.id,
      sourcePlantName: plt.name,
      destinationWarehouseId: wh.id,
      destinationWarehouseName: wh.name,
      material: materials[idx % materials.length],
      quantityMT: 10 + (idx % 30),
      requiredVehicleType: (['TRUCK_14T','TRUCK_20T','TRUCK_40T'] as const)[idx % 3],
      requiredCapacityMT: [14, 20, 40][idx % 3],
      priority: priorities[idx % priorities.length],
      requiredDate: BASE_DATE,
      requiredTime: `${13 + (idx % 8)}:00`,
      remarks: idx % 4 === 0 ? 'Urgent dispatch required' : '',
      status: 'PENDING' as const,
      assignedVehicleId: null,
      assignedVehicleNumber: null,
      tripId: null,
      createdBy: 'Ops Manager',
    };
  }),
  // Completed requests
  ...Array.from({ length: 15 }, (_, i) => {
    const idx = i;
    const plt = PLANTS[idx % PLANTS.length];
    const wh = WAREHOUSES[(idx + 3) % WAREHOUSES.length];
    return {
      id: `TR-2026-003${String(idx + 50).padStart(2,'0')}`,
      requestDate: ts(4 + (idx % 4), (idx * 13) % 60),
      sourcePlantId: plt.id,
      sourcePlantName: plt.name,
      destinationWarehouseId: wh.id,
      destinationWarehouseName: wh.name,
      material: materials[(idx + 1) % materials.length],
      quantityMT: 15 + (idx % 25),
      requiredVehicleType: (['TRUCK_14T','TRUCK_20T','TRUCK_40T'] as const)[idx % 3],
      requiredCapacityMT: [14, 20, 40][idx % 3],
      priority: priorities[(idx + 1) % priorities.length],
      requiredDate: BASE_DATE,
      requiredTime: `${8 + (idx % 4)}:00`,
      remarks: '',
      status: 'COMPLETED' as const,
      assignedVehicleId: VEHICLES[(idx + 20) % VEHICLES.length].id,
      assignedVehicleNumber: VEHICLES[(idx + 20) % VEHICLES.length].vehicleNumber,
      tripId: `TRIP-COMP-${String(idx + 1).padStart(3,'0')}`,
      createdBy: 'Ops Manager',
    };
  }),
];

// ============================================================
// TRIPS
// ============================================================
const makeEvent = (
  tripId: string, ts_: string, status: TripEvent['status'], checkpoint: string,
  checkpointCode: string, operator: string, role: string, location: string, action: string, remark = ''
): TripEvent => ({
  id: `EVT-${tripId}-${status}`,
  tripId,
  timestamp: ts_,
  status,
  checkpoint,
  checkpointCode,
  operator,
  operatorRole: role,
  location,
  remark,
  action,
});

export const TRIPS: Trip[] = [
  // TRIP-002: IN TRANSIT
  {
    id: 'TRIP-002',
    requestId: 'TR-2026-00422',
    vehicleId: 'VEH-002',
    vehicleNumber: 'GJ01AB5678',
    transporterId: 'TR-001',
    transporterName: 'ABC Logistics Pvt Ltd',
    driverId: 'DRV-002',
    driverName: 'Sunil Kumar',
    driverPhone: '9711001002',
    sourcePlantId: 'PLT-01',
    sourcePlantName: 'Plant Ahmedabad',
    destinationWarehouseId: 'WH-02',
    destinationWarehouseName: 'Warehouse Pune',
    material: 'RM',
    quantityMT: 35,
    priority: 'MEDIUM',
    status: 'IN_TRANSIT',
    lastConfirmedCheckpoint: 'Plant Ahmedabad Gate',
    lastConfirmedCheckpointCode: 'PLT-01-GATE',
    lastConfirmedAt: ts(10, 42),
    startedAt: ts(8, 0),
    expectedCompletionAt: ts(14, 0),
    completedAt: null,
    delayMinutes: 18,
    isDelayed: false,
    events: [
      makeEvent('TRIP-002', ts(7, 30), 'REQUESTED', 'Office', 'OFFICE', 'Ops Manager', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-002', ts(8, 0), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ01AB5678 assigned'),
      makeEvent('TRIP-002', ts(8, 45), 'AT_PLANT', 'Plant Ahmedabad Entry Gate', 'PLT-01-ENTRY', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Vehicle arrived at plant'),
      makeEvent('TRIP-002', ts(9, 0), 'LOADING', 'Plant Ahmedabad Bay 3', 'PLT-01-BAY3', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Loading started at bay 3'),
      makeEvent('TRIP-002', ts(10, 20), 'LOADED', 'Plant Ahmedabad Bay 3', 'PLT-01-BAY3', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Loading completed. 35 MT RM loaded'),
      makeEvent('TRIP-002', ts(10, 42), 'GATE_OUT', 'Plant Ahmedabad Gate', 'PLT-01-GATE', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Vehicle exited plant gate'),
    ],
  },
  // TRIP-003: AT WAREHOUSE
  {
    id: 'TRIP-003',
    requestId: 'TR-2026-00423',
    vehicleId: 'VEH-003',
    vehicleNumber: 'GJ05CD4567',
    transporterId: 'TR-002',
    transporterName: 'Gujarat Road Carriers',
    driverId: 'DRV-003',
    driverName: 'Mahesh Yadav',
    driverPhone: '9711001003',
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-02',
    destinationWarehouseName: 'Warehouse Pune',
    material: 'FG',
    quantityMT: 18,
    priority: 'HIGH',
    status: 'AT_WAREHOUSE',
    lastConfirmedCheckpoint: 'Warehouse Pune',
    lastConfirmedCheckpointCode: 'WH-02',
    lastConfirmedAt: ts(11, 18),
    startedAt: ts(6, 30),
    expectedCompletionAt: ts(13, 0),
    completedAt: null,
    delayMinutes: 0,
    isDelayed: false,
    events: [
      makeEvent('TRIP-003', ts(7, 0), 'REQUESTED', 'Office', 'OFFICE', 'Ops Manager', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-003', ts(6, 30), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ05CD4567 assigned'),
      makeEvent('TRIP-003', ts(7, 10), 'AT_PLANT', 'Plant Vadodara Entry', 'PLT-02-ENTRY', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Vehicle arrived at plant'),
      makeEvent('TRIP-003', ts(7, 30), 'LOADING', 'Plant Vadodara Bay 1', 'PLT-02-BAY1', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Loading started'),
      makeEvent('TRIP-003', ts(8, 45), 'LOADED', 'Plant Vadodara Bay 1', 'PLT-02-BAY1', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Loading completed. 18 MT FG loaded'),
      makeEvent('TRIP-003', ts(9, 5), 'GATE_OUT', 'Plant Vadodara Gate', 'PLT-02-GATE', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Vehicle exited gate'),
      makeEvent('TRIP-003', ts(11, 18), 'AT_WAREHOUSE', 'Warehouse Pune', 'WH-02', 'Priya Joshi', 'WAREHOUSE_OPERATOR', 'Warehouse Pune', 'Vehicle arrived at warehouse'),
    ],
  },
  // TRIP-004: UNLOADING
  {
    id: 'TRIP-004',
    requestId: 'TR-2026-00424',
    vehicleId: 'VEH-004',
    vehicleNumber: 'GJ05CD8901',
    transporterId: 'TR-002',
    transporterName: 'Gujarat Road Carriers',
    driverId: 'DRV-004',
    driverName: 'Ramesh Sharma',
    driverPhone: '9711001004',
    sourcePlantId: 'PLT-01',
    sourcePlantName: 'Plant Ahmedabad',
    destinationWarehouseId: 'WH-01',
    destinationWarehouseName: 'Warehouse Mumbai Central',
    material: 'PGP',
    quantityMT: 19,
    priority: 'URGENT',
    status: 'UNLOADING',
    lastConfirmedCheckpoint: 'Warehouse Mumbai Central',
    lastConfirmedCheckpointCode: 'WH-01',
    lastConfirmedAt: ts(12, 5),
    startedAt: ts(6, 0),
    expectedCompletionAt: ts(12, 30),
    completedAt: null,
    delayMinutes: 0,
    isDelayed: false,
    events: [
      makeEvent('TRIP-004', ts(6, 30), 'REQUESTED', 'Office', 'OFFICE', 'Suresh Mehta', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised', 'Urgent deadline'),
      makeEvent('TRIP-004', ts(6, 0), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ05CD8901 assigned'),
      makeEvent('TRIP-004', ts(6, 40), 'AT_PLANT', 'Plant Ahmedabad Entry', 'PLT-01-ENTRY', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Vehicle arrived at plant'),
      makeEvent('TRIP-004', ts(7, 0), 'LOADING', 'Plant Ahmedabad Bay 2', 'PLT-01-BAY2', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Loading started'),
      makeEvent('TRIP-004', ts(7, 45), 'LOADED', 'Plant Ahmedabad Bay 2', 'PLT-01-BAY2', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Loading completed. 19 MT PGP loaded'),
      makeEvent('TRIP-004', ts(8, 0), 'GATE_OUT', 'Plant Ahmedabad Gate', 'PLT-01-GATE', 'Suresh Mehta', 'PLANT_OPERATOR', 'Plant Ahmedabad', 'Vehicle exited gate'),
      makeEvent('TRIP-004', ts(11, 50), 'AT_WAREHOUSE', 'Warehouse Mumbai Central', 'WH-01', 'Anil Desai', 'WAREHOUSE_OPERATOR', 'Warehouse Mumbai Central', 'Vehicle arrived at warehouse'),
      makeEvent('TRIP-004', ts(12, 5), 'UNLOADING', 'Warehouse Mumbai Central Bay 4', 'WH-01-BAY4', 'Anil Desai', 'WAREHOUSE_OPERATOR', 'Warehouse Mumbai Central', 'Unloading started'),
    ],
  },
  // TRIP-005: LOADING
  {
    id: 'TRIP-005',
    requestId: 'TR-2026-00425',
    vehicleId: 'VEH-005',
    vehicleNumber: 'GJ06EF7821',
    transporterId: 'TR-003',
    transporterName: 'National Express Transport',
    driverId: 'DRV-005',
    driverName: 'Pradeep Singh',
    driverPhone: '9711001005',
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-03',
    destinationWarehouseName: 'Warehouse Delhi NCR',
    material: 'RM',
    quantityMT: 38,
    priority: 'MEDIUM',
    status: 'LOADING',
    lastConfirmedCheckpoint: 'Plant Vadodara Bay 2',
    lastConfirmedCheckpointCode: 'PLT-02-BAY2',
    lastConfirmedAt: ts(9, 30),
    startedAt: ts(8, 30),
    expectedCompletionAt: ts(18, 0),
    completedAt: null,
    delayMinutes: 0,
    isDelayed: false,
    events: [
      makeEvent('TRIP-005', ts(8, 30), 'REQUESTED', 'Office', 'OFFICE', 'Ramesh Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-005', ts(8, 30), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ06EF7821 assigned'),
      makeEvent('TRIP-005', ts(9, 10), 'AT_PLANT', 'Plant Vadodara Entry', 'PLT-02-ENTRY', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Vehicle arrived at plant'),
      makeEvent('TRIP-005', ts(9, 30), 'LOADING', 'Plant Vadodara Bay 2', 'PLT-02-BAY2', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Loading started at bay 2'),
    ],
  },
  // TRIP-006: DELAYED IN TRANSIT
  {
    id: 'TRIP-006',
    requestId: 'TR-2026-00426',
    vehicleId: 'VEH-006',
    vehicleNumber: 'GJ06EF9012',
    transporterId: 'TR-003',
    transporterName: 'National Express Transport',
    driverId: 'DRV-006',
    driverName: 'Vijay Tiwari',
    driverPhone: '9711001006',
    sourcePlantId: 'PLT-02',
    sourcePlantName: 'Plant Vadodara',
    destinationWarehouseId: 'WH-04',
    destinationWarehouseName: 'Warehouse Hyderabad',
    material: 'FG',
    quantityMT: 37,
    priority: 'HIGH',
    status: 'IN_TRANSIT',
    lastConfirmedCheckpoint: 'Plant Vadodara Gate',
    lastConfirmedCheckpointCode: 'PLT-02-GATE',
    lastConfirmedAt: ts(8, 0),
    startedAt: ts(6, 0),
    expectedCompletionAt: ts(12, 0),
    completedAt: null,
    delayMinutes: 52,
    isDelayed: true,
    events: [
      makeEvent('TRIP-006', ts(6, 0), 'REQUESTED', 'Office', 'OFFICE', 'Ops Manager', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-006', ts(6, 0), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ06EF9012 assigned'),
      makeEvent('TRIP-006', ts(6, 30), 'AT_PLANT', 'Plant Vadodara Entry', 'PLT-02-ENTRY', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Vehicle arrived at plant'),
      makeEvent('TRIP-006', ts(6, 45), 'LOADING', 'Plant Vadodara Bay 3', 'PLT-02-BAY3', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Loading started'),
      makeEvent('TRIP-006', ts(7, 30), 'LOADED', 'Plant Vadodara Bay 3', 'PLT-02-BAY3', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Loading completed. 37 MT FG loaded'),
      makeEvent('TRIP-006', ts(8, 0), 'GATE_OUT', 'Plant Vadodara Gate', 'PLT-02-GATE', 'Ramesh Shah', 'PLANT_OPERATOR', 'Plant Vadodara', 'Vehicle exited gate'),
    ],
  },
  // TRIP-007: IN TRANSIT
  {
    id: 'TRIP-007',
    requestId: 'TR-2026-00427',
    vehicleId: 'VEH-007',
    vehicleNumber: 'GJ18GH9012',
    transporterId: 'TR-004',
    transporterName: 'Reliance Fleet Services',
    driverId: 'DRV-007',
    driverName: 'Anil Joshi',
    driverPhone: '9711001007',
    sourcePlantId: 'PLT-03',
    sourcePlantName: 'Plant Surat',
    destinationWarehouseId: 'WH-05',
    destinationWarehouseName: 'Warehouse Chennai',
    material: 'PM',
    quantityMT: 12,
    priority: 'LOW',
    status: 'IN_TRANSIT',
    lastConfirmedCheckpoint: 'Plant Surat Gate',
    lastConfirmedCheckpointCode: 'PLT-03-GATE',
    lastConfirmedAt: ts(11, 0),
    startedAt: ts(9, 0),
    expectedCompletionAt: ts(20, 0),
    completedAt: null,
    delayMinutes: 0,
    isDelayed: false,
    events: [
      makeEvent('TRIP-007', ts(9, 0), 'REQUESTED', 'Office', 'OFFICE', 'Naresh Patel', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-007', ts(9, 0), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ18GH9012 assigned'),
      makeEvent('TRIP-007', ts(9, 40), 'AT_PLANT', 'Plant Surat Entry', 'PLT-03-ENTRY', 'Naresh Patel', 'PLANT_OPERATOR', 'Plant Surat', 'Vehicle arrived at plant'),
      makeEvent('TRIP-007', ts(10, 0), 'LOADING', 'Plant Surat Bay 1', 'PLT-03-BAY1', 'Naresh Patel', 'PLANT_OPERATOR', 'Plant Surat', 'Loading started'),
      makeEvent('TRIP-007', ts(10, 40), 'LOADED', 'Plant Surat Bay 1', 'PLT-03-BAY1', 'Naresh Patel', 'PLANT_OPERATOR', 'Plant Surat', 'Loading completed. 12 MT PM loaded'),
      makeEvent('TRIP-007', ts(11, 0), 'GATE_OUT', 'Plant Surat Gate', 'PLT-03-GATE', 'Naresh Patel', 'PLANT_OPERATOR', 'Plant Surat', 'Vehicle exited gate'),
    ],
  },
  // TRIP-010: LOADED
  {
    id: 'TRIP-010',
    requestId: 'TR-2026-00428',
    vehicleId: 'VEH-010',
    vehicleNumber: 'GJ09IJ2345',
    transporterId: 'TR-005',
    transporterName: 'Speedway Transport Co',
    driverId: 'DRV-010',
    driverName: 'Deepak Verma',
    driverPhone: '9711001010',
    sourcePlantId: 'PLT-04',
    sourcePlantName: 'Plant Rajkot',
    destinationWarehouseId: 'WH-06',
    destinationWarehouseName: 'Warehouse Kolkata',
    material: 'SFG',
    quantityMT: 38,
    priority: 'MEDIUM',
    status: 'LOADED',
    lastConfirmedCheckpoint: 'Plant Rajkot Bay 2',
    lastConfirmedCheckpointCode: 'PLT-04-BAY2',
    lastConfirmedAt: ts(10, 15),
    startedAt: ts(9, 30),
    expectedCompletionAt: ts(22, 0),
    completedAt: null,
    delayMinutes: 0,
    isDelayed: false,
    events: [
      makeEvent('TRIP-010', ts(9, 30), 'REQUESTED', 'Office', 'OFFICE', 'Hitesh Joshi', 'TRANSPORT_PLANNER', 'Head Office', 'Transport request raised'),
      makeEvent('TRIP-010', ts(9, 30), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle GJ09IJ2345 assigned'),
      makeEvent('TRIP-010', ts(9, 50), 'AT_PLANT', 'Plant Rajkot Entry', 'PLT-04-ENTRY', 'Hitesh Joshi', 'PLANT_OPERATOR', 'Plant Rajkot', 'Vehicle arrived at plant'),
      makeEvent('TRIP-010', ts(10, 0), 'LOADING', 'Plant Rajkot Bay 2', 'PLT-04-BAY2', 'Hitesh Joshi', 'PLANT_OPERATOR', 'Plant Rajkot', 'Loading started'),
      makeEvent('TRIP-010', ts(10, 15), 'LOADED', 'Plant Rajkot Bay 2', 'PLT-04-BAY2', 'Hitesh Joshi', 'PLANT_OPERATOR', 'Plant Rajkot', 'Loading completed. 38 MT SFG loaded'),
    ],
  },
  // Completed trips
  ...Array.from({ length: 15 }, (_, i): Trip => {
    const idx = i;
    const veh = VEHICLES[(idx + 20) % VEHICLES.length];
    const plt = PLANTS[idx % PLANTS.length];
    const wh = WAREHOUSES[(idx + 3) % WAREHOUSES.length];
    const mat = materials[idx % materials.length];
    const qty = 15 + (idx % 25);
    const startH = 3 + (idx % 4);
    const endH = startH + 5 + (idx % 3);
    return {
      id: `TRIP-COMP-${String(idx + 1).padStart(3, '0')}`,
      requestId: `TR-2026-003${String(idx + 50).padStart(2, '0')}`,
      vehicleId: veh.id,
      vehicleNumber: veh.vehicleNumber,
      transporterId: veh.transporterId,
      transporterName: veh.transporterName,
      driverId: veh.driverId,
      driverName: veh.driverName,
      driverPhone: veh.driverPhone,
      sourcePlantId: plt.id,
      sourcePlantName: plt.name,
      destinationWarehouseId: wh.id,
      destinationWarehouseName: wh.name,
      material: mat,
      quantityMT: qty,
      priority: priorities[idx % priorities.length],
      status: 'COMPLETED',
      lastConfirmedCheckpoint: wh.name,
      lastConfirmedCheckpointCode: wh.id,
      lastConfirmedAt: ts(endH, (idx * 11) % 60),
      startedAt: ts(startH, (idx * 7) % 60),
      expectedCompletionAt: ts(endH - 1, 0),
      completedAt: ts(endH, (idx * 11) % 60),
      delayMinutes: idx % 4 === 0 ? 0 : 0,
      isDelayed: false,
      events: [
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH, 0), 'REQUESTED', 'Office', 'OFFICE', 'Ops Manager', 'TRANSPORT_PLANNER', 'Head Office', 'Request raised'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH, 10), 'ASSIGNED', 'Transport Office', 'OFFICE', 'Amit Shah', 'TRANSPORT_PLANNER', 'Head Office', 'Vehicle assigned'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH, 30), 'AT_PLANT', plt.name, plt.id, 'Plant Operator', 'PLANT_OPERATOR', plt.name, 'Vehicle arrived at plant'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH, 45), 'LOADING', `${plt.name} Bay`, `${plt.id}-BAY`, 'Plant Operator', 'PLANT_OPERATOR', plt.name, 'Loading started'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH + 1, 30), 'LOADED', `${plt.name} Bay`, `${plt.id}-BAY`, 'Plant Operator', 'PLANT_OPERATOR', plt.name, 'Loading completed'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(startH + 1, 45), 'GATE_OUT', `${plt.name} Gate`, `${plt.id}-GATE`, 'Plant Operator', 'PLANT_OPERATOR', plt.name, 'Vehicle exited gate'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(endH - 1, 20), 'AT_WAREHOUSE', wh.name, wh.id, 'WH Operator', 'WAREHOUSE_OPERATOR', wh.name, 'Vehicle arrived at warehouse'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(endH - 1, 30), 'UNLOADING', `${wh.name} Bay`, `${wh.id}-BAY`, 'WH Operator', 'WAREHOUSE_OPERATOR', wh.name, 'Unloading started'),
        makeEvent(`TRIP-COMP-${String(idx+1).padStart(3,'0')}`, ts(endH, (idx*11)%60), 'COMPLETED', wh.name, wh.id, 'WH Operator', 'WAREHOUSE_OPERATOR', wh.name, 'Trip completed'),
      ],
    };
  }),
];

// ============================================================
// EXCEPTIONS
// ============================================================
export const EXCEPTIONS: TripException[] = [
  {
    id: 'EXC-001',
    type: 'DELAYED_TRIP',
    severity: 'CRITICAL',
    tripId: 'TRIP-006',
    vehicleId: 'VEH-006',
    vehicleNumber: 'GJ06EF9012',
    requestId: 'TR-2026-00426',
    title: 'Trip Delayed — 52 minutes',
    description: 'Vehicle GJ06EF9012 is IN TRANSIT from Plant Vadodara to WH-04. Expected arrival was 12:00 PM. Last confirmed at Plant Vadodara Gate at 08:00 AM. No checkpoint update received for 5h 40min.',
    detectedAt: ts(12, 0),
    resolvedAt: null,
    resolved: false,
    assignedTo: 'Amit Shah',
    remarks: ['Driver contacted — stuck in highway traffic near Surat bypass'],
  },
  {
    id: 'EXC-002',
    type: 'WAITING_TOO_LONG',
    severity: 'WARNING',
    tripId: null,
    vehicleId: 'VEH-008',
    vehicleNumber: 'GJ18GH3456',
    requestId: null,
    title: 'Vehicle Empty at Warehouse > 4 hours',
    description: 'Vehicle GJ18GH3456 completed unloading at WH-03 (Delhi NCR) at 09:00 AM. No return trip assigned for 4+ hours. Vehicle is idle and incurring detention charges.',
    detectedAt: ts(11, 0),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-003',
    type: 'UNASSIGNED_REQUEST',
    severity: 'WARNING',
    tripId: null,
    vehicleId: null,
    vehicleNumber: null,
    requestId: 'TR-2026-00429',
    title: 'Transport Request Unassigned — 2 hours',
    description: 'Transport request TR-2026-00429 from Plant Surat to WH-06 has been pending for 2 hours with no vehicle assignment. Dispatch deadline is 15:00.',
    detectedAt: ts(11, 30),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-004',
    type: 'MISSING_CHECKPOINT',
    severity: 'WARNING',
    tripId: 'TRIP-007',
    vehicleId: 'VEH-007',
    vehicleNumber: 'GJ18GH9012',
    requestId: 'TR-2026-00427',
    title: 'No Checkpoint Update for 2.5 hours',
    description: 'Vehicle GJ18GH9012 last confirmed at Plant Surat Gate at 11:00. No warehouse arrival confirmed. Expected transit time is ~8 hours but no intermediate update received.',
    detectedAt: ts(13, 30),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-005',
    type: 'OVERDUE_ARRIVAL',
    severity: 'CRITICAL',
    tripId: 'TRIP-002',
    vehicleId: 'VEH-002',
    vehicleNumber: 'GJ01AB5678',
    requestId: 'TR-2026-00422',
    title: 'Warehouse Arrival Overdue — 18 min',
    description: 'Vehicle GJ01AB5678 expected at WH-02 by 14:00. Current time is 14:18. No arrival confirmation received. Last confirmed at Plant Ahmedabad Gate.',
    detectedAt: ts(14, 0),
    resolvedAt: null,
    resolved: false,
    assignedTo: 'Priya Joshi',
    remarks: ['WH-02 operator alerted to watch for arrival'],
  },
  {
    id: 'EXC-006',
    type: 'WAITING_TOO_LONG',
    severity: 'WARNING',
    tripId: 'TRIP-003',
    vehicleId: 'VEH-003',
    vehicleNumber: 'GJ05CD4567',
    requestId: 'TR-2026-00423',
    title: 'Vehicle Waiting at Warehouse > 45 min',
    description: 'Vehicle GJ05CD4567 arrived at WH-02 at 11:18. Unloading has not started after 45 minutes. Warehouse dock may be busy.',
    detectedAt: ts(12, 3),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-007',
    type: 'TRACKING_MISSING',
    severity: 'INFO',
    tripId: null,
    vehicleId: 'VEH-020',
    vehicleNumber: 'GJ15KL3740',
    requestId: null,
    title: 'No Status Update — Vehicle Offline',
    description: 'Vehicle GJ15KL3740 has not had any status update in 12+ hours. Vehicle may be offline or out of service.',
    detectedAt: ts(7, 0),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-008',
    type: 'DELAYED_TRIP',
    severity: 'WARNING',
    tripId: 'TRIP-005',
    vehicleId: 'VEH-005',
    vehicleNumber: 'GJ06EF7821',
    requestId: 'TR-2026-00425',
    title: 'Loading in Progress > 90 min',
    description: 'Vehicle GJ06EF7821 loading started at Plant Vadodara at 09:30. Loading still in progress after 90+ minutes. Normal loading time is 60 minutes for 38 MT.',
    detectedAt: ts(11, 0),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-009',
    type: 'UNASSIGNED_REQUEST',
    severity: 'INFO',
    tripId: null,
    vehicleId: null,
    vehicleNumber: null,
    requestId: 'TR-2026-00432',
    title: 'Pending Request — No Assignment',
    description: 'Transport request TR-2026-00432 created 3 hours ago. Required dispatch time is 16:00. No vehicle assigned yet.',
    detectedAt: ts(10, 30),
    resolvedAt: null,
    resolved: false,
    assignedTo: null,
    remarks: [],
  },
  {
    id: 'EXC-010',
    type: 'DELAYED_TRIP',
    severity: 'WARNING',
    tripId: 'TRIP-004',
    vehicleId: 'VEH-004',
    vehicleNumber: 'GJ05CD8901',
    requestId: 'TR-2026-00424',
    title: 'Unloading Taking Longer Than Expected',
    description: 'Vehicle GJ05CD8901 started unloading at WH-01 at 12:05. Expected to complete by 12:30. Still in progress as of 13:40.',
    detectedAt: ts(12, 30),
    resolvedAt: null,
    resolved: false,
    assignedTo: 'Anil Desai',
    remarks: [],
  },
];

// ============================================================
// AUDIT LOG
// ============================================================
export const AUDIT_LOG: AuditEntry[] = [
  { id: 'AUD-003', timestamp: ts(7, 30), operator: 'Ops Manager', operatorRole: 'TRANSPORT_PLANNER', module: 'Transport Requests', action: 'Request Created', entityType: 'TransportRequest', entityId: 'TR-2026-00422', entityLabel: 'TR-2026-00422', oldValue: null, newValue: 'PENDING', location: 'Head Office', ipAddress: '192.168.1.10' },
  { id: 'AUD-004', timestamp: ts(8, 0), operator: 'Amit Shah', operatorRole: 'TRANSPORT_PLANNER', module: 'Vehicle Assignment', action: 'Vehicle Assigned', entityType: 'Trip', entityId: 'TRIP-002', entityLabel: 'TRIP-002 → GJ01AB5678', oldValue: 'PENDING', newValue: 'ASSIGNED', location: 'Head Office', ipAddress: '192.168.1.11' },
  { id: 'AUD-005', timestamp: ts(8, 45), operator: 'Suresh Mehta', operatorRole: 'PLANT_OPERATOR', module: 'Trip Execution', action: 'Status Updated', entityType: 'Trip', entityId: 'TRIP-002', entityLabel: 'GJ01AB5678', oldValue: 'ASSIGNED', newValue: 'AT_PLANT', location: 'Plant Ahmedabad', ipAddress: '192.168.2.15' },
  { id: 'AUD-006', timestamp: ts(9, 0), operator: 'Suresh Mehta', operatorRole: 'PLANT_OPERATOR', module: 'Trip Execution', action: 'Loading Started', entityType: 'Trip', entityId: 'TRIP-002', entityLabel: 'GJ01AB5678', oldValue: 'AT_PLANT', newValue: 'LOADING', location: 'Plant Ahmedabad', ipAddress: '192.168.2.15' },
  { id: 'AUD-007', timestamp: ts(10, 20), operator: 'Suresh Mehta', operatorRole: 'PLANT_OPERATOR', module: 'Trip Execution', action: 'Loading Completed', entityType: 'Trip', entityId: 'TRIP-002', entityLabel: 'GJ01AB5678', oldValue: 'LOADING', newValue: 'LOADED', location: 'Plant Ahmedabad', ipAddress: '192.168.2.15' },
  { id: 'AUD-008', timestamp: ts(10, 42), operator: 'Suresh Mehta', operatorRole: 'PLANT_OPERATOR', module: 'Trip Execution', action: 'Gate Out', entityType: 'Trip', entityId: 'TRIP-002', entityLabel: 'GJ01AB5678', oldValue: 'LOADED', newValue: 'IN_TRANSIT', location: 'Plant Ahmedabad', ipAddress: '192.168.2.15' },
  { id: 'AUD-009', timestamp: ts(11, 18), operator: 'Priya Joshi', operatorRole: 'WAREHOUSE_OPERATOR', module: 'Trip Execution', action: 'Warehouse Arrival Confirmed', entityType: 'Trip', entityId: 'TRIP-003', entityLabel: 'GJ05CD4567', oldValue: 'IN_TRANSIT', newValue: 'AT_WAREHOUSE', location: 'Warehouse Pune', ipAddress: '192.168.3.22' },
  { id: 'AUD-010', timestamp: ts(12, 5), operator: 'Anil Desai', operatorRole: 'WAREHOUSE_OPERATOR', module: 'Trip Execution', action: 'Unloading Started', entityType: 'Trip', entityId: 'TRIP-004', entityLabel: 'GJ05CD8901', oldValue: 'AT_WAREHOUSE', newValue: 'UNLOADING', location: 'Warehouse Mumbai Central', ipAddress: '192.168.3.31' },
  { id: 'AUD-011', timestamp: ts(12, 0), operator: 'System', operatorRole: 'ADMIN', module: 'Exceptions', action: 'Exception Raised', entityType: 'Exception', entityId: 'EXC-001', entityLabel: 'Delayed — GJ06EF9012', oldValue: null, newValue: 'ACTIVE', location: 'System', ipAddress: '192.168.1.1' },
  { id: 'AUD-012', timestamp: ts(9, 30), operator: 'Ramesh Shah', operatorRole: 'PLANT_OPERATOR', module: 'Trip Execution', action: 'Loading Started', entityType: 'Trip', entityId: 'TRIP-005', entityLabel: 'GJ06EF7821', oldValue: 'AT_PLANT', newValue: 'LOADING', location: 'Plant Vadodara', ipAddress: '192.168.2.18' },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const NOTIFICATIONS: AppNotification[] = [
  { id: 'NOT-001', timestamp: ts(11, 18), type: 'SUCCESS', title: 'Arrival Confirmed', body: 'GJ05CD4567 arrived at WH-02 (Warehouse Pune)', read: false, link: '/vehicles/VEH-003', vehicleId: 'VEH-003', tripId: 'TRIP-003' },
  { id: 'NOT-002', timestamp: ts(12, 0), type: 'WARNING', title: 'Trip Delayed', body: 'GJ06EF9012 delayed by 52 minutes — in transit to WH-04', read: false, link: '/exceptions', vehicleId: 'VEH-006', tripId: 'TRIP-006' },
  { id: 'NOT-003', timestamp: ts(11, 30), type: 'WARNING', title: 'Unassigned Request', body: 'TR-2026-00429 still pending assignment — deadline 15:00', read: false, link: '/requests', vehicleId: null, tripId: null },
  { id: 'NOT-004', timestamp: ts(9, 0), type: 'INFO', title: '3 Vehicles Available at PLT-01', body: 'VEH-009 and 2 others available at Plant Ahmedabad', read: true, link: '/vehicles/empty', vehicleId: null, tripId: null },
  { id: 'NOT-005', timestamp: ts(12, 3), type: 'WARNING', title: 'WH-02 Dock Busy', body: 'GJ05CD4567 waiting at WH-02 for 45+ min — no dock available', read: false, link: '/warehouses/WH-02', vehicleId: 'VEH-003', tripId: 'TRIP-003' },
  { id: 'NOT-006', timestamp: ts(12, 5), type: 'INFO', title: 'Unloading Started', body: 'GJ05CD8901 unloading started at WH-01 (Mumbai Central)', read: true, link: '/vehicles/VEH-004', vehicleId: 'VEH-004', tripId: 'TRIP-004' },
  { id: 'NOT-007', timestamp: ts(10, 42), type: 'SUCCESS', title: 'Gate Out', body: 'GJ01AB5678 departed Plant Ahmedabad — now IN TRANSIT to WH-02', read: true, link: '/vehicles/VEH-002', vehicleId: 'VEH-002', tripId: 'TRIP-002' },
  { id: 'NOT-008', timestamp: ts(11, 0), type: 'INFO', title: 'Vehicle in Transit', body: 'GJ18GH9012 departed Plant Surat for WH-05 (Chennai)', read: true, link: '/vehicles/VEH-007', vehicleId: 'VEH-007', tripId: 'TRIP-007' },
];

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
