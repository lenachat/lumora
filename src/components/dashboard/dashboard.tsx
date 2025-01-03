import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entry-form/journal-entry-form";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import JournalEntriesView from "../journal-entries-view/journal-entries-view";
import { Card } from "../ui/card";
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

interface User {
  displayName: string;
  uid: string;
  journalEntries: Array<{ created: Date; entry: string; updated: Date }>;
}
interface JournalEntry {
  entry: string;
  created: Date;
  updated: Date;
}

const Dashboard = ({ user }: { user: User }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };

    fetchJournalEntries();
  }, [user.uid]);

  return (
    <>
      <div className="m-4">
        <Navigation />
      </div>
      <Card className="m-4">
        <h1 className="p-4">Welcome {user.displayName}!</h1>
        <Card className="m-4 p-4">
          <DailyAffirmation />
        </Card>
        <Card className="m-4 p-4 w-5/12">
          <JournalEntryForm user={user} journalEntries={journalEntries}
          setJournalEntries={setJournalEntries} />
        </Card>
        <Card className="m-4 p-4 w-5/12">
          <JournalEntriesView journalEntries={journalEntries} />
        </Card>
      </Card>
    </>
  );
};

export default Dashboard;