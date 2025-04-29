
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, FileText, Send, RefreshCw, Check, Filter, Mail, MessageSquare, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for documents pending signature
const pendingDocuments = [
  {
    id: 1,
    title: "Sunset Heights Lease Agreement",
    documentType: "Lease",
    recipient: "John Doe",
    recipientEmail: "john.doe@example.com",
    sentDate: "2023-05-15",
    status: "pending",
    expiresOn: "2023-05-30",
  },
  {
    id: 2,
    title: "Maple Gardens Maintenance Contract",
    documentType: "Vendor Contract",
    recipient: "ABC Plumbing",
    recipientEmail: "service@abcplumbing.com",
    sentDate: "2023-05-14",
    status: "viewed",
    expiresOn: "2023-05-29",
  }
];

// Mock data for completed documents
const completedDocuments = [
  {
    id: 3,
    title: "Riverfront Condos Lease Renewal",
    documentType: "Lease",
    recipient: "Sarah Johnson",
    recipientEmail: "sarah.j@example.com",
    sentDate: "2023-05-01",
    signedDate: "2023-05-03",
    status: "completed",
  },
  {
    id: 4,
    title: "Urban Lofts Cleaning Service Agreement",
    documentType: "Vendor Contract",
    recipient: "CleanPro Services",
    recipientEmail: "contracts@cleanpro.com",
    sentDate: "2023-04-28",
    signedDate: "2023-05-02",
    status: "completed",
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Awaiting Signature</Badge>;
    case "viewed":
      return <Badge variant="outline" className="text-blue-500 border-blue-500">Viewed</Badge>;
    case "completed":
      return <Badge variant="outline" className="text-green-500 border-green-500">Completed</Badge>;
    case "expired":
      return <Badge variant="outline" className="text-red-500 border-red-500">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Document send dialog component
const SendDocumentDialog = ({ documentId, documentTitle, recipientEmail, onSend }: { 
  documentId: number; 
  documentTitle: string;
  recipientEmail: string;
  onSend: (method: string, recipient: string, message: string) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState("email");
  const [recipient, setRecipient] = useState(recipientEmail);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(method, recipient, message);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to send document:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const getMethodIcon = () => {
    switch (method) {
      case "email": return <Mail className="mr-2 h-4 w-4" />;
      case "sms": return <MessageSquare className="mr-2 h-4 w-4" />;
      case "whatsapp": return <MessageCircle className="mr-2 h-4 w-4 text-green-500" />;
      default: return <Send className="mr-2 h-4 w-4" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Document for Signature</DialogTitle>
          <DialogDescription>
            Send "{documentTitle}" to the recipient via your preferred method.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="method">Delivery Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>SMS</span>
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>WhatsApp</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="recipient">
              {method === "email" ? "Email Address" : "Phone Number"}
            </Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={method === "email" ? "johndoe@example.com" : "+1 (555) 123-4567"}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign this document at your earliest convenience."
            />
          </div>
        </div>
        
        <div className="pt-2 text-sm text-muted-foreground">
          <p>
            This document delivery complies with UETA and ESIGN Act requirements.
            Recipient identity and consent will be verified and recorded.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!recipient || isSending}>
            {getMethodIcon()}
            {isSending ? "Sending..." : "Send Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DocumentSigning = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();
  
  const handleSendReminder = (documentId: number) => {
    // In a real app, would call API to send reminder
    console.log("Sending reminder for document ID:", documentId);
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent for document #${documentId}.`
    });
  };
  
  const handleSendDocument = async (documentId: number, method: string, recipient: string, message: string) => {
    // In a real app, would call API to send document
    console.log("Sending document:", { documentId, method, recipient, message });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Document Sent",
        description: `Document has been sent via ${method}.`,
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send",
        description: "There was an error sending the document. Please try again."
      });
      
      return Promise.reject(error);
    }
  };

  const handleViewDocument = (documentId: number) => {
    console.log("Navigating to document:", documentId);
    navigate(`/view-document/${documentId}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">Document Signing</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <Button onClick={() => navigate("/create-document")} className="mr-3">
            <FileText className="mr-2 h-4 w-4" />
            Create New Document
          </Button>
          <Button variant="outline" onClick={() => navigate("/document-templates")}>
            Manage Templates
          </Button>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="lease">Leases</SelectItem>
              <SelectItem value="vendor">Vendor Contracts</SelectItem>
              <SelectItem value="maintenance">Maintenance Agreements</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Search documents..." className="w-[250px]" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Signatures</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Documents Awaiting Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>
                        {doc.recipient}
                        <div className="text-xs text-muted-foreground">{doc.recipientEmail}</div>
                      </TableCell>
                      <TableCell>{doc.sentDate}</TableCell>
                      <TableCell>{doc.expiresOn}</TableCell>
                      <TableCell><StatusBadge status={doc.status} /></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.id)}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleSendReminder(doc.id)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <SendDocumentDialog 
                            documentId={doc.id}
                            documentTitle={doc.title}
                            recipientEmail={doc.recipientEmail}
                            onSend={(method, recipient, message) => 
                              handleSendDocument(doc.id, method, recipient, message)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Signed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>
                        {doc.recipient}
                        <div className="text-xs text-muted-foreground">{doc.recipientEmail}</div>
                      </TableCell>
                      <TableCell>{doc.sentDate}</TableCell>
                      <TableCell>{doc.signedDate}</TableCell>
                      <TableCell><StatusBadge status={doc.status} /></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.id)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentSigning;
