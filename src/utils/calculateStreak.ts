
// Streak calculation
const calculateStreak = (dates: Date[]): number => {
  // Sort the dates in descending order
  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());

  // Remove duplicate dates
  const uniqueDates = sorted.filter((entry, index, self) =>
    index === self.findIndex((e) => e.toDateString() === entry.toDateString())
  );

  // Initialize streak count and today's date to compare streak to
  let currentStreak = 0;
  const today = new Date();

  // Check if the first date is today
  const hasToday = uniqueDates.some(date => date.toDateString() === today.toDateString());

  // if there's no entry for today, use yesterday's date as base for streak calculation
  const baseDate = hasToday ? today : new Date(today.setDate(today.getDate() - 1));

  const expectedDate = new Date(baseDate); // expected date for the streak comparison

  for (let i = 0; i < uniqueDates.length; i++) {
    expectedDate.setDate(today.getDate() - i); // Set expected date to today minus i days (i=0 for today, i=1 for yesterday, etc.)
    if (uniqueDates[i].toDateString() === expectedDate.toDateString()) { //if true, streak continues
      currentStreak++;
    } else {
      break; // Stop if the streak is broken
    }
  }
  return currentStreak;
};

// Trigger streak calculation when the user logs in or journal entries update.
useEffect(() => {
  if (user) {
    const createdDates = journalEntries.map(entry => entry.created);
    const streakCalculated = calculateStreak(createdDates);

    // setStreak(streakCalculated);
    dispatch(setStreak(streakCalculated)); // Update the streak in the Redux store
  }
}, [user, journalEntries]);