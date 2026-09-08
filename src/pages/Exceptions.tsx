import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, MessageSquare, CheckCircle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, SearchBar, SelectFilter, Card, Button, EmptyState, Modal } from '../components/ui';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui';
import type { ExceptionType, ExceptionSeverity } from '../types';

const TYPE_LABELS: Record<ExceptionType, string> = {
  DELAYED_TRIP: 'Delayed Trip',
  WAITING_TOO_LONG: 'Waiting Too Long',
  MISSING_CHECKPOINT: 'Missing Checkpoint',
  OVERDUE_ARRIVAL: 'Overdue Arrival',
  TRACKING_MISSING: 'Tracking Missing',
  UNASSIGNED_REQUEST: 'Unassigned Request',
};

export function Exceptions() {
  const { state, resolveException, dispatch } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<ExceptionSeverity | ''>('');
  const [typeFilter, setTypeFilter] = useState<ExceptionType | ''>('');
  const [showResolved, setShowResolved] = useState(false);
  const [remarkModal, setRemarkModal] = useState<{ id: string; title: string } | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const exceptions = state.exceptions.filter(e => {
    if (!showResolved && e.resolved) return false;
    if (showResolved && !e.resolved) return false;
    if (severityFilter && e.severity !== severityFilter) return false;
    if (typeFilter && e.type !== typeFilter) return false;
    const q = search.toLowerCase();
    if (q && !e.title.toLowerCase().includes(q) &&
        !(e.vehicleNumber || '').toLowerCase().includes(q) &&
        !(e.requestId || '').toLowerCase().includes(q)) return false;
    return true;
  });

  const handleResolve = (id: string) => {
    resolveException(id, 'Resolved by operator');
    addToast('success', 'Exception resolved successfully');
  };

  const handleAddRemark = () => {
    if (!remarkModal || !remarkText.trim()) return;
    dispatch({ type: 'ADD_EXCEPTION_REMARK', exceptionId: remarkModal.id, remark: remarkText });
    setRemarkText('');
    setRemarkModal(null);
    addToast('success', 'Remark added');
  };

  const timeFmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const criticalCount = state.exceptions.filter(e => !e.resolved && e.severity === 'CRITICAL').length;
  const warningCount = state.exceptions.filter(e => !e.resolved && e.severity === 'WARNING').length;

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader
        title="Exception Management"
        subtitle="Active trips with delays, waiting violations, and tracking gaps"
        breadcrumb={['Operations', 'Exceptions']}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="p-4 bg-white border border-rose-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-center">
          <div className="text-2xl lg:text-3xl font-bold text-rose-700">{criticalCount}</div>
          <div className="text-xs text-[#555E68] font-bold uppercase tracking-wider mt-1">Critical Exceptions</div>
        </div>
        <div className="p-4 bg-white border border-amber-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-center">
          <div className="text-2xl lg:text-3xl font-bold text-amber-700">{warningCount}</div>
          <div className="text-xs text-[#555E68] font-bold uppercase tracking-wider mt-1">Warning Alerts</div>
        </div>
        <div className="p-4 bg-white border border-emerald-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-center">
          <div className="text-2xl lg:text-3xl font-bold text-emerald-700">{state.exceptions.filter(e => e.resolved).length}</div>
          <div className="text-xs text-[#555E68] font-bold uppercase tracking-wider mt-1">Resolved Today</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-5 p-3.5 bg-white border border-[#E8E5E0] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search exceptions by title, vehicle..." className="w-full sm:w-64" />
        <SelectFilter
          value={severityFilter}
          onChange={v => setSeverityFilter(v as ExceptionSeverity | '')}
          options={[{ label: 'All Severity', value: '' }, { label: 'Critical', value: 'CRITICAL' }, { label: 'Warning', value: 'WARNING' }, { label: 'Info', value: 'INFO' }]}
          label="Severity filter"
        />
        <SelectFilter
          value={typeFilter}
          onChange={v => setTypeFilter(v as ExceptionType | '')}
          options={[
            { label: 'All Types', value: '' },
            ...Object.entries(TYPE_LABELS).map(([v, l]) => ({ label: l, value: v })),
          ]}
          label="Type filter"
        />
        <button
          onClick={() => setShowResolved(r => !r)}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-[10px] border transition-colors ${showResolved ? 'bg-[#F4511E] text-white border-[#F4511E]' : 'bg-white border-[#E8E5E0] text-[#101820] hover:bg-[#F6F5F2]'}`}
        >
          <Filter size={14} />
          {showResolved ? 'Showing Resolved' : 'Show Resolved'}
        </button>
      </div>

      {/* Exception List */}
      <div className="space-y-4">
        {exceptions.length === 0 && (
          <Card>
            <EmptyState icon={<CheckCircle size={36} className="text-emerald-500" />} title="No exceptions found"
              description={showResolved ? 'No resolved exceptions found.' : 'All transport movements are running normally. No active exceptions.'}
            />
          </Card>
        )}

        {exceptions.map(exc => (
          <div
            key={exc.id}
            className={`bg-white rounded-2xl border shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden transition-all
              ${exc.severity === 'CRITICAL'
                ? 'border-rose-300/80 hover:border-rose-400'
                : exc.severity === 'WARNING'
                ? 'border-amber-300/80 hover:border-amber-400'
                : 'border-[#E8E5E0] hover:border-[#F4511E]/40'}
              ${exc.resolved ? 'opacity-60' : ''}`}
          >
            {/* Header banner */}
            <div className={`px-5 py-3.5 border-b ${exc.severity === 'CRITICAL' ? 'bg-rose-50/60 border-rose-100' : exc.severity === 'WARNING' ? 'bg-amber-50/60 border-amber-100' : 'bg-[#F6F5F2] border-[#E8E5E0]'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border
                    ${exc.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                    <AlertTriangle size={12} /> {exc.severity}
                  </span>
                  <span className="text-xs font-bold text-[#101820] font-mono">{exc.vehicleNumber || exc.requestId || ''}</span>
                  <span className="text-xs text-[#8E9CA8]">({TYPE_LABELS[exc.type]})</span>
                  {exc.resolved && <span className="text-xs text-emerald-700 font-bold">✓ Resolved</span>}
                </div>
                <div className="text-xs text-[#8E9CA8]">{timeFmt(exc.detectedAt)}</div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <h3 className="text-base font-bold text-[#101820] mb-1">{exc.title}</h3>
              <p className="text-sm text-[#555E68] leading-relaxed">{exc.description}</p>

              {/* Specific details grid */}
              <div className="mt-4 p-3.5 bg-[#F6F5F2]/70 rounded-xl border border-[#E8E5E0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {exc.vehicleNumber && (
                  <div>
                    <span className="text-[#8E9CA8] font-bold uppercase tracking-wider text-[10px] block">Vehicle</span>
                    <span className="font-mono font-bold text-[#101820]">{exc.vehicleNumber}</span>
                  </div>
                )}
                {exc.tripId && (
                  <div>
                    <span className="text-[#8E9CA8] font-bold uppercase tracking-wider text-[10px] block">Trip</span>
                    <span className="font-semibold text-[#101820] font-mono">{exc.tripId}</span>
                  </div>
                )}
                {exc.requestId && (
                  <div>
                    <span className="text-[#8E9CA8] font-bold uppercase tracking-wider text-[10px] block">Request</span>
                    <span className="font-semibold text-[#101820] font-mono">{exc.requestId}</span>
                  </div>
                )}
                {exc.assignedTo && (
                  <div>
                    <span className="text-[#8E9CA8] font-bold uppercase tracking-wider text-[10px] block">Assigned To</span>
                    <span className="font-semibold text-[#101820]">{exc.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Remarks */}
              {exc.remarks.length > 0 && (
                <div className="mt-3.5 space-y-1.5">
                  {exc.remarks.map((r, i) => (
                    <div key={i} className="text-xs text-[#555E68] italic bg-[#FFF0E9]/40 px-3.5 py-2 rounded-xl border border-[#FFE1D4]">
                      "{r}"
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {!exc.resolved && (
                <div className="mt-5 pt-4 border-t border-[#F0EDE8] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRemarkModal({ id: exc.id, title: exc.title })}
                      icon={<MessageSquare size={13} />}
                    >
                      Add Remark
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleResolve(exc.id)}
                      icon={<CheckCircle size={13} className="text-emerald-600" />}
                    >
                      Resolve
                    </Button>
                  </div>

                  {exc.tripId && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/transit')}
                      icon={<Eye size={13} />}
                    >
                      View Trip
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Remark Modal */}
      <Modal open={!!remarkModal} onClose={() => setRemarkModal(null)} title="Add Operational Remark" size="sm"
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <Button variant="secondary" onClick={() => setRemarkModal(null)} className="w-full sm:w-auto justify-center">Cancel</Button>
            <Button variant="primary" onClick={handleAddRemark} disabled={!remarkText.trim()} className="w-full sm:w-auto justify-center">Submit Remark</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs font-bold text-[#101820]">{remarkModal?.title}</p>
          <textarea
            value={remarkText}
            onChange={e => setRemarkText(e.target.value)}
            rows={3}
            placeholder="Enter operational remark or update..."
            className="w-full text-sm bg-white border border-[#E8E5E0] rounded-[10px] p-3 text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] resize-none"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
