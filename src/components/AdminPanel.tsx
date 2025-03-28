
import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NfcWriter from "./NfcWriter";

interface AdminPanelProps {
  onWriteComplete: (accountId: string) => void;
}

const AdminPanel = ({ onWriteComplete }: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "00000"; // Dummy password as requested

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleWriteComplete = (accountId: string) => {
    onWriteComplete(accountId);
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleWriteError = (error: string) => {
    console.error("Write error:", error);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="mt-4 bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <Key className="mr-2 h-4 w-4" />
        Admin
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isAuthenticated ? "Admin Panel" : "Admin Login"}</DialogTitle>
          </DialogHeader>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleLogin}>Login</Button>
            </div>
          ) : (
            <NfcWriter
              onWriteComplete={handleWriteComplete}
              onWriteError={handleWriteError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPanel;
