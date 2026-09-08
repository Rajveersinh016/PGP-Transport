import React, { useState } from 'react';
import { X, PenLine, Lock } from 'lucide-react';
import type { NoteCategory, OperatorNote } from '../../types';
import type { UserRole } from '../../types';
import { hasPermission } from '../../auth/permissions';

// ============================================================
// ADD NOTE MODAL
// ============================================================
const CATEGORIES: { value: NoteCategory; label: string; emoji: string }[] = [
  { value: 'DELAY',     label: 'Delay',     emoji: '⏰' },
  { value: 'LOADING',   label: 'Loading',   emoji: '📦' },
  { value: 'UNLOADING', label: 'Unloading', emoji: '🚚' },
  { value: 'GATE',      label: 'Gate',      emoji: '🚪' },
  { value: 'VEHICLE',   label: 'Vehicle',   emoji: '🚛' },
  { value: 'WAREHOUSE', label: 'Warehouse', emoji: '🏭' },
  { value: 'PLANT',     label: 'Plant',     emoji: '🏗️' },
  { value: 'GENERAL',   label: 'General',   emoji: '📝' },
];

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, entityType: OperatorNote['entityType'], entityId: string | null, category: NoteCategory, location: string) => void;
  currentRole: UserRole;
  entityType?: OperatorNote['entityType'];
  entityId?: string | null;
  locationDefault?: string;
}

export function AddNoteModal({ isOpen, onClose, onAdd, currentRole, entityType = 'GENERAL', entityId = null, locationDefault = '' }: AddNoteModalProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<NoteCategory>('GENERAL');
  const [location, setLocation] = useState(locationDefault);
  const canAdd = hasPermission(currentRole, 'ADD_NOTE');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!text.trim() || !canAdd) return;
    onAdd(text.trim(), entityType, entityId, category, location || locationDefault);
    setText('');
    setCategory('GENERAL');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#101820]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8E5E0] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EDE8] bg-[#FFFEF7]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <PenLine size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#101820]">Add Operator Note</h3>
              {entityId && <p className="text-[10px] text-[#8E9CA8]">Re: {entityId}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8E9CA8] hover:text-[#101820] hover:bg-[#F6F5F2] rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!canAdd && (
            <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <Lock size={16} className="text-rose-500 flex-shrink-0" />
              <p className="text-xs text-rose-700 font-medium">
                Your role ({currentRole.replace(/_/g, ' ')}) does not have permission to add notes.
              </p>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#101820] mb-2 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  disabled={!canAdd}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-medium transition-all
                    ${category === cat.value
                      ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                      : 'bg-[#F6F5F2] border-[#E8E5E0] text-[#555E68] hover:bg-[#F0EDE8]'}
                    ${!canAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note text — uses handwriting font in preview */}
          <div>
            <label className="block text-xs font-bold text-[#101820] mb-2 uppercase tracking-wider">Note</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={!canAdd}
              placeholder="Write your operational remark..."
              rows={4}
              className="w-full px-4 py-3 text-base border border-[#E8E5E0] rounded-xl text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all resize-none disabled:opacity-50 disabled:bg-[#F6F5F2]"
              style={{ fontFamily: "'Caveat', cursive" }}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#101820] mb-2 uppercase tracking-wider">Location <span className="text-[#8E9CA8] normal-case font-normal">(optional)</span></label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              disabled={!canAdd}
              placeholder="e.g. Plant-01 Loading Bay"
              className="w-full px-4 py-2.5 text-sm border border-[#E8E5E0] rounded-xl text-[#101820] placeholder-[#8E9CA8] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all disabled:opacity-50 disabled:bg-[#F6F5F2]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0EDE8] flex gap-3 bg-[#F6F5F2]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[#E8E5E0] rounded-xl text-sm font-semibold text-[#101820] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || !canAdd}
            className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <PenLine size={15} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
