import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entries/journal-entries";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import { Card } from "../ui/card";

const Dashboard = () => {

  return (
    <>
      <div className="m-4">
        <Navigation />
      </div>
      <Card className="m-4">
        <Card className="m-4 p-4">
          <DailyAffirmation />
        </Card>
        <Card className="m-4 p-4 w-6/12">
          <JournalEntryForm />
        </Card>
      </Card>
    </>
  );
};

export default Dashboard;