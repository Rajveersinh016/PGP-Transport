import React from 'react';
import type { VehicleStatus, TripStatus, RequestStatus, Priority, ExceptionSeverity, MaterialType } from '../../types';

// ============================================================
// STATUS BADGE
// Semantic status colors maintained per prompt guidelines
// ============================================================
const vehicleStatusConfig: Record<VehicleStatus, { label: string; color: string }> = {
  AVAILABLE:    { label: 'Available',    color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
  ASSIGNED:     { label: 'Assigned',     color: 'bg-sky-50 text-sky-800 border-sky-200/80' },
  AT_PLANT:     { label: 'At Plant',     color: 'bg-blue-50 text-blue-800 border-blue-200/80' },
  LOADING:      { label: 'Loading',      color: 'bg-[#FFF0E9] text-[#F4511E] border-[#FFE1D4]' },
  LOADED:       { label: 'Loaded',       color: 'bg-indigo-50 text-indigo-800 border-indigo-200/80' },
  IN_TRANSIT:   { label: 'In Transit',   color: 'bg-[#FFF0E9] text-[#F4511E] border-[#F4511E]/30 font-bold' },
  AT_WAREHOUSE: { label: 'At Warehouse', color: 'bg-purple-50 text-purple-800 border-purple-200/80' },
  UNLOADING:    { label: 'Unloading',    color: 'bg-[#FFF0E9] text-[#F4511E] border-[#FFE1D4]' },
  EMPTY:        { label: 'Empty',        color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
  DELAYED:      { label: 'Delayed',      color: 'bg-rose-50 text-rose-800 border-rose-200/80 font-bold' },
  OFFLINE:      { label: 'Offline',      color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const tripStatusConfig: Record<TripStatus, { label: string; color: string }> = {
  REQUESTED:    { label: 'Requested',    color: 'bg-[#F6F5F2] text-[#555E68] border-[#E8E5E0]' },
  ASSIGNED:     { label: 'Assigned',     color: 'bg-sky-50 text-sky-800 border-sky-200/80' },
  AT_PLANT:     { label: 'At Plant',     color: 'bg-blue-50 text-blue-800 border-blue-200/80' },
  LOADING:      { label: 'Loading',      color: 'bg-[#FFF0E9] text-[#F4511E] border-[#FFE1D4]' },
  LOADED:       { label: 'Loaded',       color: 'bg-indigo-50 text-indigo-800 border-indigo-200/80' },
  GATE_OUT:     { label: 'Gate Out',     color: 'bg-teal-50 text-teal-800 border-teal-200/80' },
  IN_TRANSIT:   { label: 'In Transit',   color: 'bg-[#FFF0E9] text-[#F4511E] border-[#F4511E]/40 font-bold' },
  AT_WAREHOUSE: { label: 'At Warehouse', color: 'bg-purple-50 text-purple-800 border-purple-200/80' },
  UNLOADING:    { label: 'Unloading',    color: 'bg-[#FFF0E9] text-[#F4511E] border-[#FFE1D4]' },
  UNLOADED:     { label: 'Unloaded',     color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold' },
  COMPLETED:    { label: 'Completed',    color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold' },
  CANCELLED:    { label: 'Cancelled',    color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const requestStatusConfig: Record<RequestStatus, { label: string; color: string }> = {
  PENDING:     { label: 'Pending',     color: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  ASSIGNED:    { label: 'Assigned',    color: 'bg-sky-50 text-sky-800 border-sky-200/80' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-[#FFF0E9] text-[#F4511E] border-[#FFE1D4]' },
  COMPLETED:   { label: 'Completed',   color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
  CANCELLED:   { label: 'Cancelled',   color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  LOW:    { label: 'Low',    color: 'bg-[#F6F5F2] text-[#555E68] border-[#E8E5E0]' },
  MEDIUM: { label: 'Medium', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  HIGH:   { label: 'High',   color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' },
  URGENT: { label: 'Urgent', color: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' },
};

const severityConfig: Record<ExceptionSeverity, { label: string; color: string }> = {
  INFO:     { label: 'Info',     color: 'bg-sky-50 text-sky-700 border-sky-200' },
  WARNING:  { label: 'Warning',  color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' },
  CRITICAL: { label: 'Critical', color: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' },
};

const materialConfig: Record<MaterialType, { label: string; color: string }> = {
  FG:  { label: 'FG — Finished Goods',     color: 'bg-teal-50 text-teal-800 border-teal-200/80' },
  RM:  { label: 'RM — Raw Material',        color: 'bg-orange-50 text-orange-800 border-orange-200/80' },
  OW:  { label: 'OW — Own Work',            color: 'bg-purple-50 text-purple-800 border-purple-200/80' },
  PGP: { label: 'PGP',                      color: 'bg-rose-50 text-rose-800 border-rose-200/80' },
  PM:  { label: 'PM — Packing Material',    color: 'bg-cyan-50 text-cyan-800 border-cyan-200/80' },
  SFG: { label: 'SFG — Semi-Finished Goods',color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
};

interface StatusBadgeProps {
  type: 'vehicle' | 'trip' | 'request' | 'priority' | 'exception' | 'material';
  value: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ type, value, size = 'md' }: StatusBadgeProps) {
  let cfg = { label: value, color: 'bg-[#F6F5F2] text-[#555E68] border-[#E8E5E0]' };
  if (type === 'vehicle') cfg = vehicleStatusConfig[value as VehicleStatus] ?? cfg;
  if (type === 'trip') cfg = tripStatusConfig[value as TripStatus] ?? cfg;
  if (type === 'request') cfg = requestStatusConfig[value as RequestStatus] ?? cfg;
  if (type === 'priority') cfg = priorityConfig[value as Priority] ?? cfg;
  if (type === 'exception') cfg = severityConfig[value as ExceptionSeverity] ?? cfg;
  if (type === 'material') cfg = materialConfig[value as MaterialType] ?? cfg;
  const sz = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-md border font-semibold tracking-wide ${sz} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ============================================================
// KPI CARD
// 16px radius, subtle warm border, bold charcoal numbers
// ============================================================
interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  sub?: string;
  highlight?: boolean;
}

export function KpiCard({ label, value, icon, color = 'text-[#F4511E]', bgColor = 'bg-[#FFF0E9]', onClick, sub, highlight = false }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border bg-white p-3 sm:p-4 transition-all duration-150 relative overflow-hidden group
        ${highlight
          ? 'border-[#F4511E] shadow-[0_2px_8px_rgba(244,81,30,0.12)] ring-1 ring-[#F4511E]/30'
          : 'border-[#E8E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#F4511E]/40 hover:shadow-md'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {highlight && <div className="absolute top-0 left-0 right-0 h-1 bg-[#F4511E]" />}
      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#8E9CA8] uppercase tracking-wider truncate">{label}</p>
          <p className="mt-1 sm:mt-1.5 text-xl sm:text-2xl lg:text-3xl font-bold text-[#101820] tracking-tight">{value}</p>
          {sub && <p className="text-[10px] sm:text-[11px] text-[#8E9CA8] mt-0.5 sm:mt-1 truncate">{sub}</p>}
        </div>
        <div className={`flex-shrink-0 rounded-xl p-2 sm:p-2.5 transition-transform duration-150 group-hover:scale-105 ${bgColor}`}>
          <span className={`${color}`}>{icon}</span>
        </div>
      </div>
    </button>
  );
}

// ============================================================
// PAGE HEADER
// Clean typography, Dark Charcoal title
// ============================================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-1.5">
          <p className="text-xs font-medium text-[#8E9CA8] flex items-center gap-1.5 flex-wrap">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                <span>{crumb}</span>
                {idx < breadcrumb.length - 1 && <span className="text-[#D8D4CC]">›</span>}
              </React.Fragment>
            ))}
          </p>
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#101820] tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-[#555E68] mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">{action}</div>}
      </div>
    </div>
  );
}

// ============================================================
// MODAL
// 16px radius, subtle border, smooth backdrop
// ============================================================
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-white rounded-2xl border border-[#E8E5E0] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#F0EDE8] flex-shrink-0">
          <h2 className="text-sm sm:text-base font-bold text-[#101820] truncate pr-2">{title}</h2>
          <button onClick={onClose} className="text-[#8E9CA8] hover:text-[#101820] hover:bg-[#F6F5F2] transition-colors p-1.5 rounded-lg flex-shrink-0" aria-label="Close modal">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">{children}</div>
        {footer && <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#F0EDE8] bg-[#F6F5F2] rounded-b-2xl flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'primary', loading }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end w-full">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto justify-center">Cancel</Button>
          <Button
            variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
            onClick={() => { onConfirm(); onClose(); }}
            disabled={loading}
            className="w-full sm:w-auto justify-center"
          >
            {loading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-sm text-[#555E68]">{message}</div>
    </Modal>
  );
}

// ============================================================
// TOAST
// ============================================================
interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ToastProps { toasts: ToastMessage[]; onRemove: (id: string) => void; }

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  const styles = {
    success: 'bg-emerald-700 text-white border border-emerald-600',
    error: 'bg-rose-700 text-white border border-rose-600',
    warning: 'bg-amber-600 text-white border border-amber-500',
    info: 'bg-[#101820] text-white border border-[#17232B]',
  };
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  return (
    <div className="fixed top-3 sm:top-4 right-3 sm:right-4 left-3 sm:left-auto sm:max-w-sm z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-xl ${styles[t.type]} animate-in transition-all text-xs sm:text-sm`}>
          <span className="text-sm font-bold flex-shrink-0">{icons[t.type]}</span>
          <span className="flex-1 font-medium break-words">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-white/70 hover:text-white p-1 flex-shrink-0" aria-label="Close notification">✕</button>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
      {icon && <div className="text-[#8E9CA8] mb-3">{icon}</div>}
      <h3 className="text-sm font-bold text-[#101820] mb-1">{title}</h3>
      {description && <p className="text-xs text-[#555E68] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// SEARCH BAR
// 10-12px radius, orange focus ring
// ============================================================
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9CA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2 text-sm bg-white border border-[#E8E5E0] rounded-[10px] text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all"
        aria-label={placeholder}
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9CA8] hover:text-[#101820]" aria-label="Clear search">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

// ============================================================
// SELECT FILTER
// ============================================================
interface SelectFilterProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  className?: string;
}

export function SelectFilter({ value, onChange, options, label, className = '' }: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={label}
      className={`text-xs sm:text-sm border border-[#E8E5E0] rounded-[10px] px-2.5 sm:px-3 py-2 bg-white text-[#101820] max-w-full focus:outline-none focus:ring-2 focus:ring-[#F4511E]/30 focus:border-[#F4511E] transition-all ${className}`}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ============================================================
// TABLE WRAPPER
// Light warm gray header, white rows, peach tint on hover
// ============================================================
export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto max-w-full touch-pan-x rounded-2xl border border-[#E8E5E0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${className}`}>
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 sm:px-4 py-2.5 sm:py-3.5 text-left text-[10px] sm:text-[11px] font-bold text-[#555E68] uppercase tracking-wider bg-[#F6F5F2] border-b border-[#E8E5E0] whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-[#101820] border-b border-[#F0EDE8] transition-colors ${className}`}>
      {children}
    </td>
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <div className={`${s} border-2 border-[#FFE1D4] border-t-[#F4511E] rounded-full animate-spin`} role="status" aria-label="Loading" />
  );
}

// ============================================================
// SECTION CARD
// 16px radius, clean white, 1px subtle warm-gray border
// ============================================================
export function Card({ children, className = '', padding = true }: { children: React.ReactNode; className?: string; padding?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E5E0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ============================================================
// BUTTON
// Primary: Orange #F4511E, 10-12px radius, compact & modern
// ============================================================
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#F4511E] hover:bg-[#D84315] text-white border-transparent shadow-sm font-semibold hover:shadow',
    secondary: 'bg-white hover:bg-[#F6F5F2] text-[#101820] border-[#E8E5E0] font-medium hover:border-[#D8D4CC]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent font-medium shadow-sm',
    ghost: 'bg-transparent hover:bg-[#FFF0E9] text-[#101820] hover:text-[#F4511E] border-transparent font-medium',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-medium shadow-sm',
  };
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-5 py-2.5' };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center gap-2 rounded-[10px] border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}

// ============================================================
// TIMELINE STEP
// Orange brand for completed and active current step
// ============================================================
interface TimelineStepProps {
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
  last?: boolean;
  operator?: string;
  remark?: string;
}

export function TimelineStep({ label, timestamp, completed, current, last, operator, remark }: TimelineStepProps) {
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-150
          ${completed
            ? 'bg-[#F4511E] border-[#F4511E] text-white shadow-sm'
            : current
            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-4 ring-[#FFE1D4]'
            : 'bg-white border-[#D8D4CC] text-[#8E9CA8]'}`}>
          {completed ? '✓' : current ? '●' : '○'}
        </div>
        {!last && (
          <div className={`w-0.5 flex-1 my-1 min-h-[22px] transition-colors ${completed ? 'bg-[#F4511E]/40' : 'bg-[#E8E5E0]'}`} />
        )}
      </div>
      <div className="flex-1 pb-4">
        <p className={`text-sm font-bold tracking-tight ${completed ? 'text-[#101820]' : current ? 'text-[#F4511E]' : 'text-[#8E9CA8]'}`}>
          {label}
        </p>
        {timestamp && <p className="text-xs text-[#555E68] mt-0.5 font-medium">{timestamp}</p>}
        {operator && <p className="text-xs text-[#8E9CA8] mt-0.5">by {operator}</p>}
        {remark && (
          <p className="text-xs text-[#555E68] italic mt-1 bg-[#FFF0E9] p-2 rounded-lg border border-[#FFE1D4]">
            "{remark}"
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LABEL VALUE PAIR
// ============================================================
export function LabelValue({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[11px] text-[#8E9CA8] font-bold uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm text-[#101820] font-semibold">{value || '—'}</dd>
    </div>
  );
}
