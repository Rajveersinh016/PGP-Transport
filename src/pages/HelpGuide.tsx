import React, { useState } from 'react';
import {
  BookOpen, HelpCircle, Compass, LayoutDashboard, FileText, CheckSquare,
  Factory, Warehouse, AlertTriangle, ShieldCheck, BarChart3, ChevronRight,
  Info, Check, Sparkles, Navigation
} from 'lucide-react';
import { PageHeader, Card, StatusBadge, Button } from '../components/ui';

type HelpSection =
  | 'poster'
  | 'getting-started'
  | 'no-gps'
  | 'dashboard'
  | 'requests'
  | 'assignment'
  | 'plant'
  | 'warehouse'
  | 'exceptions'
  | 'audit'
  | 'reports'
  | 'faq';

export function HelpGuide() {
  const [activeTab, setActiveTab] = useState<HelpSection>('poster');

  const navItems: { id: HelpSection; label: string; icon: React.ReactNode }[] = [
    { id: 'poster', label: '★ Quick Reference Poster (A3)', icon: <Sparkles size={16} /> },
    { id: 'getting-started', label: '1. Getting Started', icon: <Compass size={16} /> },
    { id: 'no-gps', label: '2. The No-GPS Tracking Concept', icon: <Navigation size={16} /> },
    { id: 'dashboard', label: '3. Operations Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'requests', label: '4. Transport Requests', icon: <FileText size={16} /> },
    { id: 'assignment', label: '5. Vehicle Assignment', icon: <CheckSquare size={16} /> },
    { id: 'plant', label: '6. Plant Operations', icon: <Factory size={16} /> },
    { id: 'warehouse', label: '7. Warehouse Operations', icon: <Warehouse size={16} /> },
    { id: 'exceptions', label: '8. Exceptions & Delays', icon: <AlertTriangle size={16} /> },
    { id: 'audit', label: '9. Audit Log & History', icon: <ShieldCheck size={16} /> },
    { id: 'reports', label: '10. Performance Reports', icon: <BarChart3 size={16} /> },
    { id: 'faq', label: '11. FAQ & Troubleshooting', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & User Manual"
        subtitle="Simple, comprehensive operational guide for Transport Planners, Plant/Warehouse Operators, and Managers"
        breadcrumb={['System', 'Help & Manual']}
      />

      {/* Overview Banner */}
      <div className="p-5 bg-gradient-to-r from-[#FFF0E9] to-[#FFFDF9] border border-[#FFE1D4] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4511E] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#101820]">TransitFlow V1 Operational Manual</h2>
            <p className="text-xs text-[#555E68] mt-0.5">Written in plain, everyday language without technical jargon</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-white border border-[#E8E5E0] rounded-lg text-[#101820]">
            Version: V1 Prototype
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5 lg:col-span-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8E9CA8]">
            User Manual Chapters
          </div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === item.id
                  ? 'bg-[#F4511E] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F6F5F2] text-[#101820] border border-[#E8E5E0]'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-[#8E9CA8]'}>{item.icon}</span>
              <span className="truncate flex-1">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="text-white" />}
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3">
          <Card padding={true}>
            {/* 0. POSTER */}
            {activeTab === 'poster' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EDE8]">
                  <div>
                    <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Instructional Reference</span>
                    <h3 className="text-xl font-bold text-[#101820] mt-0.5">TransitFlow Operational Poster (A3)</h3>
                    <p className="text-xs text-[#555E68]">All-in-one corporate quick reference guide for notice boards and training</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/transitflow_guide_poster.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-[10px] bg-[#F4511E] text-white hover:bg-[#d94416] transition-colors shadow-sm"
                    >
                      <Sparkles size={14} /> Open Full Resolution / Print
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] text-xs text-[#101820] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#F4511E]">Designed for Factory Notice Boards & Control Rooms:</span> Includes 11-step lifecycle, No-GPS checkpoint rules, role matrix, and 5-step tracking guide.
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-[#E8E5E0] shadow-md bg-white flex justify-center p-2">
                  <img
                    src="/transitflow_guide_poster.jpg"
                    alt="TransitFlow Transport & Vehicle Visibility System Instructional Poster"
                    className="w-full max-w-2xl rounded-xl shadow-xs object-contain"
                  />
                </div>
              </div>
            )}

            {/* 1. GETTING STARTED */}
            {activeTab === 'getting-started' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 1</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">What is TransitFlow?</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    <strong>TransitFlow</strong> is a transport tracking and vehicle visibility system designed for day-to-day logistics operations. It helps companies know exactly where their trucks are, what stage of the journey they are in, whether they are waiting, and whether trips are running on time.
                  </p>
                </div>

                <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] space-y-2 text-xs text-[#101820]">
                  <h4 className="font-bold text-sm text-[#101820]">The Core Transport Lifecycle:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-medium">
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">1. Transport Request</span>: A requirement to move cargo from a plant to a warehouse is logged.
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">2. Vehicle Assignment</span>: A suitable, available truck is assigned to the request.
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">3. Plant Operations</span>: The truck arrives at the factory, is loaded, and passes the exit gate.
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">4. In Transit</span>: The truck travels towards its destination (tracked by manual checkpoints).
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">5. Warehouse Operations</span>: The truck reaches the warehouse, is unloaded, and emptied.
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#E8E5E0]">
                      <span className="text-[#F4511E] font-bold">6. Trip Completion</span>: The trip is closed and the truck is immediately available for its next job.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] text-xs text-[#101820]">
                  <h4 className="font-bold text-[#F4511E] mb-1">Quick 1-Minute Rule</h4>
                  <p>
                    Every time a physical truck moves or starts an activity, the operator on site confirms it with a single tap. The entire company instantly sees the updated status without phone calls.
                  </p>
                </div>
              </div>
            )}

            {/* 2. THE NO-GPS CONCEPT */}
            {activeTab === 'no-gps' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 2</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Understanding the No-GPS Tracking Concept</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    In India and many logistics operations, thousands of commercial trucks do not have active GPS hardware installed. TransitFlow solves this challenge using <strong>Operational Checkpoint Tracking</strong>.
                  </p>
                </div>

                <div className="p-4 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Info size={18} className="text-[#F4511E] flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-[#101820] space-y-1">
                      <p className="font-bold text-sm text-[#F4511E]">How Checkpoint Tracking Works:</p>
                      <p>
                        Instead of reading satellite coordinates every 10 seconds, the system records verified operational milestones confirmed by authorized operators at physical locations:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-lg border border-[#FFE1D4]">
                      <div className="font-bold text-[#101820]">1. Gate Out (Plant)</div>
                      <div className="text-[#555E68] mt-1">Plant security confirms the loaded truck left the factory gate. Status becomes <strong>IN TRANSIT</strong>.</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#FFE1D4]">
                      <div className="font-bold text-[#101820]">2. Intermediate Points</div>
                      <div className="text-[#555E68] mt-1">Checkpoints like highway toll crossings or weighbridges can confirm progress.</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#FFE1D4]">
                      <div className="font-bold text-[#101820]">3. Gate In (Warehouse)</div>
                      <div className="text-[#555E68] mt-1">Receiving supervisor confirms truck arrival at the warehouse receiving dock.</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#555E68] space-y-2">
                  <h4 className="font-bold text-sm text-[#101820]">Important Phrasing Rules:</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Never call this "Live GPS Location" — call it <strong>"Last Confirmed Checkpoint"</strong>.</li>
                    <li>The time displayed is the exact moment an operator physically verified the vehicle.</li>
                    <li>In future phases, GPS hardware or Fastag toll tracking can plug into this exact workflow seamlessly.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. OPERATIONS DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 3</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Operations Dashboard Guide</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    The Dashboard gives transport supervisors and company management an instant 5-second health check of all fleet movements.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#101820]">What the 8 KPI Cards Mean:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                      <div className="font-bold text-[#101820]">Total Vehicles</div>
                      <div className="text-[#555E68] mt-1">All commercial trucks registered in your company's network.</div>
                    </div>
                    <div className="p-3 bg-[#FFF0E9] border border-[#FFE1D4] rounded-xl">
                      <div className="font-bold text-[#F4511E]">In Transit</div>
                      <div className="text-[#555E68] mt-1">Trucks that passed plant gate-out and are moving towards warehouses.</div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="font-bold text-blue-800">At Plant</div>
                      <div className="text-[#555E68] mt-1">Trucks currently inside manufacturing plants (waiting, loading, or ready).</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="font-bold text-purple-800">At Warehouse</div>
                      <div className="text-[#555E68] mt-1">Trucks arrived at receiving warehouses (waiting or unloading).</div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="font-bold text-emerald-800">Empty / Available</div>
                      <div className="text-[#555E68] mt-1">Trucks that have no cargo and are immediately ready for assignment.</div>
                    </div>
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                      <div className="font-bold text-sky-800">Assigned</div>
                      <div className="text-[#555E68] mt-1">Trucks paired with a transport request that haven't arrived at plant yet.</div>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <div className="font-bold text-rose-800">Delayed / Alert</div>
                      <div className="text-[#555E68] mt-1">Trips running past their scheduled time or with pending exceptions.</div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="font-bold text-emerald-800">Completed Today</div>
                      <div className="text-[#555E68] mt-1">Trips successfully delivered and closed during the current shift.</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] text-xs text-[#555E68]">
                  <h4 className="font-bold text-sm text-[#101820] mb-1">Transit Control Board:</h4>
                  <p>
                    Below the KPI cards is the visual Transit Control Board. It categorizes trips into columns by stage. Clicking any trip card opens the action panel to inspect checkpoints or advance status.
                  </p>
                </div>
              </div>
            )}

            {/* 4. TRANSPORT REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 4</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Transport Requests</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    A Transport Request represents a business order to move material from a specific plant to a receiving warehouse.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-[#101820]">
                  <h4 className="font-bold text-sm">How to Create a Request:</h4>
                  <ol className="list-decimal list-inside space-y-2 bg-[#F6F5F2] p-4 rounded-xl border border-[#E8E5E0]">
                    <li>Navigate to <strong>Transport Requests</strong> from the sidebar.</li>
                    <li>Click the <strong>+ New Request</strong> button at the top right.</li>
                    <li>Enter or confirm the <strong>Request ID</strong> (e.g. TR-2026-00421).</li>
                    <li>Select the <strong>Source Plant</strong> (e.g. Plant Ahmedabad) and <strong>Destination Warehouse</strong> (e.g. Warehouse Pune).</li>
                    <li>Select the <strong>Material Type</strong> (Finished Goods FG, Raw Material RM, etc.).</li>
                    <li>Enter the <strong>Quantity</strong> in Metric Tonnes (e.g. 38 MT).</li>
                    <li>Choose the required <strong>Vehicle Capacity</strong> (must be $\ge$ quantity).</li>
                    <li>Set priority and required delivery date/time, then click <strong>Create Request</strong>.</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-[#FFF0E9] rounded-xl border border-[#FFE1D4] text-xs text-[#101820]">
                  <span className="font-bold text-[#F4511E] block mb-1">Validation Safeguards:</span>
                  <ul className="list-disc list-inside space-y-1 text-[#555E68]">
                    <li>Duplicate Request IDs are automatically rejected.</li>
                    <li>Quantity cannot be zero, negative, or greater than 100 MT.</li>
                    <li>Vehicle capacity cannot be smaller than material quantity.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 5. VEHICLE ASSIGNMENT */}
            {activeTab === 'assignment' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 5</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Vehicle Assignment Guide</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    The Vehicle Assignment screen pairs a pending request with a qualified, empty commercial truck.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E8E5E0] space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-[#101820]">Step-by-Step Assignment:</h4>
                  <div className="space-y-2 text-[#555E68]">
                    <div className="p-2.5 bg-[#F6F5F2] rounded-lg">
                      <strong>Step 1</strong>: Select the pending transport request from the left list.
                    </div>
                    <div className="p-2.5 bg-[#F6F5F2] rounded-lg">
                      <strong>Step 2</strong>: The right table displays available empty vehicles.
                    </div>
                    <div className="p-2.5 bg-[#F6F5F2] rounded-lg">
                      <strong>Step 3</strong>: Review vehicle capacity, driver, and location. If a vehicle has insufficient capacity, clicking Assign will show an error.
                    </div>
                    <div className="p-2.5 bg-[#F6F5F2] rounded-lg">
                      <strong>Step 4</strong>: Click <strong>Assign</strong>, review the confirmation modal, and confirm.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Strict Rule 1 — Single Active Trip:</div>
                  <p>A vehicle cannot be assigned to two trips at once. The system automatically blocks any truck that is already engaged in an active trip.</p>
                </div>
              </div>
            )}

            {/* 6. PLANT OPERATIONS */}
            {activeTab === 'plant' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 6</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Plant Operator Workflow</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    Plant operators and security personnel control the initial stages of the physical trip.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">1. ARRIVE AT PLANT</div>
                    <p className="text-[#555E68] mt-1">When the truck reaches the factory entrance, click <strong>Arrive at Plant</strong>. Status transitions from ASSIGNED to AT PLANT.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">2. START LOADING</div>
                    <p className="text-[#555E68] mt-1">When the truck docks at the loading bay, click <strong>Start Loading</strong>. Status transitions to LOADING.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">3. COMPLETE LOADING</div>
                    <p className="text-[#555E68] mt-1">When cargo is secured and weighed, click <strong>Complete Loading</strong>. Status transitions to LOADED.</p>
                  </div>
                  <div className="p-3 bg-[#FFF0E9] border border-[#FFE1D4] rounded-xl">
                    <div className="font-bold text-[#F4511E]">4. CONFIRM GATE OUT</div>
                    <p className="text-[#555E68] mt-1">Before the vehicle leaves, security clicks <strong>Confirm Gate Out</strong>. A confirmation modal displays payload and route. Upon confirmation, status becomes <strong>IN TRANSIT</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. WAREHOUSE OPERATIONS */}
            {activeTab === 'warehouse' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 7</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Warehouse Operator Workflow</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    Receiving supervisors at the warehouse complete the delivery lifecycle.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">1. CONFIRM ARRIVAL</div>
                    <p className="text-[#555E68] mt-1">When the truck pulls into the warehouse yard, click <strong>Confirm Arrival</strong>. Status changes from IN TRANSIT to AT WAREHOUSE.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">2. START UNLOADING</div>
                    <p className="text-[#555E68] mt-1">When unloading commences at the dock, click <strong>Start Unloading</strong>. Status becomes UNLOADING.</p>
                  </div>
                  <div className="p-3 bg-[#FFF0E9] border border-[#FFE1D4] rounded-xl">
                    <div className="font-bold text-[#F4511E]">3. COMPLETE UNLOADING & EMPTY VEHICLE</div>
                    <p className="text-[#555E68] mt-1">
                      Click <strong>Complete Unloading</strong>. The truck is now officially <strong>EMPTY</strong> and reappears in the Empty Vehicles pool so transport planners can immediately assign it for a return load!
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="font-bold text-emerald-800">4. COMPLETE TRIP</div>
                    <p className="text-[#555E68] mt-1">Click <strong>Complete Trip</strong> to close the journey. Both the trip and the original transport request are finalized with status COMPLETED.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. EXCEPTIONS & DELAYS */}
            {activeTab === 'exceptions' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 8</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Exceptions & Delay Management</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    Logistics operations frequently encounter unexpected delays. TransitFlow highlights these issues automatically so teams can react proactively.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <div className="font-bold text-rose-800">Delayed Trip</div>
                    <p className="text-[#555E68] mt-1">Generated when a truck exceeds its estimated transit time between plant and warehouse.</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="font-bold text-amber-800">Waiting Too Long</div>
                    <p className="text-[#555E68] mt-1">Triggered when a vehicle waits inside a plant or warehouse yard beyond acceptable detention limits.</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="font-bold text-blue-800">Missing Checkpoint</div>
                    <p className="text-[#555E68] mt-1">Flagged when a vehicle hasn't checked in at an expected intermediate point.</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="font-bold text-purple-800">Unassigned Request</div>
                    <p className="text-[#555E68] mt-1">Identifies pending requests that have not been assigned within the target dispatch window.</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] text-xs space-y-1">
                  <div className="font-bold text-sm text-[#101820]">How to Resolve an Exception:</div>
                  <p className="text-[#555E68]">1. Go to <strong>Exceptions</strong> from the sidebar.</p>
                  <p className="text-[#555E68]">2. Click <strong>Add Remark</strong> to record supervisor notes (e.g. "Flat tyre repaired on NH48").</p>
                  <p className="text-[#555E68]">3. Click <strong>Resolve</strong>. The exception closes and an immutable audit entry is logged.</p>
                </div>
              </div>
            )}

            {/* 9. AUDIT LOG */}
            {activeTab === 'audit' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 9</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Audit Log & Traceability</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    The Audit Log is the system's chronological history book. It records every status change, assignment, gate event, and exception resolution.
                  </p>
                </div>

                <div className="p-4 bg-[#F6F5F2] rounded-xl border border-[#E8E5E0] space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-[#101820]">What Every Audit Record Contains:</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#555E68]">
                    <li><strong>Timestamp</strong>: Exact ISO date and local time of the action.</li>
                    <li><strong>User & Role</strong>: Who performed the change (e.g., Plant Operator Rajesh).</li>
                    <li><strong>Action & Entity</strong>: What was done (e.g. `GATE_OUT`, `VEHICLE_ASSIGNED`).</li>
                    <li><strong>Vehicle & Trip ID</strong>: Relevant asset and journey identifiers.</li>
                    <li><strong>Old & New Status</strong>: Before-and-after states for 100% accountability.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 10. REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 10</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Performance Reports</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    Reports aggregate operational data to identify bottlenecks and evaluate transport contractor efficiency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">Transport Performance</div>
                    <p className="text-[#555E68] mt-1">Evaluates on-time delivery rates, total tonnage moved, and average transit hours per route.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">Vehicle Utilization</div>
                    <p className="text-[#555E68] mt-1">Measures fleet activity: percentage of time trucks spend moving cargo vs. waiting idle.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">Warehouse Performance</div>
                    <p className="text-[#555E68] mt-1">Tracks dock unloading turnaround times and detention delays at receiving docks.</p>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E5E0] rounded-xl">
                    <div className="font-bold text-[#101820]">Trip History</div>
                    <p className="text-[#555E68] mt-1">Searchable archive of all historical trips with detailed event logs and delivery receipts.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 11. FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">Chapter 11</span>
                  <h3 className="text-xl font-bold text-[#101820] mt-1">Frequently Asked Questions</h3>
                  <p className="text-sm text-[#555E68] leading-relaxed mt-2">
                    Quick solutions to everyday operational questions.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-xl space-y-1">
                    <p className="font-bold text-sm text-[#101820]">Q: Why can't I click "Confirm Gate Out"?</p>
                    <p className="text-[#555E68]">
                      A: Gate Out requires loading to be completed first. Make sure you have clicked <strong>Start Loading</strong> and then <strong>Complete Loading</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-xl space-y-1">
                    <p className="font-bold text-sm text-[#101820]">Q: Why is my truck not showing in Empty Vehicles?</p>
                    <p className="text-[#555E68]">
                      A: A truck becomes EMPTY only after the warehouse operator clicks <strong>Complete Unloading</strong>. If the truck is still marked as UNLOADING or IN TRANSIT, it is considered occupied.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-xl space-y-1">
                    <p className="font-bold text-sm text-[#101820]">Q: How does the system remember my demo state after refreshing?</p>
                    <p className="text-[#555E68]">
                      A: TransitFlow saves your active demo session into your browser's local storage. To return to the clean starting scenario at any time, click <strong>Reset Demo</strong> in the top header.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-[#E8E5E0] rounded-xl space-y-1">
                    <p className="font-bold text-sm text-[#101820]">Q: Can I use this on a mobile phone or tablet?</p>
                    <p className="text-[#555E68]">
                      A: Yes! Visit <strong>/mobile</strong> or open the app on your mobile device. The layout automatically presents large, touch-friendly buttons tailored for gate security and dock workers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
