# TransitFlow — 1-Minute Quick Start Guide
## Operational Cheat Sheet for New Users

---

### Step-by-Step Daily Routine

```
[Step 1] Open Dashboard (http://localhost:5173/)
    ↓
[Step 2] Check "Delayed / Alert" KPI card for urgent issues
    ↓
[Step 3] Go to "Transport Requests" → Click "+ New Request"
    ↓
[Step 4] Go to "Vehicle Assignment" → Pair request with an available truck
    ↓
[Step 5] In "Active Transit", click the vehicle to open Trip Details
    ↓
[Step 6] Plant Sequence: Arrive at Plant → Start Loading → Complete Loading → Confirm Gate Out
    ↓
[Step 7] Highway Transit: Vehicle appears in "In Transit" (Checkpoint: Plant Gate)
    ↓
[Step 8] Warehouse Sequence: Confirm Arrival → Start Unloading → Complete Unloading
    ↓
[Step 9] Notice truck immediately becomes "EMPTY" and ready for a new load!
    ↓
[Step 10] Click "Complete Trip" to close the journey
```

---

### Key Golden Rules to Remember

1. **No Hardware GPS Needed**: Everything is based on human checkpoint confirmation at gate-in and gate-out.
2. **One Truck = One Job**: A truck cannot be assigned to another trip until its current cargo is completely unloaded.
3. **Sequential Safeguards**: You cannot skip stages (e.g. You cannot Gate Out before Loading is finished).
4. **Instant Synchronization**: When an operator updates a checkpoint in the field, it reflects instantly on the manager's dashboard.
5. **Resetting Demo State**: If you want to run a fresh client demonstration from scratch, click **Reset Demo Data** in the top header.
