import { ArtistCard, Loader, Error } from '../components';
import { useGetTopChartsQuery } from '../redux/services/itunes';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading Top Artists" />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4
    mb-4">
        Top Artists
      </h2>

      <div className="flex flex-wrap sm:justify-start
    justify-center gap-4 sm:gap-6">
        {data?.map((track) => (
          <ArtistCard key={track.key} track={track} />
        ))}
      </div>

    </div>
  );
};
export default TopArtists;

