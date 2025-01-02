import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entries/journal-entries";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";

const Dashboard = () => {

  return (
    <>
      <Navigation />
      <JournalEntryForm />
      <DailyAffirmation />
    </>
  );
};

export default Dashboard;