
import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ScanRecord {
  accountId: string;
  timestamp: number;
}

interface ScanHistoryProps {
  visible: boolean;
}

const ScanHistory = ({ visible }: ScanHistoryProps) => {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);

  // Load scan history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("scanHistory");
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory) as ScanRecord[];
        setScanHistory(parsed);
      } catch (e) {
        console.error("Failed to parse scan history:", e);
      }
    }
  }, [visible]); // Reload when visibility changes

  const clearHistory = () => {
    localStorage.removeItem("scanHistory");
    setScanHistory([]);
  };

  if (!visible) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <History className="mr-2 text-blue-600" />
          Scan History
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearHistory}
          className="text-red-500 hover:text-red-700"
        >
          Clear
        </Button>
      </div>

      {scanHistory.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No scan history available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanHistory.map((record, index) => {
              const date = new Date(record.timestamp);
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.accountId}</TableCell>
                  <TableCell>{date.toLocaleDateString()}</TableCell>
                  <TableCell>{date.toLocaleTimeString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ScanHistory;
