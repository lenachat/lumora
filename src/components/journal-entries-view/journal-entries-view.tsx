import { Card } from '../ui/card';

interface JournalEntries {
  entry: string;
  created: Date;
  updated: Date;
}

const JournalEntriesView = ({ journalEntries }: { journalEntries: JournalEntries[] }) => {

  return (
    <>
      <h2 className="p-2">Journal Entries</h2>
      <div>
        {journalEntries.slice().reverse().map((entry, index) => (
          <Card key={index} className="p-4">
            <p><strong>Entry:</strong> {entry.entry}</p>
            <p>Created At: {entry.created.toLocaleString()}</p>
            <p>Last Updated: {entry.updated.toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </>
  );

};

export default JournalEntriesView;