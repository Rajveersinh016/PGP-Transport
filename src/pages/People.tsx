import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, SearchBar, Table, Th, Td, EmptyState, Card } from '../components/ui';
import { Users, Building2 } from 'lucide-react';

export function DriversPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [transporterFilter, setTransporterFilter] = useState('');

  const filtered = state.drivers.filter(d => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.phone.includes(q) && !d.licenseNumber.toLowerCase().includes(q)) return false;
    if (transporterFilter && d.transporterId !== transporterFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Drivers" subtitle={`${state.drivers.length} registered drivers`} breadcrumb={['People', 'Drivers']} />
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, phone, license..." className="w-full sm:w-72" />
        <select
          value={transporterFilter}
          onChange={e => setTransporterFilter(e.target.value)}
          className="w-full sm:w-auto text-sm border border-[#E8E5E0] rounded-[10px] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
        >
          <option value="">All Transporters</option>
          {state.transporters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <Card padding={false}>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Driver Name</Th>
              <Th>Phone</Th>
              <Th>License Number</Th>
              <Th>Transporter</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const vehicle = state.vehicles.find(v => v.driverName === d.name);
              return (
                <tr key={d.id} className="hover:bg-[#FFF0E9]/40 transition-colors">
                  <Td><span className="text-xs text-gray-400">{i + 1}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FFF0E9] flex items-center justify-center text-xs font-bold text-[#F4511E]">
                        {d.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <span className="text-sm font-medium text-[#101820]">{d.name}</span>
                    </div>
                  </Td>
                  <Td><a href={`tel:${d.phone}`} className="text-xs text-[#101820] hover:text-[#F4511E] font-medium">{d.phone}</a></Td>
                  <Td><span className="text-xs font-mono text-gray-700">{d.licenseNumber}</span></Td>
                  <Td><span className="text-xs text-gray-600">{d.transporterName}</span></Td>
                  <Td>
                    {vehicle ? (
                      <div>
                        <span className="text-xs font-mono font-semibold text-gray-900">{vehicle.vehicleNumber}</span>
                        <span className="text-xs text-gray-400 ml-1">({vehicle.status.replace('_',' ')})</span>
                      </div>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Users size={28} />} title="No drivers found" />}
      </Card>
    </div>
  );
}

export function TransportersPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  const filtered = state.transporters.filter(t => {
    const q = search.toLowerCase();
    if (q && !t.name.toLowerCase().includes(q) && !t.code.toLowerCase().includes(q) && !t.contactPerson.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Transporters" subtitle={`${state.transporters.length} registered transporters`} breadcrumb={['People', 'Transporters']} />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search transporter, code..." className="w-full sm:w-72" />
      </div>
      <Card padding={false}>
        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Transporter Name</Th>
              <Th>Contact Person</Th>
              <Th>Phone</Th>
              <Th>Vehicles</Th>
              <Th>Active Drivers</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const vehicles = state.vehicles.filter(v => v.transporterId === t.id);
              const drivers = state.drivers.filter(d => d.transporterId === t.id);
              const active = vehicles.filter(v => v.status !== 'AVAILABLE' && v.status !== 'EMPTY' && v.status !== 'OFFLINE').length;
              return (
                <tr key={t.id} className="hover:bg-[#FFF0E9]/40 transition-colors">
                  <Td><span className="text-xs font-bold font-mono text-[#101820] bg-[#F6F5F2] border border-[#E8E5E0] px-2 py-0.5 rounded-[6px]">{t.code}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#101820] flex items-center justify-center text-xs font-bold text-white">
                        {t.code.slice(0,2)}
                      </div>
                      <span className="text-sm font-medium text-[#101820]">{t.name}</span>
                    </div>
                  </Td>
                  <Td><span className="text-xs text-gray-700">{t.contactPerson}</span></Td>
                  <Td><a href={`tel:${t.contactPhone}`} className="text-xs text-[#101820] hover:text-[#F4511E] font-medium">{t.contactPhone}</a></Td>
                  <Td>
                    <span className="text-xs font-semibold text-gray-900">{vehicles.length}</span>
                    <span className="text-xs text-gray-400 ml-1">({active} active)</span>
                  </Td>
                  <Td><span className="text-xs text-gray-700">{drivers.length}</span></Td>
                  <Td>
                    <span className={`text-xs font-semibold ${t.active ? 'text-green-700' : 'text-gray-400'}`}>
                      {t.active ? '● Active' : '○ Inactive'}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Building2 size={28} />} title="No transporters found" />}
      </Card>
    </div>
  );
}
