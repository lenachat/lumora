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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

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
      setShouldNavigate(true);
      showDialog("Journal entry updated successfully!");
    } catch (error) {
      showDialog("Error updating journal entry. Please check your connection and try again.");
      console.error("Error updating journal entry:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:ml-8 md:mr-8">
        <Navigation />
        <div className="md:hidden flex items-center">
          <Link to={`/journalEntries/${index}`}>
            <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
              <img src="/back.svg" alt="Back button" className="w-8 h-8" />
            </Button>
          </Link>
          <h2 className="p-2 absolute left-1/2 transform -translate-x-1/2 text-center">Update Entry</h2>
        </div>
        <div>
          <div className="hidden md:block">
            <h2 className="p-2 place-self-center">Update Entry</h2>
            <Link to={`/journalEntries/${index}`}>
              <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
                <img src="/back.svg" alt="Back button" className="w-8 h-8" />
              </Button>
            </Link>
          </div>
          <Card className="md:p-4 p-4 mb-4 mt-4 w-10/12 md:w-1/2 mx-auto border-none rounded-[35px]">
            <h1 className='m-3'>Update your entry here:</h1>
            <form onSubmit={handleUpdateEntry} className="pl-3 pr-3 pb-3">
              <label htmlFor="title"></label>
              <Input
                id="title"
                name="title"
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="mb-2 text-primary border-none"
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
      <Dialog open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open && shouldNavigate) {
            navigate(`/journalEntries/${entryIndex}`);
          }
        }}
      >
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

};

export default UpdateJournalEntry;