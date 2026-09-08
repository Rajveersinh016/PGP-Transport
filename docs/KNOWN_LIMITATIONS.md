# TransitFlow — Known Prototype Limitations & Future Roadmap

---

## 1. Prototype Limitations (V1 Status)

TransitFlow V1 is a high-fidelity **interactive frontend operational simulator and functional prototype**. While it contains complete end-to-end business logic, reactive state synchronization, and workflow validation, it operates with the following explicit technical boundaries:

1. **No Hardware GPS Integration**:
   - Vehicles do not report telemetry via satellite or OBD devices.
   - All locations represent human operator checkpoint confirmations.
2. **No Persistent Backend Server**:
   - The application does not connect to a centralized Node.js/Java/Python backend API.
   - State is held in React state with automatic browser `localStorage` caching (`TRANSITFLOW_STATE_V1`).
3. **No Central Database**:
   - No SQL (PostgreSQL, MySQL) or NoSQL (MongoDB) database is connected.
   - Multi-device concurrent syncing is not supported in the V1 prototype.
4. **No Direct SAP / ERP Integration**:
   - Transport Requests, Material Masters, and Purchase/Sales Orders are simulated.
   - No live RFC, BAPI, or OData SAP connectors are active.
5. **Mock Authentication**:
   - User roles and login personas (Planner, Operator, Manager, Admin) are switchable directly via the UI role selector for rapid stakeholder demonstration.
   - Real SSO, OAuth2, and RBAC token authentication are not enabled.
6. **Mock Notifications**:
   - Notifications and alerts appear as in-app toast alerts. SMS and WhatsApp driver notifications are simulated.

---

## 2. Production Architecture Roadmap (Future Phases)

```
[Web / Mobile Clients]
        │
        ▼ (HTTPS / WSS)
[API Gateway & Auth Service (OAuth2 / JWT)]
        │
        ├──▶ [Transport Workflow Engine (Go / Node.js)]
        │         │
        │         ├──▶ [PostgreSQL / TimeScaleDB (Audit & Metrics)]
        │         └──▶ [Redis (Live Vehicle State Cache)]
        │
        ├──▶ [SAP ECC / S4HANA Integration Connector (OData / IDoc)]
        │
        └──▶ [Telemetry & FASTag Toll Checkpoint Ingestion Engine]
```

### Phase 2 Implementation Recommendations:
- **Fastag Toll Plaza Ingestion**: Automatically advance vehicle status using NPCI FASTag toll plaza API events as trucks cross highway toll booths without needing GPS devices!
- **SAP OData Integration**: Ingest real Sales Orders (SO) and Outbound Deliveries (OB) directly into pending Transport Requests.
- **Driver WhatsApp/PWA Check-in**: Allow drivers to send one-click WhatsApp location pings that auto-confirm checkpoints.
