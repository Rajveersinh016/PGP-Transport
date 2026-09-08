import React, { useState } from 'react';
import { Factory, Warehouse as WarehouseIcon, Truck, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, Card, StatusBadge } from '../components/ui';

export function PlantsPage() {
  const { state } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Plants" subtitle="Manufacturing plant operations overview" breadcrumb={['Locations', 'Plants']} />
      <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {state.plants.map(plant => {
          const plantVehicles = state.vehicles.filter(v => v.lastConfirmedLocationCode.startsWith(plant.id));
          const loading = plantVehicles.filter(v => v.status === 'LOADING').length;
          const waiting = plantVehicles.filter(v => v.status === 'AT_PLANT').length;
          const loaded = plantVehicles.filter(v => v.status === 'LOADED').length;
          const trips = state.trips.filter(t => t.sourcePlantId === plant.id && t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
          const pendingReqs = state.requests.filter(r => r.sourcePlantId === plant.id && r.status === 'PENDING').length;

          return (
            <button
              key={plant.id}
              onClick={() => setSelected(s => s === plant.id ? null : plant.id)}
              className={`text-left bg-white rounded-2xl border transition-all duration-150 p-5
                ${selected === plant.id ? 'border-[#F4511E] bg-[#FFF0E9]/30 ring-1 ring-[#F4511E]' : 'border-[#E8E5E0] hover:border-[#F4511E]/40 shadow-sm'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Factory size={20} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{plant.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{plant.city}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{plant.contactPerson} — {plant.contactPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-amber-800">{loading}</div>
                  <div className="text-[10px] text-amber-600">Loading</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-800">{waiting}</div>
                  <div className="text-[10px] text-blue-600">Waiting</div>
                </div>
                <div className="text-center p-2 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-800">{loaded}</div>
                  <div className="text-[10px] text-indigo-600">Loaded</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{trips.length} active trips</span>
                {pendingReqs > 0 && <span className="text-amber-600 font-semibold">{pendingReqs} pending requests</span>}
              </div>

              {selected === plant.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Current Vehicles</h4>
                  {plantVehicles.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No vehicles currently at this plant</p>
                  ) : (
                    <div className="space-y-1">
                      {plantVehicles.map(v => (
                        <div key={v.id} className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-gray-900">{v.vehicleNumber}</span>
                          <StatusBadge type="vehicle" value={v.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 space-y-1">
                    <h4 className="text-xs font-semibold text-gray-700">Active Trips from this Plant</h4>
                    {trips.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                        <span className="font-mono text-gray-700">{t.vehicleNumber}</span>
                        <span className="text-gray-500 truncate max-w-[120px]">→ {t.destinationWarehouseName.replace('Warehouse ','')}</span>
                        <StatusBadge type="trip" value={t.status} size="sm" />
                      </div>
                    ))}
                    {trips.length === 0 && <p className="text-xs text-gray-400 italic">No active trips</p>}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WarehousesPage() {
  const { state } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Warehouses" subtitle="Warehouse operations and vehicle status" breadcrumb={['Locations', 'Warehouses']} />
      <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {state.warehouses.map(wh => {
          const whVehicles = state.vehicles.filter(v => v.lastConfirmedLocationCode === wh.id);
          const unloading = whVehicles.filter(v => v.status === 'UNLOADING').length;
          const waiting = whVehicles.filter(v => v.status === 'AT_WAREHOUSE').length;
          const empty = whVehicles.filter(v => v.status === 'EMPTY').length;
          const activeTrips = state.trips.filter(t => t.destinationWarehouseId === wh.id && t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
          const pending = activeTrips.filter(t => t.status === 'IN_TRANSIT').length;
          const completedToday = state.trips.filter(t => t.destinationWarehouseId === wh.id && t.status === 'COMPLETED').length;

          // Average turnaround from completed trips (mock)
          const avgTurnaround = `${3 + (wh.id.charCodeAt(3) % 3)} hrs ${15 + (wh.id.charCodeAt(3) % 30)} min`;

          return (
            <button
              key={wh.id}
              onClick={() => setSelected(s => s === wh.id ? null : wh.id)}
              className={`text-left bg-white rounded-2xl border transition-all duration-150 p-5
                ${selected === wh.id ? 'border-[#F4511E] bg-[#FFF0E9]/30 ring-1 ring-[#F4511E]' : 'border-[#E8E5E0] hover:border-[#F4511E]/40 shadow-sm'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <WarehouseIcon size={20} className="text-purple-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{wh.code}</h3>
                    <span className="text-xs text-gray-500">{wh.city}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{wh.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{wh.contactPerson}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1">
                <div className="text-center p-1.5 bg-purple-50 rounded">
                  <div className="text-base font-bold text-purple-800">{waiting}</div>
                  <div className="text-[9px] text-purple-600">Waiting</div>
                </div>
                <div className="text-center p-1.5 bg-indigo-50 rounded">
                  <div className="text-base font-bold text-indigo-800">{unloading}</div>
                  <div className="text-[9px] text-indigo-600">Unloading</div>
                </div>
                <div className="text-center p-1.5 bg-green-50 rounded">
                  <div className="text-base font-bold text-green-800">{empty}</div>
                  <div className="text-[9px] text-green-600">Empty</div>
                </div>
                <div className="text-center p-1.5 bg-blue-50 rounded">
                  <div className="text-base font-bold text-blue-800">{pending}</div>
                  <div className="text-[9px] text-blue-600">En Route</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Capacity: {wh.capacity} MT</span>
                <span>{completedToday} completed today</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">Avg turnaround: {avgTurnaround}</div>

              {selected === wh.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Current Vehicles</h4>
                  {whVehicles.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No vehicles at this warehouse</p>
                  ) : (
                    <div className="space-y-1">
                      {whVehicles.map(v => (
                        <div key={v.id} className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-gray-900">{v.vehicleNumber}</span>
                          <StatusBadge type="vehicle" value={v.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Trips En Route to this Warehouse</h4>
                    {activeTrips.filter(t => t.status === 'IN_TRANSIT').map(t => (
                      <div key={t.id} className="text-xs text-gray-600 flex justify-between py-1 border-b border-gray-50">
                        <span className="font-mono">{t.vehicleNumber}</span>
                        <span>ETA: {new Date(t.expectedCompletionAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                    {activeTrips.filter(t => t.status === 'IN_TRANSIT').length === 0 && <p className="text-xs text-gray-400 italic">No arrivals expected</p>}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
