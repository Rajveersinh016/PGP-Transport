import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check, Truck, AlertTriangle, ArrowRight, ShieldCheck, User, Phone, Building2, MapPin, Plus, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusBadge, SearchBar, SelectFilter, Card, Button, EmptyState } from '../components/ui';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';
import type { Vehicle, TransportRequest } from '../types';

export function VehicleAssignment() {
  const { state, assignVehicle } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    searchParams.get('requestId') || state.requests.find(r => r.status === 'PENDING')?.id || ''
  );
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [confirmVehicleId, setConfirmVehicleId] = useState<string | null>(null);
  const [assignedSummary, setAssignedSummary] = useState<{
    request: TransportRequest;
    vehicle: Vehicle;
  } | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  const pendingRequests = state.requests.filter(r => r.status === 'PENDING');
  const selectedRequest = state.requests.find(r => r.id === selectedRequestId);

  useEffect(() => {
    const rId = searchParams.get('requestId');
    if (rId && state.requests.some(r => r.id === rId)) {
      setSelectedRequestId(rId);
    } else if (!selectedRequestId && pendingRequests.length > 0) {
      setSelectedRequestId(pendingRequests[0].id);
    }
  }, [searchParams, state.requests, pendingRequests]);

  const availableVehicles = state.vehicles.filter(v => {
    if (v.status !== 'AVAILABLE' && v.status !== 'EMPTY') return false;
    if (v.currentTripId) return false;
    const q = search.toLowerCase();
    if (q && !v.vehicleNumber.toLowerCase().includes(q) && !v.transporterName.toLowerCase().includes(q) && !v.driverName.toLowerCase().includes(q)) return false;
    if (capacityFilter && v.capacityMT !== Number(capacityFilter)) return false;
    if (locationFilter && v.lastConfirmedLocationCode !== locationFilter) return false;
    return true;
  });

  const confirmVehicle = confirmVehicleId ? state.vehicles.find(v => v.id === confirmVehicleId) : null;

  const handleAssign = () => {
    if (!confirmVehicle || !selectedRequest) return;

    if ((confirmVehicle.status !== 'AVAILABLE' && confirmVehicle.status !== 'EMPTY') || confirmVehicle.currentTripId) {
      addToast('error', 'Vehicle is not available for assignment.');
      setConfirmVehicleId(null);
      return;
    }

    const requiredCapacity = Math.max(selectedRequest.requiredCapacityMT, selectedRequest.quantityMT);
    if (confirmVehicle.capacityMT < requiredCapacity) {
      addToast('error', `Selected vehicle capacity (${confirmVehicle.capacityMT} MT) is insufficient for this request (${requiredCapacity} MT required).`);
      setConfirmVehicleId(null);
      return;
    }

    if (selectedRequest.status !== 'PENDING') {
      addToast('error', 'This transport request is not pending assignment.');
      setConfirmVehicleId(null);
      return;
    }

    // Execute assignment
    assignVehicle(selectedRequest.id, confirmVehicle.id);
    addToast('success', `Vehicle ${confirmVehicle.vehicleNumber} successfully assigned to ${selectedRequest.id}`);

    // Show detailed operational success dialog with next step
    setAssignedSummary({
      request: selectedRequest,
      vehicle: confirmVehicle,
    });

    setConfirmVehicleId(null);
    const nextPending = pendingRequests.find(r => r.id !== selectedRequest.id);
    setSelectedRequestId(nextPending ? nextPending.id : '');
  };

  const timeFmt = (iso: string) => {
    if (!iso) return '—';
    const diff = (Date.now() - new Date(iso).getTime()) / 60000;
    if (diff < 60) return `${Math.round(diff)} min ago`;
    return `${Math.round(diff / 60)} hr ago`;
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader
        title="Vehicle Assignment"
        subtitle="Match and assign available fleet vehicles to pending transport requests"
        breadcrumb={['Operations', 'Vehicle Assignment']}
        action={
          <Link to="/requests">
            <Button variant="secondary" icon={<Plus size={16} />}>
              Create Request
            </Button>
          </Link>
        }
      />

      {/* Assignment Workflow Instructions Banner */}
      <div className="p-4 bg-white border border-[#E8E5E0] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E9] flex items-center justify-center text-[#F4511E] font-bold">
            1 → 2
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101820]">How Vehicle Assignment Works</h3>
            <p className="text-xs text-[#555E68]">
              <strong>Step 1:</strong> Select a pending transport request on the left. &nbsp;|&nbsp; 
              <strong>Step 2:</strong> Review eligible vehicles and confirm assignment.
            </p>
          </div>
        </div>
        <div className="text-xs text-[#8E9CA8] font-medium">
          {pendingRequests.length} pending request{pendingRequests.length === 1 ? '' : 's'} • {availableVehicles.length} available vehicle{availableVehicles.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Step 1 - Pending Requests (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#101820] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#101820] text-white text-xs flex items-center justify-center font-bold">1</span>
              Select Pending Request
            </h2>
            <span className="text-xs text-[#8E9CA8] font-bold">{pendingRequests.length} pending</span>
          </div>

          <Card padding={false} className="overflow-hidden">
            <div className="divide-y divide-[#F0EDE8] max-h-[640px] overflow-y-auto">
              {pendingRequests.length === 0 && (
                <EmptyState
                  icon={<Check size={32} className="text-emerald-500" />}
                  title="No requests pending assignment"
                  description="All transport requests have been assigned. Create a new transport request to begin."
                  action={
                    <Button variant="primary" icon={<Plus size={14} />} onClick={() => navigate('/requests')}>
                      Create Transport Request
                    </Button>
                  }
                />
              )}
              {pendingRequests.map(req => {
                const isSelected = selectedRequestId === req.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`w-full text-left p-4 transition-all block ${
                      isSelected
                        ? 'bg-[#FFF0E9]/60 border-l-4 border-[#F4511E] shadow-inner'
                        : 'hover:bg-[#F6F5F2]/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#101820] bg-white px-2 py-0.5 rounded border border-[#E8E5E0]">
                          {req.id}
                        </span>
                        <StatusBadge type="priority" value={req.priority} size="sm" />
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-[#F4511E] bg-[#FFF0E9] border border-[#FFE1D4] px-2 py-0.5 rounded-full">
                          ✓ Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8E9CA8] font-semibold">Click to assign</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#101820] font-bold my-1">
                      <span className="truncate">{req.sourcePlantName.replace('Plant ', '')}</span>
                      <ArrowRight size={12} className="text-[#8E9CA8] flex-shrink-0" />
                      <span className="truncate">{req.destinationWarehouseName.replace('Warehouse ', '')}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#555E68] mt-2 pt-2 border-t border-[#F0EDE8]">
                      <div className="flex items-center gap-2">
                        <StatusBadge type="material" value={req.material} size="sm" />
                        <span className="font-bold text-[#101820]">{req.quantityMT} MT</span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#8E9CA8]">
                        Min Capacity: <strong className="text-[#101820]">{req.requiredCapacityMT} MT</strong>
                      </span>
                    </div>

                    {req.remarks && (
                      <p className="text-[11px] text-[#8E9CA8] italic mt-1.5 truncate">
                        "{req.remarks}"
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Step 2 - Assign Vehicle (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#101820] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#101820] text-white text-xs flex items-center justify-center font-bold">2</span>
              Choose Eligible Vehicle
            </h2>
            <span className="text-xs text-[#8E9CA8] font-bold">
              {availableVehicles.length} available
            </span>
          </div>

          {selectedRequest ? (
            <Card padding={false} className="overflow-hidden">
              {/* Target Request Information Header */}
              <div className="p-4 bg-[#FFF0E9] border-b border-[#FFE1D4]">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4511E] text-white px-2 py-0.5 rounded">
                      Assigning Request
                    </span>
                    <span className="font-mono font-bold text-sm text-[#101820]">{selectedRequest.id}</span>
                  </div>
                  <StatusBadge type="priority" value={selectedRequest.priority} size="sm" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[#8E9CA8] text-[10px] uppercase font-bold block">Origin Plant</span>
                    <strong className="text-[#101820]">{selectedRequest.sourcePlantName}</strong>
                  </div>
                  <div>
                    <span className="text-[#8E9CA8] text-[10px] uppercase font-bold block">Destination</span>
                    <strong className="text-[#101820]">{selectedRequest.destinationWarehouseName}</strong>
                  </div>
                  <div>
                    <span className="text-[#8E9CA8] text-[10px] uppercase font-bold block">Material / Quantity</span>
                    <strong className="text-[#101820]">{selectedRequest.material} — {selectedRequest.quantityMT} MT</strong>
                  </div>
                  <div>
                    <span className="text-[#8E9CA8] text-[10px] uppercase font-bold block">Required Capacity</span>
                    <strong className="text-[#F4511E] text-sm font-black">≥ {selectedRequest.requiredCapacityMT} MT</strong>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="p-3.5 border-b border-[#F0EDE8] bg-[#F6F5F2] flex flex-wrap gap-2.5">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search vehicle number, driver, transporter..."
                  className="flex-1 min-w-[200px]"
                />
                <SelectFilter
                  value={capacityFilter}
                  onChange={setCapacityFilter}
                  options={[
                    { label: 'All Capacities', value: '' },
                    { label: '14 MT', value: '14' },
                    { label: '20 MT', value: '20' },
                    { label: '40 MT', value: '40' },
                  ]}
                  label="Capacity filter"
                />
              </div>

              {/* Vehicle List */}
              <div className="divide-y divide-[#F0EDE8] max-h-[480px] overflow-y-auto">
                {availableVehicles.map(vehicle => {
                  const requiredMin = Math.max(selectedRequest.requiredCapacityMT, selectedRequest.quantityMT);
                  const isCapacityOk = vehicle.capacityMT >= requiredMin;

                  return (
                    <div
                      key={vehicle.id}
                      className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCapacityOk ? 'hover:bg-[#FFF0E9]/30' : 'bg-gray-50/60 opacity-60'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-[#101820]">
                            {vehicle.vehicleNumber}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {vehicle.capacityMT} MT Capacity
                          </span>
                          <StatusBadge type="vehicle" value={vehicle.status} size="sm" />
                        </div>

                        <div className="text-xs text-[#555E68] flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 size={12} className="text-[#8E9CA8]" />
                            {vehicle.transporterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} className="text-[#8E9CA8]" />
                            {vehicle.driverName} ({vehicle.driverPhone})
                          </span>
                        </div>

                        <div className="text-[11px] text-[#8E9CA8] flex items-center gap-1.5">
                          <MapPin size={11} className="text-[#8E9CA8]" />
                          <span>Location: <strong>{vehicle.lastConfirmedLocation}</strong></span>
                          <span>•</span>
                          <span>Available since: {timeFmt(vehicle.availableSince || '')}</span>
                        </div>

                        {/* Capacity Status Notice */}
                        {isCapacityOk ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1">
                            <Check size={11} />
                            Suitable Capacity ({vehicle.capacityMT} MT ≥ {requiredMin} MT Required)
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md mt-1">
                            <AlertTriangle size={11} />
                            Insufficient Capacity ({vehicle.capacityMT} MT &lt; {requiredMin} MT Required)
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 self-end sm:self-center">
                        <Button
                          variant={isCapacityOk ? 'primary' : 'secondary'}
                          size="sm"
                          disabled={!isCapacityOk}
                          onClick={() => {
                            if (!isCapacityOk) {
                              addToast('error', `Cannot assign ${vehicle.vehicleNumber}: Capacity (${vehicle.capacityMT} MT) is less than required ${requiredMin} MT.`);
                              return;
                            }
                            setConfirmVehicleId(vehicle.id);
                          }}
                          className="min-w-[120px] justify-center"
                        >
                          {isCapacityOk ? 'Assign Vehicle' : 'Insufficient'}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {availableVehicles.length === 0 && (
                  <EmptyState
                    icon={<Truck size={36} className="text-[#8E9CA8]" />}
                    title="No available vehicles found"
                    description={`No vehicles matching your search criteria are currently available in the fleet.`}
                  />
                )}
              </div>
            </Card>
          ) : (
            <Card padding={true} className="text-center py-16">
              <Truck size={40} className="mx-auto text-[#8E9CA8] mb-3 opacity-40" />
              <h3 className="text-base font-bold text-[#101820]">No Request Selected</h3>
              <p className="text-xs text-[#555E68] max-w-sm mx-auto mt-1">
                Please select a pending transport request from the list on the left to view matching vehicles and assign.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmVehicle && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={() => setConfirmVehicleId(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0EDE8] bg-[#F6F5F2] flex-shrink-0">
              <h2 className="text-base font-bold text-[#101820]">Confirm Vehicle Assignment</h2>
              <p className="text-xs text-[#8E9CA8] mt-0.5">Please verify all trip parameters before confirming.</p>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Request Details Box */}
              <div className="p-3.5 bg-[#FFF0E9]/60 rounded-xl border border-[#FFE1D4] space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-[#F4511E] block">Transport Request</span>
                <div className="flex justify-between"><span className="text-[#555E68]">Request ID:</span><span className="font-mono font-bold text-[#101820]">{selectedRequest.id}</span></div>
                <div className="flex justify-between"><span className="text-[#555E68]">Route:</span><span className="font-bold text-[#101820]">{selectedRequest.sourcePlantName} → {selectedRequest.destinationWarehouseName}</span></div>
                <div className="flex justify-between"><span className="text-[#555E68]">Material & Quantity:</span><span className="font-bold text-[#101820]">{selectedRequest.material} — {selectedRequest.quantityMT} MT</span></div>
              </div>

              {/* Vehicle Details Box */}
              <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-sky-700 block">Assigned Vehicle Details</span>
                <div className="flex justify-between"><span className="text-[#555E68]">Vehicle Number:</span><span className="font-mono font-bold text-sky-900 text-sm">{confirmVehicle.vehicleNumber}</span></div>
                <div className="flex justify-between"><span className="text-[#555E68]">Vehicle Capacity:</span><span className="font-bold text-[#101820]">{confirmVehicle.capacityMT} MT</span></div>
                <div className="flex justify-between"><span className="text-[#555E68]">Driver:</span><span className="font-bold text-[#101820]">{confirmVehicle.driverName} ({confirmVehicle.driverPhone})</span></div>
                <div className="flex justify-between"><span className="text-[#555E68]">Transporter:</span><span className="font-bold text-[#101820]">{confirmVehicle.transporterName}</span></div>
              </div>

              {/* Validation Check */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
                <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Validation passed: Vehicle capacity ({confirmVehicle.capacityMT} MT) meets the requirement for {selectedRequest.quantityMT} MT cargo.
                </span>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-[#F0EDE8] bg-[#F6F5F2] flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end flex-shrink-0">
              <Button variant="secondary" onClick={() => setConfirmVehicleId(null)} className="w-full sm:w-auto justify-center">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAssign} icon={<Check size={16} />} className="w-full sm:w-auto justify-center">
                Confirm & Dispatch Assignment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Assignment Operational Next-Step Dialog */}
      {assignedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={() => setAssignedSummary(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <Check size={26} />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-[#101820]">Vehicle Assigned Successfully!</h2>
              <p className="text-xs text-[#555E68]">
                Vehicle <strong className="font-mono text-[#101820]">{assignedSummary.vehicle.vehicleNumber}</strong> has been assigned to request <strong className="font-mono text-[#101820]">{assignedSummary.request.id}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Request Status:</span><span className="font-bold text-sky-700">ASSIGNED</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Vehicle Status:</span><span className="font-bold text-sky-700">ASSIGNED</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Driver:</span><span className="font-semibold text-[#101820]">{assignedSummary.vehicle.driverName} ({assignedSummary.vehicle.driverPhone})</span></div>
              <div className="flex justify-between"><span className="text-[#8E9CA8]">Transporter:</span><span className="font-semibold text-[#101820]">{assignedSummary.vehicle.transporterName}</span></div>
            </div>

            {/* Next Step Banner */}
            <div className="p-3.5 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] text-xs space-y-1">
              <div className="font-bold text-[#F4511E] flex items-center gap-1.5">
                <Navigation size={13} />
                OPERATIONAL NEXT STEP
              </div>
              <p className="text-[#101820]">
                Plant Operator at <strong>{assignedSummary.request.sourcePlantName}</strong> should confirm vehicle physical arrival at the entry gate once the truck reaches the plant.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => setAssignedSummary(null)}
                className="flex-1 justify-center"
              >
                Assign Another Request
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setAssignedSummary(null);
                  navigate('/');
                }}
                className="flex-1 justify-center"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
