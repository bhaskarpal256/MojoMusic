import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdWaves } from 'react-icons/md';

import { nextSong, prevSong, playPause, toggleLikeSong } from '../../redux/features/playerSlice';
import Controls from './Controls';
import Player from './Player';
import Seekbar from './Seekbar';
import Track from './Track';
import VolumeBar from './VolumeBar';
import VisualizerOverlay from './VisualizerOverlay';
import { themes } from '../../assets/constants';

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying, currentTheme } = useSelector((state) => state.player);
  const themeConfig = themes.find((t) => t.value === currentTheme) || themes[0];
  
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const dispatch = useDispatch();

  const ambientCanvasRef = useRef(null);

  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
  }, [currentIndex]);

  useEffect(() => {
    const canvas = ambientCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const primaryColor = themeConfig.accentColor || '#22d3ee';
      ctx.strokeStyle = `${primaryColor}22`;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const amplitude = isPlaying ? (volume * 20 + 8) : 2;
        const speed = isPlaying ? (volume * 0.04 + 0.015) : 0.001;
        phase += speed * 0.005;
        const y = (height / 2) + Math.sin(x * 0.008 + phase) * amplitude + Math.cos(x * 0.015 - phase) * (amplitude * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (ambientCanvasRef.current) {
        width = ambientCanvasRef.current.width = ambientCanvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, volume, currentTheme, themeConfig]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSeekTime(Math.max(0, appTime - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSeekTime(Math.min(duration, appTime + 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => Math.min(1, prev + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 0.05));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setVolume((prev) => (prev > 0 ? 0 : 0.3));
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handleNextSong();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handlePrevSong();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          if (activeSong?.title) {
            dispatch(toggleLikeSong(activeSong));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isActive, currentIndex, currentSongs, duration, appTime, activeSong]);

  const handlePlayPause = () => {
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = () => {
    dispatch(playPause(false));

    const songList = currentSongs?.tracks?.hits || currentSongs?.tracks || currentSongs;
    if (songList && songList.length) {
      if (!shuffle) {
        dispatch(nextSong((currentIndex + 1) % songList.length));
      } else {
        dispatch(nextSong(Math.floor(Math.random() * songList.length)));
      }
    }
  };

  const handlePrevSong = () => {
    const songList = currentSongs?.tracks?.hits || currentSongs?.tracks || currentSongs;
    if (songList && songList.length) {
      if (currentIndex === 0) {
        dispatch(prevSong(songList.length - 1));
      } else if (shuffle) {
        dispatch(prevSong(Math.floor(Math.random() * songList.length)));
      } else {
        dispatch(prevSong(currentIndex - 1));
      }
    }
  };

  return (
    <div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      {/* Subtle ambient visualizer wave in background */}
      <canvas ref={ambientCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20 rounded-t-3xl" />

      <Seekbar
        value={appTime}
        min="0"
        max={duration}
        onInput={(event) => setSeekTime(event.target.value)}
        setSeekTime={setSeekTime}
        appTime={appTime}
        mode="mobile-bottom"
      />

      <Track isPlaying={isPlaying} isActive={isActive} activeSong={activeSong} />
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration}
          onInput={(event) => setSeekTime(event.target.value)}
          setSeekTime={setSeekTime}
          appTime={appTime}
          mode="desktop"
        />
        <Player
          activeSong={activeSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>
      
      <div className="flex-1 flex flex-row items-center justify-end gap-1 text-gray-400 z-10">
        <button
          onClick={() => setVisualizerOpen(true)}
          title="Open Visualizer"
          className="text-gray-400 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110 p-1.5 rounded-full hover:bg-white/10 focus:outline-none mr-2 flex items-center justify-center"
        >
          <MdWaves size={24} className={isPlaying ? 'animate-pulse' : ''} style={{ color: themeConfig.accentColor }} />
        </button>
        <VolumeBar value={volume} min="0" max="1" onChange={(event) => setVolume(event.target.value)} setVolume={setVolume} />
      </div>

      <VisualizerOverlay 
        isOpen={visualizerOpen}
        onClose={() => setVisualizerOpen(false)}
        appTime={appTime}
        duration={duration}
        volume={volume}
      />
    </div>
  );
};

export default MusicPlayer;
