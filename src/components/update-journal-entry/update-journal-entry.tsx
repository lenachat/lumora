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
import { Input } from "../ui/input";

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
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />

        <h2 className="p-2 text-center">Update Entry</h2>

        <div>
          <Link to={`/journalEntries/${index}`}>
            <Button className='m-4 p-4 float-start'>
              <img src="/../../../files/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>

          <Card className="p-4 mb-6 mt-4 w-1/2 place-self-center border-none">
            <h1 className='p-4'>Update your entry here:</h1>
            <form onSubmit={handleUpdateEntry} className="p-4">
              <label htmlFor="title"></label>
              <Input
                id="title"
                name="title"
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="mb-2 text-primary border-none"
                required
              />
              <label htmlFor="entry"></label>
              <textarea id="entry" name="entry" rows={10} cols={50} value={updatedEntry}
                onChange={(e) => setUpdatedEntry(e.target.value)}
                className="w-full p-3 mb-2 text-sm resize-none rounded-xl bg-background text-primary focus:outline-none placeholder:text-base placeholder:text-md"
              ></textarea>
              <br />
              <Button type="submit">Save Changes</Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );

};

export default UpdateJournalEntry;