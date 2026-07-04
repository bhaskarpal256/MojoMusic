import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

const ShortcutsHelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutsList = [
    { keys: ['Space'], desc: 'Play / Pause' },
    { keys: ['←', '→'], desc: 'Seek Backward / Forward 5s' },
    { keys: ['↑', '↓'], desc: 'Volume Up / Down 5%' },
    { keys: ['M'], desc: 'Mute / Unmute Player' },
    { keys: ['N'], desc: 'Next Song' },
    { keys: ['P'], desc: 'Previous Song' },
    { keys: ['L'], desc: 'Toggle Like / Favorite' },
    { keys: ['?', 'H'], desc: 'Toggle Keyboard Guide' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] animate-fadeIn p-4">
      <div 
        className="relative bg-[#191624]/95 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 animate-slideup"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RiCloseLine size={24} />
        </button>

        <h3 className="font-bold text-2xl text-white mb-6 pr-8 border-b border-white/5 pb-3">
          Keyboard Shortcuts Guide
        </h3>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {shortcutsList.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-300 text-sm font-medium">{item.desc}</span>
              <div className="flex gap-1.5">
                {item.keys.map((k) => (
                  <kbd 
                    key={k} 
                    className="inline-block bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_2px_0_rgba(255,255,255,0.1)] min-w-[28px] text-center"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Press <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10">ESC</kbd> or click anywhere outside to close this guide.
        </p>
      </div>
    </div>
  );
};

export default ShortcutsHelpModal;
