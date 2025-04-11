import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface DailyAffirmationProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
  setFavoriteAffirmations: (favs: { id: string; affirmation: string }[]) => void;
}

const DailyAffirmation = ({ favoriteAffirmations, setFavoriteAffirmations }: DailyAffirmationProps) => {
  const [affirmation, setAffirmation] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).uid : null;

  // useEffect(() => {
  //   const fetchFavoritesFromFirestore = async () => {
  //     const user = JSON.parse(localStorage.getItem("user") || "{}");
  //     const userId = user?.uid;
  //     if (!userId) return;

  //     try {
  //       const userDocRef = doc(db, "users", userId);
  //       const userSnap = await getDoc(userDocRef);

  //       if (userSnap.exists()) {
  //         const data = userSnap.data();
  //         const favorites = data.favoriteAffirmations || [];

  //         localStorage.setItem("favoriteAffirmations", JSON.stringify(favorites));
  //       }
  //     } catch (error) {
  //       console.error("Error syncing favorites from Firestore:", error);
  //     }
  //   };

  //   fetchFavoritesFromFirestore();
  // }, []);

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
          const response = await fetch("/api/");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: { affirmation: string } = await response.json();
          setAffirmation(data.affirmation);

          localStorage.setItem("dailyAffirmation", data.affirmation);
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


  // useEffect(() => {
  //   if (!affirmation || !userId) return;

  //   const favorites = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");
  //   const match = favorites.find((fav: { affirmation: string }) => fav.affirmation === affirmation);

  //   if (match) {
  //     setIsFavorite(true);
  //   } else {
  //     setIsFavorite(false);
  //   }
  // }, [affirmation, userId]);


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
      <div>{affirmation}.</div>
      <button onClick={toggleFavorite} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>
        {isFavorite ? "⭐" : "☆"}
      </button>
    </>
  );
};

export default DailyAffirmation;