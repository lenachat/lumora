import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface JournalEntries {
  entry: string;
  created: Date;
  updated: Date;
}

interface JournalEntriesList {
  journalEntries: JournalEntries[];
}

const AllJournalEntries = ({ journalEntries }: JournalEntriesList) => {
  return (
    <>
      <h2 className="p-2">Your Journal Entries</h2>
      <div>
        {[...journalEntries].reverse().map((entry, index) => (
          <div key={index}>
            <Link to={`/journalEntries/${index}`}>
              <Card className="p-4">
                <p className='line-clamp'><strong>Entry:</strong> {entry.entry}</p>
                <p>Created At: {entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </Card>
            </Link>
            <br />
          </div>
        ))}
      </div>
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </>
  );
}
export default AllJournalEntries;