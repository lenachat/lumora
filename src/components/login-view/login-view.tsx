import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase.ts";
import { Button } from "../ui/button";
import Navigation from "../navigation/navigation-bar.tsx";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { signOut } from "firebase/auth";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await signOut(auth);
        console.error('User not found in Firestore.');
        alert('User does not exist. Please sign up.');
        return;
      } else {
        console.log(user.email, "User logged in successfully");
        localStorage.setItem('user', JSON.stringify(user));
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  }

  return (
    <>
      <div className="m-4">
        <Navigation />
      </div>
      <Card className="m-4 w-6/12">
        <CardHeader>Login</CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginView;