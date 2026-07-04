import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import PlayPause from './PlayPause';
import Equalizer from './Equalizer';
import { playPause, setActiveSong, toggleLikeSong } from '../redux/features/playerSlice';


const SongCard = ({ song, isPlaying, activeSong, i ,data}) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.player);
  const isLiked = likedSongs.some((s) => s.key === song.key);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i}));
    dispatch(playPause(true));
  };

  return(
  <div className="flex flex-col w-[calc(50%-8px)] sm:w-[200px] p-2 sm:p-4 bg-white/5
  bg-opacity-80 backdrop-blur-sm animate-slideup
  rounded-lg cursor-pointer group hover:bg-white/10 transition-all duration-300">
    <div className="relative w-full h-36 sm:h-44 group">
      <div 
        onClick={activeSong?.title === song.title && isPlaying ? handlePauseClick : handlePlayClick}
        className={`absolute inset-0 justify-center items-center bg-black bg-opacity-40 cursor-pointer
        flex sm:hidden sm:group-hover:flex 
        ${activeSong?.title === song.title ? 'flex bg-black bg-opacity-65' : ''}`}
      >
        <div className="flex flex-col items-center gap-3">
          {activeSong?.title === song.title && isPlaying && (
            <Equalizer isPlaying={isPlaying} />
          )}
          <PlayPause 
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
      </div>
      <img alt="song_img" src={song.images?.coverart} className="w-full h-full rounded-lg object-cover" />
    </div>

    <div className="mt-2 sm:mt-4 flex flex-col">
      <div className="flex justify-between items-center">
        <p className="font-semibold sm:text-lg text-sm text-white truncate flex-1 mr-1">
          <Link to={`/songs/${song?.key}`}>
          {song.title}
          </Link>
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleLikeSong(song));
          }}
          className="transition-transform duration-200 active:scale-125 focus:outline-none flex-shrink-0"
        >
          {isLiked ? (
            <AiFillHeart className="text-red-500 hover:text-red-400 sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]" />
          ) : (
            <AiOutlineHeart className="text-gray-400 hover:text-red-500 sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]" />
          )}
        </button>
      </div>
      <p className="sm:text-sm text-xs truncate text-gray-300 mt-0.5 sm:mt-1">
        <Link to={song.artists ? `/artists/${song?.
        artists[0]?.adamid}` : '/top-artists'}>
        {song.subtitle}
        </Link>
      </p>
    </div>
  </div>
  );
      };

export default SongCard;
