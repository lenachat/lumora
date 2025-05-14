import Navigation from "../navigation/navigation-bar";
import JournalEntryForm from "../journal-entry-form/journal-entry-form";
import DailyAffirmation from "../daily-affirmations/daily-affirmations";
import JournalEntriesView from "../journal-entries-view/journal-entries-view";
import JournalStreak from "../streak/streak";
import FavoriteAffirmations from "../favorite-affirmations/favorite-affirmations";
import { Card } from "../ui/card";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setFavoriteAffirmations } from "../../state/favoriteAffirmations/favoriteAffirmationsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

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

interface DashboardProps {
  // user: User;
  journalEntries: JournalEntry[];
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
  calculateStreak: (dates: Date[]) => number;
  // setStreak: (streak: number) => void;
  // favoriteAffirmations: { id: string; affirmation: string }[];
  // setFavoriteAffirmations: (affirmations: { id: string; affirmation: string }[]) => void;
}

const Dashboard = ({ journalEntries, setJournalEntries, calculateStreak,
}: DashboardProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteAffirmations") || "[]");
    dispatch(setFavoriteAffirmations(stored));
    // setFavoriteAffirmations(stored);
  }, []);

  useEffect(() => {
    if (isTyping) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTyping]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center ml-3 mr-3 pb-3 md:ml-8 md:mr-8 md:pb-8">
        <Navigation />

        <h1 className="p-4 text-center text-dark">Good to have you{user.displayName ? ", " + user.displayName : ""}!</h1>

        <div className="md:m-4 grid grid-rows-5 grid-cols-2 gap-3 md:gap-6 w-full max-w-7xl grow">
          <div className="row-span-1 col-span-2">
            <Card className="p-4 border-none h-full w-full rounded-[35px]">
              <DailyAffirmation
              // favoriteAffirmations={favoriteAffirmations}
              // setFavoriteAffirmations={setFavoriteAffirmations}
              />
            </Card>
          </div>

          <div className="row-span-1 col-span-1">
            <Card className="p-2 md:p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
              <JournalStreak
              // streak={streak} 
              />
            </Card>
          </div>

          <div className="hidden md:block row-span-2 col-span-1">
            <Card className="p-2 basis-1/2 border-none h-full w-full rounded-[35px]">
              <JournalEntryForm
                // user={user}
                journalEntries={journalEntries}
                setJournalEntries={setJournalEntries}
                // setStreak={setStreak}
                calculateStreak={calculateStreak} />
            </Card>
          </div>

          <div className="md:hidden row-span-1 col-span-1 h-full w-full">
            <div onClick={() => setIsTyping(true)} className="h-full w-full">
              <Card className="p-2 basis-1/2 border-none h-full w-full rounded-[35px]">
                <p className="mb-3 mt-6 pl-2 pr-2 text-center">Write a journal Entry</p>
                <p className="font-semibold mt-8 mb-1 pl-2 pr-2 md:mb-3 md:mt-6 text-center">Start writing</p>
              </Card>
            </div>
          </div>

          <div className="row-span-3 col-span-2 md:row-span-3 md:col-span-1">
            <Link to="/journalEntries">
              <Card className="p-2 md:p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
                <JournalEntriesView journalEntries={journalEntries} />
              </Card>
            </Link>
          </div>

          <div className="row-span-2 col-span-2 md:row-span-2 md:col-span-1">
            <Card className="p-2 md:p-4 basis-1/2 border-none h-full w-full rounded-[35px]">
              <FavoriteAffirmations
              // favoriteAffirmations={favoriteAffirmations}
              />
            </Card>
          </div>

        </div>

        {isTyping && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          >
            <div
              className="animate-fade-in-up w-full max-w-3xl p-6"
            >
              <Card className="rounded-[35px] shadow-lg transition-transform duration-300 ease-in-out transform scale-95">
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setIsTyping(false)}
                    className="text-sm text-gray-500 hover:text-primary transition mr-3 border-none"
                  >
                    X
                  </Button>
                </div>
                <JournalEntryForm
                  // user={user}
                  journalEntries={journalEntries}
                  setJournalEntries={(entries) => {
                    setJournalEntries(entries);
                    setIsTyping(false);
                  }}
                  // setStreak={setStreak}
                  calculateStreak={calculateStreak}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;