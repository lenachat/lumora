import { Card } from "../ui/card";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";


// interface FavoriteAffirmationsProps {
//   favoriteAffirmations: { id: string; affirmation: string }[];
// }

const FavoriteAffirmations = () => {
  const favoriteAffirmations = useSelector(
    (state: RootState) => state.favoriteAffirmations.favoriteAffirmations
  );

  return (
    <div>
      <h2 className="mb-3 mt-6 place-self-center text-center">Fav Affirmations</h2>
      <ul>
        {favoriteAffirmations.slice(0, 4).map((fav: { affirmation: string }, index: number) => {
          return (
            <Link to={`/favoriteAffirmations`}>
              <Card
                key={index}
                className="p-4 m-2 mt-2 rounded-[25px] transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md"
              >
                <li className="pl-2 pr-2 pt-1 pb-1" key={index}>
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
