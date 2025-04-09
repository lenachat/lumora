import { useEffect, useState } from "react";


const DailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState<string>("");

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

  return (
    <>
      <div>{affirmation}.</div>
    </>
  );
};

export default DailyAffirmation;