import { createUserWithEmailAndPassword } from "firebase/auth";
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
      console.log("User created successfully");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div><Navigation /></div>
      <Card>
        <CardHeader>Signup</CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
      </Card>

    </>

  );
};

export default SignupView;