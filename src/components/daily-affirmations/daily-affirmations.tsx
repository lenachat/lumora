import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // for generating random ids

const DailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState<string>("");

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

  const saveToFavorites = async () => {

    if (affirmation && userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const favorites = userDoc.data().favoriteAffirmations || [];

          // Check if affirmation already exists (by text)
          const alreadyExists = favorites.some(
            (fav: { affirmation: string }) => fav.affirmation === affirmation
          );
          if (alreadyExists) {
            alert("Affirmation already in favorites!");
            return;
          }
          const newAffirmation = {
            id: uuidv4(),
            affirmation,
          };

          await updateDoc(userDocRef, {
            favoriteAffirmations: arrayUnion(newAffirmation),
          });
          alert("Affirmation added to favorites!");
        }
      } catch (error) {
        console.error("Error saving favorite affirmation:", error);
      }
    }
  };


  return (
    <>
      <div>{affirmation}.</div>
      <button onClick={saveToFavorites} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" }}>
        {/* {isFavorite ? "⭐" : "☆"} */}
        click me
      </button>
    </>
  );
};

export default DailyAffirmation;