import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entries/journal-entries";

const Dashboard = () => {

  return (
    <>
      <div><Navigation /></div>
      <div>This is your Dashboard</div>
      <JournalEntryForm />
    </>
  );
};

export default Dashboard;