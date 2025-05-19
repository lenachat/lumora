import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import Navigation from "../navigation/navigation-bar";
import { db } from "../../firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setFavoriteAffirmations } from "../../state/favoriteAffirmations/favoriteAffirmationsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

// interface FavoriteAffirmationsProps {
//   favoriteAffirmations: { id: string; affirmation: string }[];
//   setFavoriteAffirmations: (favs: { id: string; affirmation: string }[]) => void;
// }

const AllFavoriteAffirmations = () => {
  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).uid : null;

  const favoriteAffirmations = useSelector(
    (state: RootState) => state.favoriteAffirmations.favoriteAffirmations
  );

  const dispatch = useDispatch();

  const handleUnfavorite = async (affirmationId: string) => {
    if (!userId) return;

    const toRemove = favoriteAffirmations.find((fav) => fav.id === affirmationId);
    if (!toRemove) return;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        favoriteAffirmations: arrayRemove(toRemove),
      });

      const newFavorites = favoriteAffirmations.filter((fav) => fav.id !== affirmationId);
      dispatch(setFavoriteAffirmations(newFavorites));
      localStorage.setItem("favoriteAffirmations", JSON.stringify(newFavorites));
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

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
          <h2 className="p-2 absolute left-1/2 transform -translate-x-1/2 text-center">My favorite Affirmations</h2>
        </div>

        <div>
          <div className="hidden md:block">
            <h2 className="p-2 place-self-center">My favorite Affirmations</h2>
            <Link to="/">
              <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
                <img src="/back.svg" alt="Back button" className="w-8 h-8" />
              </Button>
            </Link>
          </div>

          {favoriteAffirmations.map((affirmation) => (
            <Card
              key={affirmation.id}
              className="p-4 mb-4 md:mb-6 rounded-[25px] mt-4 w-10/12 md:w-1/2 mx-auto border-none relative">
              <p className="line-clamp-3 ml-3 mr-3 mb-2 mt-4">{affirmation.affirmation}</p>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleUnfavorite(affirmation.id)}
                  className=" border-none hover:bg-base"
                >
                  <img
                    src="/heart-filled.svg"
                    alt="Unfavorite"
                    className="w-6 h-6"
                  />
                </Button>
              </div>

            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllFavoriteAffirmations;
