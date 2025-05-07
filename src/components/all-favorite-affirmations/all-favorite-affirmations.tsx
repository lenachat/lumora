import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import Navigation from "../navigation/navigation-bar";
import { db } from "../../firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

interface FavoriteAffirmationsProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
  setFavoriteAffirmations: (favs: { id: string; affirmation: string }[]) => void;
}

const AllFavoriteAffirmations = ({
  favoriteAffirmations,
  setFavoriteAffirmations,
}: FavoriteAffirmationsProps) => {
  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).uid : null;

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
      setFavoriteAffirmations(newFavorites);
      localStorage.setItem("favoriteAffirmations", JSON.stringify(newFavorites));
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  return (
    <>
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />
        <h2 className="p-2 place-self-center">Your favorite Affirmations</h2>

        <div>
          <Link to="/">
            <Button className="m-4 p-4 float-start">
              <img src="/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>

          {favoriteAffirmations.map((affirmation) => (
            <Card
              key={affirmation.id}
              className="p-6 mb-6 rounded-[25px] mt-4 w-1/2 place-self-center border-none relative">
              <p className="line-clamp-3 ml-3 mr-3 mb-2">{affirmation.affirmation}</p>
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
