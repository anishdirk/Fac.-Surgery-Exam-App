import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { medicalTermsDictionary } from '../utils/medicalTerms';
import { SoundEffects } from '../utils/audio';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    return Object.entries(medicalTermsDictionary).filter(([ru, en]) => {
      if (!query.trim()) return true;
      const qLower = query.toLowerCase();
      return ru.toLowerCase().includes(qLower) || en.toLowerCase().includes(qLower);
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0C10]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#161A23] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">
              🩺
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">
                Russian Surgical Eponyms & Sign Glossary
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                English translations & clinical explanations for high-yield exam terms
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sign (e.g. Murphy, Blumberg, Kocher, Rovsing, флегмона)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F1218] border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder-slate-500"
          />
        </div>

        {/* List of definitions */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No matching clinical signs found.
            </div>
          ) : (
            entries.map(([ru, en]) => (
              <div
                key={ru}
                className="p-3.5 rounded-2xl bg-[#0F1218] border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
              >
                <div className="font-extrabold text-white text-sm">
                  {ru}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  {en}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{entries.length} Surgical Terms Indexed</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
