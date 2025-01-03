import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

interface User {
  displayName: string;
  uid: string;
}

interface JournalEntry {
  entry: string;
  created: Date;
  updated: Date;
}

const JournalEntryForm = (
  { user, journalEntries, setJournalEntries }:
    {
      user: User; journalEntries: JournalEntry[]; setJournalEntries: (journalEntries: JournalEntry[]) => void
    }) => {
  const [journalEntry, setJournalEntry] = useState<string>('');

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      created: new Date(),
      entry: journalEntry,
      updated: new Date(),
    };
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        journalEntries: arrayUnion(newEntry),
      });
      // Update the local state with the new entry
      setJournalEntries([...journalEntries, newEntry]);
      setJournalEntry('');
      alert("Journal entry saved!");
    } catch (error) {
      console.error("Error saving journal entry: ", error);
    }
  };

  return (
    <>
      <div>
        <h1>Write a new Entry</h1>
      </div>

      <form onSubmit={handleSaveEntry}>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your journal entry here..."
          rows={5}
          className="w-full p-2 resize-none md:resize-y md:h-32 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <br />
        <Button type="submit">Save Entry</Button>
      </form>

    </>

  )

}

export default JournalEntryForm;