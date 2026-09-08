import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, SearchBar, SelectFilter, Table, Th, Td, EmptyState, Card } from '../components/ui';

export function AuditLog() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const filtered = state.auditLog.filter(entry => {
    const q = search.toLowerCase();
    if (q && !entry.operator.toLowerCase().includes(q) && !entry.entityLabel.toLowerCase().includes(q) &&
        !entry.action.toLowerCase().includes(q)) return false;
    if (roleFilter && entry.operatorRole !== roleFilter) return false;
    if (moduleFilter && entry.module !== moduleFilter) return false;
    return true;
  });

  const modules = [...new Set(state.auditLog.map(e => e.module))];
  const roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Transport Planner', value: 'TRANSPORT_PLANNER' },
    { label: 'Plant Operator', value: 'PLANT_OPERATOR' },
    { label: 'Warehouse Operator', value: 'WAREHOUSE_OPERATOR' },
    { label: 'Management', value: 'MANAGEMENT' },
  ];

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle={`${state.auditLog.length} events recorded`}
        breadcrumb={['Administration', 'Audit Log']}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search operator, action, entity..." className="w-full sm:w-72" />
        <SelectFilter value={roleFilter} onChange={setRoleFilter} options={roleOptions} label="Role filter" />
        <SelectFilter
          value={moduleFilter}
          onChange={setModuleFilter}
          options={[{ label: 'All Modules', value: '' }, ...modules.map(m => ({ label: m, value: m }))]}
          label="Module filter"
        />
      </div>

      <Card padding={false}>
        <Table>
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Operator</Th>
              <Th>Module</Th>
              <Th>Action</Th>
              <Th>Entity</Th>
              <Th className="hidden lg:table-cell">Change</Th>
              <Th className="hidden xl:table-cell">Location</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                <Td>
                  <div className="text-xs font-mono text-gray-700">{timeFmt(entry.timestamp)}</div>
                  <div className="text-[10px] text-gray-400">{new Date(entry.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FFF0E9] flex items-center justify-center text-xs font-bold text-[#F4511E]">
                      {entry.operator.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">{entry.operator}</div>
                      <div className="text-[10px] text-gray-400">{entry.operatorRole.replace('_', ' ')}</div>
                    </div>
                  </div>
                </Td>
                <Td><span className="text-xs text-gray-600">{entry.module}</span></Td>
                <Td>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded
                    ${entry.action.includes('Created') ? 'text-[#F4511E] bg-[#FFF0E9]' :
                      entry.action.includes('Completed') || entry.action.includes('Resolved') ? 'text-green-700 bg-green-50' :
                      entry.action.includes('Cancelled') || entry.action.includes('Delayed') ? 'text-red-700 bg-red-50' :
                      'text-gray-700 bg-gray-50'}`}>
                    {entry.action}
                  </span>
                </Td>
                <Td>
                  <div className="text-xs font-mono text-gray-900">{entry.entityLabel}</div>
                  <div className="text-[10px] text-gray-400">{entry.entityType}</div>
                </Td>
                <Td className="hidden lg:table-cell">
                  {entry.oldValue || entry.newValue ? (
                    <div className="flex items-center gap-1 text-xs">
                      {entry.oldValue && <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{entry.oldValue}</span>}
                      {entry.oldValue && entry.newValue && <span className="text-gray-400">→</span>}
                      {entry.newValue && <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{entry.newValue}</span>}
                    </div>
                  ) : <span className="text-xs text-gray-400">—</span>}
                </Td>
                <Td className="hidden xl:table-cell"><span className="text-xs text-gray-500">{entry.location}</span></Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {filtered.length === 0 && (
          <EmptyState icon={<FileText size={28} />} title="No audit entries found" description="Adjust your filters to see audit log entries." />
        )}
      </Card>
    </div>
  );
}

// ============================================================
// SETTINGS
// ============================================================
export function SettingsPage() {
  const { state, dispatch } = useApp();
  const [settings, setSettings] = useState(state.settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const f = (key: keyof typeof settings, val: unknown) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and thresholds" breadcrumb={['Administration', 'Settings']} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Thresholds */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Delay Thresholds</h3>
          <div className="space-y-4">
            {[
              { key: 'waitingThresholdMinutes' as const, label: 'Waiting Threshold (min)', desc: 'Alert when vehicle waits more than this duration' },
              { key: 'loadingThresholdMinutes' as const, label: 'Loading Threshold (min)', desc: 'Alert when loading exceeds this duration' },
              { key: 'unloadingThresholdMinutes' as const, label: 'Unloading Threshold (min)', desc: 'Alert when unloading exceeds this duration' },
              { key: 'transitThresholdMinutes' as const, label: 'Transit Threshold (min)', desc: 'Alert when in-transit time exceeds this duration' },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                <p className="text-xs text-gray-400 mb-1">{desc}</p>
                <input
                  type="number"
                  value={settings[key]}
                  onChange={e => f(key, Number(e.target.value))}
                  min="1"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Integrations */}
        <div className="space-y-5">
          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">GPS Integration</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-xs font-semibold text-gray-600">Not Connected</span>
              </div>
              <p className="text-xs text-gray-500">GPS integration can be connected in a future phase. Currently using checkpoint-based manual tracking.</p>
              <div className="mt-3 p-2 bg-white rounded border border-gray-200 text-xs text-gray-400 font-mono">
                API Endpoint: Not configured<br />
                Provider: —<br />
                Status: Demo Mode
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">SAP Integration</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-xs font-semibold text-amber-700">Demo / Not Connected</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">SAP integration can be added after the workflow is approved by the business team.</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p className="font-semibold text-gray-600">Future data sources:</p>
                {['Transport Orders', 'Material Master', 'Plant Master', 'Warehouse Master', 'Delivery Data'].map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Demo Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Demo Mode</p>
                  <p className="text-xs text-gray-400">Show demo indicators and reset button</p>
                </div>
                <button
                  onClick={() => f('demoMode', !settings.demoMode)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.demoMode ? 'bg-[#F4511E]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.demoMode ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Notifications</p>
                  <p className="text-xs text-gray-400">Enable system notifications</p>
                </div>
                <button
                  onClick={() => f('notificationsEnabled', !settings.notificationsEnabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-[#F4511E]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 text-sm font-semibold rounded-[10px] transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-[#F4511E] hover:bg-[#D43D10] text-white shadow-sm'}`}
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MASTER DATA
// ============================================================
export function MasterData() {
  const [activeTab, setActiveTab] = useState('materials');

  const tabs = [
    { key: 'materials', label: 'Materials' },
    { key: 'vehicle-types', label: 'Vehicle Types' },
    { key: 'status-defs', label: 'Status Definitions' },
  ];

  const materials = [
    { code: 'FG', name: 'Finished Goods', description: 'Production output ready for dispatch', unit: 'MT' },
    { code: 'RM', name: 'Raw Material', description: 'Input materials for production', unit: 'MT' },
    { code: 'OW', name: 'Own Work', description: 'Internal processing material', unit: 'MT' },
    { code: 'PGP', name: 'PGP Material', description: 'Company-specific material category', unit: 'MT' },
    { code: 'PM', name: 'Packing Material', description: 'Packaging and packing materials', unit: 'MT' },
    { code: 'SFG', name: 'Semi-Finished Goods', description: 'Partially processed goods', unit: 'MT' },
  ];

  const vehicleTypes = [
    { code: 'TRUCK_14T', name: '14 Tonne Truck', capacity: 14, description: 'Light duty transport' },
    { code: 'TRUCK_20T', name: '20 Tonne Truck', capacity: 20, description: 'Medium duty transport' },
    { code: 'TRUCK_40T', name: '40 Tonne Truck', capacity: 40, description: 'Heavy duty transport' },
    { code: 'TRUCK_SMALL', name: 'Small Truck / LCV', capacity: 6, description: 'Light commercial vehicle' },
    { code: 'TANKER', name: 'Tanker', capacity: 20, description: 'Liquid / bulk material transport' },
  ];

  const statusDefs = [
    { code: 'AVAILABLE', label: 'Available', color: 'Green', description: 'Vehicle is ready and can be assigned to a trip' },
    { code: 'ASSIGNED', label: 'Assigned', color: 'Blue', description: 'Vehicle has been assigned to a transport request' },
    { code: 'AT_PLANT', label: 'At Plant', color: 'Amber', description: 'Vehicle has arrived at the source plant' },
    { code: 'LOADING', label: 'Loading', color: 'Amber', description: 'Loading of material is in progress' },
    { code: 'LOADED', label: 'Loaded', color: 'Indigo', description: 'Vehicle is fully loaded and awaiting dispatch' },
    { code: 'IN_TRANSIT', label: 'In Transit', color: 'Blue', description: 'Vehicle has left the plant and is on route to warehouse' },
    { code: 'AT_WAREHOUSE', label: 'At Warehouse', color: 'Purple', description: 'Vehicle has arrived at the destination warehouse' },
    { code: 'UNLOADING', label: 'Unloading', color: 'Purple', description: 'Unloading of material is in progress' },
    { code: 'EMPTY', label: 'Empty', color: 'Green', description: 'Vehicle completed unloading and is now empty' },
    { code: 'DELAYED', label: 'Delayed', color: 'Red', description: 'Vehicle is behind schedule' },
    { code: 'OFFLINE', label: 'Offline', color: 'Gray', description: 'Vehicle is inactive or out of service' },
  ];

  return (
    <div>
      <PageHeader title="Master Data" subtitle="Configurable reference data — to be finalized with business team" breadcrumb={['Administration', 'Master Data']} />
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
        <span className="font-semibold">Note:</span> This master data is configured as mock/demo data. In the production system, this will be editable and can be synchronized with SAP.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 overflow-x-auto max-w-full touch-pan-x">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === t.key ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'materials' && (
        <Card padding={false}>
          <Table>
            <thead><tr><Th>Code</Th><Th>Material Name</Th><Th>Description</Th><Th>Unit</Th></tr></thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.code} className="hover:bg-gray-50 border-b border-gray-50">
                  <Td><span className="font-mono font-bold text-gray-900">{m.code}</span></Td>
                  <Td><span className="font-medium text-gray-900">{m.name}</span></Td>
                  <Td><span className="text-xs text-gray-500">{m.description}</span></Td>
                  <Td><span className="text-xs text-gray-600">{m.unit}</span></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {activeTab === 'vehicle-types' && (
        <Card padding={false}>
          <Table>
            <thead><tr><Th>Code</Th><Th>Vehicle Type</Th><Th>Capacity (MT)</Th><Th>Description</Th></tr></thead>
            <tbody>
              {vehicleTypes.map(v => (
                <tr key={v.code} className="hover:bg-gray-50 border-b border-gray-50">
                  <Td><span className="font-mono font-bold text-gray-900">{v.code}</span></Td>
                  <Td><span className="font-medium text-gray-900">{v.name}</span></Td>
                  <Td><span className="font-semibold text-blue-700">{v.capacity} MT</span></Td>
                  <Td><span className="text-xs text-gray-500">{v.description}</span></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {activeTab === 'status-defs' && (
        <Card padding={false}>
          <Table>
            <thead><tr><Th>Status Code</Th><Th>Label</Th><Th>Color</Th><Th>Definition</Th></tr></thead>
            <tbody>
              {statusDefs.map(s => (
                <tr key={s.code} className="hover:bg-gray-50 border-b border-gray-50">
                  <Td><span className="font-mono text-xs font-bold text-gray-900">{s.code}</span></Td>
                  <Td><StatusBadge type="vehicle" value={s.code as any} /></Td>
                  <Td><span className="text-xs text-gray-600">{s.color}</span></Td>
                  <Td><span className="text-xs text-gray-500">{s.description}</span></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}

// Need to import StatusBadge
import { StatusBadge } from '../components/ui';

// ============================================================
// USERS & ROLES
// ============================================================
export function UsersRoles() {
  const demoUsers = [
    { id: 'USR-001', name: 'Amit Shah', role: 'TRANSPORT_PLANNER', email: 'amit.shah@company.in', location: 'Head Office', active: true },
    { id: 'USR-002', name: 'Suresh Mehta', role: 'PLANT_OPERATOR', email: 'suresh.mehta@company.in', location: 'Plant Ahmedabad', active: true },
    { id: 'USR-003', name: 'Ramesh Shah', role: 'PLANT_OPERATOR', email: 'ramesh.shah@company.in', location: 'Plant Vadodara', active: true },
    { id: 'USR-004', name: 'Priya Joshi', role: 'WAREHOUSE_OPERATOR', email: 'priya.joshi@company.in', location: 'Warehouse Pune', active: true },
    { id: 'USR-005', name: 'Anil Desai', role: 'WAREHOUSE_OPERATOR', email: 'anil.desai@company.in', location: 'Warehouse Mumbai', active: true },
    { id: 'USR-006', name: 'Operations Manager', role: 'MANAGEMENT', email: 'ops.manager@company.in', location: 'Head Office', active: true },
    { id: 'USR-007', name: 'System Admin', role: 'ADMIN', email: 'admin@company.in', location: 'Head Office', active: true },
  ];

  const roleDescriptions: Record<string, { label: string; perms: string[] }> = {
    ADMIN: { label: 'Admin', perms: ['Full system access', 'User management', 'Master data configuration', 'All reports'] },
    TRANSPORT_PLANNER: { label: 'Transport Planner', perms: ['Create transport requests', 'Assign vehicles', 'View all trips', 'Generate reports'] },
    PLANT_OPERATOR: { label: 'Plant Operator', perms: ['Confirm vehicle arrivals', 'Start/complete loading', 'Gate out vehicles', 'View plant trips'] },
    WAREHOUSE_OPERATOR: { label: 'Warehouse Operator', perms: ['Confirm warehouse arrivals', 'Start/complete unloading', 'View warehouse trips'] },
    MANAGEMENT: { label: 'Management', perms: ['View all dashboards', 'View all reports', 'View KPIs', 'Read-only access'] },
  };

  return (
    <div>
      <PageHeader title="Users & Roles" subtitle="Demo user accounts and role definitions" breadcrumb={['Administration', 'Users & Roles']} />
      <p className="text-xs text-[#101820] bg-[#FFF0E9] border border-[#FFE1D4] rounded-[10px] px-3.5 py-2.5 mb-5 font-medium">
        <span className="font-bold text-[#F4511E]">Demo Mode:</span> Authentication is not enabled in this prototype. Use the role switcher in the sidebar to switch between roles.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Users */}
        <Card padding={false}>
          <div className="px-4 py-3 border-b border-[#E8E5E0]">
            <h3 className="text-sm font-bold text-[#101820]">Demo Users</h3>
          </div>
          <Table>
            <thead><tr><Th>User</Th><Th>Role</Th><Th>Location</Th></tr></thead>
            <tbody>
              {demoUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#FFF0E9]/40 border-b border-[#E8E5E0]">
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#101820] flex items-center justify-center text-xs font-bold text-white">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{u.name}</div>
                        <div className="text-[10px] text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><span className="text-xs text-gray-600">{roleDescriptions[u.role]?.label || u.role}</span></Td>
                  <Td><span className="text-xs text-gray-500">{u.location}</span></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Role definitions */}
        <div className="space-y-3">
          {Object.entries(roleDescriptions).map(([role, def]) => (
            <Card key={role}>
              <h4 className="text-xs font-bold text-gray-900 mb-2">{def.label}</h4>
              <ul className="space-y-1">
                {def.perms.map(p => (
                  <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
