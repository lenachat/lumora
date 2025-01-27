import { useParams, Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Make sure to import your Firebase config

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
      <div>
        <h2 className="p-2">Single Journal Entry</h2>
      </div>
      <Card className="p-4">
        <p><strong>Entry:</strong> {entry.entry}</p>
        <p>Created At: {entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </Card>
      <Link to="/journalEntries">
        <Button>Back to All Entries</Button>
      </Link>
      <Link to={`/journalEntries/${index}/edit`}>
        <Button>Edit Journal Entry</Button>
      </Link>
      <Button onClick={handleDeleteEntry}>Delete Journal Entry</Button>
    </>
  );
}

export default SingleJournalEntry;

