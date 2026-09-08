import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { RouteGuard } from './auth/RouteGuard';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ActiveTransit } from './pages/ActiveTransit';
import { TransportRequests } from './pages/TransportRequests';
import { VehicleAssignment } from './pages/VehicleAssignment';
import { Exceptions } from './pages/Exceptions';
import { VehiclesPage, EmptyVehicles, AtPlantVehicles, AtWarehouseVehicles, InTransitVehicles } from './pages/Vehicles';
import { VehicleDetail } from './pages/VehicleDetail';
import { PlantsPage, WarehousesPage } from './pages/Locations';
import { DriversPage, TransportersPage } from './pages/People';
import { TransportPerformance, VehicleUtilization, WarehousePerformance, TripHistory } from './pages/Reports';
import { AuditLog, SettingsPage, MasterData, UsersRoles } from './pages/Administration';
import { MobileOperator } from './pages/MobileOperator';
import { HelpGuide } from './pages/HelpGuide';

// ============================================================
// GUARDED ROUTE — wraps every page component with role check
// ============================================================
function Guarded({ path, element }: { path: string; element: React.ReactNode }) {
  const { state } = useApp();
  return (
    <RouteGuard role={state.settings.currentRole} path={path}>
      {element}
    </RouteGuard>
  );
}

// ============================================================
// INNER APP (needs useApp — must be inside AppProvider)
// ============================================================
function InnerApp() {
  return (
    <Router>
      <Routes>
        {/* Mobile operator — standalone (no sidebar) */}
        <Route path="/mobile" element={<MobileOperator />} />

        {/* Main app with layout */}
        <Route path="/*" element={
          <AppLayout>
            <Routes>
              {/* Dashboard — all roles, role-specific content inside */}
              <Route path="/" element={<Dashboard />} />

              {/* Operations */}
              <Route path="/transit"    element={<Guarded path="/transit"    element={<ActiveTransit />} />} />
              <Route path="/requests"   element={<Guarded path="/requests"   element={<TransportRequests />} />} />
              <Route path="/assignment" element={<Guarded path="/assignment" element={<VehicleAssignment />} />} />
              <Route path="/exceptions" element={<Guarded path="/exceptions" element={<Exceptions />} />} />

              {/* Vehicles */}
              <Route path="/vehicles"               element={<Guarded path="/vehicles"               element={<VehiclesPage />} />} />
              <Route path="/vehicles/empty"         element={<Guarded path="/vehicles/empty"         element={<EmptyVehicles />} />} />
              <Route path="/vehicles/at-plant"      element={<Guarded path="/vehicles/at-plant"      element={<AtPlantVehicles />} />} />
              <Route path="/vehicles/at-warehouse"  element={<Guarded path="/vehicles/at-warehouse"  element={<AtWarehouseVehicles />} />} />
              <Route path="/vehicles/in-transit"    element={<Guarded path="/vehicles/in-transit"    element={<InTransitVehicles />} />} />
              <Route path="/vehicles/:id"           element={<VehicleDetail />} />

              {/* Locations — Admin & Planner only */}
              <Route path="/plants"      element={<Guarded path="/plants"      element={<PlantsPage />} />} />
              <Route path="/warehouses"  element={<Guarded path="/warehouses"  element={<WarehousesPage />} />} />

              {/* People — Admin & Planner only */}
              <Route path="/drivers"      element={<Guarded path="/drivers"      element={<DriversPage />} />} />
              <Route path="/transporters" element={<Guarded path="/transporters" element={<TransportersPage />} />} />

              {/* Reports — Admin, Planner, Management */}
              <Route path="/reports/performance" element={<Guarded path="/reports/performance" element={<TransportPerformance />} />} />
              <Route path="/reports/utilization" element={<Guarded path="/reports/utilization" element={<VehicleUtilization />} />} />
              <Route path="/reports/warehouse"   element={<Guarded path="/reports/warehouse"   element={<WarehousePerformance />} />} />
              <Route path="/reports/history"     element={<Guarded path="/reports/history"     element={<TripHistory />} />} />

              {/* Aliases */}
              <Route path="/reports"   element={<Navigate to="/reports/performance" replace />} />
              <Route path="/audit"     element={<Navigate to="/admin/audit" replace />} />
              <Route path="/settings"  element={<Navigate to="/admin/settings" replace />} />

              {/* Administration — Admin & Management (audit) */}
              <Route path="/admin/users"     element={<Guarded path="/admin/users"     element={<UsersRoles />} />} />
              <Route path="/admin/master"    element={<Guarded path="/admin/master"    element={<MasterData />} />} />
              <Route path="/admin/audit"     element={<Guarded path="/admin/audit"     element={<AuditLog />} />} />
              <Route path="/admin/settings"  element={<Guarded path="/admin/settings"  element={<SettingsPage />} />} />

              {/* Help — all roles */}
              <Route path="/help" element={<HelpGuide />} />

              {/* Fallback */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
}

// ============================================================
// ROOT APP
// ============================================================
function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}

export default App;
