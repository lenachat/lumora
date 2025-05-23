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
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useDispatch } from 'react-redux';
import { setJournalEntries } from '../../state/journalEntries/journalEntriesSlice';

const SingleJournalEntry = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const journalEntries = useSelector((state: RootState) => state.journalEntries.journalEntries);
  const dispatch = useDispatch();

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
    const updatedJournalEntries = [...journalEntries]
    updatedJournalEntries.splice(entryIndex, 1);

    if (!user) {
      showDialog("Please log in to delete a journal entry.");
      return;
    }
    if (user.uid) {
      const userDocRef = doc(db, 'users', user.uid);

      try {
        // Sort by created date in descending order
        await updateDoc(userDocRef, {
          journalEntries: updatedJournalEntries.sort(
            (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
          )
        });
        dispatch(setJournalEntries(updatedJournalEntries));
        setShouldNavigate(true);
        showDialog("Journal entry deleted successfully!");
      } catch (error) {
        showDialog("Error deleting journal entry. Please check your connection and try again.");
        console.error("Error deleting journal entry:", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:ml-8 md:mr-8">
        <Navigation />
        <div className="md:hidden flex items-center">
          <Link to="/journalEntries">
            <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
              <img src="/back.svg" alt="Back button" className="w-8 h-8" />
            </Button>
          </Link>
          <h2 className="p-2 absolute left-1/2 transform -translate-x-1/2 text-center">Journal Entry</h2>
        </div>
        <div>
          <div className="hidden md:block">
            <h2 className="p-2 place-self-center">Journal Entry</h2>
            <Link to="/journalEntries">
              <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
                <img src="/back.svg" alt="Back button" className="w-8 h-8" />
              </Button>
            </Link>
          </div>
          <Card className="p-4 mb-6 mt-4 w-10/12 md:w-1/2 mx-auto border-none rounded-[25px]">
            <div className="md:flex md:justify-between">
              <p className='text-left text-light text-sm font-thin ml-3 mr-3'>
                {new Date(entry.created).toLocaleDateString()}
              </p>
              <p className='md:text-right text-light text-sm font-thin ml-3 mr-3'>
                Last Updated: {new Date(entry.updated).toLocaleDateString()}
              </p>
            </div>
            <h3 className='text-xl mt-1 mb-2 ml-3 mr-3'>{entry.title}</h3>
            <p className='ml-3 mr-3 mb-2 whitespace-pre-wrap'>{entry.entry}</p>
            <div className="flex flex-row ml-3 mr-3 justify-between">
              <Button>
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
            <DialogFooter className='flex flex-row justify-between'>
              <Button className='border-primary' onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
              <Button
                className="border-warning "
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

