import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JournalEntry {
  title: string;
  entry: string;
  created: string;
  updated: string;
}

interface JournalEntriesState {
  journalEntries: JournalEntry[];
}

const initialState: JournalEntriesState = {
  journalEntries: [],
};

const journalEntriesSlice = createSlice({
  name: 'journalEntries',
  initialState,
  reducers: {
    setJournalEntries: (state, action: PayloadAction<JournalEntry[]>) => {
      state.journalEntries = action.payload;
    }
  },
});

export const { setJournalEntries } = journalEntriesSlice.actions;
export default journalEntriesSlice.reducer;