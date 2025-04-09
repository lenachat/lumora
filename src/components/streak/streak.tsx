

interface JournalStreakProps {
  streak: number;
}

const JournalStreak = ({ streak }: JournalStreakProps) => {

  return <div>🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}</div>;
};

export default JournalStreak;
