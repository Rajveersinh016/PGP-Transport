import React from 'react';
import { Trash2, PenLine } from 'lucide-react';
import type { OperatorNote, UserRole } from '../../types';
import { roleLabels, roleColors } from '../../auth/permissions';

// ============================================================
// NOTE CATEGORY CONFIG
// ============================================================
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DELAY:     { label: 'Delay',     color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200' },
  LOADING:   { label: 'Loading',   color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  UNLOADING: { label: 'Unloading', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  GATE:      { label: 'Gate',      color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200' },
  VEHICLE:   { label: 'Vehicle',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  WAREHOUSE: { label: 'Warehouse', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  PLANT:     { label: 'Plant',     color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200' },
  GENERAL:   { label: 'General',   color: 'text-[#555E68]',  bg: 'bg-[#F6F5F2] border-[#E8E5E0]' },
};

// ============================================================
// OPERATOR NOTE CARD
// Visual concept: physical logbook entry
// Handwriting font ONLY for the note text content
// ============================================================
interface OperatorNoteCardProps {
  note: OperatorNote;
  currentUser: string;
  currentRole: UserRole;
  onDelete?: (noteId: string) => void;
  compact?: boolean;
}

export function OperatorNoteCard({ note, currentUser, currentRole, onDelete, compact = false }: OperatorNoteCardProps) {
  const cat = CATEGORY_CONFIG[note.category] || CATEGORY_CONFIG.GENERAL;
  const authorColor = roleColors[note.authorRole];

  const canDelete = currentRole === 'ADMIN' || note.author === currentUser;

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const formattedTime = new Date(note.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div
      className={`
        relative bg-[#FFFEF7] border border-[#E8E4D0] rounded-xl overflow-hidden
        shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
        ${compact ? 'p-3' : 'p-4'}
      `}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            transparent,
            transparent 27px,
            #E8E8D8 27px,
            #E8E8D8 28px
          )
        `,
        backgroundPosition: '0 36px',
      }}
    >
      {/* Top strip */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#8E9CA8]">
            <PenLine size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Operator Note</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color}`}>
            {cat.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {note.entityId && (
            <span className="text-[10px] text-[#8E9CA8] font-mono bg-[#F6F5F2] px-1.5 py-0.5 rounded">
              {note.entityId}
            </span>
          )}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="p-1 text-[#8E9CA8] hover:text-rose-500 transition-colors rounded"
              title="Delete note"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Note text — handwriting font */}
      <div
        className={`
          text-[#2D2416] leading-relaxed mb-3 break-words overflow-hidden
          ${compact ? 'text-sm' : 'text-base'}
        `}
        style={{ fontFamily: "'Caveat', 'Patrick Hand', cursive" }}
      >
        "{note.text}"
      </div>

      {/* Footer — normal font */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8E4D0]/60">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${authorColor.bg} ${authorColor.text}`}>
            {note.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex items-center flex-wrap gap-1">
            <span className="text-xs font-bold text-[#101820]">— {note.author}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${authorColor.bg} ${authorColor.text} ${authorColor.border}`}>
              {roleLabels[note.authorRole]}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-[#101820]">{formattedTime}</div>
          <div className="text-[9px] text-[#8E9CA8]">{formattedDate}</div>
        </div>
      </div>

      {/* Location */}
      {note.location && (
        <div className="text-[10px] text-[#8E9CA8] mt-1">
          📍 {note.location}
        </div>
      )}
    </div>
  );
}
