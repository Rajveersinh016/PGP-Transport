import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Truck, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusBadge, SearchBar, SelectFilter, Card, Button, EmptyState } from '../components/ui';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';
import type { Vehicle } from '../types';

export function VehicleAssignment() {
  const { state, assignVehicle } = useApp();
  const [searchParams] = useSearchParams();
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    searchParams.get('requestId') || state.requests.find(r => r.status === 'PENDING')?.id || ''
  );
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [confirmVehicleId, setConfirmVehicleId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const rId = searchParams.get('requestId');
    if (rId && state.requests.some(r => r.id === rId)) {
      setSelectedRequestId(rId);
    }
  }, [searchParams, state.requests]);

  const pendingRequests = state.requests.filter(r => r.status === 'PENDING');
  const selectedRequest = state.requests.find(r => r.id === selectedRequestId);

  const availableVehicles = state.vehicles.filter(v => {
    if (v.status !== 'AVAILABLE' && v.status !== 'EMPTY') return false;
    const q = search.toLowerCase();
    if (q && !v.vehicleNumber.toLowerCase().includes(q) && !v.transporterName.toLowerCase().includes(q) && !v.driverName.toLowerCase().includes(q)) return false;
    if (capacityFilter && v.capacityMT !== Number(capacityFilter)) return false;
    if (locationFilter && v.lastConfirmedLocationCode !== locationFilter) return false;
    return true;
  });

  const handleAssign = () => {
    if (!confirmVehicleId || !selectedRequest) return;
    const targetVehicle = state.vehicles.find(v => v.id === confirmVehicleId);
    if (!targetVehicle || ((targetVehicle.status !== 'AVAILABLE' && targetVehicle.status !== 'EMPTY') || targetVehicle.currentTripId)) {
      addToast('error', 'Vehicle is already assigned to an active trip.');
      setConfirmVehicleId(null);
      return;
    }
    if (targetVehicle.capacityMT < selectedRequest.requiredCapacityMT || targetVehicle.capacityMT < selectedRequest.quantityMT) {
      addToast('error', 'Selected vehicle capacity is insufficient for this request.');
      setConfirmVehicleId(null);
      return;
    }
    if (selectedRequest.status !== 'PENDING') {
      addToast('error', 'This request is not pending assignment.');
      setConfirmVehicleId(null);
      return;
    }

    assignVehicle(selectedRequest.id, confirmVehicleId);
    addToast('success', `Vehicle ${targetVehicle.vehicleNumber} assigned to ${selectedRequest.id}`);
    setConfirmVehicleId(null);
    setSelectedRequestId(pendingRequests.find(r => r.id !== selectedRequest.id)?.id || '');
  };

  const locationOptions = [
    { label: 'All Locations', value: '' },
    ...state.plants.map(p => ({ label: p.name, value: p.id })),
    ...state.warehouses.map(w => ({ label: w.name, value: w.id })),
  ];

  const confirmVehicle = confirmVehicleId ? state.vehicles.find(v => v.id === confirmVehicleId) : null;

  const timeFmt = (iso: string) => {
    if (!iso) return '—';
    const diff = (Date.now() - new Date(iso).getTime()) / 60000;
    if (diff < 60) return `${Math.round(diff)} min ago`;
    return `${Math.round(diff / 60)} hr ago`;
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader
        title="Vehicle Assignment"
        subtitle="Assign available vehicles to pending transport requests"
        breadcrumb={['Operations', 'Vehicle Assignment']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Requests */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#F0EDE8] bg-[#F6F5F2]">
            <h2 className="text-sm font-bold text-[#101820]">Pending Transport Requests</h2>
            <p className="text-xs text-[#8E9CA8] mt-0.5">{pendingRequests.length} requests awaiting vehicle assignment</p>
          </div>
          <div className="divide-y divide-[#F0EDE8] max-h-[600px] overflow-y-auto">
            {pendingRequests.length === 0 && (
              <EmptyState icon={<Check size={32} className="text-emerald-500" />} title="All requests assigned" description="No pending transport requests at this time." />
            )}
            {pendingRequests.map(req => (
              <button
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`w-full text-left p-4.5 transition-all ${selectedRequestId === req.id ? 'bg-[#FFF0E9]/50 border-l-4 border-[#F4511E]' : 'hover:bg-[#F6F5F2]/60'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#101820] font-mono">{req.id}</span>
                      <StatusBadge type="priority" value={req.priority} size="sm" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#101820] font-semibold">
                      <span>{req.sourcePlantName.replace('Plant ','')}</span>
                      <ArrowRight size={11} className="text-[#8E9CA8]" />
                      <span>{req.destinationWarehouseName.replace('Warehouse ','')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <StatusBadge type="material" value={req.material} size="sm" />
                      <span className="text-xs font-bold text-[#101820]">{req.quantityMT} MT</span>
                      <span className="text-xs text-[#8E9CA8]">Min: {req.requiredCapacityMT} MT</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-[#8E9CA8] uppercase font-bold tracking-wider">Required by</div>
                    <div className="text-xs font-bold text-[#101820] mt-0.5">{req.requiredTime}</div>
                  </div>
                </div>
                {req.remarks && (
                  <div className="mt-2.5 text-xs text-[#555E68] bg-white px-3 py-1.5 rounded-lg border border-[#E8E5E0] italic">
                    "{req.remarks}"
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Right: Available Vehicles */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#F0EDE8] bg-[#F6F5F2]">
            <h2 className="text-sm font-bold text-[#101820]">Available Vehicles</h2>
            {selectedRequest && (
              <div className="mt-2.5 p-3 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] text-xs text-[#101820]">
                <span className="font-bold text-[#F4511E] uppercase tracking-wider text-[10px] block mb-0.5">Active Target Request</span>
                <span className="font-mono font-bold">{selectedRequest.id}</span> — {selectedRequest.requiredCapacityMT} MT Capacity • {selectedRequest.material}
                {availableVehicles.length === 0 && (
                  <span className="block mt-1 text-rose-700 font-bold">⚠ No matching vehicles with ≥ {selectedRequest.requiredCapacityMT} MT</span>
                )}
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-b border-[#F0EDE8] flex flex-wrap gap-2.5">
            <SearchBar value={search} onChange={setSearch} placeholder="Search vehicles, drivers..." className="flex-1 min-w-0" />
            <SelectFilter
              value={capacityFilter}
              onChange={setCapacityFilter}
              options={[{ label: 'All Capacity', value: '' }, { label: '14 MT', value: '14' }, { label: '20 MT', value: '20' }, { label: '40 MT', value: '40' }]}
              label="Capacity filter"
            />
          </div>
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F6F5F2] border-b border-[#E8E5E0]">
                  <th className="px-4 py-3 text-left font-bold text-[#555E68] uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left font-bold text-[#555E68] uppercase tracking-wider hidden sm:table-cell">Capacity</th>
                  <th className="px-4 py-3 text-left font-bold text-[#555E68] uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left font-bold text-[#555E68] uppercase tracking-wider hidden md:table-cell">Driver</th>
                  <th className="px-4 py-3 text-left font-bold text-[#555E68] uppercase tracking-wider hidden lg:table-cell">Available</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {availableVehicles.map(vehicle => {
                  const capacityOk = !selectedRequest || vehicle.capacityMT >= selectedRequest.requiredCapacityMT;
                  return (
                    <tr key={vehicle.id} className={`border-b border-[#F0EDE8] hover:bg-[#FFF0E9]/30 transition-colors ${!capacityOk ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#101820] font-mono text-xs">{vehicle.vehicleNumber}</div>
                        <div className="text-[#8E9CA8] text-[11px]">{vehicle.transporterName.split(' ').slice(0,2).join(' ')}</div>
                        <StatusBadge type="vehicle" value={vehicle.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`font-bold ${capacityOk ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {vehicle.capacityMT} MT
                        </span>
                        {!capacityOk && <div className="text-rose-500 text-[10px] font-semibold">Insufficient</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-[#101820] font-medium truncate max-w-[120px]">{vehicle.lastConfirmedLocation}</div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="text-[#101820] font-medium">{vehicle.driverName}</div>
                        <div className="text-[#8E9CA8] text-[11px]">{vehicle.driverPhone}</div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-[#8E9CA8]">
                        {vehicle.availableSince ? timeFmt(vehicle.availableSince) : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Button
                          variant={capacityOk ? 'primary' : 'secondary'}
                          size="sm"
                          disabled={!selectedRequest}
                          onClick={() => {
                            if (!selectedRequest) return;
                            if (!capacityOk) {
                              addToast('error', 'Selected vehicle capacity is insufficient for this request.');
                              return;
                            }
                            setConfirmVehicleId(vehicle.id);
                          }}
                        >
                          {capacityOk ? 'Assign' : 'Insufficient'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {availableVehicles.length === 0 && (
              <EmptyState
                icon={<Truck size={32} className="text-[#8E9CA8]" />}
                title="No available vehicles"
                description={selectedRequest ? `No vehicles with ≥ ${selectedRequest.requiredCapacityMT} MT capacity are currently available.` : 'Select a request on the left to filter vehicles.'}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Confirm assign dialog */}
      {confirmVehicle && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={() => setConfirmVehicleId(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F0EDE8] bg-[#F6F5F2]">
              <h2 className="text-base font-bold text-[#101820]">Confirm Vehicle Assignment</h2>
            </div>
            <div className="px-6 py-5 space-y-3.5">
              <div className="p-4 bg-[#FFF0E9]/50 rounded-xl border border-[#FFE1D4] space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Request:</span><span className="font-mono font-bold text-[#101820]">{selectedRequest.id}</span></div>
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Route:</span><span className="font-semibold text-[#101820] text-xs">{selectedRequest.sourcePlantName.replace('Plant','')} → {selectedRequest.destinationWarehouseName.replace('Warehouse','')}</span></div>
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Material:</span><span className="font-bold text-[#101820]">{selectedRequest.material} — {selectedRequest.quantityMT} MT</span></div>
                <hr className="border-[#FFE1D4]" />
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Vehicle:</span><span className="font-bold text-[#F4511E] font-mono">{confirmVehicle.vehicleNumber}</span></div>
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Capacity:</span><span className="font-bold text-[#101820]">{confirmVehicle.capacityMT} MT</span></div>
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Driver:</span><span className="font-semibold text-[#101820]">{confirmVehicle.driverName}</span></div>
                <div className="flex justify-between"><span className="text-[#8E9CA8] font-medium">Transporter:</span><span className="font-semibold text-[#101820] text-xs">{confirmVehicle.transporterName}</span></div>
              </div>
              {confirmVehicle.capacityMT < selectedRequest.quantityMT && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs font-medium">
                  <AlertTriangle size={15} />
                  <span>Vehicle capacity is lower than quantity. Please verify before proceeding.</span>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#F0EDE8] bg-[#F6F5F2] flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setConfirmVehicleId(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleAssign} icon={<Check size={16} />}>Confirm Assignment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
