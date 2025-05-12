import { Card } from "../ui/card";
import { Link } from "react-router-dom";

interface FavoriteAffirmationsProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
}

const FavoriteAffirmations = ({ favoriteAffirmations }: FavoriteAffirmationsProps) => {

  return (
    <div>
      <h2 className="mt-3 mb-1 md:mb-3 md:mt-6 place-self-center text-center">Fav Affirmations</h2>
      <ul>
        {favoriteAffirmations.slice(0, 4).map((fav: { affirmation: string }, index: number) => {
          return (
            <Link to={`/favoriteAffirmations`}>
              <Card
                key={index}
                className="p-2 m-1 mt-2 md:p-4 md:m-2 rounded-2xl md:rounded-[25px] transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md"
              >
                <li className="pl-2 pr-2 pt-1 pb-1">
                  {fav.affirmation}
                </li>
              </Card>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoriteAffirmations;
