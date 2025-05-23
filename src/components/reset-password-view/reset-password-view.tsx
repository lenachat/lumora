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
    <>
      <div className="flex flex-col md:ml-5 md:mr-5">
        <Navigation />
        <div className="w-10/12 sm:w-1/2 md:w-1/3 mx-auto mt-20">
          <h2 className="text-primary text-xl font-semibold mb-4">Reset Password</h2>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 text-primary"
          />
          <Button onClick={handleReset} className="mt-4 bg-base text-primary hover:bg-background hover:border-base">
            Send reset Email
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
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-100">
        <footer className="flex justify-center items-center p-4">
          <p className="text-xs text-gray-400">&copy; 2025 Lena Chatziastros</p>
        </footer>
      </div>
    </>
  );
};

export default ResetPassword;
