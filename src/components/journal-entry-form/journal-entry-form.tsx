import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Input } from '../ui/input';

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
      <div >
        <h1 className="text-center mb-3 mt-6 text-primary">New Journal Entry</h1>
      </div>
      <div className='w-full flex justify-center'>
        <div className="w-[80%] max-w-md">
          <form onSubmit={handleSaveEntry} className='w-full '>
            <Input
              type="text"
              id="journalTitle"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              placeholder="Journal Title"
              className="mb-2 text-primary border-none"
            />
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Today I am grateful for..."
              rows={8}
              className="w-full p-3 mb-2 text-sm resize-none rounded-xl bg-background text-primary focus:outline-none placeholder:text-base placeholder:text-md"
            />
            <Button type="submit">Save</Button>
          </form>
        </div>
      </div>
    </>

  )

}

export default JournalEntryForm;