import { useParams, Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface JournalEntry {
  entry: string;
  created: Date;
  updated: Date;
}

interface SingleJournalEntryProps {
  journalEntries: JournalEntry[];
}

const SingleJournalEntry = ({ journalEntries }: SingleJournalEntryProps) => {
  const { index } = useParams<{ index: string }>();
  const entryIndex = parseInt(index ?? "0", 10);

  // Ensure ordering matches AllJournalEntries
  const reversedEntries = [...journalEntries].reverse();
  const entry = reversedEntries[entryIndex];

  if (!entry) {
    return <p>Journal entry not found.</p>;
  }

  return (
    <>
      <div>
        <h2 className="p-2">Single Journal Entry</h2>
      </div>
      <Card className="p-4">
        <p><strong>Entry:</strong> {entry.entry}</p>
        <p>Created At: {entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Last Updated: {entry.created.toLocaleDateString()}, {entry.updated.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}</p>
      </Card>
      <Link to="/journalEntries">
        <Button>Back to All Entries</Button>
      </Link>
    </>
  );
}

export default SingleJournalEntry;

