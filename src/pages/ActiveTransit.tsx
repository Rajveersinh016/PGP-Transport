import React, { useState } from 'react';
import { Truck, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusBadge, SearchBar, SelectFilter, Table, Th, Td, EmptyState, Card } from '../components/ui';
import { TripActionPanel } from '../components/trip/TripActionPanel';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'At Plant', value: 'AT_PLANT' },
  { label: 'Loading', value: 'LOADING' },
  { label: 'Loaded', value: 'LOADED' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'At Warehouse', value: 'AT_WAREHOUSE' },
  { label: 'Unloading', value: 'UNLOADING' },
];

const MATERIAL_OPTIONS = [
  { label: 'All Materials', value: '' },
  { label: 'FG', value: 'FG' },
  { label: 'RM', value: 'RM' },
  { label: 'OW', value: 'OW' },
  { label: 'PGP', value: 'PGP' },
  { label: 'PM', value: 'PM' },
  { label: 'SFG', value: 'SFG' },
];

const PRIORITY_OPTIONS = [
  { label: 'All Priority', value: '' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export function ActiveTransit() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [plantFilter, setPlantFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const activeTrips = state.trips.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

  const filtered = activeTrips.filter(t => {
    const q = search.toLowerCase();
    if (q && !t.vehicleNumber.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) &&
        !t.driverName.toLowerCase().includes(q) && !t.transporterName.toLowerCase().includes(q)) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (plantFilter && t.sourcePlantId !== plantFilter) return false;
    if (warehouseFilter && t.destinationWarehouseId !== warehouseFilter) return false;
    if (materialFilter && t.material !== materialFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  const selectedTrip = selectedTripId ? state.trips.find(t => t.id === selectedTripId) : null;
  const selectedVehicle = selectedTrip ? state.vehicles.find(v => v.id === selectedTrip.vehicleId) : null;

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const plantOptions = [
    { label: 'All Plants', value: '' },
    ...state.plants.map(p => ({ label: p.name, value: p.id })),
  ];
  const whOptions = [
    { label: 'All Warehouses', value: '' },
    ...state.warehouses.map(w => ({ label: w.name, value: w.id })),
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader
        title="Active Transit"
        subtitle={`${activeTrips.length} active trips — real-time checkpoint view`}
        breadcrumb={['Operations', 'Active Transit']}
      />

      <div className="flex flex-wrap gap-2.5 mb-5 p-3.5 bg-white border border-[#E8E5E0] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search vehicle, trip, driver..." className="w-full sm:w-64" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} label="Status filter" />
        <SelectFilter value={plantFilter} onChange={setPlantFilter} options={plantOptions} label="Plant filter" />
        <SelectFilter value={warehouseFilter} onChange={setWarehouseFilter} options={whOptions} label="Warehouse filter" />
        <SelectFilter value={materialFilter} onChange={setMaterialFilter} options={MATERIAL_OPTIONS} label="Material filter" />
        <SelectFilter value={priorityFilter} onChange={setPriorityFilter} options={PRIORITY_OPTIONS} label="Priority filter" />
      </div>

      <div className={`grid gap-6 ${selectedTrip ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
        <div className={selectedTrip ? 'xl:col-span-2' : 'xl:col-span-1'}>
          <Card padding={false}>
            <Table>
              <thead>
                <tr>
                  <Th>Trip / Vehicle</Th>
                  <Th>Route</Th>
                  <Th>Material</Th>
                  <Th>Status</Th>
                  <Th className="hidden lg:table-cell">Last Checkpoint</Th>
                  <Th className="hidden xl:table-cell">Expected</Th>
                  <Th className="hidden xl:table-cell">Delay</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(trip => (
                  <tr
                    key={trip.id}
                    className={`hover:bg-[#FFF0E9]/40 cursor-pointer transition-colors ${selectedTripId === trip.id ? 'bg-[#FFF0E9]/30 border-l-4 border-[#F4511E]' : ''}`}
                    onClick={() => setSelectedTripId(prev => prev === trip.id ? null : trip.id)}
                  >
                    <Td>
                      <div className="font-bold text-[#101820] font-mono text-xs">{trip.vehicleNumber}</div>
                      <div className="text-[11px] text-[#8E9CA8] font-mono">{trip.id}</div>
                      <div className="text-xs text-[#555E68]">{trip.transporterName.split(' ').slice(0,2).join(' ')}</div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5 text-xs text-[#101820] font-semibold">
                        <span className="truncate max-w-[85px]">{trip.sourcePlantName.replace('Plant ','')}</span>
                        <ArrowRight size={11} className="flex-shrink-0 text-[#8E9CA8]" />
                        <span className="truncate max-w-[85px]">{trip.destinationWarehouseName.replace('Warehouse ','')}</span>
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge type="material" value={trip.material} size="sm" />
                      <div className="text-xs font-semibold text-[#101820] mt-1">{trip.quantityMT} MT</div>
                    </Td>
                    <Td>
                      <StatusBadge type="trip" value={trip.status} size="sm" />
                      {trip.isDelayed && <div className="text-[10px] text-rose-700 font-bold mt-1 flex items-center gap-1"><AlertTriangle size={9} /> Delayed</div>}
                    </Td>
                    <Td className="hidden lg:table-cell">
                      <div className="text-xs font-semibold text-[#101820]">{trip.lastConfirmedCheckpoint}</div>
                      <div className="text-[10px] text-[#8E9CA8]">{timeFmt(trip.lastConfirmedAt)}</div>
                    </Td>
                    <Td className="hidden xl:table-cell">
                      <div className="text-xs text-[#555E68] flex items-center gap-1 font-medium">
                        <Clock size={12} className="text-[#8E9CA8]" />
                        {timeFmt(trip.expectedCompletionAt)}
                      </div>
                    </Td>
                    <Td className="hidden xl:table-cell">
                      {trip.isDelayed ? (
                        <span className="text-xs text-rose-700 font-bold">+{trip.delayMinutes} min</span>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold">On time</span>
                      )}
                    </Td>
                    <Td>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedTripId(trip.id); }}
                        className="text-xs text-[#F4511E] hover:underline font-bold px-2.5 py-1 rounded-lg hover:bg-[#FFF0E9] transition-colors"
                      >
                        Update
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {filtered.length === 0 && (
              <EmptyState icon={<Truck size={32} className="text-[#8E9CA8]" />} title="No active trips found" description="Adjust your filters or create a new transport request." />
            )}
          </Card>
        </div>

        {selectedTrip && selectedVehicle && (
          <div className="xl:col-span-1">
            <TripActionPanel
              trip={selectedTrip}
              vehicle={selectedVehicle}
              onClose={() => setSelectedTripId(null)}
              onAction={msg => addToast('success', msg)}
              warehouses={state.warehouses}
              plants={state.plants}
              embedded
            />
          </div>
        )}
      </div>
    </div>
  );
}
