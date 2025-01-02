import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase.ts";
import { Button } from "../ui/button";
import Navigation from "../navigation/navigation-bar.tsx";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user.email, "User logged in successfully");
      localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
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