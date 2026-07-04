import React from 'react';

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime, mode = 'desktop' }) => {
  // converts the time to format 0:00
  const getTime = (time) => `${Math.floor(time / 60)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

  if (mode === 'mobile-bottom') {
    return (
      <div className="absolute bottom-0 left-0 right-0 w-full flex sm:hidden flex-row items-center px-4 py-1 select-none z-20">
        <p className="text-white text-xs font-mono min-w-[35px] text-right">{value === 0 ? '0:00' : getTime(value)}</p>
        <input
          type="range"
          step="any"
          value={value}
          min={min}
          max={max}
          onInput={onInput}
          className="flex-1 h-1 mx-3 rounded-lg cursor-pointer accent-white bg-white/20 hover:bg-white/30 transition-colors"
        />
        <p className="text-white text-xs font-mono min-w-[35px]">{max === 0 ? '0:00' : getTime(max)}</p>
      </div>
    );
  }

  // Default Desktop View
  return (
    <div className="hidden sm:flex flex-row items-center select-none mt-2">
      <p className="text-white text-sm font-medium">{value === 0 ? '0:00' : getTime(value)}</p>
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        className="w-24 md:w-56 2xl:w-96 h-1 mx-4 2xl:mx-6 rounded-lg cursor-pointer accent-white bg-white/10 hover:bg-white/25"
      />
      <p className="text-white text-sm font-medium">{max === 0 ? '0:00' : getTime(max)}</p>
    </div>
  );
};

export default Seekbar;
