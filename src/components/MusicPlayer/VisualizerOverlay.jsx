import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RiCloseLine } from 'react-icons/ri';
import { BsPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { playPause, nextSong, prevSong } from '../../redux/features/playerSlice';
import { themes } from '../../assets/constants';

const VisualizerOverlay = ({ isOpen, onClose, appTime, duration, volume }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, currentSongs, currentIndex, currentTheme } = useSelector((state) => state.player);
  const themeConfig = themes.find((t) => t.value === currentTheme) || themes[0];
  const [visualizerMode, setVisualizerMode] = useState('circular'); // 'circular', 'bars', 'particles'
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle list
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let phase = 0;
    const fftData = Array.from({ length: 64 }, () => Math.random() * 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine visualization color based on active theme
      const primaryColor = themeConfig.accentColor || '#22d3ee';
      const secondaryColor = currentTheme === 'midnight' ? '#374151' : '#a855f7';

      // Update simulation speeds based on volume and playback state
      const targetSpeed = isPlaying ? (volume * 1.5 + 0.5) : 0;
      phase += isPlaying ? (volume * 0.05 + 0.02) : 0.001;

      // Update pseudo-FFT data for reactive look
      for (let i = 0; i < fftData.length; i++) {
        if (isPlaying) {
          const target = Math.abs(Math.sin(phase + i * 0.1)) * (100 + Math.sin(phase * 2) * 50) * (volume + 0.2);
          fftData[i] += (target - fftData[i]) * 0.15;
        } else {
          fftData[i] += (0 - fftData[i]) * 0.08;
        }
      }

      // Drawing styles
      if (visualizerMode === 'circular') {
        // --- Circular Ripple Visualizer ---
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.18 + (isPlaying ? fftData[0] * 0.1 : 0);

        // Ambient glows
        const glowGrad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.8, centerX, centerY, baseRadius * 2);
        glowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        glowGrad.addColorStop(0.5, `${primaryColor}0d`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Ripple waves
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = primaryColor;

        // Circular Wave 1
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.05) {
          const fftIndex = Math.floor((a / (Math.PI * 2)) * fftData.length);
          const offset = isPlaying ? (fftData[fftIndex] || 10) * 0.35 : Math.sin(a * 8 + phase * 10) * 2;
          const r = baseRadius + offset;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Circular Wave 2 (Outer Ripple)
        ctx.strokeStyle = `${primaryColor}66`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.05) {
          const fftIndex = Math.floor(((a + Math.PI) / (Math.PI * 2)) * fftData.length) % fftData.length;
          const offset = isPlaying ? (fftData[fftIndex] || 10) * 0.5 : Math.sin(a * 4 - phase * 5) * 4;
          const r = baseRadius * 1.25 + offset;
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.shadowBlur = 0;

      } else if (visualizerMode === 'bars') {
        // --- Frequency Bars Visualizer ---
        const barWidth = (width / fftData.length) * 0.8;
        const spacing = (width / fftData.length) * 0.2;
        const startX = (width - (barWidth + spacing) * fftData.length) / 2;

        ctx.shadowBlur = 8;
        ctx.shadowColor = primaryColor;

        for (let i = 0; i < fftData.length; i++) {
          const x = startX + i * (barWidth + spacing);
          const barHeight = Math.max(4, fftData[i] * 2.5);
          const y = height * 0.8 - barHeight;

          // Gradient fill for bars
          const barGrad = ctx.createLinearGradient(x, height * 0.8, x, y);
          barGrad.addColorStop(0, secondaryColor);
          barGrad.addColorStop(1, primaryColor);

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 4);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Base Line
        ctx.strokeStyle = `${primaryColor}40`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.8);
        ctx.lineTo(width, height * 0.8);
        ctx.stroke();

      } else if (visualizerMode === 'particles') {
        // --- Cosmic Particles Visualizer ---
        ctx.fillStyle = primaryColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = primaryColor;

        particles.forEach((p, idx) => {
          // Adjust velocity based on speed multiplier
          const modSpeedX = p.speedX * (targetSpeed + 0.2);
          const modSpeedY = p.speedY * (targetSpeed + 0.2);

          p.x += modSpeedX;
          p.y += modSpeedY;

          // Warp edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Pulsate particle size
          const fftIndex = idx % fftData.length;
          const pSize = p.size + (isPlaying ? fftData[fftIndex] * 0.05 : 0);

          ctx.fillStyle = `${primaryColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, visualizerMode, isPlaying, volume, currentTheme, themeConfig]);

  if (!isOpen) return null;

  const activeSongsData = currentSongs?.tracks?.hits || currentSongs?.tracks || currentSongs;
  const progressPercent = duration ? (appTime / duration) * 100 : 0;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPauseToggle = () => {
    dispatch(playPause(!isPlaying));
  };

  const handleSkipNext = () => {
    if (!activeSongsData || activeSongsData.length === 0) return;
    dispatch(playPause(false));
    dispatch(nextSong((currentIndex + 1) % activeSongsData.length));
  };

  const handleSkipPrev = () => {
    if (!activeSongsData || activeSongsData.length === 0) return;
    dispatch(playPause(false));
    dispatch(prevSong(currentIndex === 0 ? activeSongsData.length - 1 : currentIndex - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06060c] flex flex-col justify-between overflow-hidden animate-fadeIn">
      {/* Background visualizer canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-black/80 to-transparent w-full">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div>
            <h2 className="text-white text-base sm:text-lg font-bold">Mojo Music Visualizer</h2>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Experience your sound waves</p>
          </div>
          
          <button
            onClick={onClose}
            className="sm:hidden text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 p-2 rounded-full cursor-pointer hover:rotate-90 duration-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>
        
        {/* Style mode toggles */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 max-w-full overflow-x-auto">
          {['circular', 'bars', 'particles'].map((mode) => (
            <button
              key={mode}
              onClick={() => setVisualizerMode(mode)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold capitalize transition-all duration-300 cursor-pointer whitespace-nowrap ${
                visualizerMode === mode 
                  ? `${themeConfig.highlightBg} text-black font-bold shadow-lg` 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="hidden sm:block text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-full cursor-pointer hover:rotate-90 duration-300"
        >
          <RiCloseLine size={24} />
        </button>
      </div>

      {/* Main visual component */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {visualizerMode === 'circular' && (
          <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 select-none">
            {/* Spinning disc art */}
            <div 
              className={`absolute inset-2 rounded-full border-4 border-[#121212] overflow-hidden shadow-2xl flex items-center justify-center bg-black ${
                isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''
              }`}
            >
              <img 
                src={activeSong?.images?.coverart} 
                alt="album" 
                className="w-full h-full object-cover rounded-full pointer-events-none"
              />
              {/* Central spindle hole */}
              <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-[#06060c] border-[3px] border-white/20 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            
            {/* Retro vinyl tracks styling overlays */}
            <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute inset-10 border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute inset-20 border border-white/5 rounded-full pointer-events-none" />
          </div>
        )}

        {/* Track Title and Artist */}
        <div className="mt-8 text-center px-4 max-w-xl relative">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight truncate filter drop-shadow">
            {activeSong?.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1 sm:mt-2 truncate">
            {activeSong?.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom control & seek bar */}
      <div className="relative z-10 bg-gradient-to-t from-black/90 via-black/85 to-transparent px-8 py-8 flex flex-col items-center">
        {/* Progress seek slider */}
        <div className="w-full max-w-2xl flex items-center gap-4 mb-6">
          <span className="text-gray-400 text-xs font-mono w-10 text-right">{formatTime(appTime)}</span>
          <div className="flex-1 relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 bottom-0 left-0 ${themeConfig.highlightBg} transition-all duration-100`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-gray-400 text-xs font-mono w-10">{formatTime(duration)}</span>
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-6 md:gap-8">
          <button 
            onClick={handleSkipPrev}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <BsSkipStartFill size={35} />
          </button>
          
          <button 
            onClick={handlePlayPauseToggle}
            className={`p-4 rounded-full text-black font-bold cursor-pointer transition-all hover:scale-110 duration-200 active:scale-95 ${themeConfig.highlightBg}`}
          >
            {isPlaying ? <BsPauseFill size={30} /> : <BsPlayFill size={30} />}
          </button>

          <button 
            onClick={handleSkipNext}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <BsSkipEndFill size={35} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizerOverlay;
