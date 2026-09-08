import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  PageHeader, StatusBadge, SearchBar, Table, Th, Td,
  EmptyState, Card, Button, Modal
} from '../components/ui';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';
import type { TransportRequest, RequestStatus, MaterialType, VehicleType, Priority } from '../types';

const STATUS_TABS: { label: string; value: RequestStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// ============================================================
// NEW REQUEST FORM
// ============================================================
interface NewRequestFormProps {
  onClose: () => void;
  onSubmit: (req: TransportRequest) => void;
}

function NewRequestForm({ onClose, onSubmit }: NewRequestFormProps) {
  const { state } = useApp();
  const defaultWh = state.warehouses.find(w => w.id === 'WH-02')?.id || state.warehouses[0]?.id;
  const defaultPlt = state.plants.find(p => p.id === 'PLT-01')?.id || state.plants[0]?.id;

  const [form, setForm] = useState(() => ({
    requestId: `TR-2026-${String(Date.now()).slice(-5)}`,
    sourcePlantId: defaultPlt,
    destinationWarehouseId: defaultWh,
    material: 'FG' as MaterialType,
    quantityMT: '20',
    requiredVehicleType: 'TRUCK_20T' as VehicleType,
    requiredCapacityMT: '20',
    priority: 'MEDIUM' as Priority,
    requiredDate: new Date().toISOString().split('T')[0],
    requiredTime: '14:00',
    remarks: '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.requestId.trim()) {
      e.requestId = 'Request ID is mandatory.';
    } else if (state.requests.some(r => r.id.toLowerCase() === form.requestId.trim().toLowerCase())) {
      e.requestId = 'This Request ID already exists. Please enter a unique ID.';
    }

    const qty = Number(form.quantityMT);
    if (!form.quantityMT || isNaN(qty) || qty <= 0) {
      e.quantityMT = 'Please enter a valid transport quantity.';
    } else if (qty > 100) {
      e.quantityMT = 'Quantity cannot exceed 100 MT for a single transport request.';
    } else if (qty > Number(form.requiredCapacityMT)) {
      e.quantityMT = 'Quantity exceeds required vehicle capacity. Please adjust capacity or quantity.';
    }

    if (!form.requiredDate) e.requiredDate = 'Required date is mandatory.';
    if (!form.sourcePlantId) e.sourcePlantId = 'Please select a source plant.';
    if (!form.destinationWarehouseId) e.destinationWarehouseId = 'Please select a destination warehouse.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const srcPlant = state.plants.find(p => p.id === form.sourcePlantId)!;
    const dstWH = state.warehouses.find(w => w.id === form.destinationWarehouseId)!;
    const reqId = form.requestId.trim() || `TR-2026-${String(Date.now()).slice(-5)}`;
    const newReq: TransportRequest = {
      id: reqId,
      requestDate: new Date().toISOString(),
      sourcePlantId: form.sourcePlantId,
      sourcePlantName: srcPlant.name,
      destinationWarehouseId: form.destinationWarehouseId,
      destinationWarehouseName: dstWH.name,
      material: form.material,
      quantityMT: Number(form.quantityMT),
      requiredVehicleType: form.requiredVehicleType,
      requiredCapacityMT: Number(form.requiredCapacityMT),
      priority: form.priority,
      requiredDate: form.requiredDate,
      requiredTime: form.requiredTime,
      remarks: form.remarks,
      status: 'PENDING',
      assignedVehicleId: null,
      assignedVehicleNumber: null,
      tripId: null,
      createdBy: state.settings.currentUser,
    };
    onSubmit(newReq);
  };

  const vehicleTypeLabels: Record<VehicleType, string> = {
    TRUCK_14T: 'Truck 14 MT', TRUCK_20T: 'Truck 20 MT', TRUCK_40T: 'Truck 40 MT',
    TRUCK_SMALL: 'Small Truck', TANKER: 'Tanker',
  };

  const capacityMap: Record<VehicleType, string> = {
    TRUCK_14T: '14', TRUCK_20T: '20', TRUCK_40T: '40', TRUCK_SMALL: '6', TANKER: '20',
  };

  const f = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4">
      {/* Request ID */}
      <div>
        <label className="block text-xs font-bold text-[#101820] mb-1.5">Request ID <span className="text-[#F4511E]">*</span></label>
        <input
          type="text"
          value={form.requestId}
          onChange={e => f('requestId', e.target.value)}
          placeholder="e.g. TR-2026-00421"
          className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
        />
        {errors.requestId && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.requestId}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Source Plant */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Source Plant <span className="text-[#F4511E]">*</span></label>
          <select
            value={form.sourcePlantId}
            onChange={e => f('sourcePlantId', e.target.value)}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          >
            {state.plants.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
          </select>
          {errors.sourcePlantId && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.sourcePlantId}</p>}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Destination Warehouse <span className="text-[#F4511E]">*</span></label>
          <select
            value={form.destinationWarehouseId}
            onChange={e => f('destinationWarehouseId', e.target.value)}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          >
            {state.warehouses.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
          </select>
          {errors.destinationWarehouseId && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.destinationWarehouseId}</p>}
        </div>

        {/* Material */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Material <span className="text-[#F4511E]">*</span></label>
          <select
            value={form.material}
            onChange={e => f('material', e.target.value)}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          >
            {(['FG','RM','OW','PGP','PM','SFG'] as MaterialType[]).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Quantity (MT) <span className="text-[#F4511E]">*</span></label>
          <input
            type="number"
            value={form.quantityMT}
            onChange={e => f('quantityMT', e.target.value)}
            min="1"
            max="100"
            placeholder="e.g. 38"
            className={`w-full text-sm bg-white border rounded-[10px] px-3.5 py-2 text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all ${errors.quantityMT ? 'border-rose-400' : 'border-[#E8E5E0]'}`}
          />
          {errors.quantityMT && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.quantityMT}</p>}
        </div>

        {/* Vehicle type */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Required Vehicle Type</label>
          <select
            value={form.requiredVehicleType}
            onChange={e => {
              const vt = e.target.value as VehicleType;
              setForm(prev => ({ ...prev, requiredVehicleType: vt, requiredCapacityMT: capacityMap[vt] }));
            }}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          >
            {Object.entries(vehicleTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Required Capacity (MT)</label>
          <input
            type="number"
            value={form.requiredCapacityMT}
            readOnly
            className="w-full text-sm border border-[#E8E5E0] bg-[#F6F5F2] rounded-[10px] px-3.5 py-2 text-[#555E68] font-semibold"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Priority</label>
          <select
            value={form.priority}
            onChange={e => f('priority', e.target.value)}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          >
            {(['LOW','MEDIUM','HIGH','URGENT'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Required Date */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Required Date <span className="text-[#F4511E]">*</span></label>
          <input
            type="date"
            value={form.requiredDate}
            onChange={e => f('requiredDate', e.target.value)}
            className={`w-full text-sm bg-white border rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all ${errors.requiredDate ? 'border-rose-400' : 'border-[#E8E5E0]'}`}
          />
          {errors.requiredDate && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.requiredDate}</p>}
        </div>

        {/* Required Time */}
        <div>
          <label className="block text-xs font-bold text-[#101820] mb-1.5">Required Time</label>
          <input
            type="time"
            value={form.requiredTime}
            onChange={e => f('requiredTime', e.target.value)}
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
          />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-xs font-bold text-[#101820] mb-1.5">Remarks</label>
        <textarea
          value={form.remarks}
          onChange={e => f('remarks', e.target.value)}
          rows={2}
          placeholder="Any special instructions or handling notes..."
          className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] px-3.5 py-2 text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] resize-none transition-all"
        />
      </div>

      <div className="flex gap-3 justify-end pt-3 border-t border-[#F0EDE8]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} icon={<Plus size={16} />}>Create Request</Button>
      </div>
    </div>
  );
}

// ============================================================
// TRANSPORT REQUESTS PAGE
// ============================================================
export function TransportRequests() {
  const { state, addRequest, cancelRequest } = useApp();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<RequestStatus | ''>('');
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (searchParams.get('new') === '1') setShowNewForm(true);
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = state.requests.filter(r => {
    if (tab && r.status !== tab) return false;
    const q = search.toLowerCase();
    if (q && !r.id.toLowerCase().includes(q) && !r.sourcePlantName.toLowerCase().includes(q) &&
        !r.destinationWarehouseName.toLowerCase().includes(q) && !r.material.toLowerCase().includes(q)) return false;
    return true;
  });

  const tabCounts = STATUS_TABS.reduce((acc, t) => {
    acc[t.value] = t.value === '' ? state.requests.length : state.requests.filter(r => r.status === t.value).length;
    return acc;
  }, {} as Record<string, number>);

  const handleNewRequest = (req: TransportRequest) => {
    addRequest(req);
    setShowNewForm(false);
    addToast('success', `Transport request ${req.id} created successfully. Next step: Assign an available vehicle.`);
  };

  const handleCancel = () => {
    if (!cancelId) return;
    cancelRequest(cancelId);
    setCancelId(null);
    addToast('warning', 'Transport request cancelled');
  };

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader
        title="Transport Requests"
        subtitle={`${state.requests.length} total transport requests`}
        breadcrumb={['Operations', 'Transport Requests']}
        action={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowNewForm(true)}>
            New Transport Request
          </Button>
        }
      />

      {/* Tabs styled with design system */}
      <div className="flex gap-1.5 p-1.5 bg-[#F6F5F2] border border-[#E8E5E0] rounded-2xl overflow-x-auto max-w-full touch-pan-x">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-150 flex-shrink-0
              ${tab === t.value
                ? 'bg-[#F4511E] text-white shadow-sm'
                : 'text-[#555E68] hover:text-[#101820] hover:bg-white/60'}`}
          >
            {t.label} <span className={tab === t.value ? 'text-[#FFE1D4]' : 'text-[#8E9CA8]'}>({tabCounts[t.value] || 0})</span>
          </button>
        ))}
      </div>

      <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search requests by ID, route, material..." className="w-full sm:w-80" />
      </div>

      <Card padding={false}>
        <Table>
          <thead>
            <tr>
              <Th>Request ID</Th>
              <Th>Date</Th>
              <Th>Route</Th>
              <Th>Material</Th>
              <Th>Qty</Th>
              <Th>Priority</Th>
              <Th>Status</Th>
              <Th className="hidden lg:table-cell">Assigned Vehicle</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr key={req.id} className="hover:bg-[#FFF0E9]/40 transition-colors">
                <Td>
                  <div className="font-mono text-xs font-bold text-[#101820]">{req.id}</div>
                  <div className="text-[10px] text-[#8E9CA8]">{req.createdBy}</div>
                </Td>
                <Td><span className="text-xs text-[#555E68]">{timeFmt(req.requestDate)}</span></Td>
                <Td>
                  <div className="text-xs text-[#101820] font-semibold">
                    <span className="truncate">{req.sourcePlantName.replace('Plant ','')}</span>
                    <span className="text-[#8E9CA8] mx-1">→</span>
                    <span className="truncate">{req.destinationWarehouseName.replace('Warehouse ','')}</span>
                  </div>
                </Td>
                <Td><StatusBadge type="material" value={req.material} size="sm" /></Td>
                <Td><span className="text-xs font-bold text-[#101820]">{req.quantityMT} MT</span></Td>
                <Td><StatusBadge type="priority" value={req.priority} size="sm" /></Td>
                <Td><StatusBadge type="request" value={req.status} size="sm" /></Td>
                <Td className="hidden lg:table-cell">
                  {req.assignedVehicleNumber
                    ? <span className="text-xs font-mono font-bold text-[#101820]">{req.assignedVehicleNumber}</span>
                    : <span className="text-xs text-[#8E9CA8] italic">Unassigned</span>}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    {req.status === 'PENDING' && (
                      <>
                        <Link
                          to={`/assignment?requestId=${req.id}`}
                          className="text-xs bg-[#F4511E] text-white hover:bg-[#D43D10] font-bold px-2.5 py-1.5 rounded-[8px] transition-colors shadow-xs"
                        >
                          Assign Vehicle
                        </Link>
                        <button
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
                          onClick={() => setCancelId(req.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {req.status === 'ASSIGNED' && (
                      <span className="text-xs text-[#8E9CA8] font-medium">Awaiting trip</span>
                    )}
                    {req.status === 'IN_PROGRESS' && req.tripId && (
                      <span className="text-xs text-[#F4511E] font-mono font-bold">{req.tripId}</span>
                    )}
                    {req.status === 'COMPLETED' && (
                      <span className="text-xs text-emerald-700 font-bold">✓ Done</span>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filtered.length === 0 && (
          <EmptyState
            icon={<ClipboardList size={36} className="text-[#8E9CA8]" />}
            title="No requests found"
            description="No transport requests match your current filters."
            action={<Button variant="primary" icon={<Plus size={14} />} onClick={() => setShowNewForm(true)}>Create Request</Button>}
          />
        )}
      </Card>

      {/* New Request Modal */}
      <Modal open={showNewForm} onClose={() => setShowNewForm(false)} title="Create Transport Request" size="lg">
        <NewRequestForm onClose={() => setShowNewForm(false)} onSubmit={handleNewRequest} />
      </Modal>

      {/* Cancel Confirm */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl p-4 sm:p-6">
            <h3 className="font-bold text-[#101820] text-base mb-2">Cancel Transport Request?</h3>
            <p className="text-sm text-[#555E68] mb-5">Are you sure you want to cancel request <strong className="text-[#101820]">{cancelId}</strong>? This action cannot be undone.</p>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <Button variant="secondary" onClick={() => setCancelId(null)} className="w-full sm:w-auto justify-center">Keep</Button>
              <Button variant="danger" onClick={handleCancel} className="w-full sm:w-auto justify-center">Cancel Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
