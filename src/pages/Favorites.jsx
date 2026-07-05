import React from 'react';
import { useSelector } from 'react-redux';
import { SongCard } from '../components';

const Favorites = () => {
  const { activeSong, isPlaying, likedSongs } = useSelector((state) => state.player);

  return (
    <div className="flex flex-col animate-fadeIn">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-4">
        Your Favorite Songs
      </h2>

      {likedSongs.length === 0 ? (
        <div className="flex justify-center items-center h-48 bg-white/5 rounded-xl border border-white/10 p-8 text-center">
          <p className="text-gray-400 text-lg">You haven't liked any songs yet. Heart some songs to see them here!</p>
        </div>
      ) : (
        <div className="flex flex-wrap sm:justify-start justify-center gap-4 sm:gap-6">
          {likedSongs.map((song, i) => (
            <SongCard
              key={song.key}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={likedSongs}
              i={i}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
