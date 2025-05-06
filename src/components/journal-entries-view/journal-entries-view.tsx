import { Card } from '../ui/card';
import './journal-entries-view.css';
import { Link } from 'react-router-dom';

interface JournalEntries {
  title: string;
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
      <h2 className="mb-3 mt-6 place-self-center">All Journal Entries</h2>
      <div>
        {journalEntries
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) // Sort by created date in descending order
          .slice(0, 4)
          .map((entry, index) => ( // Show only the last 4 entries
            <Link to={`/journalEntries/${index}`}>
              <Card key={index} className="p-4 m-2 rounded-[25px] transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
                <div className="flex justify-end">
                  <p className='text-right text-light text-sm font-thin mr-3'>
                    {entry.created.toLocaleDateString()}
                  </p>
                  {/* <p className='w-32 flex-1 place-items-end font-thin'>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> */}
                </div>
                <h3 className='text-xl mt-1 mb-2 ml-3 mr-3'>{entry.title}</h3>
                <p className='line-clamp ml-3 mr-3 mb-2'>{entry.entry}</p>
              </Card>
            </Link>
          ))}
      </div>
    </>
  );

};

export default JournalEntriesView;