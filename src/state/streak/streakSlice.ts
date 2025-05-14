import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StreakState {
  streak: number;
}

const initialState: StreakState = {
  streak: 0,
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    setStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload;
    }
  },
});

export const { setStreak } = streakSlice.actions;

export default streakSlice.reducer;