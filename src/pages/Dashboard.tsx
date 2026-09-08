import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Package, Factory, Warehouse, AlertTriangle, CheckCircle2,
  Clock, Navigation, TrendingUp, RefreshCw, Play, ChevronRight, ArrowRight,
  PenLine
} from 'lucide-react';
import { useApp, useVehicleStats, useActiveTrips } from '../context/AppContext';
import { KpiCard, StatusBadge, Card, Button, EmptyState } from '../components/ui';
import { TripActionPanel } from '../components/trip/TripActionPanel';
import { TransportStatusChart, TransportMiniStats } from '../components/charts/TransportStatusChart';
import type { Trip } from '../types';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';
import { hasPermission } from '../auth/permissions';

// ============================================================
// ============================================================
// TRANSIT CONTROL BOARD LANE
// ============================================================
type Lane = {
  key: string;
  label: string;
  statuses: Trip['status'][];
  color: string;
  bg: string;
  isSpecial?: boolean;
};

const LANES: Lane[] = [
  { key: 'REQUESTED', label: 'Requested', statuses: ['REQUESTED'], color: 'border-[#E8E5E0]', bg: 'bg-[#F6F5F2]' },
  { key: 'ASSIGNED', label: 'Assigned', statuses: ['ASSIGNED'], color: 'border-sky-200', bg: 'bg-sky-50/50' },
  { key: 'AT_PLANT', label: 'At Plant', statuses: ['AT_PLANT'], color: 'border-blue-200', bg: 'bg-blue-50/50' },
  { key: 'LOADING', label: 'Loading', statuses: ['LOADING', 'LOADED'], color: 'border-[#FFE1D4]', bg: 'bg-[#FFF0E9]/60' },
  { key: 'GATE_OUT', label: 'Gate Out', statuses: ['GATE_OUT'], color: 'border-teal-200', bg: 'bg-teal-50/50' },
  { key: 'IN_TRANSIT', label: 'In Transit', statuses: ['IN_TRANSIT'], color: 'border-[#F4511E] shadow-sm', bg: 'bg-[#FFF0E9]', isSpecial: true },
  { key: 'AT_WAREHOUSE', label: 'At Warehouse', statuses: ['AT_WAREHOUSE'], color: 'border-purple-200', bg: 'bg-purple-50/50' },
  { key: 'UNLOADING', label: 'Unloading', statuses: ['UNLOADING'], color: 'border-[#FFE1D4]', bg: 'bg-[#FFF0E9]/50' },
  { key: 'COMPLETED', label: 'Completed', statuses: ['COMPLETED'], color: 'border-emerald-200', bg: 'bg-emerald-50/50' },
];

// ============================================================
// TRIP CARD
// Follows prompt specifications: White card, dark text,
// orange status accent, clear badges, "View Trip" button
// ============================================================
function TripCard({ trip, onClick }: { trip: Trip; onClick: () => void }) {
  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const isInTransit = trip.status === 'IN_TRANSIT';

  return (
    <div
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-3.5 transition-all duration-150 cursor-pointer group relative
        ${isInTransit
          ? 'border-[#F4511E]/40 shadow-[0_2px_8px_rgba(244,81,30,0.08)] hover:border-[#F4511E]'
          : 'border-[#E8E5E0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#F4511E]/40 hover:shadow-md'}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Trip ${trip.id} — ${trip.vehicleNumber}`}
    >
      {isInTransit && (
        <div className="absolute -top-2 right-3 px-1.5 py-0.2 bg-[#F4511E] text-white text-[9px] font-bold rounded uppercase tracking-wider shadow-xs">
          Active
        </div>
      )}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Truck size={13} className={isInTransit ? 'text-[#F4511E]' : 'text-[#8E9CA8]'} />
          <span className="text-xs font-bold text-[#101820] font-mono tracking-tight">{trip.vehicleNumber}</span>
        </div>
        <StatusBadge type="trip" value={trip.status} size="sm" />
      </div>

      <div className="text-xs font-medium text-[#555E68] mb-2 flex items-center gap-1.5">
        <span className="truncate max-w-[75px] font-semibold text-[#101820]">{trip.sourcePlantName.replace('Plant ', 'Plant-')}</span>
        <ArrowRight size={11} className="flex-shrink-0 text-[#8E9CA8]" />
        <span className="truncate max-w-[75px] font-semibold text-[#101820]">{trip.destinationWarehouseName.replace('Warehouse ', 'WH-')}</span>
      </div>

      <div className="flex items-center justify-between py-1 border-t border-[#F0EDE8]">
        <StatusBadge type="material" value={trip.material} size="sm" />
        <span className="text-xs font-bold text-[#101820]">{trip.quantityMT} MT</span>
      </div>

      <div className="mt-2 pt-2 border-t border-[#F0EDE8] bg-[#F6F5F2]/50 -mx-3.5 -mb-3.5 p-2.5 rounded-b-xl">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#8E9CA8] font-bold uppercase tracking-wider">Last Confirmed</p>
            <p className="text-[11px] font-bold text-[#101820] truncate mt-0.5">{trip.lastConfirmedCheckpoint}</p>
            <p className="text-[10px] text-[#8E9CA8]">{timeFmt(trip.lastConfirmedAt)}</p>
          </div>
          <span className="text-[10px] font-bold text-[#F4511E] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 ml-2 mt-1">
            View Trip <ChevronRight size={10} />
          </span>
        </div>
      </div>

      {trip.isDelayed && (
        <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded font-bold flex items-center gap-1">
          <AlertTriangle size={10} className="text-rose-600" /> DELAYED +{trip.delayMinutes}m
        </div>
      )}
    </div>
  );
}

// ============================================================
// TRANSIT CONTROL BOARD
// ============================================================
function TransitControlBoard({ trips, onTripClick }: { trips: Trip[]; onTripClick: (id: string) => void }) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex gap-3 min-w-max">
        {LANES.map(lane => {
          const laneTrips = trips.filter(t => lane.statuses.includes(t.status));
          return (
            <div
              key={lane.key}
              className={`flex-shrink-0 w-48 rounded-2xl border transition-all duration-150 ${lane.color} ${lane.bg}`}
            >
              <div className="px-3.5 py-3 border-b border-[#E8E5E0]/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {lane.isSpecial && <span className="w-2 h-2 bg-[#F4511E] rounded-full animate-pulse" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${lane.isSpecial ? 'text-[#F4511E]' : 'text-[#101820]'}`}>
                    {lane.label}
                  </span>
                </div>
                <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border
                  ${lane.isSpecial
                    ? 'bg-[#F4511E] text-white border-[#F4511E]'
                    : 'bg-white text-[#101820] border-[#E8E5E0]'}`}>
                  {laneTrips.length}
                </span>
              </div>
              <div className="p-2.5 space-y-2.5 min-h-[140px]">
                {laneTrips.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-[#8E9CA8] font-medium">No vehicles</div>
                )}
                {laneTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onClick={() => onTripClick(trip.id)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// EXCEPTION ITEM
// ============================================================
function ExceptionItem({ exc }: { exc: ReturnType<typeof useApp>['state']['exceptions'][0] }) {
  const navigate = useNavigate();
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all
      ${exc.severity === 'CRITICAL'
        ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
        : exc.severity === 'WARNING'
        ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
        : 'bg-sky-50/50 border-sky-200 hover:border-sky-300'}`}>
      <AlertTriangle
        size={16}
        className={exc.severity === 'CRITICAL' ? 'text-rose-600 flex-shrink-0 mt-0.5' : exc.severity === 'WARNING' ? 'text-amber-600 flex-shrink-0 mt-0.5' : 'text-sky-600 flex-shrink-0 mt-0.5'}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge type="exception" value={exc.severity} size="sm" />
          <span className="text-xs font-bold text-[#101820] truncate">{exc.title}</span>
        </div>
        <p className="text-xs text-[#555E68] mt-0.5 truncate font-mono">{exc.vehicleNumber || exc.requestId || ''}</p>
      </div>
      <button
        onClick={() => navigate('/exceptions')}
        className="text-xs text-[#F4511E] hover:underline font-bold flex-shrink-0"
      >
        View Trip
      </button>
    </div>
  );
}

// ============================================================
// DEMO SCENARIO MODAL
// ============================================================
const DEMO_STEPS = [
  { title: 'Step 1: Transport Request Created', desc: 'A new transport request TR-2026-00421 is created by the Transport Planner. Plant: Ahmedabad → Warehouse: Pune. Material: FG, 38 MT. Priority: HIGH.' },
  { title: 'Step 2: Vehicle Assigned', desc: 'Vehicle GJ01AB1234 (40 MT, ABC Logistics) is assigned to the transport request. Request status changes to ASSIGNED. Vehicle status changes from AVAILABLE to ASSIGNED.' },
  { title: 'Step 3: Vehicle Arrives at Plant', desc: 'The plant operator confirms that GJ01AB1234 has arrived at Plant Ahmedabad. Status changes to AT PLANT. Last confirmed checkpoint updates.' },
  { title: 'Step 4: Loading Started', desc: 'Plant operator starts loading. Status = LOADING. Timestamp and operator are recorded. 38 MT FG begins loading at Bay 2.' },
  { title: 'Step 5: Loading Completed', desc: 'Loading completes. Status = LOADED. All 38 MT FG loaded. Operator marks completion. Vehicle is ready for departure.' },
  { title: 'Step 6: Gate Out (Departure)', desc: 'Vehicle exits Plant Ahmedabad gate. Status = IN TRANSIT. This is now the last confirmed checkpoint. The system notes the departure time.' },
  { title: 'Step 7: Warehouse Arrival Confirmed', desc: 'WH-02 operator confirms vehicle arrival at Warehouse Pune. Status = AT WAREHOUSE. Last confirmed checkpoint = Warehouse Pune.' },
  { title: 'Step 8: Unloading', desc: 'Unloading begins at WH-02. Status = UNLOADING. Operator starts the process. Dock bay assigned.' },
  { title: 'Step 9: Trip Completed', desc: 'Unloading completes. Vehicle status = EMPTY. Request status = COMPLETED. Trip history records the full timeline. Dashboard updates. Audit log captures all events.' },
];

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  if (!open) return null;
  const s = DEMO_STEPS[step];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F0EDE8] flex items-center gap-3 bg-[#F6F5F2] flex-shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-[#F4511E] text-white flex items-center justify-center text-sm font-bold shadow-sm">{step + 1}</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-[#101820] truncate">Demo Scenario Walkthrough</h2>
            <p className="text-[10px] sm:text-[11px] text-[#8E9CA8] font-medium truncate">Checkpoint-Based Operational Journey</p>
          </div>
          <button onClick={onClose} className="text-[#8E9CA8] hover:text-[#101820] p-1.5 rounded-lg flex-shrink-0" aria-label="Close demo">✕</button>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
          <h3 className="font-bold text-[#101820] text-sm sm:text-base mb-2">{s.title}</h3>
          <p className="text-xs sm:text-sm text-[#555E68] leading-relaxed">{s.desc}</p>
          {/* Operational route visual */}
          <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 bg-[#FFF0E9]/50 rounded-xl border border-[#FFE1D4]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#F4511E] font-bold uppercase tracking-wider">Operational Journey — Not GPS</span>
              <span className="text-[10px] text-[#8E9CA8] font-semibold">Checkpoint Flow</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              {['Requested', 'Assigned', 'At Plant', 'Loading', 'Loaded', 'Gate Out', 'In Transit', 'At WH', 'Unloading', 'Completed'].map((s_, i) => (
                <React.Fragment key={s_}>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${i <= step ? 'bg-[#F4511E] text-white' : 'bg-white text-[#8E9CA8] border border-[#E8E5E0]'}`}>{s_}</span>
                  {i < 9 && <ChevronRight size={10} className="text-[#8E9CA8] flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#F0EDE8] bg-[#F6F5F2] flex flex-wrap gap-2 items-center justify-between flex-shrink-0">
          <div className="text-xs font-bold text-[#8E9CA8]">{step + 1} of {DEMO_STEPS.length} Steps</div>
          <div className="flex gap-2">
            {step > 0 && <Button variant="secondary" size="sm" onClick={() => setStep(s => s - 1)}>Previous</Button>}
            {step < DEMO_STEPS.length - 1
              ? <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)}>Next Step</Button>
              : <Button variant="primary" size="sm" onClick={onClose}>Finish Demo</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN / PLANNER DASHBOARD (Full Operations)
// ============================================================
function PlannerDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const stats = useVehicleStats();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const currentRole = state.settings.currentRole;
  const canCreateRequest = hasPermission(currentRole, 'CREATE_REQUEST');

  const selectedTrip = selectedTripId ? state.trips.find(t => t.id === selectedTripId) : null;
  const selectedVehicle = selectedTrip ? state.vehicles.find(v => v.id === selectedTrip.vehicleId) : null;
  const unresolvedExceptions = state.exceptions.filter(e => !e.resolved);
  const pendingRequests = state.requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-5 sm:space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <DemoModal open={showDemo} onClose={() => setShowDemo(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#101820] tracking-tight">
            {currentRole === 'ADMIN' ? 'System Dashboard' : 'Planning Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-[#555E68] mt-0.5">
            {currentRole === 'ADMIN' ? 'Full system control — all operations visible' : 'Transport planning — requests, vehicles, active trips'}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowDemo(true)} icon={<Play size={13} className="text-[#F4511E]" />}>Demo Scenario</Button>
          {canCreateRequest && (
            <Button variant="primary" size="sm" onClick={() => navigate('/requests?new=1')} icon={<RefreshCw size={13} />}>New Request</Button>
          )}
        </div>
      </div>

      {/* No-GPS notice */}
      <div className="p-3.5 sm:p-4 bg-[#FFF0E9] border border-[#FFE1D4] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#F4511E] text-white flex items-center justify-center flex-shrink-0">
          <Navigation size={18} />
        </div>
        <p className="text-xs text-[#101820] font-medium leading-relaxed">
          <span className="font-bold text-[#F4511E] uppercase tracking-wider text-[11px] mr-1.5">Operational Transit View</span>
          — <span className="font-bold">Not GPS Tracking</span>. Vehicles update via verified checkpoint confirmations at plant gates, weighbridges, and warehouse receiving docks.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5 sm:gap-3.5">
        <KpiCard label="Total Vehicles" value={stats.total} icon={<Truck size={17} />} color="text-[#101820]" bgColor="bg-[#F6F5F2]" onClick={() => navigate('/vehicles')} />
        <KpiCard label="In Transit" value={stats.inTransit} icon={<Navigation size={17} />} color="text-[#F4511E]" bgColor="bg-[#FFF0E9]" highlight={true} onClick={() => navigate('/transit')} sub="Active on route" />
        <KpiCard label="At Plant" value={stats.atPlant} icon={<Factory size={17} />} color="text-blue-700" bgColor="bg-blue-50" onClick={() => navigate('/vehicles/at-plant')} />
        <KpiCard label="At Warehouse" value={stats.atWarehouse} icon={<Warehouse size={17} />} color="text-purple-700" bgColor="bg-purple-50" onClick={() => navigate('/vehicles/at-warehouse')} />
        <KpiCard label="Empty / Avail" value={stats.available} icon={<Package size={17} />} color="text-emerald-700" bgColor="bg-emerald-50" onClick={() => navigate('/vehicles/empty')} sub="Ready to assign" />
        <KpiCard label="Assigned" value={stats.assigned} icon={<CheckCircle2 size={17} />} color="text-sky-700" bgColor="bg-sky-50" onClick={() => navigate('/assignment')} />
        <KpiCard label="Delayed / Alert" value={unresolvedExceptions.length} icon={<AlertTriangle size={17} />} color="text-rose-700" bgColor="bg-rose-50" onClick={() => navigate('/exceptions')} sub="Needs attention" />
        <KpiCard label="Completed" value={stats.completedToday} icon={<TrendingUp size={17} />} color="text-emerald-700" bgColor="bg-emerald-50" onClick={() => navigate('/reports/history')} sub="Today" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-4">
          <Card padding={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F0EDE8]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#101820]">Transit Control Board</h2>
                <p className="text-xs text-[#8E9CA8] mt-0.5">Click any vehicle card to view details and execute actions</p>
              </div>
              <button onClick={() => navigate('/transit')} className="text-xs font-bold text-[#F4511E] hover:underline flex items-center gap-1 self-start sm:self-auto">Full Operations View <ChevronRight size={14} /></button>
            </div>
            <div className="p-3 sm:p-5">
              <TransitControlBoard trips={state.trips} onTripClick={id => setSelectedTripId(id)} />
            </div>
          </Card>
        </div>

        {selectedTrip && selectedVehicle && (
          <div className="xl:col-span-2">
            <TripActionPanel trip={selectedTrip} vehicle={selectedVehicle} onClose={() => setSelectedTripId(null)} onAction={(msg) => addToast('success', msg)} warehouses={state.warehouses} plants={state.plants} />
          </div>
        )}

        <div className={selectedTrip ? 'xl:col-span-2' : 'xl:col-span-2'}>
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
              <h2 className="text-sm font-bold text-[#101820] flex items-center gap-2"><AlertTriangle size={16} className="text-rose-600" />Active Exceptions {unresolvedExceptions.length > 0 && <span className="bg-rose-100 text-rose-800 text-xs rounded-full px-2 py-0.5 font-bold">{unresolvedExceptions.length}</span>}</h2>
              <button onClick={() => navigate('/exceptions')} className="text-xs text-[#F4511E] hover:underline font-bold flex items-center gap-1">All Exceptions <ChevronRight size={14} /></button>
            </div>
            <div className="p-4 space-y-2.5">
              {unresolvedExceptions.length === 0
                ? <EmptyState icon={<CheckCircle2 size={32} className="text-emerald-500" />} title="No active exceptions" description="All transit movements operating normally" />
                : unresolvedExceptions.slice(0, 5).map(exc => <ExceptionItem key={exc.id} exc={exc} />)}
            </div>
          </Card>
        </div>

        <div className={selectedTrip ? 'xl:col-span-4' : 'xl:col-span-2'}>
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
              <h2 className="text-sm font-bold text-[#101820]">Pending Requests</h2>
              <button onClick={() => navigate('/requests')} className="text-xs text-[#F4511E] hover:underline font-bold flex items-center gap-1">All Requests <ChevronRight size={14} /></button>
            </div>
            <div className="p-4 space-y-2.5">
              {pendingRequests.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF0E9]/40 border border-[#FFE1D4] hover:border-[#F4511E]/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#101820]">{r.id}</div>
                    <div className="text-[11px] text-[#555E68] truncate mt-0.5">{r.sourcePlantName.replace('Plant ', '')} → {r.destinationWarehouseName.replace('Warehouse ', '')}</div>
                    <div className="flex items-center gap-1.5 mt-1"><StatusBadge type="material" value={r.material} size="sm" /><span className="text-[11px] font-bold">{r.quantityMT} MT</span><StatusBadge type="priority" value={r.priority} size="sm" /></div>
                  </div>
                  {canCreateRequest && <Button variant="primary" size="sm" onClick={() => navigate('/assignment')} className="flex-shrink-0">Assign Truck</Button>}
                </div>
              ))}
              {pendingRequests.length === 0 && <EmptyState title="No pending requests" description="All requests have been assigned" />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PLANT OPERATOR DASHBOARD
// ============================================================
function PlantOperatorDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  // Plant-01 is the assigned plant for demo Plant Operator
  const myPlantId = 'PLT-01';
  const myPlantName = 'Plant Ahmedabad';

  const plantTrips = state.trips.filter(t => t.sourcePlantId === myPlantId && t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
  const expected = plantTrips.filter(t => t.status === 'ASSIGNED').length;
  const atPlant = plantTrips.filter(t => t.status === 'AT_PLANT').length;
  const loading = plantTrips.filter(t => t.status === 'LOADING').length;
  const loaded = plantTrips.filter(t => t.status === 'LOADED').length;
  const unresolvedExceptions = state.exceptions.filter(e => !e.resolved);

  const selectedTrip = selectedTripId ? state.trips.find(t => t.id === selectedTripId) : null;
  const selectedVehicle = selectedTrip ? state.vehicles.find(v => v.id === selectedTrip.vehicleId) : null;

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820]">My Plant</h1>
        <p className="text-sm text-[#555E68]">{myPlantName} — Operational View</p>
      </div>

      {/* MY WORK TODAY */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0"><Clock size={16} /></div>
          <div>
            <h2 className="text-sm font-bold text-amber-900">MY WORK TODAY</h2>
            <p className="text-xs text-amber-700">{myPlantName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Expected', value: expected, color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', action: () => navigate('/vehicles/at-plant') },
            { label: 'At Plant', value: atPlant, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', action: () => navigate('/vehicles/at-plant') },
            { label: 'Loading', value: loading, color: 'text-amber-700', bg: 'bg-amber-100 border-amber-300', action: null },
            { label: 'Loaded / Ready', value: loaded, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', action: null },
          ].map(stat => (
            <button key={stat.label} onClick={stat.action || undefined}
              className={`border rounded-xl p-2.5 sm:p-3 text-center transition-all ${stat.bg} ${stat.action ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}`}>
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#555E68] mt-0.5 sm:mt-1 truncate">{stat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Vehicles */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#F0EDE8]">
          <h2 className="text-xs sm:text-sm font-bold text-[#101820] flex items-center gap-2 truncate"><Truck size={15} />Today's Vehicles at {myPlantName}</h2>
          <button onClick={() => navigate('/vehicles/at-plant')} className="text-xs text-[#F4511E] hover:underline font-bold flex items-center gap-1 flex-shrink-0">View All <ChevronRight size={14} /></button>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          {plantTrips.length === 0 ? (
            <EmptyState icon={<Truck size={28} />} title="No vehicles today" description="No vehicles assigned to your plant yet" />
          ) : (
            plantTrips.slice(0, 8).map(trip => {
              const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
              return (
                <button key={trip.id} onClick={() => setSelectedTripId(trip.id)}
                  className="w-full text-left p-3 sm:p-4 rounded-xl border border-[#E8E5E0] hover:border-[#F4511E]/40 bg-white hover:bg-[#FFF0E9]/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F6F5F2] flex items-center justify-center flex-shrink-0"><Truck size={18} className="text-[#F4511E]" /></div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#101820] font-mono text-xs sm:text-sm">{trip.vehicleNumber}</div>
                        <div className="text-xs text-[#555E68] truncate">{vehicle?.driverName} · {vehicle?.capacityMT}MT</div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                      <StatusBadge type="trip" value={trip.status} size="sm" />
                      <div className="text-[10px] text-[#8E9CA8]">{trip.quantityMT} MT {trip.material}</div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Trip Panel */}
      {selectedTrip && selectedVehicle && (
        <TripActionPanel trip={selectedTrip} vehicle={selectedVehicle}
          onClose={() => setSelectedTripId(null)}
          onAction={(msg) => addToast('success', msg)}
          warehouses={state.warehouses} plants={state.plants} />
      )}

      {/* Exceptions */}
      {unresolvedExceptions.length > 0 && (
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
            <h2 className="text-sm font-bold text-[#101820] flex items-center gap-2"><AlertTriangle size={15} className="text-rose-600" />Exceptions ({unresolvedExceptions.length})</h2>
            <button onClick={() => navigate('/exceptions')} className="text-xs text-[#F4511E] hover:underline font-bold">View All</button>
          </div>
          <div className="p-4 space-y-2">
            {unresolvedExceptions.slice(0, 3).map(exc => <ExceptionItem key={exc.id} exc={exc} />)}
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// WAREHOUSE OPERATOR DASHBOARD
// ============================================================
function WarehouseOperatorDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const myWarehouseId = 'WH-02';
  const myWarehouseName = 'Warehouse Pune';

  const whTrips = state.trips.filter(t => t.destinationWarehouseId === myWarehouseId && t.status !== 'CANCELLED');
  const incoming = whTrips.filter(t => ['IN_TRANSIT', 'GATE_OUT', 'ASSIGNED', 'AT_PLANT', 'LOADING', 'LOADED'].includes(t.status)).length;
  const arrived = whTrips.filter(t => t.status === 'AT_WAREHOUSE').length;
  const unloading = whTrips.filter(t => t.status === 'UNLOADING').length;
  const completed = whTrips.filter(t => t.status === 'COMPLETED' || t.status === 'UNLOADED').length;
  const activeWhTrips = whTrips.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

  const selectedTrip = selectedTripId ? state.trips.find(t => t.id === selectedTripId) : null;
  const selectedVehicle = selectedTrip ? state.vehicles.find(v => v.id === selectedTrip.vehicleId) : null;

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div>
        <h1 className="text-2xl font-bold text-[#101820]">My Warehouse</h1>
        <p className="text-sm text-[#555E68]">{myWarehouseName} — Receiving Operations</p>
      </div>

      {/* MY WORK TODAY */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 sm:p-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0"><Warehouse size={16} /></div>
          <div>
            <h2 className="text-sm font-bold text-purple-900">MY WORK TODAY</h2>
            <p className="text-xs text-purple-700">{myWarehouseName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Incoming', value: incoming, color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
            { label: 'Arrived', value: arrived, color: 'text-purple-700', bg: 'bg-purple-100 border-purple-300' },
            { label: 'Unloading', value: unloading, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Completed', value: completed, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          ].map(stat => (
            <div key={stat.label} className={`border rounded-xl p-2.5 sm:p-3 text-center ${stat.bg}`}>
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#555E68] mt-0.5 sm:mt-1 truncate">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming Vehicles */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#F0EDE8]">
          <h2 className="text-xs sm:text-sm font-bold text-[#101820] flex items-center gap-2 truncate"><Truck size={15} />Incoming Vehicles — {myWarehouseName}</h2>
          <button onClick={() => navigate('/vehicles/at-warehouse')} className="text-xs text-[#F4511E] hover:underline font-bold flex items-center gap-1 flex-shrink-0">View All <ChevronRight size={14} /></button>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          {activeWhTrips.length === 0 ? (
            <EmptyState icon={<Warehouse size={28} />} title="No incoming vehicles" description="No vehicles assigned to your warehouse" />
          ) : (
            activeWhTrips.slice(0, 8).map(trip => {
              const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
              return (
                <button key={trip.id} onClick={() => setSelectedTripId(trip.id)}
                  className="w-full text-left p-3 sm:p-4 rounded-xl border border-[#E8E5E0] hover:border-purple-300 bg-white hover:bg-purple-50/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0"><Truck size={18} className="text-purple-600" /></div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#101820] font-mono text-xs sm:text-sm">{trip.vehicleNumber}</div>
                        <div className="text-xs text-[#555E68] truncate">{vehicle?.driverName} · {vehicle?.capacityMT}MT</div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                      <StatusBadge type="trip" value={trip.status} size="sm" />
                      <div className="text-[10px] text-[#8E9CA8]">{trip.quantityMT} MT {trip.material}</div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>

      {selectedTrip && selectedVehicle && (
        <TripActionPanel trip={selectedTrip} vehicle={selectedVehicle}
          onClose={() => setSelectedTripId(null)}
          onAction={(msg) => addToast('success', msg)}
          warehouses={state.warehouses} plants={state.plants} />
      )}
    </div>
  );
}

// ============================================================
// MANAGEMENT EXECUTIVE DASHBOARD
// ============================================================
function ManagementDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const stats = useVehicleStats();
  const unresolvedExceptions = state.exceptions.filter(e => !e.resolved);
  const totalTrips = state.trips.filter(t => t.status !== 'CANCELLED').length;
  const delayedTrips = state.trips.filter(t => t.isDelayed && t.status !== 'COMPLETED').length;
  const onTimePct = totalTrips > 0 ? Math.round(((totalTrips - delayedTrips) / totalTrips) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820]">Executive Dashboard</h1>
        <p className="text-sm text-[#555E68]">Read-only monitoring — transport performance overview</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E5E0] p-3.5 sm:p-5 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F4511E]">{totalTrips}</div>
          <div className="text-[10px] sm:text-xs text-[#555E68] font-semibold mt-1 uppercase tracking-wider">Total Trips</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8E5E0] p-3.5 sm:p-5 shadow-sm text-center" onClick={() => navigate('/transit')} style={{cursor:'pointer'}}>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{stats.inTransit}</div>
          <div className="text-[10px] sm:text-xs text-[#555E68] font-semibold mt-1 uppercase tracking-wider">In Transit</div>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-3.5 sm:p-5 shadow-sm text-center" onClick={() => navigate('/exceptions')} style={{cursor:'pointer'}}>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-600">{delayedTrips}</div>
          <div className="text-[10px] sm:text-xs text-[#555E68] font-semibold mt-1 uppercase tracking-wider">Delayed</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-3.5 sm:p-5 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">{onTimePct}%</div>
          <div className="text-[10px] sm:text-xs text-[#555E68] font-semibold mt-1 uppercase tracking-wider">On-Time</div>
        </div>
      </div>

      {/* Transport Status Chart — LIVE */}
      <TransportStatusChart />

      {/* Mini stats row */}
      <TransportMiniStats />

      {/* Exceptions */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
          <h2 className="text-sm font-bold text-[#101820] flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-600" />Active Exceptions
            {unresolvedExceptions.length > 0 && <span className="bg-rose-100 text-rose-800 text-xs rounded-full px-2 py-0.5 font-bold">{unresolvedExceptions.length}</span>}
          </h2>
          <button onClick={() => navigate('/exceptions')} className="text-xs text-[#F4511E] hover:underline font-bold flex items-center gap-1">View All <ChevronRight size={14} /></button>
        </div>
        <div className="p-4 space-y-2">
          {unresolvedExceptions.length === 0
            ? <EmptyState icon={<CheckCircle2 size={28} className="text-emerald-500" />} title="No exceptions" description="All operations running normally" />
            : unresolvedExceptions.slice(0, 5).map(exc => <ExceptionItem key={exc.id} exc={exc} />)}
        </div>
      </Card>

      {/* Vehicle utilization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Fleet Size', value: stats.total, sub: 'Total vehicles', color: 'text-[#101820]', onClick: () => navigate('/vehicles') },
          { label: 'In Operations', value: stats.total - stats.available - stats.offline, sub: 'Assigned / In transit', color: 'text-[#F4511E]', onClick: () => navigate('/transit') },
          { label: 'Available', value: stats.available, sub: 'Ready for assignment', color: 'text-emerald-600', onClick: () => navigate('/vehicles') },
        ].map(item => (
          <div key={item.label} onClick={item.onClick} className="bg-white rounded-2xl border border-[#E8E5E0] p-5 shadow-sm cursor-pointer hover:border-[#F4511E]/30 transition-colors">
            <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-sm font-bold text-[#101820] mt-1">{item.label}</div>
            <div className="text-xs text-[#8E9CA8]">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD — role switcher entry point
// ============================================================
export function Dashboard() {
  const { state } = useApp();
  const currentRole = state.settings.currentRole;

  switch (currentRole) {
    case 'ADMIN':
    case 'TRANSPORT_PLANNER':
      return <PlannerDashboard />;
    case 'PLANT_OPERATOR':
      return <PlantOperatorDashboard />;
    case 'WAREHOUSE_OPERATOR':
      return <WarehouseOperatorDashboard />;
    case 'MANAGEMENT':
      return <ManagementDashboard />;
    default:
      return <PlannerDashboard />;
  }
}
