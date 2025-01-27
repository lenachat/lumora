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

interface User {
  uid: string;
  displayName: string;
}

interface JournalEntry {
  created: Date;
  entry: string;
  updated: Date;
}

const MainView = () => {
  const [user, setUser] = useState<User | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        if (user) {
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
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            {user ? <Dashboard user={user} journalEntries={journalEntries} setJournalEntries={setJournalEntries} /> : (<Navigate to="/login" />)}
          </>
        }
        >
        </Route>
        <Route path="/login" element={
          <>
            {user ? (<Navigate to="/" />) : <LoginView />}
          </>
        }
        />
        <Route path="/signup" element={
          <>
            {user ? (<Navigate to="/" />) : <SignupView />}
          </>
        }
        />
        <Route path='/journalEntries' element={user ? <AllJournalEntries journalEntries={journalEntries} /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index' element={user ? <SingleJournalEntry journalEntries={journalEntries} /> : <Navigate to="/login" />} />
        <Route path='/journalEntries/:index/edit' element={user ? <UpdateJournalEntry journalEntries={journalEntries} userId={user.uid} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );

};

export default MainView;
