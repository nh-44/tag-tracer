
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import NfcInfo from "@/components/NfcInfo";
import NfcScanner from "@/components/NfcScanner";
import AdminPanel from "@/components/AdminPanel";
import ScanHistory from "@/components/ScanHistory";
import { History } from "lucide-react";

interface ScanRecord {
  accountId: string;
  timestamp: number;
}

const Index = () => {
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [lastScannedUrl, setLastScannedUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleScan = (accountId: string) => {
    setLastScannedId(accountId);
    // Update the URL to include the account ID
    const url = `https://nfc-health-connect.lovable.app/account/${accountId}`;
    setLastScannedUrl(url);
    setIsScanning(false);
    
    // Open URL in browser
    window.open(url, "_blank");
    toast.success("NFC tag scanned successfully!");
    
    // Save to scan history
    saveScanToHistory(accountId);
  };

  const saveScanToHistory = (accountId: string) => {
    const newScan: ScanRecord = {
      accountId,
      timestamp: Date.now()
    };
    
    try {
      const storedHistory = localStorage.getItem("scanHistory");
      let history: ScanRecord[] = [];
      
      if (storedHistory) {
        history = JSON.parse(storedHistory);
      }
      
      // Add new scan at the beginning
      history.unshift(newScan);
      
      // Keep only the last 100 scans
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
      
      localStorage.setItem("scanHistory", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save scan history:", e);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    toast.info("Scanning for NFC tags...");
  };

  const handleScanError = (error: string) => {
    setIsScanning(false);
    toast.error(`Scan failed: ${error}`);
  };

  const handleWriteComplete = (accountId: string) => {
    toast.success(`Successfully wrote ID ${accountId} to NFC tag`);
  };

  const handleAdminAuth = (isAuthenticated: boolean) => {
    setIsAdminAuthenticated(isAuthenticated);
    // Only show history when admin is authenticated
    if (!isAuthenticated) {
      setShowHistory(false);
    }
  };

  // Simulate NFC permission request on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("NFC permissions have been granted", {
        description: "The app can now scan NFC tags"
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-2 mt-8">Tag Tracer</h1>
      <p className="text-gray-600 mb-8 text-center">Scan NFC tags to automatically open profile URLs</p>
      
      <Card className="w-full max-w-md p-6 shadow-lg border-blue-100 mb-4 bg-white">
        <div className="flex flex-col items-center">
          <NfcScanner 
            isScanning={isScanning} 
            onScanComplete={handleScan}
            onScanError={handleScanError}
          />
          
          <Button 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg rounded-full shadow-md transition-all"
            onClick={startScanning}
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Scan NFC Tag"}
          </Button>
          
          <div className="flex gap-4 mt-6 w-full justify-center">
            {isAdminAuthenticated && (
              <Button 
                variant="outline" 
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="mr-2 h-4 w-4" />
                {showHistory ? "Hide History" : "Show History"}
              </Button>
            )}
            
            <AdminPanel 
              onWriteComplete={handleWriteComplete} 
              onAuthChange={handleAdminAuth}
            />
          </div>
        </div>
      </Card>
      
      {(lastScannedId || lastScannedUrl) && (
        <NfcInfo 
          accountId={lastScannedId} 
          url={lastScannedUrl} 
        />
      )}
      
      <ScanHistory visible={showHistory && isAdminAuthenticated} />
      
      <footer className="mt-auto pt-6 pb-4 text-center text-gray-500 text-sm">
        <p>This app works offline • No internet connection required</p>
      </footer>
    </div>
  );
};

export default Index;
