import { useNavigate } from "react-router-dom";


const ArtistCard = ({ track }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-[calc(50%-8px)] sm:w-[200px] p-2 sm:p-4 bg-white/5
    bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg
    cursor-pointer group hover:bg-white/10 transition-all duration-300" onClick={() => navigate(`/artists/${track?.artists[0].adamid}`)}>
      <img alt="artist" src={track?.images?.coverart}
      className="w-full h-36 sm:h-44 rounded-lg object-cover" />
      <p className="mt-2 sm:mt-4 font-semibold sm:text-lg text-sm text-white
      truncate">{track?.subtitle}</p>
    </div>
  );
};

export default ArtistCard;
