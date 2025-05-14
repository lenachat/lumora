import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDispatch } from 'react-redux';
import { setStreak } from '../../state/streak/streakSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

// interface User {
//   displayName: string;
//   uid: string;
// }

interface JournalEntry {
  title: string;
  entry: string;
  created: Date;
  updated: Date;
}

interface JournalEntryFormProps {
  // user: User;
  journalEntries: JournalEntry[];
  setJournalEntries: (entries: JournalEntry[]) => void;
  // setStreak: (streak: number) => void;
  calculateStreak: (dates: Date[]) => number;
}

const JournalEntryForm = (
  { journalEntries, setJournalEntries, calculateStreak }: JournalEntryFormProps) => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const [journalTitle, setJournalTitle] = useState<string>('');
  const [journalEntry, setJournalEntry] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      title: journalTitle,
      created: new Date(),
      entry: journalEntry,
      updated: new Date(),
    };
    try {
      // Check if the user is logged in
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          journalEntries: arrayUnion(newEntry),
        });

        // Update the local state with the new entry
        const updatedEntries = [...journalEntries, newEntry];
        setJournalEntries(updatedEntries);
        setJournalEntry('');
        setJournalTitle('');
        // Update the streak count
        const createdDates = updatedEntries.map(entry => new Date(entry.created));
        const streakCount = calculateStreak(createdDates);
        dispatch(setStreak(streakCount));
        // setStreak(streakCount); // update the state from parent
        showDialog("Journal entry saved successfully! Keep it up :)");
      } else {
        showDialog("Please log in to save a journal entry.");
      }
    } catch (error) {
      showDialog("Error saving journal entry. Please check your connection and try again.");
      console.error("Error saving journal entry: ", error);
    }
  };

  return (
    <>
      <div>
        <h1 className="mb-1 text-center md:mb-3 md:mt-6 text-primary">Write a new entry</h1>
      </div>
      <div className='w-full flex justify-center'>
        <div className="p-4 w-[90%] max-w-md">
          <form onSubmit={handleSaveEntry} className='w-full flex flex-col'>
            <Input
              type="text"
              id="journalTitle"
              value={journalTitle}
              onChange={(e) => {
                setJournalTitle(e.target.value);
              }}
              placeholder="Journal Title"
              className="mb-2 text-primary border-none"
            />
            <textarea
              value={journalEntry}
              onChange={(e) => {
                setJournalEntry(e.target.value);
              }}
              placeholder="Today I am grateful for..."
              rows={9}
              className="w-full p-3 mb-1 text-sm resize-none rounded-xl bg-background text-primary focus:outline-none placeholder:text-base placeholder:text-md"
            />
            <Button type="submit" className="mb-2 place-self-end">Save</Button>
          </form>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background text-primary rounded-xl">
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JournalEntryForm;