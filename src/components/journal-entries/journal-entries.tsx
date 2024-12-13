import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { collection, addDoc } from "firebase/firestore";

const JournalEntryForm = () => {
  const [journalEntry, setJournalEntry] = useState<string>('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(journalEntry);
    addDoc(collection(db, "journalEntries"), {
      entry: journalEntry,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }


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
          cols={40}
        />
        <br />
        <Button type="submit">Save Entry</Button>
      </form>

    </>

  )

}

export default JournalEntryForm;