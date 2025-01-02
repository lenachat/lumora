import Navigation from "../navigation/navigation-bar";
import { useEffect, useState } from "react";

const DailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState<string>("");

  useEffect(() => {
    // Fetch data from the proxied affirmations API
    const fetchAffirmation = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { affirmation: string } = await response.json();
        setAffirmation(data.affirmation);
      } catch (error) {
        console.error("Error fetching affirmation:", error);
      }
    };
    fetchAffirmation();
  }, []);

  return (
    <>
      <div>Your daily affirmation:</div>
      <div>{affirmation}.</div>
    </>
  );
};

export default DailyAffirmation;