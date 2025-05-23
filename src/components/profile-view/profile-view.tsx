import Navigation from "../navigation/navigation-bar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, verifyBeforeUpdateEmail, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/user/userSlice";
import { logout } from "../../state/user/userSlice";


const ProfileView = () => {
  const dispatch = useDispatch();

  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailVerified] = useState(user?.emailVerified || false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);


  const saveUserData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        // Update display name
        if (displayName !== user.displayName) {
          await updateProfile(user, { displayName });
        }

        // Reauth if email or password change
        if ((email && email !== user.email) || newPassword) {
          const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
          await reauthenticateWithCredential(user, credential);
        }

        // Update email
        if (email !== user.email) {
          await verifyBeforeUpdateEmail(user, email);
          showDialog(
            "A verification email has been sent to your new address. Please verify it to complete the email change."
          );
        }

        // Update password
        if (newPassword.length > 5) {
          await updatePassword(user, newPassword);
        }

        // Firestore update
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          displayName,
          email,
        });

        // LocalStorage update
        const updatedUserData = {
          displayName,
          email,
          uid: user.uid,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        // Redux store update
        dispatch(setUser(updatedUserData));

        showDialog("Profile updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          showDialog("Error updating profile: " + error.message);
        } else {
          console.error("An unknown error occurred.");
          showDialog("An unknown error occurred. Please try again.");
        }
      }
    }
  }

  const deleteAccount = async () => {
    if (!user) return;

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete user from Firebase Auth
      await user.delete();
      showDialog("Your account has been deleted successfully.");
      localStorage.removeItem("user");
      localStorage.removeItem("favoriteAffirmations");
      dispatch(logout()); // Clear user data from Redux store
      // Redirect to login or home page
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting account:", error);
        showDialog("An error occurred while deleting your account. Please check your connection and try again.");
      } else {
        showDialog("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:ml-8 md:mr-8">
        <Navigation />
        <div className="md:hidden flex items-center">
          <Link to="/">
            <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
              <img src="/back.svg" alt="Back button" className="w-8 h-8" />
            </Button>
          </Link>
          <h2 className="p-2 absolute left-1/2 transform -translate-x-1/2 text-center">My Profile</h2>
        </div>
        <div>
          <div className="hidden md:block">
            <h2 className="p-2 place-self-center">My Profile</h2>
            <Link to="/">
              <Button className='ml-4 mt-1 md:p-4 float-start border-none'>
                <img src="/back.svg" alt="Back button" className="w-8 h-8" />
              </Button>
            </Link>
          </div>
          <Card className="p-3 mb-4 md:mb-6 mt-4 w-11/12 md:w-1/2 mx-auto border-none rounded-[25px]">
            <CardHeader className="font-semibold">User Information</CardHeader>
            <CardContent>
              <p><strong>Username:</strong> {user?.displayName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p>Email verified? {emailVerified ? "Yes" : (
                <>
                  Email not verified. <strong>Please check your inbox.</strong>
                </>)}
              </p>
            </CardContent>

            <CardHeader className="font-semibold">Update Profile</CardHeader>
            <CardContent>
              <form onSubmit={saveUserData} className="w-full md:w-1/2">
                <p>Username:</p>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-primary border-none"
                />
                <br />
                <p>Email:</p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-primary border-none"
                />
                <br />
                <p>Password:</p>
                <Input
                  type="password"
                  value={newPassword}
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-primary border-none"
                />
                <br />
                {(email !== user?.email || newPassword) && (
                  <>
                    <label className="block mt-4 mb-2">Current Password (required to update email or password):</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="text-primary border-none"
                    />
                  </>
                )}
                <Button type="submit" className="mt-2">Save Changes</Button>
              </form>
            </CardContent>

            <CardHeader className="font-semibold">Delete Account</CardHeader>
            <CardContent>
              <p>To delete your account, please enter your current password:</p>
              <Input
                id="delete-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="text-primary border-none md:w-1/2 mt-2"
              />
              <div className="mt-4">
                <Button onClick={() => setIsDeleteDialogOpen(true)} className="border-warning hover:bg-warning">
                  Delete my account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background text-primary rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={deleteAccount} className="border-warning hover:bg-warning">
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
}

export default ProfileView;