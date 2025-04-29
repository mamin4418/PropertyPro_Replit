
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, FileText, Send, RefreshCw, Check, Filter } from "lucide-react";
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

const DocumentSigning = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("pending");

  const handleSendReminder = (documentId: number) => {
    // In a real app, would call API to send reminder
    console.log("Sending reminder for document ID:", documentId);
    alert(`Reminder sent for document #${documentId}`);
  };

  const handleViewDocument = (documentId: number) => {
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
