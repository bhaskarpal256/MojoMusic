import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const itunesGenreMap = {
  POP: '14',
  HIP_HOP_RAP: '18',
  DANCE: '17',
  ELECTRONIC: '7',
  SOUL_RNB: '15',
  ALTERNATIVE: '20',
  ROCK: '21',
  LATIN: '12',
  FILM_TV: '16',
  COUNTRY: '6',
  WORLDWIDE: '19',
  REGGAE_DANCE_HALL: '24',
  HOUSE: '1007',
  K_POP: '51',
};

const mapITunesTrackToShazam = (track) => {
  if (!track) return null;
  const coverUrl = track.artworkUrl100 || '';
  const highResCoverUrl = coverUrl.replace('100x100bb', '500x500bb');
  return {
    ...track,
    key: track.trackId?.toString(),
    title: track.trackName,
    subtitle: track.artistName,
    images: {
      coverart: highResCoverUrl,
      background: highResCoverUrl,
    },
    artists: [{ adamid: track.artistId?.toString() || '1' }],
    hub: {
      actions: [
        {},
        { uri: track.previewUrl || '' }
      ]
    }
  };
};

const mapITunesRSSEntryToShazam = (entry) => {
  if (!entry) return null;
  
  const trackId = entry.id?.attributes?.['im:id'];
  const trackName = entry['im:name']?.label || '';
  const artistName = entry['im:artist']?.label || '';
  
  const artistHref = entry['im:artist']?.attributes?.href || '';
  const artistIdMatch = artistHref.match(/artist\/.*\/(\d+)/) || artistHref.match(/artist\/(\d+)/);
  const artistId = artistIdMatch ? artistIdMatch[1] : '1';
  
  const coverUrl = entry['im:image']?.[2]?.label || entry['im:image']?.[0]?.label || '';
  const highResCoverUrl = coverUrl
    .replace('170x170bb', '500x500bb')
    .replace('55x55bb', '500x500bb')
    .replace('60x60bb', '500x500bb');
  
  const previewLink = entry.link?.find(l => l.attributes?.title === 'Preview' || l.attributes?.rel === 'enclosure');
  const previewUrl = previewLink ? previewLink.attributes?.href : '';
  
  return {
    key: trackId?.toString(),
    title: trackName,
    subtitle: artistName,
    images: {
      coverart: highResCoverUrl,
      background: highResCoverUrl,
    },
    artists: [{ adamid: artistId.toString() }],
    hub: {
      actions: [
        {},
        { uri: previewUrl || '' }
      ]
    }
  };
};

export const itunesApi = createApi({
  reducerPath: 'itunesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://itunes.apple.com',
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => '/us/rss/topsongs/limit=50/json',
      transformResponse: (response) => {
        const entries = response.feed?.entry || [];
        return entries.map(mapITunesRSSEntryToShazam);
      },
    }),
    getSongsByGenre: builder.query({
      query: (genre) => {
        const genreId = itunesGenreMap[genre] || '14';
        return `/us/rss/topsongs/limit=50/genre=${genreId}/json`;
      },
      transformResponse: (response) => {
        const entries = response.feed?.entry || [];
        return entries.map(mapITunesRSSEntryToShazam);
      },
    }),
    getSongDetails: builder.query({
      query: ({ songid }) => `/lookup?id=${songid}`,
      transformResponse: (response) => {
        const track = response.results?.[0];
        const baseMapped = mapITunesTrackToShazam(track);
        return {
          ...baseMapped,
          sections: [
            { type: 'TITLE', text: [] },
            { type: 'LYRICS', text: ['Lyrics are not available for this track.'] }
          ]
        };
      },
    }),
    getSongsRelated: builder.query({
      async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
        const { songid } = args;
        const trackResult = await fetchWithBQ(`/lookup?id=${songid}`);
        if (trackResult.error) return { error: trackResult.error };
        const artistId = trackResult.data?.results?.[0]?.artistId;
        if (!artistId) return { data: [] };
        
        const relatedResult = await fetchWithBQ(`/lookup?id=${artistId}&entity=song&limit=20`);
        if (relatedResult.error) return { error: relatedResult.error };
        
        // results[0] is the artist, results[1..] are tracks
        const tracks = relatedResult.data?.results?.slice(1) || [];
        const mapped = tracks.map(mapITunesTrackToShazam);
        return { data: mapped };
      },
    }),
    getArtistDetails: builder.query({
      async queryFn(artistId, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`/lookup?id=${artistId}&entity=song&limit=20`);
        if (result.error) return { error: result.error };

        const results = result.data?.results || [];
        const artist = results[0];
        const songs = results.slice(1) || [];
        
        const mappedSongs = songs.map((song) => {
          const base = mapITunesTrackToShazam(song);
          return {
            ...base,
            attributes: {
              name: song.trackName,
              albumName: song.collectionName || '',
              artwork: {
                url: base?.images?.coverart || ''
              }
            }
          };
        });

        const artworkUrl = mappedSongs[0]?.images?.coverart || '';

        return {
          data: {
            artists: {
              [artistId]: {
                attributes: {
                  name: artist?.artistName || 'Unknown Artist',
                  artwork: {
                    url: artworkUrl
                  },
                  genreNames: [artist?.primaryGenreName || 'Music']
                }
              }
            },
            songs: mappedSongs
          }
        };
      },
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => {
        const country = countryCode?.toLowerCase() || 'us';
        return `/${country}/rss/topsongs/limit=50/json`;
      },
      transformResponse: (response) => {
        const entries = response.feed?.entry || [];
        return entries.map(mapITunesRSSEntryToShazam);
      },
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => `/search?term=${searchTerm}&entity=song&limit=50`,
      transformResponse: (response) => {
        const tracks = response.results || [];
        return tracks.map(mapITunesTrackToShazam);
      },
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongsRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
} = itunesApi;
