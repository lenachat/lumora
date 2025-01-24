import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entry-form/journal-entry-form";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import JournalEntriesView from "../journal-entries-view/journal-entries-view";
import { Card } from "../ui/card";

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
}

const Dashboard = ({ user, journalEntries, setJournalEntries }: DashboardProps) => {
  return (
    <>
      <div className="m-4">
        <Navigation />
      </div>
      <Card className="m-4">
        <h1 className="p-4">Welcome {user.displayName}!</h1>
        <Card className="m-4 p-4">
          <DailyAffirmation />
        </Card>
        <Card className="m-4 p-4 w-5/12">
          <JournalEntryForm user={user} journalEntries={journalEntries}
            setJournalEntries={setJournalEntries} />
        </Card>
        <Card className="m-4 p-4 w-5/12">
          <JournalEntriesView journalEntries={journalEntries} />
        </Card>
      </Card>
    </>
  );
};

export default Dashboard;