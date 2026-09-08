import React, { useState } from 'react';
import { Search, Smartphone, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Button, ToastContainer } from '../components/ui';
import { TripActionPanel } from '../components/trip/TripActionPanel';
import { useToast } from '../hooks/useToast';

export function MobileOperator() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [foundVehicle, setFoundVehicle] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const vehicle = foundVehicle ? state.vehicles.find(v => v.id === foundVehicle) : null;
  const trip = vehicle?.currentTripId ? state.trips.find(t => t.id === vehicle.currentTripId) : null;

  const handleSearch = () => {
    const q = search.trim().toLowerCase();
    const v = state.vehicles.find(v2 =>
      v2.vehicleNumber.toLowerCase() === q ||
      v2.id.toLowerCase() === q ||
      v2.vehicleNumber.toLowerCase().includes(q)
    );
    if (v) {
      setFoundVehicle(v.id);
    } else {
      setFoundVehicle(null);
      addToast('error', `Vehicle "${search}" not found`);
    }
  };

  return (
    <div className="min-h-screen bg-[#101820] flex flex-col text-slate-100">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="bg-[#17232B] border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F4511E] flex items-center justify-center font-black text-white text-base">
            T
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-tight">Transit<span className="text-[#F4511E]">Flow</span></div>
            <div className="text-slate-400 text-xs">Operator Mobile Terminal</div>
          </div>
        </div>
        <Smartphone size={22} className="text-[#F4511E]" />
      </div>

      {/* No GPS disclaimer */}
      <div className="bg-[#FFF0E9] border-b border-[#FFE1D4] px-4 py-2">
        <p className="text-[#101820] text-xs text-center font-medium">
          <span className="text-[#F4511E] font-bold">OPERATIONAL VIEW:</span> Checkpoint-based tracking — no GPS. Confirm physical checkpoints below.
        </p>
      </div>

      {/* Search area */}
      <div className="bg-[#17232B] px-4 py-5 border-b border-white/10">
        <p className="text-slate-200 text-sm font-semibold mb-3">Find Vehicle Checkpoint</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter vehicle number (e.g. GJ01AB1234)"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#101820] border border-white/20 text-white rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#F4511E] placeholder-slate-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-[#F4511E] hover:bg-[#D43D10] text-white font-semibold rounded-[10px] transition-colors text-sm shadow-sm"
          >
            Find
          </button>
        </div>

        {/* Demo Scanner */}
        <button
          onClick={() => setShowScanner(s => !s)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/20 rounded-[10px] text-slate-300 hover:text-white hover:border-[#F4511E] transition-colors text-sm bg-white/5"
        >
          <span>📷</span>
          Demo QR Scanner (no camera required)
        </button>

        {/* Demo scanner list */}
        {showScanner && (
          <div className="mt-3 bg-slate-700 rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-600 text-xs text-slate-400 font-semibold">
              Select vehicle to simulate scan:
            </div>
            <div className="max-h-40 overflow-y-auto">
              {state.vehicles.slice(0, 15).map(v => (
                <button
                  key={v.id}
                  onClick={() => { setFoundVehicle(v.id); setSearch(v.vehicleNumber); setShowScanner(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="text-sm font-mono font-bold text-white">{v.vehicleNumber}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="vehicle" value={v.status} size="sm" />
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vehicle found */}
      {vehicle && (
        <div className="flex-1 overflow-y-auto">
          {trip ? (
            <div className="p-4 space-y-4">
              {/* Vehicle summary */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-bold text-white font-mono">{vehicle.vehicleNumber}</div>
                    <div className="text-slate-400 text-sm mt-0.5">{trip.id}</div>
                  </div>
                  <StatusBadge type="vehicle" value={vehicle.status} />
                </div>

                {/* Route */}
                <div className="mt-3 flex items-center gap-2 text-white">
                  <span className="text-sm">{trip.sourcePlantName.replace('Plant ','')}</span>
                  <ArrowRight size={16} className="text-slate-400" />
                  <span className="text-sm font-semibold">{trip.destinationWarehouseName.replace('Warehouse ','')}</span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <StatusBadge type="material" value={trip.material} size="sm" />
                  <span className="text-slate-300 text-sm">{trip.quantityMT} MT</span>
                </div>

                {/* Last confirmed */}
                <div className="mt-3 p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Last Confirmed Checkpoint</p>
                  <p className="text-white font-semibold mt-1">{trip.lastConfirmedCheckpoint}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(trip.lastConfirmedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-amber-400 text-xs mt-1 font-medium">⚠ Manual checkpoint — no GPS</p>
                </div>
              </div>

              {/* Action panel */}
              <div className="bg-white rounded-xl overflow-hidden">
                <TripActionPanel
                  trip={trip}
                  vehicle={vehicle}
                  onAction={msg => addToast('success', msg)}
                  warehouses={state.warehouses}
                  plants={state.plants}
                  embedded
                />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-xl font-bold text-white font-mono mb-2">{vehicle.vehicleNumber}</div>
                <StatusBadge type="vehicle" value={vehicle.status} />
                <div className="mt-3 text-slate-300 text-sm">
                  <div><span className="text-slate-400">Driver:</span> {vehicle.driverName}</div>
                  <div className="mt-1"><span className="text-slate-400">Location:</span> {vehicle.lastConfirmedLocation}</div>
                </div>
                <div className="mt-4 p-3 bg-green-900/50 border border-green-700/50 rounded-lg flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm font-semibold">No Active Trip</p>
                    <p className="text-green-400 text-xs">This vehicle is currently {vehicle.status.toLowerCase().replace('_',' ')}.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!vehicle && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <Smartphone size={28} className="text-slate-500" />
          </div>
          <h3 className="text-slate-300 font-semibold mb-2">Operator Mode</h3>
          <p className="text-slate-500 text-sm">Search or scan a vehicle to confirm checkpoints, start/complete loading, or confirm warehouse arrivals.</p>
          <div className="mt-6 p-3 bg-slate-800 rounded-xl border border-slate-700 text-left">
            <p className="text-xs text-slate-400 font-semibold mb-2">Quick Access — Demo Vehicles:</p>
            {state.vehicles.filter(v => v.currentTripId).slice(0, 4).map(v => (
              <button key={v.id} onClick={() => { setFoundVehicle(v.id); setSearch(v.vehicleNumber); }}
                className="w-full flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <span className="text-sm font-mono font-bold text-[#F4511E]">{v.vehicleNumber}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge type="vehicle" value={v.status} size="sm" />
                  <ChevronRight size={12} className="text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
