
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import NfcInfo from "@/components/NfcInfo";
import NfcScanner from "@/components/NfcScanner";

const Index = () => {
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [lastScannedUrl, setLastScannedUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (accountId: string) => {
    setLastScannedId(accountId);
    const url = `https://myserver.com/profile/${accountId}`;
    setLastScannedUrl(url);
    setIsScanning(false);
    
    // Open URL in browser
    window.open(url, "_blank");
    toast.success("NFC tag scanned successfully!");
  };

  const startScanning = () => {
    setIsScanning(true);
    toast.info("Scanning for NFC tags...");
  };

  const handleScanError = (error: string) => {
    setIsScanning(false);
    toast.error(`Scan failed: ${error}`);
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
      <h1 className="text-3xl font-bold text-blue-800 mb-2 mt-8">Tag Tracer</h1>
      <p className="text-gray-600 mb-8 text-center">Scan NFC tags to automatically open profile URLs</p>
      
      <Card className="w-full max-w-md p-6 shadow-lg border-blue-100 mb-8">
        <div className="flex flex-col items-center">
          <NfcScanner 
            isScanning={isScanning} 
            onScanComplete={handleScan}
            onScanError={handleScanError}
          />
          
          <Button 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-md transition-all"
            onClick={startScanning}
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Scan NFC Tag"}
          </Button>
        </div>
      </Card>
      
      {(lastScannedId || lastScannedUrl) && (
        <NfcInfo 
          accountId={lastScannedId} 
          url={lastScannedUrl} 
        />
      )}
      
      <footer className="mt-auto pt-6 pb-4 text-center text-gray-500 text-sm">
        <p>This app works offline • No internet connection required</p>
      </footer>
    </div>
  );
};

export default Index;
