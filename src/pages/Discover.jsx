import { useDispatch, useSelector } from 'react-redux';


import { Error, Loader, SongCard } from '../components';
import { genres } from '../assets/constants';
import { useGetTopChartsQuery, useGetSongsByGenreQuery } from '../redux/services/itunes';
import { selectGenreListId } from '../redux/features/playerSlice';


const Discover = () => {
    const dispatch = useDispatch();
    const { activeSong, isPlaying, genreListId } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetSongsByGenreQuery(genreListId || 'POP');

    if (isFetching) return <Loader title="Loading songs..." />;

    if (error) return <Error />;

    const genreTitle = genres.find(({ value }) => value === genreListId)?.title;

    return (
        <div className="flex flex-col">
            <div className="w-full flex justify-between items-center
            sm:flex-row flex-col mt-4 mb-10">
                <h2 className="font-bold text-3xl text-white
                text-left">Discover {genreTitle}</h2>
                <div className="relative sm:mt-0 mt-5">
                    <select
                        onChange={(e) => dispatch(selectGenreListId(e.target.value))}
                        value={genreListId || 'pop'}
                        className="appearance-none bg-black text-gray-300 p-3 pr-10 text-sm rounded-lg outline-none cursor-pointer"
                    >
                        {genres.map((genre) => <option key={genre.value}
                            value={genre.value}>{genre.title}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap sm:justify-start justify-center gap-4 sm:gap-6">
                {data?.map((song, i) => (
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

export default Discover;
