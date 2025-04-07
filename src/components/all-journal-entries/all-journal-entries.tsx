import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import Navigation from '../navigation/navigation-bar';

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
      <div className="m-4 flex flex-row">
        <h1 className="w-32 flex-1">Lumora</h1>
        <div className="w-32 flex-1 place-items-end">
          <Navigation />
        </div>
      </div>
      <Link to="/">
        <Button className='m-4 p-4 float-start'>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="16. Previous" id="_16._Previous"><path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" /><path d="M14.768,6.36a1,1,0,0,0-1.408-.128l-6,5a1,1,0,0,0,0,1.536l6,5a1,1,0,1,0,1.28-1.536L9.562,12,14.64,7.768A1,1,0,0,0,14.768,6.36Z" /></g></svg>
        </Button>
      </Link>
      <h2 className="p-2 place-self-center">Your past entries</h2>
      <div>
        {[...journalEntries].reverse().map((entry, index) => (
          <div key={index}>
            <Link to={`/journalEntries/${index}`}>
              <Card className="p-4 w-1/2 place-self-center transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
                <div className="flex flex-row">
                  <p className='w-32 flex-1 font-thin'>{entry.created.toLocaleDateString()}, {entry.created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className='w-32 flex-1 place-items-end font-thin'>Last Updated: {entry.updated.toLocaleDateString()}, {entry.updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p className='line-clamp'>{entry.entry}</p>
              </Card>
            </Link>
            <br />
          </div>
        ))}
      </div>

    </>
  );
}
export default AllJournalEntries;