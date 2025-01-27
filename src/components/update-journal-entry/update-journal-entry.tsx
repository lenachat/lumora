import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase"; // Import your Firebase configuration
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface JournalEntry {
  entry: string;
  created: Date;
  updated: Date;
}

interface UpdateJournalEntryProps {
  journalEntries: JournalEntry[];
  userId: string;
}

const UpdateJournalEntry = ({ journalEntries, userId }: UpdateJournalEntryProps) => {
  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();  // Get the index from the URL
  const entryIndex = parseInt(index ?? "0", 10);

  // Reverse the index to get the correct entry (reversed UI order)
  const reverseIndex = journalEntries.length - 1 - entryIndex;

  // Find the journal entry based on the reversed index
  const entryToEdit = journalEntries[reverseIndex];
  const [updatedEntry, setUpdatedEntry] = useState<string>(entryToEdit?.entry || '');

  useEffect(() => {
    // When the entry changes, update the state with the selected entry
    if (entryToEdit) {
      setUpdatedEntry(entryToEdit.entry);
    }
  }, [entryToEdit]);

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update the 'last updated' timestamp
    const updatedEntryData = {
      ...entryToEdit,
      entry: updatedEntry,
      updated: new Date(),
    };

    const userDocRef = doc(db, "users", userId);

    try {
      const updatedJournalEntries = journalEntries.reverse().map((entry, idx) =>
        idx === entryIndex ? updatedEntryData : entry
      );

      // Update the Firestore document
      await updateDoc(userDocRef, { journalEntries: updatedJournalEntries.reverse() });
      alert("Journal entry updated successfully!");
      navigate(`/journalEntries/${reverseIndex}`);
    } catch (error) {
      console.error("Error updating journal entry:", error);
    }
  };

  return (
    <div>
      <h1>Update Journal Entry</h1>
      <form onSubmit={handleUpdateEntry}>
        <label htmlFor="entry">Entry:</label>
        <textarea id="entry" name="entry" rows={4} cols={50} value={updatedEntry}
          onChange={(e) => setUpdatedEntry(e.target.value)}></textarea>
        <br />
        <button type="submit">Update Entry</button>
      </form>
    </div>
  );

};

export default UpdateJournalEntry;