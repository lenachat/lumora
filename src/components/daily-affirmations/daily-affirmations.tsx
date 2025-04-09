import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // for generating random ids

const DailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).uid : null;

  useEffect(() => {
    const fetchFavoritesFromFirestore = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.uid;
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const favorites = data.favoriteAffirmations || [];

          localStorage.setItem("favoriteAffirmations", JSON.stringify(favorites));
        }
      } catch (error) {
        console.error("Error syncing favorites from Firestore:", error);
      }
    };

    fetchFavoritesFromFirestore();
  }, []);

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

  useEffect(() => {
    if (!affirmation || !userId) return;

    const favorites = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");
    const match = favorites.find((fav: { affirmation: string }) => fav.affirmation === affirmation);

    if (match) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [affirmation, userId]);


  const toggleFavorite = async () => {
    if (!affirmation || !userId) return;

    const userDocRef = doc(db, "users", userId);
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");

    try {
      if (isFavorite) {
        const toRemove = storedFavorites.find(
          (fav: { affirmation: string }) => fav.affirmation === affirmation
        );
        if (toRemove) {
          await updateDoc(userDocRef, {
            favoriteAffirmations: arrayRemove(toRemove),
          });

          const updatedFavorites = storedFavorites.filter(
            (fav: { affirmation: string }) => fav.affirmation !== affirmation
          );
          localStorage.setItem("favoriteAffirmations", JSON.stringify(updatedFavorites));

          setIsFavorite(false);
        }
      } else {
        const newFav = { id: uuidv4(), affirmation };
        await updateDoc(userDocRef, {
          favoriteAffirmations: arrayUnion(newFav),
        });

        storedFavorites.push(newFav);
        localStorage.setItem("favoriteAffirmations", JSON.stringify(storedFavorites));

        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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