import { Link } from 'react-router-dom';

const DetailsHeader = ({ artistId, artistData, songData }) => {
  const artist = artistData?.artists?.[artistId]?.attributes;

  return (
    <div className="relative w-full flex flex-col">
      <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" />

      <div className="absolute inset-0 flex items-center px-4 sm:px-0">
        <img 
          alt="art"
          src={artistId ? artist?.artwork?.url : songData?.images?.coverart}
          className="sm:w-48 w-24 sm:h-48 h-24 rounded-full object-cover border-2 shadow-xl shadow-black"
        />
        <div className="ml-5 flex-1 min-w-0">
          <p className="font-bold sm:text-3xl text-xl text-white break-words line-clamp-2 pr-4">
            {artistId ? artist?.name : songData?.title}
          </p>
          {!artistId && songData?.artists?.[0]?.adamid && (
            <Link to={`/artists/${songData?.artists[0].adamid}`}>
              <p className="text-base text-gray-400 mt-2 hover:text-cyan-400 truncate">
                {songData?.subtitle}
              </p>
            </Link>
          )}

          <p className="text-base text-gray-400 mt-2 truncate">
            {artistId ? artist?.genreNames?.[0] : songData?.genres?.primary}
          </p>
        </div>
      </div>
      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};

export default DetailsHeader;
