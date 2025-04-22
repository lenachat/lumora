import { useState } from "react";
import { Card } from "../ui/card";

interface FavoriteAffirmationsProps {
  favoriteAffirmations: { id: string; affirmation: string }[];
}

const FavoriteAffirmations = ({ favoriteAffirmations }: FavoriteAffirmationsProps) => {
  // const favoriteAffirmations = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="">
      <h2 className="mb-3 mt-6 place-self-center">Fav Affirmations</h2>
      <ul className="grid grid-cols-1">
        {favoriteAffirmations.slice(0, 4).map((fav: { affirmation: string }, index: number) => {
          const isExpanded = expandedIndexes.includes(index);
          return (
            <Card
              key={index}
              onClick={() => toggleExpand(index)}
              className="p-4 m-2 transition-transform duration-300 ease-in-out transform hover:scale-x-105 hover:shadow-md"
            >
              <li className="mt-1 mb-2 ml-3 mr-3">
                <span className={isExpanded ? "hidden" : "block truncate"}>
                  {fav.affirmation}
                </span>
                <span className={isExpanded ? "block" : "hidden"}>
                  {fav.affirmation}
                </span>
              </li>
            </Card>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoriteAffirmations;
