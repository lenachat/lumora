import Navigation from "../navigation/navigation-bar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, verifyBeforeUpdateEmail, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";


const ProfileView = () => {

  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailVerified] = useState(user?.emailVerified || false);

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
          alert(
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

        alert("Profile updated successfully!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          alert("Error updating profile: " + error.message);
        } else {
          console.error("An unknown error occurred.");
          alert("An unknown error occurred.");
        }
      }
    }
  }

  const deleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

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

      alert("Your account has been deleted successfully.");
      localStorage.removeItem("user");
      localStorage.removeItem("favoriteAffirmations");
      // Redirect to login or home page
      window.location.href = "/"; // Or redirect to login/start page
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };


  return (
    <>
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />
        <h2 className="p-2 place-self-center">Your Profile</h2>
        <div>
          <Link to="/">
            <Button className='m-4 p-4 float-start'>
              <img src="/back.svg" alt="" className="w-8 h-8" />
            </Button>
          </Link>

          <Card className="p-4 mb-6 mt-4 w-2/3 place-self-center border-none rounded-[35px]">
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
              <form onSubmit={saveUserData} className="w-1/3">
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
                <Button type="submit">Save Changes</Button>
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
                className="text-primary border-none"
              />
              <div className="mt-4">
                <p>Are you sure you want to delete your account?</p>
                <p>This action can not be undone.</p>
                <Button onClick={deleteAccount} className="border-warning hover:bg-warning">
                  Delete my account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>

  );
}

export default ProfileView;