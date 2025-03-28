
import { useEffect } from "react";
import { Scan } from "lucide-react";

interface NfcScannerProps {
  isScanning: boolean;
  onScanComplete: (accountId: string) => void;
  onScanError: (error: string) => void;
}

const NfcScanner = ({ isScanning, onScanComplete, onScanError }: NfcScannerProps) => {
  // Simulate NFC scanning process
  useEffect(() => {
    if (!isScanning) return;
    
    // This simulates the process that would happen with real NFC hardware
    // In a real Flutter app, this would use flutter_nfc_kit or nfc_manager
    const scanTimer = setTimeout(() => {
      // Simulate successful scan 80% of the time
      if (Math.random() > 0.2) {
        // Generate a random account ID to simulate scanning different tags
        const mockAccountId = `user-${Math.floor(Math.random() * 10000)}`;
        onScanComplete(mockAccountId);
      } else {
        // Simulate occasional errors
        const errors = [
          "Tag not compatible",
          "Tag moved too quickly",
          "Unable to read tag data",
          "Invalid tag format"
        ];
        onScanError(errors[Math.floor(Math.random() * errors.length)]);
      }
    }, 2000); // Simulate 2 second scanning process
    
    return () => clearTimeout(scanTimer);
  }, [isScanning, onScanComplete, onScanError]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative p-8 rounded-full bg-blue-100 ${isScanning ? 'animate-pulse' : ''}`}>
        <Scan 
          size={64} 
          className={`text-blue-600 ${isScanning ? 'animate-spin-slow' : ''}`} 
        />
        
        {isScanning && (
          <div className="absolute inset-0 border-4 border-blue-400 rounded-full animate-ping opacity-50"></div>
        )}
      </div>
      
      <p className="mt-4 text-center text-gray-600">
        {isScanning 
          ? "Hold an NFC tag near your device..." 
          : "Tap the button below to start scanning"
        }
      </p>
    </div>
  );
};

export default NfcScanner;
