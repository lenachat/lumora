import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import './journal-entries-view.css';

interface JournalEntries {
  entry: string;
  created: Date;
  updated: Date;
}

interface JournalEntriesList {
  journalEntries: JournalEntries[];
}

const JournalEntriesView = ({ journalEntries }: JournalEntriesList) => {
  return (
    <>
      <div>
        {journalEntries.slice(-4).reverse().map((entry, index) => ( // Show only the last 4 entries
          <Card key={index} className="p-4">
            <p className='line-clamp'><strong>Entry:</strong> {entry.entry}</p>
            <p>Created At: {entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </Card>
        ))}
      </div>
      <Link to="/journalEntries">
        <Button>See all entries</Button>
      </Link>
    </>
  );

};

export default JournalEntriesView;