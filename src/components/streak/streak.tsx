

interface JournalStreakProps {
  streak: number;
}

const JournalStreak = ({ streak }: JournalStreakProps) => {

  return (
    <div>
      <img src="/fire-icon.png" alt="" className="w-24 h-auto place-self-center mt-4" />
      <p className="text-center ">
        Streak: {streak} day{streak !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default JournalStreak;
