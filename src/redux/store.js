import { configureStore } from '@reduxjs/toolkit';

import playerReducer from './features/playerSlice';
import { itunesApi } from './services/itunes';

export const store = configureStore({
  reducer: {
    [itunesApi.reducerPath]: itunesApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(itunesApi.middleware),
});
