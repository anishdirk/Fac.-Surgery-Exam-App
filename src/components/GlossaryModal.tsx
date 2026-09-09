import React, { useState, useMemo } from 'react';
import { Search, X, Stethoscope } from 'lucide-react';
import { medicalTermsDictionary } from '../utils/medicalTerms';
import { SoundEffects } from '../utils/audio';
import { Modal } from './Modal';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" id="glossary-modal">
      <div className="p-6 flex flex-col max-h-[85vh] h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-shape-md bg-primary-container text-on-primary-container border border-outline-variant/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-title-large font-black text-on-surface leading-tight">
                Russian Surgical Eponyms & Sign Glossary
              </h2>
              <p className="text-body-small text-on-surface-variant font-medium">
                English translations & clinical explanations for high-yield exam terms
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="p-2 rounded-shape-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4 relative shrink-0">
          <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sign (e.g. Murphy, Blumberg, Kocher, Rovsing, флегмона)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-shape-full bg-surface-container border border-outline-variant/50 text-on-surface text-body-medium focus:outline-none focus:ring-2 focus:ring-primary font-medium placeholder:text-on-surface-variant/50 transition-colors"
          />
        </div>

        {/* List of definitions */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant/60 text-body-medium">
              No matching clinical signs found.
            </div>
          ) : (
            entries.map(([ru, en]) => (
              <div
                key={ru}
                className="p-3.5 rounded-shape-md bg-surface-container border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high transition-colors"
              >
                <div className="font-extrabold text-on-surface text-title-small">
                  {ru}
                </div>
                <div className="text-body-small text-on-surface-variant font-medium mt-1 leading-relaxed">
                  {en}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-body-small text-on-surface-variant shrink-0">
          <span className="text-label-medium">{entries.length} Surgical Terms Indexed</span>
          <button
            onClick={() => {
              SoundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-shape-full bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80 font-bold text-label-large transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
