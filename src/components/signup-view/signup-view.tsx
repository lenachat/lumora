import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
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

    // Check if required fields are filled
    if (!email || !password || !username) {
      alert("Please fill out all fields to sign up.");
      return;
    }

    try {
      // Check if email already exists in Firestore
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("email", "==", email)));

      if (!querySnapshot.empty) {
        alert("This email is already in use. Please login instead.");
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
          alert("Verification email sent! Please check your inbox before proceeding.");
        }
        //alert("User created successfully");
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
      }
    }
    catch (error) {
      console.error("Signup error: ", error);
      alert("Signup failed. Please try again.");
    }
  }

  return (
    <>
      <div className="flex flex-col ml-8 mr-8">
        <Navigation />

        <Card className="m-4 pl-10 pr-10 w-1/3 place-self-center border-none rounded-[35px]">
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
    </>

  );
};

export default SignupView;