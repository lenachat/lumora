import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";

interface DailyAffirmationProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
  setFavoriteAffirmations: (favs: { id: string; affirmation: string }[]) => void;
}

const DailyAffirmation = ({ favoriteAffirmations, setFavoriteAffirmations }: DailyAffirmationProps) => {
  const [affirmation, setAffirmation] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).uid : null;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
    const savedAffirmation = localStorage.getItem("dailyAffirmation");
    const savedDate = localStorage.getItem("affirmationDate");

    if (savedAffirmation && savedDate === today) {
      // Use cached affirmation
      setAffirmation(savedAffirmation);
    } else {
      // Fetch data from the proxied affirmations API
      const fetchAffirmation = async () => {
        try {
          const response = await fetch("/affirmations.json");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: string[] = await response.json();
          const randomAffirmation = data[Math.floor(Math.random() * data.length)]; // Pick a random affirmation
          setAffirmation(randomAffirmation);
          console.log("Fetched affirmation:", randomAffirmation);

          localStorage.setItem("dailyAffirmation", randomAffirmation);
          localStorage.setItem("affirmationDate", today);
        } catch (error) {
          console.error("Error fetching affirmation:", error);
        }
      };
      fetchAffirmation();
    }
  }, []);

  // Check if affirmation is favorite
  useEffect(() => {
    const isFav = favoriteAffirmations.some(fav => fav.affirmation === affirmation);
    setIsFavorite(isFav);
  }, [affirmation, favoriteAffirmations]);


  const toggleFavorite = async () => {
    if (!affirmation || !userId) return;

    const userDocRef = doc(db, "users", userId);
    const updatedFavorites = [...favoriteAffirmations];

    try {
      if (isFavorite) {
        const toRemove = favoriteAffirmations.find(fav => fav.affirmation === affirmation);
        if (!toRemove) return;

        await updateDoc(userDocRef, {
          favoriteAffirmations: arrayRemove(toRemove),
        });

        const newFavorites = updatedFavorites.filter(fav => fav.affirmation !== affirmation);
        setFavoriteAffirmations(newFavorites);
        localStorage.setItem("favoriteAffirmations", JSON.stringify(newFavorites));
        setIsFavorite(false);
      } else {
        const newFavorite = { id: uuidv4(), affirmation };

        await updateDoc(userDocRef, {
          favoriteAffirmations: arrayUnion(newFavorite),
        });

        const newFavorites = [...updatedFavorites, newFavorite];
        setFavoriteAffirmations(newFavorites);
        localStorage.setItem("favoriteAffirmations", JSON.stringify(newFavorites));
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error updating Firestore:", err);
    }
  };

  return (
    <>
      <div className="place-items-center pt-3">
        <h2 className="mt-2 mb-2 font-thin text-center">Daily Affirmation</h2>
        <p className="text-lg text-center">{affirmation}</p>
      </div>
      <div className="flex justify-end m-2 h-8">
        <Button onClick={toggleFavorite} className="border-none hover:bg-base">
          {isFavorite ? <img src="/heart-filled.svg" className="w-6 h-6" /> : <img src="/heart.svg" className="w-6 h-6"/>}
        </Button>
      </div>
    </>
  );
};

export default DailyAffirmation;