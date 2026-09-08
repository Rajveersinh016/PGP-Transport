# TransitFlow — Transport & Vehicle Visibility System
## Comprehensive End-User Manual (V1 Prototype)

---

### Welcome to TransitFlow
**TransitFlow** is an operational transport tracking and vehicle visibility system designed for day-to-day fleet and shipment operations. It gives your transport planners, plant operators, warehouse receiving docks, and executive management instant visibility over every commercial truck in your network.

---

## 1. What is TransitFlow? (In Simple Words)
TransitFlow tells you:
1. **Which truck is assigned** to move your cargo.
2. **Where the truck is right now** based on the last verified operational checkpoint.
3. **What activity the truck is doing** (e.g. Waiting at plant, loading cargo, moving on highway, unloading, or ready as an empty vehicle).
4. **Whether the truck is on time or delayed**.
5. **When the trip is completed** so the empty truck can immediately be booked for its next journey.

---

## 2. The No-GPS Tracking Concept Explained
> [!IMPORTANT]
> **TransitFlow does not require GPS hardware installed on commercial trucks.**

In commercial road logistics, many trucks do not have active satellite GPS units. TransitFlow solves this using **Operational Checkpoint Confirmation**:

- **How it works**:
  1. When a truck departs a manufacturing plant, the security or dispatch operator clicks **Confirm Gate Out**.
  2. The system records the location: `Plant Gate` and sets the status to **`IN TRANSIT`**.
  3. When the truck arrives at the destination warehouse gate, the receiving supervisor clicks **Confirm Arrival**.
  4. The system updates the location to `Warehouse WH-02` and status to **`AT WAREHOUSE`**.

**Important Phrasing Rule**:
- We call this the **Last Confirmed Checkpoint**.
- We do **not** call this "Live GPS Tracking".
- The timestamp shows the exact minute an authorized human operator confirmed the vehicle.

---

## 3. The 10-Step Operational Lifecycle

```
[1. Transport Request]
         ↓
[2. Vehicle Assigned]
         ↓
[3. Truck at Plant]
         ↓
[4. Loading Started]
         ↓
[5. Loading Completed]
         ↓
[6. Gate Out (Dispatched)]
         ↓
[7. In Transit]
         ↓
[8. Warehouse Arrival]
         ↓
[9. Unloading Started]
         ↓
[10. Unloading Completed → EMPTY VEHICLE]
         ↓
[11. Trip Completed → AVAILABLE]
```

1. **Request Created**: A demand is logged to transport cargo from a plant to a warehouse.
2. **Vehicle Assigned**: An available, empty truck with matching capacity is assigned.
3. **Arrive at Plant**: Truck arrives at the manufacturing plant entrance.
4. **Loading Started**: Cargo begins loading into the truck.
5. **Loading Completed**: Cargo is loaded, secured, and weighed. Payload is verified.
6. **Gate Out**: Truck passes factory exit security and enters the public roadway.
7. **In Transit**: Vehicle travels towards the destination warehouse.
8. **Warehouse Arrival**: Truck checks in at the receiving warehouse gate.
9. **Unloading Started**: Receiving team begins unloading cargo at the dock.
10. **Unloading Completed (EMPTY)**: Cargo is fully unloaded. The truck immediately becomes **EMPTY** and available for return trip planning!
11. **Trip Completed**: Delivery documents are closed and the vehicle is fully released back to the general **AVAILABLE** fleet.

---

## 4. Dashboard User Guide
The Operations Dashboard gives you an instant 5-second overview:

| KPI Card | What it Means |
|---|---|
| **Total Vehicles** | Total commercial trucks registered in your company's network. |
| **In Transit** | Trucks that have passed plant gate-out and are traveling to warehouses. |
| **At Plant** | Trucks currently confirmed inside manufacturing plants (waiting, loading, or ready). |
| **At Warehouse** | Trucks currently confirmed inside receiving warehouses (waiting or unloading). |
| **Empty / Available** | Trucks that have no cargo and are ready to be assigned to new transport requests. |
| **Assigned** | Trucks paired with a transport request that are en route to the plant. |
| **Delayed / Alert** | Trips exceeding their estimated journey time or flagged with an exception. |
| **Completed Today** | Deliveries successfully finalized during the current shift. |

---

## 5. Transport Planner Guide
As a Transport Planner, you manage requests and vehicle assignments:

1. **Creating a Request**:
   - Go to **Transport Requests**.
   - Click **+ New Request**.
   - Enter the Request ID (e.g. `TR-2026-00421`), Plant Origin, Destination Warehouse, Material, and Quantity.
   - Select required capacity (must be $\ge$ quantity) and priority. Click **Create Request**.
2. **Assigning a Vehicle**:
   - Go to **Vehicle Assignment**.
   - Click your pending request on the left.
   - Choose an available vehicle with adequate capacity on the right.
   - Click **Assign**, review the confirmation details, and submit.
   - *Note*: If a vehicle capacity is smaller than your request, the system will prevent assignment and alert you.

---

## 6. Plant Operator Guide
As a Plant Operator, you manage the departure sequence:

1. **Confirm Plant Arrival**:
   - When the truck reaches the gate, search the vehicle number and click **Arrive at Plant**.
2. **Loading Operations**:
   - Dock the vehicle and click **Start Loading**.
   - When loading and tie-downs are finished, click **Complete Loading**.
3. **Confirm Gate Out**:
   - Click **Confirm Gate Out**.
   - Verify the vehicle number, destination, and tonnage in the confirmation pop-up.
   - Click **Confirm**. The vehicle moves into **IN TRANSIT**.

---

## 7. Warehouse Operator Guide
As a Warehouse Operator, you manage receiving and turnaround:

1. **Confirm Warehouse Arrival**:
   - When the truck arrives at your gate, click **Confirm Arrival**. Checkpoint updates to your warehouse code.
2. **Unloading Operations**:
   - When the vehicle docks, click **Start Unloading**.
   - When pallets/goods are cleared, click **Complete Unloading**.
   - *Crucial*: The vehicle immediately turns **EMPTY** and becomes visible to planners for return cargo!
3. **Complete Trip**:
   - Click **Complete Trip** once gate passes and delivery receipts are finalized.

---

## 8. Management Guide
As an Executive or Supply Chain Manager:
- Monitor high-level KPIs on the **Operations Dashboard**.
- Review **Transit Control Board** to spot pipeline bottlenecks (e.g. too many trucks stuck in Loading).
- Open **Reports** to inspect:
  - **Transport Performance**: On-time delivery percentages and tonnage moved.
  - **Vehicle Utilization**: Idle time vs. active transit hours.
  - **Warehouse Performance**: Dock turnaround times and detention delays.
- Inspect the **Audit Log** to review operational compliance and milestone timestamps.

---

## 9. Status Reference Guide

| Status | Meaning | What Happens Next |
|---|---|---|
| `PENDING` | Request logged; no truck assigned yet | Planner assigns an available vehicle |
| `ASSIGNED` | Truck paired with request | Truck drives to plant |
| `AT_PLANT` | Truck confirmed inside factory gate | Moves to loading bay |
| `LOADING` | Material being loaded into truck | Loading finishes |
| `LOADED` | Material loaded; tie-down verified | Moves to exit gate for dispatch |
| `IN_TRANSIT` | Truck left factory; on the highway | Travels to destination warehouse |
| `AT_WAREHOUSE` | Truck confirmed at warehouse gate | Moves to receiving dock |
| `UNLOADING` | Material being removed from truck | Unloading finishes |
| `UNLOADED` / `EMPTY` | Truck cargo bay is clean and empty | Truck is released for new assignments |
| `COMPLETED` | Trip closed and signed off | Vehicle returns to Available pool |
| `DELAYED` | Trip exceeded estimated transit time | Supervisor investigates & resolves exception |

---

## 10. Common Problems & Quick Solutions

- **Problem: "I cannot assign a truck."**
  - *Reason 1*: The truck already has an active trip. A truck cannot be in two places at once.
  - *Reason 2*: The truck's carrying capacity is smaller than your requested cargo tonnage.
- **Problem: "I cannot confirm Gate Out."**
  - *Reason*: Loading has not been completed. You must click *Start Loading* and then *Complete Loading* first.
- **Problem: "A vehicle is not showing in Empty Vehicles."**
  - *Reason*: The vehicle is still marked as UNLOADING or IN TRANSIT. The warehouse operator must click *Complete Unloading*.
- **Problem: "Trip shows DELAYED."**
  - *Reason*: The vehicle has not confirmed arrival within its expected transit duration. Open **Exceptions** to view details and add remarks.
- **Problem: "My demo data changed or I want to start fresh."**
  - *Solution*: Click the **Reset Demo Data** button in the top navigation bar at any time to restore the default starting scenario.
