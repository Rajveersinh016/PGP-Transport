# TransitFlow — Complete Business Workflow & Terminology Specification

---

## 1. End-to-End Transport Lifecycle Architecture

TransitFlow structures every commercial transport movement as an immutable sequence of 10 operational checkpoints:

```
[1. REQUEST]
     │
     ▼ (Planner pairs vehicle)
[2. ASSIGNMENT]
     │
     ▼ (Truck arrives at factory gate)
[3. AT PLANT]
     │
     ▼ (Material loaded at bay)
[4. LOADING]
     │
     ▼ (Cargo tied down and weighed)
[5. LOADED]
     │
     ▼ (Security confirms gate out pass)
[6. GATE OUT]
     │
     ▼ (Highway transit via confirmed checkpoints)
[7. IN TRANSIT]
     │
     ▼ (Arrival confirmed at receiving warehouse gate)
[8. AT WAREHOUSE]
     │
     ▼ (Material unloaded at dock)
[9. UNLOADING]
     │
     ▼ (Cargo unloaded; vehicle becomes EMPTY)
[10. UNLOADED / EMPTY VEHICLE]
     │
     ▼ (Proof of delivery & documents finalized)
[11. COMPLETED]
```

---

## 2. 14 Enforced Business Rules

1. **Rule 1 (Single Active Trip)**: One commercial truck can never be assigned to two active trips simultaneously.
2. **Rule 2 (In-Transit Assignment Block)**: A vehicle with status `IN_TRANSIT` is excluded from assignment selection.
3. **Rule 3 (Warehouse Vehicle Hold)**: A vehicle arrived at a warehouse cannot be assigned to another trip until unloading is complete.
4. **Rule 4 (Unloading Makes Vehicle Empty)**: Completing unloading transitions the vehicle to `EMPTY` and detaches it from cargo occupancy.
5. **Rule 5 (Trip Completion Releases Vehicle)**: Completing a trip releases the vehicle to the general `AVAILABLE` fleet.
6. **Rule 6 (Request Completion Lock)**: A transport request cannot be marked `COMPLETED` before its trip is successfully completed.
7. **Rule 7 (Gate Out Precondition)**: Gate Out is blocked until loading is confirmed as `LOADED`.
8. **Rule 8 (Warehouse Arrival Precondition)**: Warehouse arrival cannot happen before Gate Out.
9. **Rule 9 (Unloading Precondition)**: Unloading cannot commence before the truck is confirmed as `AT_WAREHOUSE`.
10. **Rule 10 (Trip Completion Precondition)**: Trip completion cannot happen before unloading is completed.
11. **Rule 11 (Audit Event Stream)**: Every operational transition appends an immutable record to the audit trail.
12. **Rule 12 (Checkpoint Event Stream)**: Every operational transition appends a chronological milestone to the trip timeline.
13. **Rule 13 (Cancelled Requests Blocked)**: Cancelled requests cannot be assigned or executed.
14. **Rule 14 (Capacity Match Guarantee)**: A vehicle cannot be assigned if its rated capacity is less than the requested material quantity.

---

## 3. Business Terminology & Glossary

| Term | System Meaning | Business Confirmation Status | Definition & Notes |
|---|---|---|---|
| **PGP** | Organization / Plant Code | *Requires confirmation from business* | Used as primary corporate / plant division prefix in the prototype. |
| **FG** | Finished Goods | Confirmed Standard | Final manufactured products ready for distribution to warehouses. |
| **RM** | Raw Materials | Confirmed Standard | Input materials transported from suppliers or primary plants. |
| **OW** | Outward Transport / Open Wagon | *Requires confirmation from business* | Transport movement type or container designation. |
| **WH** | Warehouse | Confirmed Standard | Storage depot or regional distribution center. |
| **CPC** | Central Processing Center / Central Plant Code | *Requires confirmation from business* | Central logistics hub or supply node. |
| **SO/OB** | Sales Order / Outbound Delivery | Confirmed Standard | ERP order document reference for transport scheduling. |
| **ANSA** | Advanced Notice of Shipment / Division | *Requires confirmation from business* | Specific operational business unit or plant line. |
| **DECO** | Depot Collection / Distribution Center | *Requires confirmation from business* | Distribution facility or container terminal. |
| **SAP** | SAP Enterprise Resource Planning | Confirmed Standard | Core enterprise ERP system to be integrated in future phases. |
| **LECI** | Logistics Execution & Check-In | *Requires confirmation from business* | Gate-in authorization protocol or security slip. |
