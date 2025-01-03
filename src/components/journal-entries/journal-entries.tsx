import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const JournalEntryForm = () => {
  const [journalEntry, setJournalEntry] = useState<string>('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "users", user.uid);
      updateDoc(userDocRef, {
        journalEntries: arrayUnion({
          created: new Date(),
          entry: journalEntry,
          updated: new Date(),
        }),
      });
      setJournalEntry('');
    } catch (error) {
      console.error("Error saving journal entry: ", error);
    }
  };

  return (
    <>
      <div>
        <h1>Journal Entry Form</h1>
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