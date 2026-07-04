import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import Equalizer from '../Equalizer';
import { toggleLikeSong } from '../../redux/features/playerSlice';

const Track = ({ isPlaying, isActive, activeSong }) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.player);
  const isLiked = likedSongs.some((s) => s.key === activeSong?.key);

  return (
    <div className="flex-1 flex items-center justify-start">
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={activeSong?.images?.coverart} alt="cover art" className="rounded-full" />
      </div>
      <div className="w-[50%] mr-4">
        <p className="truncate text-white font-bold text-lg">
          {activeSong?.title ? activeSong?.title : 'No active Song'}
        </p>
        <p className="truncate text-gray-300">
          {activeSong?.subtitle ? activeSong?.subtitle : 'No active Song'}
        </p>
      </div>
      {activeSong?.title && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleLikeSong(activeSong))}
            className="focus:outline-none transition-transform duration-200 active:scale-125"
          >
            {isLiked ? (
              <AiFillHeart className="text-red-500 hover:text-red-400" size={24} />
            ) : (
              <AiOutlineHeart className="text-gray-400 hover:text-red-500" size={24} />
            )}
          </button>
          {isPlaying && isActive && (
            <div className="hidden md:block">
              <Equalizer isPlaying={isPlaying} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Track;
