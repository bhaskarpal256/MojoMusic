import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import PlayPause from './PlayPause';
import { toggleLikeSong } from '../redux/features/playerSlice';

const SongBar = ({ song, i, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.player);
  const isLiked = likedSongs.some((s) => s.key === song.key);

  return (
    <div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeSong?.title === song?.title ? 'bg-[#4c426e]' : 'bg-transparent'} py-2 p-2 sm:p-4 rounded-lg cursor-pointer mb-2`}>
      <h3 className="font-bold text-base text-white mr-2 sm:mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center min-w-0">
        <img
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover"
          src={artistId ? song?.attributes?.artwork?.url.replace('{w}', '125').replace('{h}', '125') : song?.images?.coverart}
          alt={song?.title}
        />
        <div className="flex-1 flex flex-col justify-center mx-2 sm:mx-3 min-w-0">
          {!artistId ? (
            <Link to={`/songs/${song.key}`}>
              <p className="sm:text-xl text-base font-bold text-white truncate">
                {song?.title}
              </p>
            </Link>
          ) : (
            <p className="sm:text-xl text-base font-bold text-white truncate">
              {song?.attributes?.name}
            </p>
          )}
          <p className="sm:text-base text-xs text-gray-300 mt-0.5 sm:mt-1 truncate">
            {artistId ? song?.attributes?.albumName : song?.subtitle}
          </p>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleLikeSong(song));
        }}
        className="mr-6 focus:outline-none transition-transform duration-200 active:scale-125"
      >
        {isLiked ? (
          <AiFillHeart className="text-red-500 hover:text-red-400" size={24} />
        ) : (
          <AiOutlineHeart className="text-gray-400 hover:text-red-500" size={24} />
        )}
      </button>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    </div>
  );
};

export default SongBar;