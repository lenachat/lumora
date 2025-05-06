import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import Navigation from '../navigation/navigation-bar';

interface FavoriteAffirmationsProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
}

const AllFavoriteAffirmations = ({ favoriteAffirmations }: FavoriteAffirmationsProps) => {
  return (

    <>
      <div className="flex flex-col ml-8 mr-8">

        <Navigation />

        <h2 className="p-2 place-self-center">Your favorite Affirmations</h2>

        <div>
          <Link to="/">
            <Button className='m-4 p-4 float-start'>
              <img src="/../../../files/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>
          {favoriteAffirmations.map((affirmation) => (
            <Card
              key={affirmation.id}
              className="p-4 mb-6 rounded-[25px] mt-4 w-1/2 place-self-center border-none transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md"
            >
              <p className="line-clamp-3 ml-3 mr-3 mb-2">{affirmation.affirmation}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
export default AllFavoriteAffirmations;