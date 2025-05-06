import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entry-form/journal-entry-form";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import JournalEntriesView from "../journal-entries-view/journal-entries-view";
import JournalStreak from "../streak/streak";
import FavoriteAffirmations from "../favorite-affirmations/favorite-affirmations";
import { Card } from "../ui/card";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface User {
  displayName: string;
  uid: string;
}
interface JournalEntry {
  title: string;
  entry: string;
  created: Date;
  updated: Date;
}

interface DashboardProps {
  user: User;
  journalEntries: JournalEntry[];
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
  streak: number;
  calculateStreak: (dates: Date[]) => number;
  setStreak: (streak: number) => void;
  favoriteAffirmations: { id: string; affirmation: string }[];
  setFavoriteAffirmations: (affirmations: { id: string; affirmation: string }[]) => void;
}

const Dashboard = ({ user, journalEntries, setJournalEntries, streak, calculateStreak, setStreak, favoriteAffirmations,
  setFavoriteAffirmations }: DashboardProps) => {
  // const [favoriteAffirmations, setFavoriteAffirmations] = useState<{ id: string; affirmation: string }[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");
    setFavoriteAffirmations(stored);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center ml-8 mr-8">
        <Navigation />

        <h1 className="p-4 text-center text-dark">Good to have you{user.displayName ? ", " + user.displayName : ""}!</h1>

        <div className="m-4 grid grid-rows-5 grid-cols-2 gap-6 w-full max-w-7xl grow">
          <div className="row-span-1 col-span-2">
            <Card className=" p-4 border-none h-full w-full rounded-[35px]">
              <DailyAffirmation
                favoriteAffirmations={favoriteAffirmations}
                setFavoriteAffirmations={setFavoriteAffirmations}
              />
            </Card>
          </div>

          <div className="row-span-1 col-span-1">
            <Card className="p-4 basis-1/2 border-none h-full rounded-[35px]">
              <JournalStreak streak={streak} />
            </Card>
          </div>

          <div className="row-span-2 col-span-1">
            <Card className="p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
              <JournalEntryForm
                user={user}
                journalEntries={journalEntries}
                setJournalEntries={setJournalEntries}
                setStreak={setStreak}
                calculateStreak={calculateStreak} />
            </Card>
          </div>

          <div className="row-span-3 col-span-1">
            <Link to="/journalEntries">
              <Card className="p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
                <JournalEntriesView journalEntries={journalEntries} />
              </Card>
            </Link>
          </div>

          <div className="row-span-2 col-span-1">
            <Card className="p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
              <FavoriteAffirmations
                favoriteAffirmations={favoriteAffirmations}
              />
            </Card>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;