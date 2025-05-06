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
      <div className="flex flex-col ml-8 mr-8">

        <Navigation />

        <h2 className="p-2 place-self-center">Your past entries</h2>

        <div>
          <Link to="/">
            <Button className='m-4 p-4 float-start'>
              <img src="/../../../files/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>
          {[...journalEntries]
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) // Sort by created date in descending order
            .map((entry, index) => (
              <div key={index}>
                <Card className="p-4 mb-6 rounded-[25px] mt-4 w-1/2 place-self-center border-none transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md">
                  <Link to={`/journalEntries/${index}`}>
                    <div className="flex justify-between">
                      <p className='text-left text-light text-sm font-thin ml-3 mr-3'>
                        {entry.created.toLocaleDateString()}
                      </p>
                      <p className='text-right text-light text-sm font-thin ml-3 mr-3'>
                        Last Updated: {entry.updated.toLocaleDateString()}
                      </p>
                    </div>
                    <h3 className='text-xl mt-1 mb-2 ml-3 mr-3'>{entry.title}</h3>
                    <p className='line-clamp ml-3 mr-3 mb-2'>{entry.entry}</p>
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