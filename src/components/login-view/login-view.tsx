import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase.ts";
import { Button } from "../ui/button";
import Navigation from "../navigation/navigation-bar.tsx";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";


const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setIsDialogOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if user exists in Firebase
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showDialog("No account found with this email. Please sign up.");
        return;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem('user', JSON.stringify(user));
        // Fetch favorite affirmations from Firestore
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const favorites = userData.favoriteAffirmations || [];
        localStorage.setItem("favoriteAffirmations", JSON.stringify(favorites));
        window.location.reload();
      }
    } catch (error: unknown) {
      console.error("Login failed: ", error);
      if ((error as FirebaseError).code === "auth/invalid-credential") {
        showDialog("Incorrect password. Please try again.");
      } else {
        showDialog("Login failed. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-center md:ml-8 md:mr-8 ">
        <Navigation />
        <Card className="m-4 md:pl-10 md:pr-10 md:w-1/3 place-self-center border-none rounded-[25px]">
          <CardHeader className="text-center">Login</CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
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
                <Button type="submit">Login</Button>
              </div>
              <div className="flex justify-center mt-2">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-cyan-500 hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
            <div className="flex justify-center mt-2">
              <Link to="/reset-password" className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background text-primary rounded-xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
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

export default LoginView;