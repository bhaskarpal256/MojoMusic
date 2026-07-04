import React from 'react';

const Equalizer = ({ isPlaying }) => (
  <div className="flex items-end justify-center h-[24px] pointer-events-none">
    <div className={`soundwave-bar ${!isPlaying ? 'paused' : ''}`} />
    <div className={`soundwave-bar ${!isPlaying ? 'paused' : ''}`} />
    <div className={`soundwave-bar ${!isPlaying ? 'paused' : ''}`} />
    <div className={`soundwave-bar ${!isPlaying ? 'paused' : ''}`} />
    <div className={`soundwave-bar ${!isPlaying ? 'paused' : ''}`} />
  </div>
);

export default Equalizer;
