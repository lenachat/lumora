import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteAffirmationsState {
  favoriteAffirmations: { affirmation: string; id: string }[];
}

const initialState: FavoriteAffirmationsState = {
  favoriteAffirmations: [],
};

const favoriteAffirmationsSlice = createSlice({
  name: 'favoriteAffirmations',
  initialState,
  reducers: {
    setFavoriteAffirmations: (state, action: PayloadAction<{ affirmation: string; id: string }[]>) => {
      state.favoriteAffirmations = action.payload;
    },
  },
});

export const { setFavoriteAffirmations } = favoriteAffirmationsSlice.actions;

export default favoriteAffirmationsSlice.reducer;