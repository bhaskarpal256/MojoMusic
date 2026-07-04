import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: '',
  likedSongs: localStorage.getItem('likedSongs') ? JSON.parse(localStorage.getItem('likedSongs')) : [],
  currentTheme: localStorage.getItem('currentTheme') || 'deep-blue',
  shortcutsHelpOpen: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;

      if (action.payload?.data?.tracks?.hits) {
        state.currentSongs = action.payload.data.tracks.hits;
      } else if (action.payload?.data?.properties) {
        state.currentSongs = action.payload?.data?.tracks;
      } else {
        state.currentSongs = action.payload.data;
      }

      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action) => {
      if (state.currentSongs[action.payload]?.track) {
        state.activeSong = state.currentSongs[action.payload]?.track;
      } else {
        state.activeSong = state.currentSongs[action.payload];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {
      if (state.currentSongs[action.payload]?.track) {
        state.activeSong = state.currentSongs[action.payload]?.track;
      } else {
        state.activeSong = state.currentSongs[action.payload];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },

    toggleLikeSong: (state, action) => {
      const song = action.payload;
      const index = state.likedSongs.findIndex((s) => s.key === song.key);
      if (index >= 0) {
        state.likedSongs = state.likedSongs.filter((s) => s.key !== song.key);
      } else {
        state.likedSongs.push(song);
      }
      localStorage.setItem('likedSongs', JSON.stringify(state.likedSongs));
    },

    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      localStorage.setItem('currentTheme', action.payload);
    },

    toggleShortcutsHelp: (state) => {
      state.shortcutsHelpOpen = !state.shortcutsHelpOpen;
    },
  },
});

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, toggleLikeSong, setTheme, toggleShortcutsHelp } = playerSlice.actions;

export default playerSlice.reducer;
