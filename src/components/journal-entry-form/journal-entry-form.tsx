import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

interface User {
  displayName: string;
  uid: string;
}

interface JournalEntry {
  title: string;
  entry: string;
  created: Date;
  updated: Date;
}

interface JournalEntryFormProps {
  user: User;
  journalEntries: JournalEntry[];
  setJournalEntries: (entries: JournalEntry[]) => void;
  setStreak: (streak: number) => void;
  calculateStreak: (dates: Date[]) => number;
}

const JournalEntryForm = (
  { user, journalEntries, setJournalEntries, setStreak, calculateStreak }: JournalEntryFormProps) => {

  const [journalTitle, setJournalTitle] = useState<string>('');
  const [journalEntry, setJournalEntry] = useState<string>('');

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      title: journalTitle,
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
      const updatedEntries = [...journalEntries, newEntry];
      setJournalEntries(updatedEntries);
      setJournalEntry('');
      // Update the streak count
      const createdDates = updatedEntries.map(entry => new Date(entry.created));
      const streakCount = calculateStreak(createdDates);
      setStreak(streakCount); // update the state from parent
      alert("Journal entry saved successfully!");
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
        <label htmlFor="journalTitle" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="journalTitle"
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
          placeholder="Enter a title for your journal entry"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <br />
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