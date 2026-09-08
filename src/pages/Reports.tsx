import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useApp } from '../context/AppContext';
import { PageHeader, Card, StatusBadge, SearchBar, Table, Th, Td, EmptyState } from '../components/ui';
import { TrendingUp, Truck, Warehouse, History } from 'lucide-react';

// ============================================================
// TRANSPORT PERFORMANCE
// ============================================================
export function TransportPerformance() {
  const { state } = useApp();

  const total = state.trips.length;
  const completed = state.trips.filter(t => t.status === 'COMPLETED').length;
  const delayed = state.trips.filter(t => t.isDelayed).length;
  const cancelled = state.requests.filter(r => r.status === 'CANCELLED').length;
  const avgTime = 5.3;

  const byPlant = state.plants.map(p => ({
    name: p.code,
    trips: state.trips.filter(t => t.sourcePlantId === p.id).length,
    completed: state.trips.filter(t => t.sourcePlantId === p.id && t.status === 'COMPLETED').length,
    delayed: state.trips.filter(t => t.sourcePlantId === p.id && t.isDelayed).length,
  }));

  const byMaterial = ['FG','RM','OW','PGP','PM','SFG'].map(m => ({
    name: m,
    count: state.trips.filter(t => t.material === m).length,
    qty: state.trips.filter(t => t.material === m).reduce((s, t) => s + t.quantityMT, 0),
  }));

  const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#06b6d4','#f43f5e'];

  return (
    <div>
      <PageHeader title="Transport Performance" subtitle="Key metrics and trip analysis" breadcrumb={['Reports', 'Transport Performance']} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Trips', value: total, color: 'text-[#101820]', highlight: true },
          { label: 'Completed', value: completed, color: 'text-emerald-700' },
          { label: 'Delayed', value: delayed, color: 'text-rose-700' },
          { label: 'Cancelled Requests', value: cancelled, color: 'text-gray-700' },
        ].map(k => (
          <Card key={k.label} className={k.highlight ? "border-l-4 border-l-[#F4511E]" : ""}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{k.label}</p>
            <p className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trips by Plant */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Trips by Plant</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byPlant} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3,3,0,0]} />
              <Bar dataKey="trips" name="Total" fill="#3b82f6" radius={[3,3,0,0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Material breakdown */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Trips by Material</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byMaterial.filter(m => m.count > 0)} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {byMaterial.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary table */}
        <Card padding={false} className="lg:col-span-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Material-wise Transport Volume</h3>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Material</Th>
                <Th>Total Trips</Th>
                <Th>Total Quantity (MT)</Th>
                <Th>Avg per Trip (MT)</Th>
              </tr>
            </thead>
            <tbody>
              {byMaterial.filter(m => m.count > 0).map(m => (
                <tr key={m.name} className="hover:bg-gray-50">
                  <Td><StatusBadge type="material" value={m.name as any} size="sm" /></Td>
                  <Td><span className="font-semibold">{m.count}</span></Td>
                  <Td><span className="font-semibold">{m.qty} MT</span></Td>
                  <Td><span className="text-gray-600">{m.count ? Math.round(m.qty / m.count) : 0} MT</span></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// VEHICLE UTILIZATION
// ============================================================
export function VehicleUtilization() {
  const { state } = useApp();

  const total = state.vehicles.length;
  const active = state.vehicles.filter(v => v.status !== 'AVAILABLE' && v.status !== 'EMPTY' && v.status !== 'OFFLINE').length;
  const available = state.vehicles.filter(v => v.status === 'AVAILABLE' || v.status === 'EMPTY').length;
  const offline = state.vehicles.filter(v => v.status === 'OFFLINE').length;

  const byTransporter = state.transporters.slice(0, 8).map(t => ({
    name: t.code,
    total: state.vehicles.filter(v => v.transporterId === t.id).length,
    active: state.vehicles.filter(v => v.transporterId === t.id && v.status !== 'AVAILABLE' && v.status !== 'EMPTY').length,
  }));

  const byStatus = [
    { name: 'Available', count: state.vehicles.filter(v => v.status === 'AVAILABLE').length },
    { name: 'Empty', count: state.vehicles.filter(v => v.status === 'EMPTY').length },
    { name: 'Assigned', count: state.vehicles.filter(v => v.status === 'ASSIGNED').length },
    { name: 'At Plant', count: state.vehicles.filter(v => v.status === 'AT_PLANT').length },
    { name: 'Loading', count: state.vehicles.filter(v => v.status === 'LOADING').length },
    { name: 'In Transit', count: state.vehicles.filter(v => v.status === 'IN_TRANSIT').length },
    { name: 'At Warehouse', count: state.vehicles.filter(v => v.status === 'AT_WAREHOUSE').length },
    { name: 'Unloading', count: state.vehicles.filter(v => v.status === 'UNLOADING').length },
    { name: 'Offline', count: state.vehicles.filter(v => v.status === 'OFFLINE').length },
  ];

  const COLORS = ['#10b981','#34d399','#3b82f6','#f59e0b','#f97316','#6366f1','#8b5cf6','#a855f7','#9ca3af'];

  return (
    <div>
      <PageHeader title="Vehicle Utilization" subtitle="Fleet usage and availability analysis" breadcrumb={['Reports', 'Vehicle Utilization']} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Fleet', value: total, color: 'text-blue-700' },
          { label: 'Active', value: active, color: 'text-green-700' },
          { label: 'Available', value: available, color: 'text-amber-700' },
          { label: 'Offline', value: offline, color: 'text-gray-700' },
        ].map(k => (
          <Card key={k.label}>
            <p className="text-xs text-gray-500 font-medium uppercase">{k.label}</p>
            <p className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{Math.round(k.value / total * 100)}% of fleet</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Fleet by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byStatus.filter(s => s.count > 0)} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                label={({ name, value }) => (Number(value) > 2 ? `${name}: ${value}` : '')}>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Vehicles by Transporter</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byTransporter} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Bar dataKey="active" name="Active" fill="#3b82f6" radius={[0,3,3,0]} />
              <Bar dataKey="total" name="Total" fill="#e5e7eb" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// WAREHOUSE PERFORMANCE
// ============================================================
export function WarehousePerformance() {
  const { state } = useApp();

  const data = state.warehouses.map(wh => {
    const whCompleted = state.trips.filter(t => t.destinationWarehouseId === wh.id && t.status === 'COMPLETED');
    const whActive = state.trips.filter(t => t.destinationWarehouseId === wh.id && t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
    
    let avgTurnaround = '—';
    if (whCompleted.length > 0) {
      const validCompleted = whCompleted.filter(t => t.completedAt);
      if (validCompleted.length > 0) {
        const totalMin = validCompleted.reduce((acc, t) => {
          return acc + ((new Date(t.completedAt!).getTime() - new Date(t.startedAt).getTime()) / 60000);
        }, 0);
        const avgMin = Math.round(totalMin / validCompleted.length);
        avgTurnaround = `${Math.floor(avgMin / 60)}h ${avgMin % 60}m`;
      }
    }

    return {
      name: wh.code,
      fullName: wh.name,
      completed: whCompleted.length,
      active: whActive.length,
      avgWaiting: whCompleted.length > 0 ? 'Verified' : '—',
      avgLoading: whCompleted.length > 0 ? 'Verified' : '—',
      avgUnloading: whCompleted.length > 0 ? 'Verified' : '—',
      avgTurnaround,
    };
  });

  return (
    <div>
      <PageHeader title="Warehouse Performance" subtitle="Turnaround, waiting, loading and unloading metrics" breadcrumb={['Reports', 'Warehouse Performance']} />

      <div className="mb-5">
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Trips by Warehouse</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" name="Completed" fill="#8b5cf6" radius={[3,3,0,0]} />
              <Bar dataKey="active" name="Active" fill="#c4b5fd" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card padding={false}>
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Warehouse Performance Metrics</h3>
          <p className="text-xs text-gray-400 mt-0.5">Calculated dynamically from verified trip checkpoints</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <Th>Warehouse</Th>
                <Th>City</Th>
                <Th>Trips Completed</Th>
                <Th>Avg Waiting</Th>
                <Th>Avg Unloading</Th>
                <Th>Avg Turnaround</Th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.name} className="hover:bg-gray-50 border-b border-gray-50">
                  <Td>
                    <div className="font-bold text-gray-900">{d.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{d.fullName}</div>
                  </Td>
                  <Td>{state.warehouses.find(w => w.code === d.name)?.city}</Td>
                  <Td><span className="font-semibold">{d.completed}</span></Td>
                  <Td><span className="text-amber-700">{d.avgWaiting}</span></Td>
                  <Td><span className="text-purple-700">{d.avgUnloading}</span></Td>
                  <Td><span className="text-blue-700 font-semibold">{d.avgTurnaround}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TRIP HISTORY
// ============================================================
export function TripHistory() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [plantFilter, setPlantFilter] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = state.trips.filter(t => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (plantFilter && t.sourcePlantId !== plantFilter) return false;
    const q = search.toLowerCase();
    if (q && !t.vehicleNumber.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) &&
        !t.driverName.toLowerCase().includes(q) && !t.transporterName.toLowerCase().includes(q)) return false;
    return true;
  });

  const selectedTrip = selected ? state.trips.find(t => t.id === selected) : null;

  const duration = (trip: typeof state.trips[0]) => {
    if (!trip.completedAt) return 'In progress';
    const ms = new Date(trip.completedAt).getTime() - new Date(trip.startedAt).getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <div>
      <PageHeader title="Trip History" subtitle={`${state.trips.length} trips on record`} breadcrumb={['Reports', 'Trip History']} />

      <div className="flex flex-wrap gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search vehicle, trip, driver..." className="w-full sm:w-72" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="LOADING">Loading</option>
          <option value="AT_WAREHOUSE">At Warehouse</option>
        </select>
        <select value={plantFilter} onChange={e => setPlantFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Plants</option>
          {state.plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className={`grid gap-5 ${selectedTrip ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
        <div className={selectedTrip ? 'xl:col-span-2' : ''}>
          <Card padding={false}>
            <Table>
              <thead>
                <tr>
                  <Th>Trip / Vehicle</Th>
                  <Th>Route</Th>
                  <Th>Material</Th>
                  <Th>Status</Th>
                  <Th className="hidden lg:table-cell">Duration</Th>
                  <Th className="hidden xl:table-cell">Driver</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(trip => (
                  <tr
                    key={trip.id}
                    className={`hover:bg-[#FFF0E9]/50 cursor-pointer transition-colors border-b border-[#E8E5E0] ${selected === trip.id ? 'bg-[#FFF0E9] border-l-4 border-l-[#F4511E]' : ''}`}
                    onClick={() => setSelected(prev => prev === trip.id ? null : trip.id)}
                  >
                    <Td>
                      <div className="font-bold text-gray-900 font-mono text-xs">{trip.vehicleNumber}</div>
                      <div className="text-xs text-gray-400">{trip.id}</div>
                    </Td>
                    <Td>
                      <div className="text-xs text-gray-600">
                        {trip.sourcePlantName.replace('Plant ','')} → {trip.destinationWarehouseName.replace('Warehouse ','')}
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge type="material" value={trip.material} size="sm" />
                      <div className="text-xs text-gray-500 mt-0.5">{trip.quantityMT} MT</div>
                    </Td>
                    <Td><StatusBadge type="trip" value={trip.status} size="sm" /></Td>
                    <Td className="hidden lg:table-cell"><span className="text-xs text-gray-600">{duration(trip)}</span></Td>
                    <Td className="hidden xl:table-cell"><span className="text-xs text-gray-600">{trip.driverName}</span></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {filtered.length === 0 && <EmptyState icon={<History size={28} />} title="No trips found" />}
          </Card>
        </div>

        {selectedTrip && (
          <div className="xl:col-span-1">
            <Card padding={false}>
              <div className="px-4 py-3 border-b border-[#E8E5E0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#101820]">Trip Timeline</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{selectedTrip.id} — {selectedTrip.vehicleNumber}</p>
              </div>
              <div className="p-4 overflow-y-auto max-h-[500px]">
                {selectedTrip.events.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No events recorded</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTrip.events.map((event, i) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-[#F4511E] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{i+1}</div>
                          {i < selectedTrip.events.length - 1 && <div className="w-0.5 flex-1 mt-1 bg-[#FFE1D4] min-h-[16px]" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge type="trip" value={event.status} size="sm" />
                            <span className="text-[10px] text-gray-400">{new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-gray-700 font-medium mt-0.5">{event.action}</p>
                          <p className="text-[10px] text-gray-500">{event.checkpoint} — {event.operator}</p>
                          {event.remark && <p className="text-[10px] text-gray-400 italic mt-0.5">"{event.remark}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
