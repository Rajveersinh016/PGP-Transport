import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { BarChart2 } from 'lucide-react';

// ============================================================
// TRANSPORT STATUS CHART — Live data from application state
// Management & Admin dashboard
// ============================================================

const STATUS_CONFIG = [
  { key: 'Completed',   statuses: ['COMPLETED'],                             color: '#10B981', description: 'Successfully delivered' },
  { key: 'In Transit',  statuses: ['IN_TRANSIT', 'GATE_OUT'],                color: '#F4511E', description: 'Currently moving' },
  { key: 'At Plant',    statuses: ['AT_PLANT', 'LOADING', 'LOADED', 'ASSIGNED'], color: '#3B82F6', description: 'At source plant' },
  { key: 'At Warehouse',statuses: ['AT_WAREHOUSE', 'UNLOADING', 'UNLOADED'], color: '#8B5CF6', description: 'At destination warehouse' },
  { key: 'Delayed',     statuses: [] as string[],                            color: '#EF4444', description: 'Delayed trips', isDelayed: true },
];

interface ChartDatum {
  name: string;
  value: number;
  color: string;
  statuses: string[];
  description: string;
  isDelayed?: boolean;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartDatum }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#101820] text-white px-4 py-3 rounded-xl shadow-xl border border-[#17232B] text-xs">
      <div className="font-bold text-sm mb-1">{d.name}</div>
      <div className="text-[#8E9CA8] mb-2">{d.description}</div>
      <div className="text-2xl font-bold" style={{ color: d.color }}>{d.value}</div>
      <div className="text-[10px] text-[#8E9CA8] mt-1">trips</div>
    </div>
  );
}

export function TransportStatusChart() {
  const { state } = useApp();
  const navigate = useNavigate();

  // Build live chart data from actual application state
  const data: ChartDatum[] = STATUS_CONFIG.map(cfg => {
    let value = 0;
    if (cfg.isDelayed) {
      value = state.trips.filter(t => t.isDelayed && t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
    } else {
      value = state.trips.filter(t => cfg.statuses.includes(t.status)).length;
    }
    return {
      name: cfg.key,
      value,
      color: cfg.color,
      statuses: cfg.statuses,
      description: cfg.description,
      isDelayed: cfg.isDelayed,
    };
  });

  const totalTrips = state.trips.filter(t => t.status !== 'CANCELLED').length;
  const completedTrips = data.find(d => d.name === 'Completed')?.value ?? 0;
  const onTimePct = totalTrips > 0 ? Math.round(((totalTrips - (data.find(d => d.name === 'Delayed')?.value ?? 0)) / totalTrips) * 100) : 0;

  const handleBarClick = (entry: ChartDatum) => {
    if (!entry) return;
    if (entry.name === 'In Transit' || entry.isDelayed) {
      navigate('/transit');
    } else if (entry.name === 'Completed') {
      navigate('/reports/history');
    } else if (entry.name === 'At Plant') {
      navigate('/vehicles/at-plant');
    } else if (entry.name === 'At Warehouse') {
      navigate('/vehicles/at-warehouse');
    }
  };

  if (totalTrips === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E5E0] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#FFF0E9] flex items-center justify-center">
            <BarChart2 size={18} className="text-[#F4511E]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#101820]">Transport Status Overview</h2>
            <p className="text-xs text-[#8E9CA8]">Live trip distribution by current status</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center text-[#8E9CA8]">
            <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No trip data available</p>
            <p className="text-xs mt-1">Create transport requests to see charts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E5E0] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF0E9] flex items-center justify-center">
            <BarChart2 size={18} className="text-[#F4511E]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#101820]">Transport Status Overview</h2>
            <p className="text-xs text-[#8E9CA8]">Live · Click a bar to filter — {totalTrips} total trips</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-2xl font-bold text-emerald-600">{onTimePct}%</div>
          <div className="text-[10px] text-[#8E9CA8] font-medium uppercase tracking-wider">On-Time</div>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={36} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#8E9CA8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#8E9CA8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F6F5F2' }} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            cursor="pointer"
            onClick={(data) => handleBarClick(data as unknown as ChartDatum)}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} fillOpacity={entry.value === 0 ? 0.3 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend + key stats */}
      <div className="mt-4 pt-4 border-t border-[#F0EDE8] flex flex-wrap gap-3">
        {data.map(d => (
          <button
            key={d.name}
            onClick={() => handleBarClick(d)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#555E68] hover:text-[#101820] transition-colors group"
          >
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color, opacity: d.value === 0 ? 0.3 : 1 }} />
            <span>{d.name}</span>
            <span className="font-bold text-[#101820] group-hover:text-[#F4511E] transition-colors">({d.value})</span>
          </button>
        ))}
      </div>

      {/* On-time stat (mobile) */}
      <div className="sm:hidden mt-3 pt-3 border-t border-[#F0EDE8] flex items-center justify-between">
        <span className="text-xs text-[#8E9CA8]">On-Time Performance</span>
        <span className="text-lg font-bold text-emerald-600">{onTimePct}%</span>
      </div>
    </div>
  );
}

// ============================================================
// MINI TRANSPORT OVERVIEW (smaller variant for dashboard cards)
// ============================================================
export function TransportMiniStats() {
  const { state } = useApp();

  const inTransit = state.trips.filter(t => t.status === 'IN_TRANSIT' || t.status === 'GATE_OUT').length;
  const delayed = state.trips.filter(t => t.isDelayed && t.status !== 'COMPLETED').length;
  const completed = state.trips.filter(t => t.status === 'COMPLETED').length;
  const active = state.trips.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Active Trips', value: active, color: 'text-[#F4511E]', bg: 'bg-[#FFF0E9]' },
        { label: 'In Transit', value: inTransit, color: 'text-blue-700', bg: 'bg-blue-50' },
        { label: 'Delayed', value: delayed, color: 'text-rose-700', bg: 'bg-rose-50' },
        { label: 'Completed', value: completed, color: 'text-emerald-700', bg: 'bg-emerald-50' },
      ].map(stat => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-[#555E68] font-medium mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
