# TransitFlow — Role & Permissions Matrix Guide
## User Role Responsibilities and Operational Boundaries

---

TransitFlow defines 5 clear operational roles to match standard factory and logistics supply chains.

| Operational Role | Primary Purpose | Authorized Actions | Blocked Actions |
|---|---|---|---|
| **TRANSPORT PLANNER** | Creates demand and books logistics assets | • Create Transport Requests<br>• Assign Vehicles<br>• View Empty Vehicles Pool<br>• Monitor Pipeline | • Cannot perform plant loading<br>• Cannot modify system master settings |
| **PLANT OPERATOR** | Manages plant gate, weighbridge, and loading docks | • Confirm Arrive at Plant<br>• Start Loading<br>• Complete Loading<br>• Confirm Gate Out<br>• Log Detention Remarks | • Cannot reassign vehicles to other requests<br>• Cannot confirm warehouse receiving |
| **WAREHOUSE OPERATOR** | Manages receiving docks and dock turnaround | • Confirm Warehouse Arrival<br>• Start Unloading<br>• Complete Unloading (releasing vehicle to EMPTY)<br>• Sign off Complete Trip | • Cannot create transport requests<br>• Cannot dispatch vehicles from plants |
| **MANAGEMENT** | Executive oversight and KPI tracking | • View Dashboard<br>• View Reports & Charts<br>• Inspect Exceptions<br>• Inspect Audit Log | • View-only operational mode; cannot advance field checkpoint transitions |
| **ADMIN** | System governance and master data | • Full administrative access across all screens<br>• Manage Master Data (Plants, Warehouses, Vehicles, Drivers)<br>• Manage User Accounts<br>• Reset Demo State | None (Full System Authorization) |

---

### In-App Role Simulation Switcher
For demonstration purposes, users can toggle between roles at any time using the **Role Switcher** located in the top-right user menu. The application dynamically adjusts permissions and displays contextual safeguards.
