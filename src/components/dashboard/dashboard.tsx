import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entry-form/journal-entry-form";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import JournalEntriesView from "../journal-entries-view/journal-entries-view";
import JournalStreak from "../streak/streak";
import { Card } from "../ui/card";
import "./dashboard.css";
import { Link } from "react-router-dom";

interface User {
  displayName: string;
  uid: string;
}
interface JournalEntry {
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
}

const Dashboard = ({ user, journalEntries, setJournalEntries, streak, calculateStreak, setStreak }: DashboardProps) => {
  return (
    <>
      <div className="p-4 flex flex-row">
        <h1 className="w-32 flex-1">Lumora</h1>
        <div className="w-32 flex-1 place-items-end">
          <Navigation />
        </div>
      </div>
      <h1 className="p-4 place-self-center underline">Good to have you, {user.displayName}!</h1>
      <Card className="m-4">
        <Card className="m-4 p-4 place-items-center">
          <h2 className="m-2 font-thin" >Your Affirmation of the Day</h2>
          <DailyAffirmation />
        </Card>
        <div className="flex flex-row">
          <Card className="m-4 p-4 basis-1/2">
            <JournalEntryForm
              user={user}
              journalEntries={journalEntries}
              setJournalEntries={setJournalEntries}
              setStreak={setStreak}
              calculateStreak={calculateStreak} />
          </Card>
          <Card className="m-4 p-4 basis-1/2">
            <Link to="/journalEntries">
              <JournalEntriesView journalEntries={journalEntries} />
            </Link>
          </Card>
          <Card className="m-4 p-4 basis-1/2">
            <JournalStreak streak={streak} />
          </Card>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;