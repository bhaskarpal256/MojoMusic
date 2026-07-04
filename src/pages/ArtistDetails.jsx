import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs} from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';

import { useGetArtistDetailsQuery } from '../redux/services/itunes';


const ArtistDetails = () => {
    const dispatch = useDispatch();
    const { id: artistId } = useParams();
    const { activeSong, isPlaying } = useSelector((state) => state.player);
    const { data: artistData, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery(artistId);

    const handlePauseClick = () => {
        dispatch(playPause(false));
      };
    
      const handlePlayClick = (song, i) => {
        dispatch(setActiveSong({ song, data: Object.values(artistData?.songs), i }));
        dispatch(playPause(true));
      };

    if (isFetchingArtistDetails) return <Loader title="Loading artist details"/>;

    if (error) return <Error/>;

    return (
        <div className=" flex flex-col">
         <DetailsHeader 
         artistId={artistId} 
         artistData={artistData}
         />
        
        <RelatedSongs
          data={Object.values(artistData?.songs)}
          artistId={artistId}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
        </div>
    );
};

export default ArtistDetails;

