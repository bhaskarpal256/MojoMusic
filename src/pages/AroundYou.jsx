import { useState, useEffect } from 'react';
import axios from 'axios';
import { Error, Loader, SongCard } from '../components';
import { useSelector } from 'react-redux';
import { useGetSongsByCountryQuery } from '../redux/services/itunes';

const AroundYou = () => {
const [country, setCountry] = useState('');
const [loading, setLoading] = useState(true);
const { activeSong, isPlaying } = useSelector((state) => state.player);
const { data, isFetching , error } = useGetSongsByCountryQuery(country);

console.log(country);

useEffect(() => {
  axios.get(`https://ipinfo.io/json`)
    .then((res) => setCountry(res?.data?.country || 'US'))
    .catch((err) => {
      console.log(err);
      setCountry('US');
    })
    .finally(() => setLoading(false));
}, []);

    if(isFetching && loading) return <Loader title="Loading songs around you" />;

    if(error && country) return <Error />;
    
return (
  <div className="flex flex-col">
    <h2 className="font-bold text-3xl text-white text-left mt-4
    mb-10">
        Around You :<span className="font-black">{country}</span>
        </h2>
    
    <div className="flex flex-wrap sm:justify-start
    justify-center gap-4 sm:gap-6">
        {data?.map((song,i) => (
            <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}

             />
        ))}
    </div>
    
  </div>
);
};
export default AroundYou;
