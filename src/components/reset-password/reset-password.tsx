import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/navigation/navigation-bar";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setDialogMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setDialogMessage("Error sending password reset email. Please try again.");
      console.error("Error sending password reset email:", error);
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col ml-5 mr-5">
      <Navigation />
      <div className="w-1/3 m-auto mt-20">
        <h2 className="text-primary text-xl font-semibold mb-4">Reset Password</h2>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 text-primary"
        />
        <Button onClick={handleReset} className="mt-4 bg-base text-primary hover:bg-background hover:border-base">
          Send Reset Email
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
          <DialogContent className="bg-background text-primary">
            <DialogHeader>
              <DialogTitle>Password Reset</DialogTitle>
              <DialogDescription>{dialogMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => { setIsDialogOpen(false); navigate("/login"); }}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResetPassword;
