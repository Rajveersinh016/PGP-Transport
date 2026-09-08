import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, QrCode, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusBadge, SearchBar, SelectFilter, Table, Th, Td, EmptyState, Card, Button, Modal } from '../components/ui';
import type { VehicleStatus } from '../types';

interface VehiclesPageProps {
  filterStatus?: VehicleStatus[];
  title?: string;
  subtitle?: string;
}

export function VehiclesPage({ filterStatus, title = 'All Vehicles', subtitle }: VehiclesPageProps) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [transporterFilter, setTransporterFilter] = useState('');
  const [qrVehicleId, setQrVehicleId] = useState<string | null>(null);

  const filteredVehicles = state.vehicles.filter(v => {
    if (filterStatus && !filterStatus.includes(v.status)) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    if (transporterFilter && v.transporterId !== transporterFilter) return false;
    const q = search.toLowerCase();
    if (q && !v.vehicleNumber.toLowerCase().includes(q) && !v.driverName.toLowerCase().includes(q) &&
        !v.transporterName.toLowerCase().includes(q) && !v.lastConfirmedLocation.toLowerCase().includes(q)) return false;
    return true;
  });

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Empty', value: 'EMPTY' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'At Plant', value: 'AT_PLANT' },
    { label: 'Loading', value: 'LOADING' },
    { label: 'Loaded', value: 'LOADED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'At Warehouse', value: 'AT_WAREHOUSE' },
    { label: 'Unloading', value: 'UNLOADING' },
    { label: 'Delayed', value: 'DELAYED' },
    { label: 'Offline', value: 'OFFLINE' },
  ];

  const transporterOptions = [
    { label: 'All Transporters', value: '' },
    ...state.transporters.map(t => ({ label: t.name, value: t.id })),
  ];

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const qrVehicle = qrVehicleId ? state.vehicles.find(v => v.id === qrVehicleId) : null;
  const vehicleTypeLabels: Record<string, string> = {
    TRUCK_14T: '14T Truck', TRUCK_20T: '20T Truck', TRUCK_40T: '40T Truck', TRUCK_SMALL: 'Small Truck', TANKER: 'Tanker',
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle || `${filteredVehicles.length} of ${state.vehicles.length} vehicles`}
        breadcrumb={['Vehicles', title]}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search vehicle, driver, transporter..." className="w-full sm:w-72" />
        {!filterStatus && <SelectFilter value={statusFilter} onChange={setStatusFilter} options={statusOptions} label="Status filter" />}
        <SelectFilter value={transporterFilter} onChange={setTransporterFilter} options={transporterOptions} label="Transporter filter" />
      </div>

      <Card padding={false}>
        <Table>
          <thead>
            <tr>
              <Th>Vehicle</Th>
              <Th>Type / Capacity</Th>
              <Th>Status</Th>
              <Th className="hidden md:table-cell">Driver</Th>
              <Th className="hidden lg:table-cell">Transporter</Th>
              <Th className="hidden lg:table-cell">Last Checkpoint</Th>
              <Th className="hidden xl:table-cell">Current Trip</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(vehicle => (
              <tr
                key={vehicle.id}
                className="hover:bg-[#FFF0E9]/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                <Td>
                  <div className="font-bold text-gray-900 font-mono text-sm">{vehicle.vehicleNumber}</div>
                  <div className="text-xs text-gray-400">{vehicle.id}</div>
                </Td>
                <Td>
                  <div className="text-xs text-gray-700">{vehicleTypeLabels[vehicle.vehicleType]}</div>
                  <div className="text-xs font-semibold text-gray-900">{vehicle.capacityMT} MT</div>
                </Td>
                <Td><StatusBadge type="vehicle" value={vehicle.status} size="sm" /></Td>
                <Td className="hidden md:table-cell">
                  <div className="text-xs text-gray-700">{vehicle.driverName}</div>
                  <div className="text-xs text-gray-400">{vehicle.driverPhone}</div>
                </Td>
                <Td className="hidden lg:table-cell">
                  <div className="text-xs text-gray-600 truncate max-w-[140px]">{vehicle.transporterName}</div>
                </Td>
                <Td className="hidden lg:table-cell">
                  <div className="text-xs text-gray-700 truncate max-w-[140px]">{vehicle.lastConfirmedLocation}</div>
                  <div className="text-xs text-gray-400">{timeFmt(vehicle.lastUpdated)}</div>
                </Td>
                <Td className="hidden xl:table-cell">
                  {vehicle.currentTripId
                    ? <span className="text-xs font-semibold text-[#F4511E]">{vehicle.currentTripId}</span>
                    : <span className="text-xs text-gray-400 italic">No active trip</span>}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/vehicles/${vehicle.id}`); }}
                      className="text-[#101820] hover:text-[#F4511E] transition-colors"
                      aria-label={`View ${vehicle.vehicleNumber}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setQrVehicleId(vehicle.id); }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={`QR code for ${vehicle.vehicleNumber}`}
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filteredVehicles.length === 0 && (
          <EmptyState icon={<Truck size={32} />} title="No vehicles found" description="Adjust your search or filters." />
        )}
      </Card>

      {/* QR Code Modal */}
      <Modal open={!!qrVehicle} onClose={() => setQrVehicleId(null)} title="Vehicle QR Code" size="sm">
        {qrVehicle && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">Demo QR Code — Not a real QR scanner</p>
            {/* Simple SVG QR placeholder */}
            <div className="w-48 h-48 mx-auto border-4 border-gray-900 rounded-lg p-2 bg-white flex items-center justify-center">
              <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900 font-mono">{qrVehicle.vehicleNumber}</p>
              <p className="text-sm text-gray-500">{qrVehicle.id}</p>
              <StatusBadge type="vehicle" value={qrVehicle.status} />
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded border border-gray-200">
              In a live system, scanning this QR code would open the vehicle's operational status page for quick checkpoint confirmation.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// EMPTY / AVAILABLE VEHICLES VIEW (DEDICATED VISUAL CARDS)
// Per prompt: large vehicle icon, vehicle number, capacity,
// current checkpoint, available since, transporter,
// Primary action: ASSIGN VEHICLE in Orange.
// ============================================================
export function EmptyVehicles() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [transporterFilter, setTransporterFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const emptyVehicles = state.vehicles.filter(v => v.status === 'AVAILABLE' || v.status === 'EMPTY');

  const filtered = emptyVehicles.filter(v => {
    if (transporterFilter && v.transporterId !== transporterFilter) return false;
    const q = search.toLowerCase();
    if (q && !v.vehicleNumber.toLowerCase().includes(q) && !v.driverName.toLowerCase().includes(q) &&
        !v.transporterName.toLowerCase().includes(q) && !v.lastConfirmedLocation.toLowerCase().includes(q)) return false;
    return true;
  });

  const transporterOptions = [
    { label: 'All Transporters', value: '' },
    ...state.transporters.map(t => ({ label: t.name, value: t.id })),
  ];

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empty / Available Vehicles"
        subtitle={`${filtered.length} vehicles currently available and ready for transport assignment`}
        breadcrumb={['Vehicles', 'Empty / Available']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[10px] border transition-colors ${viewMode === 'grid' ? 'bg-[#F4511E] text-white border-[#F4511E]' : 'bg-white text-[#101820] border-[#E8E5E0]'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[10px] border transition-colors ${viewMode === 'table' ? 'bg-[#F4511E] text-white border-[#F4511E]' : 'bg-white text-[#101820] border-[#E8E5E0]'}`}
            >
              Table View
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-white border border-[#E8E5E0] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search empty vehicles, locations..." className="w-full sm:w-72" />
        <SelectFilter value={transporterFilter} onChange={setTransporterFilter} options={transporterOptions} label="Transporter filter" />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(vehicle => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-[#E8E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#F4511E]/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with large vehicle icon & status badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0E9] text-[#F4511E] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Truck size={24} />
                  </div>
                  <div className="text-right">
                    <StatusBadge type="vehicle" value={vehicle.status} size="sm" />
                    <p className="text-[10px] text-emerald-700 font-bold mt-1 uppercase tracking-wider">Ready to Assign</p>
                  </div>
                </div>

                {/* Vehicle Number */}
                <h3 className="text-lg font-bold text-[#101820] font-mono tracking-tight">{vehicle.vehicleNumber}</h3>
                <p className="text-xs text-[#8E9CA8] font-mono mt-0.5">{vehicle.id}</p>

                {/* Details list */}
                <div className="mt-4 pt-4 border-t border-[#F0EDE8] space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E9CA8] font-medium">Capacity</span>
                    <span className="font-bold text-[#101820]">{vehicle.capacityMT} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9CA8] font-medium">Current Checkpoint</span>
                    <span className="font-semibold text-[#101820] truncate max-w-[150px] text-right">{vehicle.lastConfirmedLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9CA8] font-medium">Available Since</span>
                    <span className="font-semibold text-[#555E68]">{timeFmt(vehicle.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9CA8] font-medium">Transporter</span>
                    <span className="font-semibold text-[#101820] truncate max-w-[150px] text-right">{vehicle.transporterName}</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button - Orange */}
              <div className="mt-5 pt-4 border-t border-[#F0EDE8]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center text-xs uppercase tracking-wider"
                  onClick={() => navigate('/assignment')}
                >
                  Assign Vehicle
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full">
              <Card>
                <EmptyState icon={<Truck size={40} className="text-[#8E9CA8]" />} title="No available vehicles" description="All vehicles are currently assigned, loading, or in transit." />
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Card padding={false}>
          <Table>
            <thead>
              <tr>
                <Th>Vehicle</Th>
                <Th>Capacity</Th>
                <Th>Status</Th>
                <Th>Current Checkpoint</Th>
                <Th>Transporter</Th>
                <Th>Available Since</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-[#FFF0E9]/40 transition-colors">
                  <Td>
                    <div className="font-bold text-[#101820] font-mono text-xs">{vehicle.vehicleNumber}</div>
                    <div className="text-[11px] text-[#8E9CA8] font-mono">{vehicle.id}</div>
                  </Td>
                  <Td className="font-bold text-[#101820]">{vehicle.capacityMT} MT</Td>
                  <Td><StatusBadge type="vehicle" value={vehicle.status} size="sm" /></Td>
                  <Td className="font-semibold text-[#101820]">{vehicle.lastConfirmedLocation}</Td>
                  <Td className="text-[#555E68]">{vehicle.transporterName}</Td>
                  <Td className="text-[#8E9CA8]">{timeFmt(vehicle.lastUpdated)}</Td>
                  <Td>
                    <Button variant="primary" size="sm" onClick={() => navigate('/assignment')}>
                      Assign
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export function AtPlantVehicles() {
  return <VehiclesPage filterStatus={['AT_PLANT', 'LOADING', 'LOADED', 'ASSIGNED']} title="Vehicles at Plant" subtitle="At plant, loading, or loaded" />;
}
export function AtWarehouseVehicles() {
  return <VehiclesPage filterStatus={['AT_WAREHOUSE', 'UNLOADING']} title="Vehicles at Warehouse" subtitle="Arrived or unloading at warehouse" />;
}
export function InTransitVehicles() {
  return <VehiclesPage filterStatus={['IN_TRANSIT', 'GATE_OUT' as VehicleStatus, 'DELAYED']} title="Vehicles In Transit" subtitle="Currently on route" />;
}

