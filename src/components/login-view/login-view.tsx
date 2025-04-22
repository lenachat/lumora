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

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if user exists in Firebase
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No account found with this email. Please sign up.");
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
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />

        <Card className="m-4 w-1/3 place-self-center">
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginView;