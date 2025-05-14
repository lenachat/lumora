import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from '../login-view/login-view';
import SignupView from '../signup-view/signup-view';
import Dashboard from '../dashboard/dashboard';
import AllJournalEntries from '../all-journal-entries/all-journal-entries';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import SingleJournalEntry from '../single-journal-entry/single-journal-entry';
import UpdateJournalEntry from '../update-journal-entry/update-journal-entry';
import ProfileView from '../profile-view/profile-view';
import AllFavoriteAffirmations from '../all-favorite-affirmations/all-favorite-affirmations';
import ResetPassword from '../reset-password/reset-password';
import { useDispatch } from 'react-redux';
import { setStreak } from '../../state/streak/streakSlice';
import { setUser } from '../../state/user/userSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

// interface User {
//   uid: string;
//   displayName: string;
// }

interface JournalEntry {
  title: string;
  created: Date;
  entry: string;
  updated: Date;
}

const MainView = () => {
  const user = useSelector((state: RootState) => state.user);

  const userId = user?.uid;

  // const [user, setUser] = useState<User | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  // const [streak, setStreak] = useState<number>(0);
  // const [favoriteAffirmations, setFavoriteAffirmations] = useState<{ id: string; affirmation: string }[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchJournalEntries = async () => {

      if (!userId) {
        console.error('User ID is not available.');
        return;
      }

      try {
        if (user?.uid) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const entries = (userData.journalEntries || []).map((entry: { created: { toDate: () => Date }; entry: string; updated: { toDate: () => Date } }) => ({
              ...entry,
              created: entry.created.toDate(),
              updated: entry.updated.toDate(),
            }));
            setJournalEntries(entries);
          } else {
            console.error('No user document found in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };

    fetchJournalEntries();
  }, [userId, user]);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            {userId ? (
              <Dashboard
                // user={user}
                journalEntries={journalEntries}
                setJournalEntries={setJournalEntries}
                calculateStreak={calculateStreak}
              // favoriteAffirmations={favoriteAffirmations}
              // setFavoriteAffirmations={setFavoriteAffirmations}
              />
            ) : (<Navigate to="/login" />)}
          </>
        }
        >
        </Route>
        <Route path="/login" element={
          <>
            {userId ? (<Navigate to="/" />) : <LoginView />}
          </>
        }
        />
        <Route path="/signup" element={
          <>
            {userId ? (<Navigate to="/" />) : <SignupView />}
          </>
        }
        />
        <Route path='/journalEntries' element={userId ? <AllJournalEntries journalEntries={journalEntries} /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index' element={userId ? <SingleJournalEntry journalEntries={journalEntries} setJournalEntries={setJournalEntries} /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index/edit' element={userId ? <UpdateJournalEntry journalEntries={journalEntries} setJournalEntries={setJournalEntries} /> : <Navigate to="/login" />} />
        <Route path='/profile' element={userId ? <ProfileView /> : <Navigate to="/login" />} />
        <Route path='/favoriteAffirmations' element={userId ? <AllFavoriteAffirmations /> : <Navigate to="/login" />} />
        <Route path='/reset-password' element={userId ? <Navigate to="/" /> : <ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );

};

export default MainView;
