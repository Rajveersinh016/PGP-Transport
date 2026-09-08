import React, { useState } from 'react';
import { X, ChevronRight, AlertTriangle, CheckCircle2, ArrowRight, PenLine, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, Button, ConfirmDialog, LabelValue, TimelineStep } from '../ui';
import type { Trip, Vehicle, Warehouse, Plant, TripStatus } from '../../types';
import { hasPermission, tripActionPermission } from '../../auth/permissions';
import { OperatorNoteCard } from '../notes/OperatorNoteCard';
import { AddNoteModal } from '../notes/AddNoteModal';

// ============================================================
// TRIP STATUS WORKFLOW
// ============================================================
interface NextAction {
  label: string;
  nextStatus: TripStatus;
  checkpoint: string;
  checkpointCode: string;
  confirmTitle: string;
  confirmMsg: React.ReactNode;
  variant: 'primary' | 'success' | 'danger';
}

function getNextActions(trip: Trip, warehouses: Warehouse[], plants: Plant[]): NextAction[] {
  const wh = warehouses.find(w => w.id === trip.destinationWarehouseId);
  const plt = plants.find(p => p.id === trip.sourcePlantId);

  switch (trip.status) {
    case 'ASSIGNED':
      return [{
        label: 'Arrive at Plant',
        nextStatus: 'AT_PLANT',
        checkpoint: `${trip.sourcePlantName} Entry Gate`,
        checkpointCode: `${trip.sourcePlantId}-ENTRY`,
        confirmTitle: 'Confirm Arrival at Plant',
        confirmMsg: (
          <div className="space-y-2">
            <div className="p-3 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4]">
              <p className="text-sm font-bold text-[#101820] font-mono">{trip.vehicleNumber}</p>
              <p className="text-xs text-[#555E68]">{trip.sourcePlantName}</p>
            </div>
            <p className="text-sm text-[#555E68]">Confirm that vehicle <strong>{trip.vehicleNumber}</strong> has arrived at <strong>{trip.sourcePlantName}</strong>?</p>
          </div>
        ),
        variant: 'primary',
      }];
    case 'AT_PLANT':
      return [{
        label: 'Start Loading',
        nextStatus: 'LOADING',
        checkpoint: `${trip.sourcePlantName} Loading Bay`,
        checkpointCode: `${trip.sourcePlantId}-BAY`,
        confirmTitle: 'Start Loading',
        confirmMsg: (
          <div className="space-y-2">
            <p className="text-sm text-[#555E68]">Begin loading <strong>{trip.quantityMT} MT</strong> of <strong>{trip.material}</strong> onto <strong>{trip.vehicleNumber}</strong>?</p>
          </div>
        ),
        variant: 'primary',
      }];
    case 'LOADING':
      return [{
        label: 'Complete Loading',
        nextStatus: 'LOADED',
        checkpoint: `${trip.sourcePlantName} Loading Bay`,
        checkpointCode: `${trip.sourcePlantId}-BAY`,
        confirmTitle: 'Mark Loading Complete',
        confirmMsg: (
          <div className="space-y-2">
            <p className="text-sm text-[#555E68]">Confirm that all <strong>{trip.quantityMT} MT {trip.material}</strong> has been loaded onto <strong>{trip.vehicleNumber}</strong>?</p>
          </div>
        ),
        variant: 'success',
      }];
    case 'LOADED':
      return [{
        label: 'Confirm Gate Out',
        nextStatus: 'IN_TRANSIT',
        checkpoint: `${trip.sourcePlantName} Gate`,
        checkpointCode: `${trip.sourcePlantId}-GATE`,
        confirmTitle: 'Confirm Gate Out',
        confirmMsg: (
          <div className="space-y-2">
            <div className="p-3.5 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Vehicle:</span><span className="font-bold text-[#101820] font-mono">{trip.vehicleNumber}</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Source:</span><span className="font-bold text-[#101820]">{trip.sourcePlantId} — {trip.sourcePlantName}</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Destination:</span><span className="font-bold text-[#101820]">{trip.destinationWarehouseId} — {trip.destinationWarehouseName}</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Material:</span><span className="font-bold text-[#101820]">{trip.material}</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Quantity:</span><span className="font-bold text-[#101820]">{trip.quantityMT} MT</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Current status:</span><span className="font-bold text-[#F4511E]">LOADED</span></div>
            </div>
            <p className="text-xs text-[#555E68]">After confirmation, vehicle will gate out and status will change to <strong>IN TRANSIT</strong>.</p>
          </div>
        ),
        variant: 'primary',
      }];
    case 'GATE_OUT':
    case 'IN_TRANSIT':
      return [{
        label: `Confirm Warehouse Arrival`,
        nextStatus: 'AT_WAREHOUSE',
        checkpoint: `${trip.destinationWarehouseName} Receiving Gate`,
        checkpointCode: `${trip.destinationWarehouseId}-GATE`,
        confirmTitle: 'Confirm Warehouse Arrival',
        confirmMsg: (
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Vehicle:</span><span className="font-bold text-gray-900 font-mono">{trip.vehicleNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Warehouse:</span><span className="font-bold text-gray-900">{trip.destinationWarehouseId} — {trip.destinationWarehouseName}</span></div>
            </div>
            <p className="text-xs text-[#555E68]">Confirm physical arrival of vehicle at <strong>{trip.destinationWarehouseName}</strong>?</p>
          </div>
        ),
        variant: 'primary',
      }];
    case 'AT_WAREHOUSE':
      return [{
        label: 'Start Unloading',
        nextStatus: 'UNLOADING',
        checkpoint: `${trip.destinationWarehouseName} Receiving Dock`,
        checkpointCode: `${trip.destinationWarehouseId}-DOCK`,
        confirmTitle: 'Start Unloading',
        confirmMsg: (
          <p className="text-sm text-[#555E68]">Begin unloading <strong>{trip.quantityMT} MT {trip.material}</strong> from <strong>{trip.vehicleNumber}</strong>?</p>
        ),
        variant: 'primary',
      }];
    case 'UNLOADING':
      return [{
        label: 'Complete Unloading',
        nextStatus: 'UNLOADED',
        checkpoint: `${trip.destinationWarehouseName} Receiving Dock`,
        checkpointCode: `${trip.destinationWarehouseId}-DOCK`,
        confirmTitle: 'Complete Unloading',
        confirmMsg: (
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Vehicle:</span><span className="font-bold text-gray-900 font-mono">{trip.vehicleNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Material:</span><span className="font-bold text-gray-900">{trip.material} — {trip.quantityMT} MT</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Vehicle Status:</span><span className="font-bold text-emerald-700">EMPTY (Available for Reassignment)</span></div>
            </div>
            <p className="text-xs text-[#555E68]">Completing unloading will mark vehicle as <strong>EMPTY</strong>, making it available for next assignment.</p>
          </div>
        ),
        variant: 'success',
      }];
    case 'UNLOADED':
      return [{
        label: 'Complete Trip',
        nextStatus: 'COMPLETED',
        checkpoint: trip.destinationWarehouseName,
        checkpointCode: trip.destinationWarehouseId,
        confirmTitle: 'Complete Trip & Close Request',
        confirmMsg: (
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Trip ID:</span><span className="font-bold text-gray-900 font-mono">{trip.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Request:</span><span className="font-bold text-gray-900">{trip.requestId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Final Status:</span><span className="font-bold text-emerald-700">COMPLETED</span></div>
            </div>
            <p className="text-xs text-[#555E68]">Finalize trip records and close transport request.</p>
          </div>
        ),
        variant: 'success',
      }];
    case 'COMPLETED':
    case 'CANCELLED':
      return [];
    default:
      return [];
  }
}

// ============================================================
// TRIP TIMELINE (11 STEPS STRICT CHRONOLOGY)
// ============================================================
const TRIP_STEPS: { status: TripStatus; label: string }[] = [
  { status: 'REQUESTED', label: 'Request Created' },
  { status: 'ASSIGNED', label: 'Vehicle Assigned' },
  { status: 'AT_PLANT', label: 'Arrived at Plant' },
  { status: 'LOADING', label: 'Loading Started' },
  { status: 'LOADED', label: 'Loading Completed' },
  { status: 'GATE_OUT', label: 'Gate Out' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'AT_WAREHOUSE', label: 'Warehouse Arrival' },
  { status: 'UNLOADING', label: 'Unloading Started' },
  { status: 'UNLOADED', label: 'Unloading Completed' },
  { status: 'COMPLETED', label: 'Trip Completed' },
];

const STATUS_ORDER: TripStatus[] = [
  'REQUESTED', 'ASSIGNED', 'AT_PLANT', 'LOADING', 'LOADED',
  'GATE_OUT', 'IN_TRANSIT', 'AT_WAREHOUSE', 'UNLOADING', 'UNLOADED', 'COMPLETED'
];

// ============================================================
// OPERATIONAL JOURNEY VISUALIZATION (No GPS Map)
// Per prompt: Clear flowchart style with Plant -> In Transit -> Warehouse
// ============================================================
function OperationalTransitVisual({ trip }: { trip: Trip }) {
  const isInTransit = trip.status === 'IN_TRANSIT' || trip.status === 'GATE_OUT';
  const isAtPlant = ['ASSIGNED', 'AT_PLANT', 'LOADING', 'LOADED'].includes(trip.status);
  const isAtWarehouse = ['AT_WAREHOUSE', 'UNLOADING', 'COMPLETED'].includes(trip.status);

  return (
    <div className="p-4 bg-[#FFF0E9]/50 rounded-2xl border border-[#FFE1D4] my-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-[#F4511E] uppercase tracking-wider">Operational Transit View</span>
        <span className="text-[10px] bg-white text-[#555E68] border border-[#E8E5E0] px-2 py-0.5 rounded-full font-semibold">Not GPS Tracking</span>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {/* Source Plant Box */}
        <div className={`w-full text-center py-2.5 px-3 rounded-xl border transition-all ${isAtPlant ? 'bg-white border-[#F4511E] shadow-sm' : 'bg-white/80 border-[#E8E5E0]'}`}>
          <p className="text-[10px] font-bold text-[#8E9CA8] uppercase tracking-wider">Source Origin</p>
          <p className="text-xs font-bold text-[#101820] truncate mt-0.5">{trip.sourcePlantName}</p>
          {isAtPlant && <p className="text-[10px] font-semibold text-[#F4511E] mt-0.5">● Current Checkpoint: {trip.lastConfirmedCheckpoint}</p>}
        </div>

        {/* Down Connector */}
        <div className="flex flex-col items-center">
          <div className={`w-0.5 h-3 ${isAtPlant ? 'bg-[#E8E5E0]' : 'bg-[#F4511E]'}`} />
          <span className="text-[10px] font-semibold text-[#555E68] bg-white px-2 py-0.5 rounded-full border border-[#E8E5E0]">
            ✓ Gate Out Confirmed
          </span>
          <div className={`w-0.5 h-3 ${isAtPlant ? 'bg-[#E8E5E0]' : 'bg-[#F4511E]'}`} />
        </div>

        {/* In Transit Box (🚛) */}
        <div className={`w-full text-center py-3 px-3 rounded-xl border transition-all ${isInTransit ? 'bg-white border-[#F4511E] ring-2 ring-[#FFE1D4] shadow-md' : 'bg-white/80 border-[#E8E5E0]'}`}>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-base">🚛</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${isInTransit ? 'text-[#F4511E]' : 'text-[#101820]'}`}>
              In Transit Stage
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[#555E68]">
            <span className="font-semibold text-[#101820] font-mono">{trip.vehicleNumber}</span> • {trip.quantityMT} MT {trip.material}
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-[#F0EDE8] text-[10px] text-[#555E68]">
            Last confirmed: <strong className="text-[#101820]">{trip.lastConfirmedCheckpoint}</strong>
          </div>
        </div>

        {/* Down Connector */}
        <div className="flex flex-col items-center">
          <div className={`w-0.5 h-3 ${isAtWarehouse ? 'bg-[#F4511E]' : 'bg-[#E8E5E0]'}`} />
          <span className="text-[10px] font-semibold text-[#555E68] bg-white px-2 py-0.5 rounded-full border border-[#E8E5E0]">
            {isAtWarehouse ? '✓ Gate In Receiving' : '○ Pending Arrival'}
          </span>
          <div className={`w-0.5 h-3 ${isAtWarehouse ? 'bg-[#F4511E]' : 'bg-[#E8E5E0]'}`} />
        </div>

        {/* Destination Warehouse Box */}
        <div className={`w-full text-center py-2.5 px-3 rounded-xl border transition-all ${isAtWarehouse ? 'bg-white border-[#F4511E] shadow-sm' : 'bg-white/80 border-[#E8E5E0]'}`}>
          <p className="text-[10px] font-bold text-[#8E9CA8] uppercase tracking-wider">Destination</p>
          <p className="text-xs font-bold text-[#101820] truncate mt-0.5">{trip.destinationWarehouseName}</p>
          {isAtWarehouse && <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">● Status: {trip.status.replace('_', ' ')}</p>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OPERATOR NOTES SECTION (embedded inside Trip Panel)
// ============================================================
function OperatorNotesSection({ tripId, plantName, warehouseName }: {
  tripId: string; plantName: string; warehouseName: string;
}) {
  const { state, addOperatorNote, deleteOperatorNote } = useApp();
  const [showAddNote, setShowAddNote] = useState(false);
  const currentRole = state.settings.currentRole;
  const currentUser = state.settings.currentUser;
  const canAdd = hasPermission(currentRole, 'ADD_NOTE');
  const canView = hasPermission(currentRole, 'VIEW_NOTES');

  const tripNotes = state.operatorNotes.filter(n => n.entityId === tripId);

  if (!canView) return null;

  const defaultLocation = currentRole === 'PLANT_OPERATOR' ? plantName
    : currentRole === 'WAREHOUSE_OPERATOR' ? warehouseName
    : 'Head Office';

  return (
    <div className="pt-4 border-t border-[#F0EDE8] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine size={14} className="text-amber-600" />
          <span className="text-xs font-bold text-[#101820] uppercase tracking-wider">Operator Notes</span>
          {tripNotes.length > 0 && (
            <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {tripNotes.length}
            </span>
          )}
        </div>
        {canAdd ? (
          <button
            onClick={() => setShowAddNote(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <PenLine size={12} /> Add Note
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-[#8E9CA8]">
            <Lock size={10} /> View only
          </div>
        )}
      </div>

      {tripNotes.length === 0 ? (
        <div className="py-4 text-center text-xs text-[#8E9CA8] bg-[#FFFEF7] border border-[#E8E4D0] rounded-xl">
          <PenLine size={20} className="mx-auto mb-1 opacity-30" />
          No notes yet for this trip
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tripNotes.map(note => (
            <OperatorNoteCard
              key={note.id}
              note={note}
              currentUser={currentUser}
              currentRole={currentRole}
              onDelete={deleteOperatorNote}
              compact
            />
          ))}
        </div>
      )}

      <AddNoteModal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onAdd={addOperatorNote}
        currentRole={currentRole}
        entityType="TRIP"
        entityId={tripId}
        locationDefault={defaultLocation}
      />
    </div>
  );
}

// ============================================================
// TRIP ACTION PANEL
// ============================================================
interface TripActionPanelProps {
  trip: Trip;
  vehicle: Vehicle;
  onClose?: () => void;
  onAction?: (message: string) => void;
  warehouses: Warehouse[];
  plants: Plant[];
  embedded?: boolean;
}

export function TripActionPanel({ trip, vehicle, onClose, onAction, warehouses, plants, embedded = false }: TripActionPanelProps) {
  const { state, updateTripStatus } = useApp();
  const [confirmAction, setConfirmAction] = useState<NextAction | null>(null);
  const [remark, setRemark] = useState('');

  const currentRole = state.settings.currentRole;
  const isManagement = currentRole === 'MANAGEMENT';
  const isPlantStage = ['ASSIGNED', 'AT_PLANT', 'LOADING', 'LOADED'].includes(trip.status);
  const isWarehouseStage = ['AT_WAREHOUSE', 'UNLOADING', 'UNLOADED'].includes(trip.status);
  const isWrongRoleForStage =
    (currentRole === 'PLANT_OPERATOR' && isWarehouseStage) ||
    (currentRole === 'WAREHOUSE_OPERATOR' && isPlantStage);

  const nextActions = getNextActions(trip, warehouses, plants);
  const currentStatusIdx = STATUS_ORDER.indexOf(trip.status);

  const handleConfirm = () => {
    if (!confirmAction) return;
    // Final permission check before executing action
    const requiredPerm = tripActionPermission[confirmAction.nextStatus];
    if (requiredPerm && !hasPermission(currentRole, requiredPerm)) {
      onAction?.('BLOCKED: You do not have permission to perform this action.');
      setConfirmAction(null);
      return;
    }
    updateTripStatus(
      trip.id,
      confirmAction.nextStatus,
      confirmAction.checkpoint,
      confirmAction.checkpointCode,
      confirmAction.label,
      remark
    );
    onAction?.(confirmAction.label + ' recorded successfully');
    setRemark('');
    setConfirmAction(null);
  };

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bg-white rounded-2xl border border-[#E8E5E0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden ${embedded ? '' : 'sticky top-20'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-[#F0EDE8] bg-[#F6F5F2]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#101820] font-mono text-sm">{trip.vehicleNumber}</span>
            <StatusBadge type="trip" value={trip.status} />
            {trip.isDelayed && (
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> +{trip.delayMinutes}m late
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8E9CA8] font-mono mt-0.5">{trip.id}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#8E9CA8] hover:text-[#101820] p-1.5 rounded-lg hover:bg-white transition-colors" aria-label="Close panel">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
        {/* Route Info */}
        <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E8E5E0]">
          <div className="flex items-center gap-2 text-sm text-[#101820] flex-wrap">
            <span className="font-bold">{trip.sourcePlantName.replace('Plant ', '')}</span>
            <ArrowRight size={14} className="text-[#8E9CA8]" />
            <span className="font-bold">{trip.destinationWarehouseName.replace('Warehouse ', '')}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <StatusBadge type="material" value={trip.material} size="sm" />
            <span className="text-xs font-bold text-[#101820]">{trip.quantityMT} MT</span>
            <StatusBadge type="priority" value={trip.priority} size="sm" />
          </div>

          {/* Last Confirmed Checkpoint */}
          <div className="mt-3 p-3 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0]">
            <p className="text-[10px] text-[#8E9CA8] uppercase font-bold tracking-wider">Last Confirmed Checkpoint</p>
            <p className="text-xs font-bold text-[#101820] mt-0.5">{trip.lastConfirmedCheckpoint}</p>
            <p className="text-[10px] text-[#8E9CA8] mt-0.5">{timeFmt(trip.lastConfirmedAt)}</p>
          </div>
        </div>

        {/* Operational Journey Flowchart */}
        <OperationalTransitVisual trip={trip} />

        {/* Vehicle & Driver Details */}
        <div className="p-4 bg-[#F6F5F2]/60 rounded-xl border border-[#E8E5E0]">
          <p className="text-[10px] font-bold text-[#8E9CA8] uppercase tracking-wider mb-2.5">Vehicle & Driver Details</p>
          <div className="grid grid-cols-2 gap-3">
            <LabelValue label="Driver" value={vehicle.driverName} />
            <LabelValue label="Contact" value={vehicle.driverPhone} />
            <LabelValue label="Transporter" value={vehicle.transporterName.split(' ').slice(0, 2).join(' ')} />
            <LabelValue label="Capacity" value={`${vehicle.capacityMT} MT`} />
          </div>
        </div>

        {/* Trip Progress Timeline with Orange branding */}
        <div className="pt-2">
          <p className="text-xs font-bold text-[#101820] uppercase tracking-wider mb-3.5">Trip Progress Timeline</p>
          <div className="pl-1">
            {TRIP_STEPS.map((step, i) => {
              const stepIdx = STATUS_ORDER.indexOf(step.status);
              const completed = stepIdx < currentStatusIdx || trip.status === 'COMPLETED';
              const current = step.status === trip.status || (step.status === 'IN_TRANSIT' && (trip.status === 'GATE_OUT' || trip.status === 'IN_TRANSIT'));
              const event = trip.events.find(e => e.status === step.status);
              return (
                <TimelineStep
                  key={step.status}
                  label={step.label}
                  timestamp={event ? timeFmt(event.timestamp) : undefined}
                  operator={event?.operator}
                  completed={completed}
                  current={current && !completed}
                  last={i === TRIP_STEPS.length - 1}
                  remark={event?.remark}
                />
              );
            })}
          </div>
        </div>

        {/* Next Actions */}
        {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && (
          <div className="pt-3 border-t border-[#F0EDE8] space-y-3">
            {/* Role permission alerts */}
            {isManagement && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Management Role (Read-Only):</span> Switch to <em>Plant Operator</em>, <em>Warehouse Operator</em>, or <em>Transport Planner</em> in sidebar to execute checkpoint updates.
                </div>
              </div>
            )}

            {isWrongRoleForStage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                <AlertTriangle size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Role Note:</span> Current stage typically executed by <strong>{isWarehouseStage ? 'Warehouse Operator' : 'Plant Operator'}</strong>. (Admin & Planner can bypass).
                </div>
              </div>
            )}

            {nextActions.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-[#8E9CA8]">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Trip completed. No further actions required.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#101820] uppercase tracking-wider">Execute Operational Action</p>
                {nextActions.map((action) => {
                  // Check if current role can execute this specific action
                  const requiredPerm = tripActionPermission[action.nextStatus];
                  const roleCanAct = !requiredPerm || hasPermission(currentRole, requiredPerm);
                  const isBlocked = isManagement || (isWrongRoleForStage && !roleCanAct);
                  return (
                    <div key={action.nextStatus}>
                      <Button
                        variant={action.variant === 'danger' ? 'danger' : 'primary'}
                        size="md"
                        disabled={isBlocked || !roleCanAct}
                        className={`w-full justify-center ${(!roleCanAct && !isManagement) ? 'opacity-40' : ''}`}
                        onClick={() => roleCanAct && !isBlocked ? setConfirmAction(action) : onAction?.(`BLOCKED: You do not have permission to perform this action.`)}
                        icon={<ChevronRight size={16} />}
                      >
                        {action.label}
                      </Button>
                      {!roleCanAct && !isManagement && (
                        <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                          <Lock size={10} /> This action requires {requiredPerm ? requiredPerm.replace(/_/g, ' ') : 'higher'} permission
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Operational Safeguards & Invalid Action Validation Panel */}
            <div className="mt-4 pt-3 border-t border-[#F0EDE8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#555E68] uppercase tracking-wider">Operational Safeguards</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Enforced</span>
              </div>
              <p className="text-[11px] text-[#8E9CA8] mb-2 leading-relaxed">System blocks out-of-order execution per logistics compliance rules:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {trip.status !== 'LOADED' && (
                  <button
                    onClick={() => onAction?.('Blocked: Gate Out is unavailable because loading has not been completed.')}
                    className="text-left p-2 rounded-lg bg-[#F6F5F2] hover:bg-rose-50 text-[#8E9CA8] hover:text-rose-700 border border-[#E8E5E0] hover:border-rose-200 transition-colors"
                  >
                    ✕ Gate Out (Blocked)
                  </button>
                )}
                {!['GATE_OUT', 'IN_TRANSIT'].includes(trip.status) && (
                  <button
                    onClick={() => onAction?.('Blocked: Warehouse arrival cannot happen before Gate Out.')}
                    className="text-left p-2 rounded-lg bg-[#F6F5F2] hover:bg-rose-50 text-[#8E9CA8] hover:text-rose-700 border border-[#E8E5E0] hover:border-rose-200 transition-colors"
                  >
                    ✕ WH Arrival (Blocked)
                  </button>
                )}
                {trip.status !== 'AT_WAREHOUSE' && (
                  <button
                    onClick={() => onAction?.('Blocked: Unloading cannot start before warehouse arrival.')}
                    className="text-left p-2 rounded-lg bg-[#F6F5F2] hover:bg-rose-50 text-[#8E9CA8] hover:text-rose-700 border border-[#E8E5E0] hover:border-rose-200 transition-colors"
                  >
                    ✕ Start Unload (Blocked)
                  </button>
                )}
                {trip.status !== 'UNLOADED' && (
                  <button
                    onClick={() => onAction?.('Blocked: Trip completion cannot happen before unloading completion.')}
                    className="text-left p-2 rounded-lg bg-[#F6F5F2] hover:bg-rose-50 text-[#8E9CA8] hover:text-rose-700 border border-[#E8E5E0] hover:border-rose-200 transition-colors"
                  >
                    ✕ Complete Trip (Blocked)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── OPERATOR NOTES SECTION ─────────────────────── */}
        <OperatorNotesSection tripId={trip.id} plantName={trip.sourcePlantName} warehouseName={trip.destinationWarehouseName} />
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F0EDE8] bg-[#F6F5F2] flex-shrink-0">
              <h2 className="text-base font-bold text-[#101820]">{confirmAction.confirmTitle}</h2>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              {confirmAction.confirmMsg}
              <div>
                <label className="text-xs text-[#555E68] font-bold block mb-1.5">Operational Remark / Note (Optional)</label>
                <input
                  type="text"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="e.g. Weighbridge slip verified, Bay 2 loaded..."
                  className="w-full text-sm border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E]"
                />
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#F0EDE8] bg-[#F6F5F2] flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end flex-shrink-0">
              <Button variant="secondary" onClick={() => setConfirmAction(null)} className="w-full sm:w-auto justify-center">Cancel</Button>
              <Button variant="primary" onClick={handleConfirm} className="w-full sm:w-auto justify-center">
                {confirmAction.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

