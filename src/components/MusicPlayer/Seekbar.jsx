import React from 'react';

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime }) => {
  // converts the time to format 0:00
  const getTime = (time) => `${Math.floor(time / 60)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

  return (
    <div className="flex flex-row items-center">
      <button type="button" onClick={() => setSeekTime(appTime - 5)} className="hidden lg:mr-4 lg:block text-white">
        -
      </button>
      <p className="text-white text-xs sm:text-sm">{value === 0 ? '0:00' : getTime(value)}</p>
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        className="w-20 sm:w-56 2xl:w-96 h-1 mx-2 sm:mx-4 rounded-lg cursor-pointer accent-white"
      />
      <p className="text-white text-xs sm:text-sm">{max === 0 ? '0:00' : getTime(max)}</p>
      <button type="button" onClick={() => setSeekTime(appTime + 5)} className="hidden lg:ml-4 lg:block text-white">
        +
      </button>
    </div>
  );
};

export default Seekbar;
