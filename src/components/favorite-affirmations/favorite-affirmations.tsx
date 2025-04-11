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
    <div className="favorite-affirmations">
      <h2 className="text-xl font-semibold mb-4">Your Favorite Affirmations</h2>
      <ul className="grid grid-cols-1 gap-4">
        {favoriteAffirmations.slice(0, 4).map((fav: { affirmation: string }, index: number) => {
          const isExpanded = expandedIndexes.includes(index);
          return (
            <Card
              key={index}
              onClick={() => toggleExpand(index)}
              className="p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <li className="favorite-affirmation text-base">
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
