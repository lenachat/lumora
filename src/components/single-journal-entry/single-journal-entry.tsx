import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Navigation from '../navigation/navigation-bar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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

interface SingleJournalEntryProps {
  journalEntries: JournalEntry[];
  user: User;
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
}

const SingleJournalEntry = ({ user, journalEntries, setJournalEntries }: SingleJournalEntryProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();
  const entryIndex = parseInt(index ?? "0", 10);

  const sortedEntries = [...journalEntries].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  const entry = sortedEntries[entryIndex];

  if (!entry) {
    return <p>Journal entry not found.</p>;
  }

  const handleDeleteEntry = async () => {
    // Filter out the selected journal entry
    const updatedJournalEntries = [...journalEntries]
    updatedJournalEntries.splice(entryIndex, 1);

    // Get the Firestore document reference
    const userDocRef = doc(db, 'users', user.uid);

    try {
      // Update the Firestore document // Sort by created date in descending order
      await updateDoc(userDocRef, {
        journalEntries: updatedJournalEntries.sort(
          (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
        )
      });
      // navigate(`/journalEntries`);
      setJournalEntries(updatedJournalEntries); // Update the local state
      setShouldNavigate(true);
      showDialog("Journal entry deleted successfully!");
    } catch (error) {
      showDialog("Error deleting journal entry. Please check your connection and try again.");
      console.error("Error deleting journal entry:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />
        <h2 className="p-2 place-self-center">Single journal entry</h2>
        <div>
          <Link to="/journalEntries">
            <Button className='m-4 p-4 float-start'>
              <img src="/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>
          <Card className="p-4 mb-6 mt-4 w-1/2 place-self-center border-none rounded-[35px]">
            <div className="flex justify-between">
              <p className='text-left text-light text-sm font-thin ml-3 mr-3'>
                {entry.created.toLocaleDateString()}
              </p>
              <p className='text-right text-light text-sm font-thin ml-3 mr-3'>
                Last Updated: {entry.updated.toLocaleDateString()}
              </p>
            </div>
            <h3 className='text-xl mt-1 mb-2 ml-3 mr-3'>{entry.title}</h3>
            <p className='ml-3 mr-3 mb-2'>{entry.entry}</p>
            <div className="flex flex-row ml-3 mr-3 justify-between">
              <Button >
                <Link to={`/journalEntries/${index}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button onClick={() => setShowConfirmDialog(true)}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open && shouldNavigate) {
          navigate(`/journalEntries`);
        }
      }}>
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-background text-primary">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete this entry? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleDeleteEntry();
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogContent className="bg-background text-primary">
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
}

export default SingleJournalEntry;

