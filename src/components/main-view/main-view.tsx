import { useEffect } from 'react';
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
import { setJournalEntries } from '../../state/journalEntries/journalEntriesSlice';

const MainView = () => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user?.uid;
  const journalEntries = useSelector((state: RootState) => state.journalEntries.journalEntries);
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

            const entries = (userData.journalEntries || []).map((entry: { created: { toDate: () => Date }; entry: string; updated: { toDate: () => Date } }) => {
              const created = typeof entry.created === 'string'
                ? entry.created
                : entry.created?.toDate?.().toISOString(); // fallback for old entries

              const updated = typeof entry.updated === 'string'
                ? entry.updated
                : entry.updated?.toDate?.().toISOString();

              return {
                ...entry,
                created,
                updated,
              };
            });
            dispatch(setJournalEntries(entries));
          } else {
            console.error('No user document found in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };

    fetchJournalEntries();
  }, [userId, user, dispatch]);

  const calculateStreak = (dates: Date[]): number => {
    const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
    // Remove duplicate dates
    const uniqueDates = sorted.filter((entry, index, self) =>
      index === self.findIndex((e) => e.toDateString() === entry.toDateString())
    );
    let currentStreak = 0;
    const today = new Date();
    const hasToday = uniqueDates.some(date => date.toDateString() === today.toDateString());
    const baseDate = hasToday ? today : new Date(today.setDate(today.getDate() - 1));
    const expectedDate = new Date(baseDate); // expected date for the streak comparison

    for (let i = 0; i < uniqueDates.length; i++) {
      expectedDate.setDate(today.getDate() - i); // Set expected date to today minus i days (i=0 for today, i=1 for yesterday, etc.)
      if (uniqueDates[i].toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  };

  // Trigger streak calculation when the user logs in or journal entries update.
  useEffect(() => {
    if (user) {
      const createdDates = journalEntries.map(entry => new Date(entry.created));
      const streakCalculated = calculateStreak(createdDates);
      dispatch(setStreak(streakCalculated));
    }
  }, [user, journalEntries, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            {userId ? (
              <Dashboard
                calculateStreak={calculateStreak}
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
        <Route path='/journalEntries' element={userId ? <AllJournalEntries /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index' element={userId ? <SingleJournalEntry /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index/edit' element={userId ? <UpdateJournalEntry /> : <Navigate to="/login" />} />
        <Route path='/profile' element={userId ? <ProfileView /> : <Navigate to="/login" />} />
        <Route path='/favoriteAffirmations' element={userId ? <AllFavoriteAffirmations /> : <Navigate to="/login" />} />
        <Route path='/reset-password' element={userId ? <Navigate to="/" /> : <ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );

};

export default MainView;
