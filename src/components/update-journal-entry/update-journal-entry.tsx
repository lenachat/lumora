import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase"; // Import your Firebase configuration
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/navigation-bar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";

interface JournalEntry {
  title: string;
  entry: string;
  created: Date;
  updated: Date;
}

interface UpdateJournalEntryProps {
  journalEntries: JournalEntry[];
  userId: string;
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
}

const UpdateJournalEntry = ({ journalEntries, userId, setJournalEntries }: UpdateJournalEntryProps) => {
  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();  // Get the index from the URL
  const entryIndex = parseInt(index ?? "0", 10);

  const sortedEntries = [...journalEntries].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  const entryToEdit = sortedEntries[entryIndex];

  const [updatedTitle, setUpdatedTitle] = useState<string>(entryToEdit?.title || '');
  const [updatedEntry, setUpdatedEntry] = useState<string>(entryToEdit?.entry || '');

  useEffect(() => {
    // When the entry changes, update the state with the selected entry
    if (entryToEdit) {
      setUpdatedEntry(entryToEdit.entry);
      setUpdatedTitle(entryToEdit.title);
    }
  }, [entryToEdit]);

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update the 'last updated' timestamp
    const updatedEntryData = {
      ...entryToEdit,
      title: updatedTitle,
      entry: updatedEntry,
      updated: new Date(),
    };

    const userDocRef = doc(db, "users", userId);

    try {
      const updatedJournalEntries = journalEntries.map((entry, idx) =>
        idx === entryIndex ? updatedEntryData : entry
      );

      // Update the Firestore document // Sort by created date in descending order
      await updateDoc(userDocRef, { journalEntries: updatedJournalEntries.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) });
      // Update local state
      setJournalEntries([...updatedJournalEntries]);
      alert("Journal entry updated successfully!");
      navigate(`/journalEntries/${entryIndex}`);
    } catch (error) {
      console.error("Error updating journal entry:", error);
    }
  };

  return (
    <>
      <div className="m-4 flex flex-row">
        <h1 className="w-32 flex-1">Lumora</h1>
        <div className="w-32 flex-1 place-items-end">
          <Navigation />
        </div>
      </div>
      <Link to={`/journalEntries/${index}`}>
        <Button className='m-4 p-4 float-start'>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="16. Previous" id="_16._Previous"><path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" /><path d="M14.768,6.36a1,1,0,0,0-1.408-.128l-6,5a1,1,0,0,0,0,1.536l6,5a1,1,0,1,0,1.28-1.536L9.562,12,14.64,7.768A1,1,0,0,0,14.768,6.36Z" /></g></svg>
        </Button>
      </Link>
      <Card className="p-4 w-1/2 place-self-center">
        <h1 className='p-4'>Update your entry here:</h1>
        <form onSubmit={handleUpdateEntry} className="p-4">
          <label htmlFor="title"></label>
          <input
            id="title"
            name="title"
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <label htmlFor="entry"></label>
          <textarea id="entry" name="entry" rows={10} cols={50} value={updatedEntry}
            onChange={(e) => setUpdatedEntry(e.target.value)}></textarea>
          <br />
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </>
  );

};

export default UpdateJournalEntry;