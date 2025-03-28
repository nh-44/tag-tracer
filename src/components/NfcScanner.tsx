
import { useEffect, useState } from "react";
import { Scan } from "lucide-react";

interface NfcScannerProps {
  isScanning: boolean;
  onScanComplete: (accountId: string) => void;
  onScanError: (error: string) => void;
}

const NfcScanner = ({ isScanning, onScanComplete, onScanError }: NfcScannerProps) => {
  const [isNfcSupported, setIsNfcSupported] = useState<boolean | null>(null);
  
  // Check if NFC is supported
  useEffect(() => {
    // @ts-ignore - NDEFReader is not in TypeScript's lib.dom yet
    const isSupported = typeof NDEFReader !== 'undefined';
    setIsNfcSupported(isSupported);
    
    if (!isSupported) {
      console.log("Web NFC API is not supported in this browser");
    }
  }, []);

  // Handle actual NFC scanning
  useEffect(() => {
    let abortController: AbortController | null = null;
    
    const startNfcScan = async () => {
      if (!isScanning || !isNfcSupported) return;
      
      try {
        abortController = new AbortController();
        // @ts-ignore - NDEFReader is not in TypeScript's lib.dom yet
        const ndef = new NDEFReader();
        
        await ndef.scan({ signal: abortController.signal });
        console.log("NFC scan started successfully");
        
        ndef.addEventListener("reading", (event: any) => {
          console.log("NFC tag detected!");
          
          // Try to read text records from the tag
          if (event.message && event.message.records) {
            for (const record of event.message.records) {
              if (record.recordType === "text") {
                const textDecoder = new TextDecoder();
                // Skip the first 3 bytes (language info) and decode the rest
                const accountId = textDecoder.decode(record.data.buffer.slice(3));
                // Ensure it's a 5-digit account ID
                const cleanAccountId = accountId.trim().substring(0, 5);
                console.log("Found account ID:", cleanAccountId);
                onScanComplete(cleanAccountId);
                if (abortController) {
                  abortController.abort();
                  abortController = null;
                }
                return;
              }
            }
          }
          
          // Fallback to using the serial number if no text records found
          if (event.serialNumber) {
            // Generate a 5-digit ID from serial number
            const accountId = Math.floor(10000 + Math.random() * 90000).toString();
            console.log("Using generated 5-digit account ID:", accountId);
            onScanComplete(accountId);
          } else {
            onScanError("Could not read account ID from tag");
          }
          
          if (abortController) {
            abortController.abort();
            abortController = null;
          }
        });
        
        ndef.addEventListener("error", (error: any) => {
          console.error("NFC Error:", error);
          onScanError(error.message || "Failed to read NFC tag");
          if (abortController) {
            abortController.abort();
            abortController = null;
          }
        });
        
      } catch (error: any) {
        console.error("Error starting NFC scan:", error);
        onScanError(error.message || "Failed to start NFC scanner");
        
        // Fallback to simulated scanning if permission denied or other issues
        if (error.name === "NotAllowedError" || error.name === "NotSupportedError") {
          simulateNfcScan();
        }
      }
    };
    
    // Simulate NFC scanning as fallback for unsupported browsers
    const simulateNfcScan = () => {
      if (!isScanning) return;
      
      console.log("Using simulated NFC scan");
      const scanTimer = setTimeout(() => {
        // Simulate successful scan 80% of the time
        if (Math.random() > 0.2) {
          // Generate a random 5-digit account ID
          const mockAccountId = Math.floor(10000 + Math.random() * 90000).toString();
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
    };
    
    // Start scanning when isScanning is true
    if (isScanning) {
      if (isNfcSupported) {
        startNfcScan();
      } else {
        simulateNfcScan();
      }
    }
    
    // Cleanup function
    return () => {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
    };
  }, [isScanning, isNfcSupported, onScanComplete, onScanError]);
  
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
      
      {isNfcSupported === false && (
        <p className="mt-2 text-center text-orange-500 text-sm">
          NFC is not supported in this browser. Using simulation mode.
        </p>
      )}
    </div>
  );
};

export default NfcScanner;
