import { Card } from '../ui/card';
// import { Button } from '../ui/button';
// import { Link } from 'react-router-dom';
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
      <h2 className="p-2 place-self-center">Last 4 Journal Entries in Dashboard</h2>
      <div>
        {journalEntries.slice(-4).reverse().map((entry, index) => ( // Show only the last 4 entries
          <Card key={index} className="p-4 m-2 transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
            <div className="flex flex-row">
              <p className='w-32 flex-1 font-thin'>{entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className='w-32 flex-1 place-items-end font-thin'>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p className='line-clamp'>{entry.entry}</p>
          </Card>
        ))}
      </div>
      {/* <Link to="/journalEntries">
        <Button>See all entries</Button>
      </Link> */}
    </>
  );

};

export default JournalEntriesView;