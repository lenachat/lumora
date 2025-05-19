import { configureStore } from '@reduxjs/toolkit';
import streakReducer from './streak/streakSlice';
import favoriteAffirmationsReducer from './favoriteAffirmations/favoriteAffirmationsSlice';
import userReducer from './user/userSlice';
import journalEntriesReducer from './journalEntries/journalEntriesSlice';

export const store = configureStore({
  reducer: {
    streak: streakReducer,
    favoriteAffirmations: favoriteAffirmationsReducer,
    user: userReducer,
    journalEntries: journalEntriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;