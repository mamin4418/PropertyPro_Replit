
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, ArrowLeft, Building2, FileText, HelpCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function ImportTransaction() {
  const [, navigate] = useLocation();
  const [fileFormat, setFileFormat] = useState("csv");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Mock bank data
  const banks = [
    { id: "chase", name: "Chase Bank" },
    { id: "bofa", name: "Bank of America" },
    { id: "wells", name: "Wells Fargo" },
    { id: "citi", name: "Citibank" },
    { id: "fnb", name: "First National Bank" },
    { id: "usbank", name: "US Bank" },
    { id: "pnc", name: "PNC Bank" },
    { id: "capital", name: "Capital One" },
    { id: "td", name: "TD Bank" },
    { id: "other", name: "Other Bank" }
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const handleImport = () => {
    // In a real app, you would upload and process the file here
    console.log("Importing file:", selectedFile);
    console.log("Selected bank:", selectedBank);
    console.log("File format:", fileFormat);
    
    // Mock success - redirect to transactions list
    navigate("/banking/transactions");
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/banking/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Import Bank Transactions</h2>
      </div>
      
      <Tabs defaultValue="file" className="space-y-4">
        <TabsList>
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="direct">Direct Bank Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Import Transactions from File</CardTitle>
              <CardDescription>
                Upload a transaction file from your bank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(bank => (
                        <SelectItem key={bank.id} value={bank.id}>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            {bank.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">File Format</Label>
                  <Select value={fileFormat} onValueChange={setFileFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select file format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                      <SelectItem value="qfx">QFX (Quicken)</SelectItem>
                      <SelectItem value="ofx">OFX (Open Financial Exchange)</SelectItem>
                      <SelectItem value="qbo">QBO (QuickBooks)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Transaction File</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Drag and drop your file here or click to browse
                </p>
                <div className="relative">
                  <Input 
                    type="file" 
                    id="file-upload" 
                    accept=".csv,.qfx,.ofx,.qbo,.xlsx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm mt-4">
                    Selected file: <span className="font-medium">{selectedFile.name}</span>
                  </p>
                )}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">File Format Instructions</h4>
                    <p className="text-sm text-amber-700">
                      Most banks allow you to export transactions in CSV or OFX format. Look for "Export" or "Download" options in your online banking portal.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/banking/transactions")}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={!selectedFile || !selectedBank}
                >
                  Import Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="direct">
          <Card>
            <CardHeader>
              <CardTitle>Direct Bank Connection</CardTitle>
              <CardDescription>
                Connect directly to your bank through Plaid integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Secure Bank Connection</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect to your bank securely using Plaid. This allows automatic import of transactions without manually downloading files.
                </p>
                <Button>
                  <Building2 className="mr-2 h-4 w-4" />
                  Connect Your Bank
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Your credentials are never stored on our servers. All connections are securely managed through Plaid.
                </p>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-2">Connected Banks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No banks connected yet. Connect to your bank to automatically import transactions.
                </p>
                <Link href="/banking/integration">
                  <Button variant="outline">
                    Manage Bank Connections
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
