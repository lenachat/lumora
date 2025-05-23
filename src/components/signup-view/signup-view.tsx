import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase.ts";
import Navigation from "../navigation/navigation-bar.tsx";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
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

const SignupView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [shouldReload, setShouldReload] = useState(false);

  const showDialog = (message: string, reloadAfterClose = false) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
    setShouldReload(reloadAfterClose);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!email || !password || !username) {
      showDialog("Please fill out all fields to sign up.");
      return;
    }

    try {
      // Check if email already exists in Firestore
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("email", "==", email)));

      if (!querySnapshot.empty) {
        showDialog("This email is already in use. Please login instead.");
        return;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Update displayName in Firebase Authentication
        await updateProfile(user, {
          displayName: username, // Set the username
        });
        // Save a new user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          username: user.displayName,
          email: user.email,
          createdAt: new Date(),
          favoriteAffirmations: [],
          journalEntries: [],
        });
        // Send email verification
        if (user && !user.emailVerified) {
          await sendEmailVerification(user);
          localStorage.setItem("user", JSON.stringify(user));
          //window.location.reload();
          showDialog("Signup succesful! You received a verification email. Please check your inbox before proceeding.", true);
        }

      }
    }
    catch (error) {
      console.error("Signup error: ", error);
      showDialog("Signup failed. Please try again.");
    }
  }

  return (
    <>
      <div className="flex flex-col md:ml-8 md:mr-8">
        <Navigation />

        <Card className="m-4 md:pl-10 md:pr-10 md:w-1/3 place-self-center border-none rounded-[25px]">
          <CardHeader className="text-center">Signup</CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <Input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2 text-primary border-none"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2 text-primary border-none"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 text-primary border-none"
              />
              <div className="flex justify-center">
                <Button type="submit">Sign Up</Button>
              </div>
              <div className="flex justify-center mt-2">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-cyan-500 hover:underline">
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open && shouldReload) {
          window.location.reload();
        }
      }}>
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
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-100">
        <footer className="flex justify-center items-center p-4">
          <p className="text-xs text-gray-400">&copy; 2025 Lena Chatziastros</p>
        </footer>
      </div>
    </>
  );
};

export default SignupView;