import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.ts";
import Navigation from "../navigation/navigation-bar.tsx";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";

const SignupView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      alert("User created successfully");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="m-4">
        <Navigation />
      </div>
      <Card className="m-4 w-6/12">
        <CardHeader>Signup</CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <Input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
      </Card>

    </>

  );
};

export default SignupView;