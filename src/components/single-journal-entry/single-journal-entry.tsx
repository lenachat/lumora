import { useParams, Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Navigation from '../navigation/navigation-bar';

interface User {
  displayName: string;
  uid: string;
}

interface JournalEntry {
  entry: string;
  created: Date;
  updated: Date;
}

interface SingleJournalEntryProps {
  journalEntries: JournalEntry[];
  user: User;
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
}

const SingleJournalEntry = ({ user, journalEntries, setJournalEntries }: SingleJournalEntryProps) => {
  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();
  const entryIndex = parseInt(index ?? "0", 10);

  const reverseIndex = journalEntries.length - 1 - entryIndex;

  const entry = journalEntries[reverseIndex];

  if (!entry) {
    return <p>Journal entry not found.</p>;
  }

  const handleDeleteEntry = async () => {
    // Filter out the selected journal entry
    const updatedJournalEntries = [...journalEntries]
    updatedJournalEntries.splice(reverseIndex, 1); // Remove the entry at the reverse index

    // Get the Firestore document reference
    const userDocRef = doc(db, 'users', user.uid);

    try {
      // Update the Firestore document
      await updateDoc(userDocRef, { journalEntries: updatedJournalEntries.reverse() });
      alert("Journal entry deleted successfully!");
      navigate(`/journalEntries`);
      setJournalEntries(updatedJournalEntries); // Update the local state
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  return (
    <>
      <div className="m-4 flex flex-row">
        <h1 className="w-32 flex-1">Lumora</h1>
        <div className="w-32 flex-1 place-items-end">
          <Navigation />
        </div>
      </div>
      <Link to="/journalEntries">
        <Button className='m-4 p-4 float-start'>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="16. Previous" id="_16._Previous"><path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" /><path d="M14.768,6.36a1,1,0,0,0-1.408-.128l-6,5a1,1,0,0,0,0,1.536l6,5a1,1,0,1,0,1.28-1.536L9.562,12,14.64,7.768A1,1,0,0,0,14.768,6.36Z" /></g></svg>
        </Button>
      </Link>
      <Card className="p-4 w-1/2 place-self-center">
        <h2 className="p-2 place-self-center">Single yournal entry</h2>
        <div className="flex flex-row">
          <p className='w-32 flex-1 font-thin'>{entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className='w-32 flex-1 place-items-end font-thin'>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <p>{entry.entry}</p>
        <div className="flex flex-row">
          <Link to={`/journalEntries/${index}/edit`} className="w-32 flex-1">
            <Button>Edit</Button>
          </Link>
          <Button onClick={handleDeleteEntry} className='w-16 flex'>Delete</Button>
        </div>
      </Card>
    </>
  );
}

export default SingleJournalEntry;

