import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import Navigation from '../navigation/navigation-bar';

interface JournalEntries {
  title: string;
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
      <div className="flex flex-col md:ml-8 md:mr-8">
        <Navigation />
        <div className="md:hidden flex items-center">
          <Link to="/">
            <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
              <img src="/back.svg" alt="Back button" className="w-8 h-8" />
            </Button>
          </Link>
          <h2 className="p-2 absolute left-1/2 transform -translate-x-1/2 text-center">My past Entries</h2>
        </div>
        <div>
          <div className="hidden md:block">
            <h2 className="p-2 place-self-center">My past Entries</h2>
            <Link to="/">
              <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
                <img src="/back.svg" alt="Back button" className="w-8 h-8" />
              </Button>
            </Link>
          </div>
          {[...journalEntries]
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) // Sort by created date in descending order
            .map((entry, index) => (
              <div key={index}>
                <Card className="p-4 mb-4 md:mb-6 rounded-[25px] mt-4 w-10/12 md:w-1/2 mx-auto border-none transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
                  <Link to={`/journalEntries/${index}`}>
                    <div className="md:flex md:justify-between">
                      <p className='text-left text-light text-sm font-thin ml-3 mr-3'>
                        {entry.created.toLocaleDateString()}
                      </p>
                      <p className='md:text-right text-light text-sm font-thin ml-3 mr-3'>
                        Last Updated: {entry.updated.toLocaleDateString()}
                      </p>
                    </div>
                    <h3 className='text-xl mt-1 mb-2 ml-3 mr-3'>{entry.title}</h3>
                    <p className='line-clamp ml-3 mr-3 mb-2 whitespace-pre-wrap'>{entry.entry}</p>
                  </Link>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
export default AllJournalEntries;