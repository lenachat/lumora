import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

// interface JournalStreakProps {
//   streak: number;
// }

const JournalStreak = () => {
  const streak = useSelector((state: RootState) => state.streak.streak);

  return (
    <div>
      <p className="text-center mb-3 mt-6 pl-2 pr-2">
        Journaling streak
      </p>
      <img src="/fire-icon.png" alt="" className="w-20 mt-2 h-auto mx-auto" />
      <p className="text-center">
        {streak} day{streak !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default JournalStreak;
