import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Phone, MapPin, Package, Navigation, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, LabelValue, Button } from '../components/ui';
import { TripActionPanel } from '../components/trip/TripActionPanel';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const vehicle = state.vehicles.find(v => v.id === id);
  const trip = vehicle?.currentTripId ? state.trips.find(t => t.id === vehicle.currentTripId) : null;
  const allTrips = state.trips.filter(t => t.vehicleId === id);

  const vehicleTypeLabels: Record<string, string> = {
    TRUCK_14T: '14 Tonne Truck', TRUCK_20T: '20 Tonne Truck', TRUCK_40T: '40 Tonne Truck',
    TRUCK_SMALL: 'Small Truck', TANKER: 'Tanker',
  };

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (!vehicle) {
    return (
      <div className="text-center py-16">
        <Truck size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Vehicle not found</p>
        <button onClick={() => navigate('/vehicles')} className="mt-3 text-[#F4511E] hover:underline text-sm">← Back to Vehicles</button>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-[#101820] hover:bg-[#FFF0E9] rounded-lg transition-colors" aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-[#101820] font-mono">{vehicle.vehicleNumber}</h1>
            <StatusBadge type="vehicle" value={vehicle.status} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{vehicleTypeLabels[vehicle.vehicleType]} · {vehicle.capacityMT} MT · {vehicle.id}</p>
        </div>
        <Button variant="secondary" size="sm" icon={<QrCode size={14} />}>
          Vehicle QR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vehicle Info */}
        <div className="space-y-5">
          <Card>
            <h2 className="text-sm font-bold text-[#101820] mb-3 pb-2 border-b border-[#E8E5E0]">Vehicle Information</h2>
            <dl className="space-y-3">
              <LabelValue label="Vehicle Number" value={<span className="font-mono">{vehicle.vehicleNumber}</span>} />
              <LabelValue label="Vehicle Type" value={vehicleTypeLabels[vehicle.vehicleType]} />
              <LabelValue label="Capacity" value={`${vehicle.capacityMT} Metric Tonnes`} />
              <LabelValue label="Status" value={<StatusBadge type="vehicle" value={vehicle.status} />} />
              <LabelValue label="Current Trip" value={vehicle.currentTripId || 'No active trip'} />
            </dl>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-[#101820] mb-3 pb-2 border-b border-[#E8E5E0]">Driver & Transporter</h2>
            <dl className="space-y-3">
              <LabelValue label="Driver Name" value={
                <span className="flex items-center gap-2">{vehicle.driverName}</span>
              } />
              <LabelValue label="Driver Contact" value={
                <a href={`tel:${vehicle.driverPhone}`} className="flex items-center gap-1 text-[#F4511E] hover:underline font-medium">
                  <Phone size={12} /> {vehicle.driverPhone}
                </a>
              } />
              <LabelValue label="Transporter" value={vehicle.transporterName} />
            </dl>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">Location Tracking</h2>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Navigation size={14} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-800">No GPS — Checkpoint Based</span>
              </div>
              <p className="text-xs text-amber-700">Location is based on the last confirmed operational checkpoint, not live GPS.</p>
            </div>
            <dl className="space-y-3">
              <LabelValue label="Last Confirmed Checkpoint" value={
                <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-400" />{vehicle.lastConfirmedLocation}</span>
              } />
              <LabelValue label="Last Updated" value={timeFmt(vehicle.lastUpdated)} />
              {vehicle.availableSince && (
                <LabelValue label="Available Since" value={timeFmt(vehicle.availableSince)} />
              )}
            </dl>
          </Card>
        </div>

        {/* Trip Action Panel or Trip History */}
        <div className="lg:col-span-2">
          {trip && vehicle.currentTripId && (
            <div className="mb-5">
              <TripActionPanel
                trip={trip}
                vehicle={vehicle}
                onAction={msg => addToast('success', msg)}
                warehouses={state.warehouses}
                plants={state.plants}
                embedded
              />
            </div>
          )}

          {/* Trip History */}
          <Card padding={false}>
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Trip History</h2>
              <p className="text-xs text-gray-400">{allTrips.length} trips on record</p>
            </div>
            {allTrips.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">No trip history for this vehicle</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {allTrips.map(t => (
                  <div key={t.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-900 font-mono">{t.id}</span>
                          <StatusBadge type="trip" value={t.status} size="sm" />
                          {t.isDelayed && <span className="text-xs text-red-600">⚠ +{t.delayMinutes}m</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {t.sourcePlantName.replace('Plant ','')} → {t.destinationWarehouseName.replace('Warehouse ','')}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge type="material" value={t.material} size="sm" />
                          <span className="text-xs text-gray-500">{t.quantityMT} MT</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-400">
                          {new Date(t.startedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                        {t.completedAt && (
                          <div className="text-xs text-green-600 mt-0.5">Completed</div>
                        )}
                      </div>
                    </div>
                    {/* Mini event log */}
                    {t.events.length > 0 && (
                      <div className="mt-2 text-[10px] text-gray-400">
                        {t.events.length} checkpoint{t.events.length !== 1 ? 's' : ''} recorded
                        {t.completedAt && ` · Duration: ${Math.round((new Date(t.completedAt).getTime() - new Date(t.startedAt).getTime()) / 3600000 * 10) / 10}h`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
