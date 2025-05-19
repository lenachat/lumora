import { Card } from '../ui/card';
import './journal-entries-view.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const JournalEntriesView = () => {
  const journalEntries = useSelector((state: RootState) => state.journalEntries.journalEntries);
  return (
    <>
      <h2 className="mt-6 mb-3 text-center">My past Entries</h2>
      <div>
        <ul>
          {[...journalEntries] 
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) // Sort by created date in descending order
            .slice(0, 4) // Show only the last 4 entries
            .map((entry, index) => ( 
              <Link to={`/journalEntries/${index}`} key={index}>
                <Card className="p-4 m-2 mt-2 rounded-[25px] transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
                  <div className="flex justify-between">
                    <h3 className='font-bold md:text-xl pl-2 pr-2 mt-1 mb-2 md:ml-3 md:mr-3'>{entry.title}</h3>
                    <p className='text-right text-light text-sm font-thin p-1 mr-1 md:mr-3'>
                      {new Date(entry.created).toLocaleDateString()}
                    </p>
                  </div>
                  <p className='line-clamp md:ml-3 md:mr-3 pl-2 pr-2 mb-2 whitespace-pre-wrap'>{entry.entry}</p>
                </Card>
              </Link>
            ))}
        </ul>
      </div>
    </>
  );

};

export default JournalEntriesView;