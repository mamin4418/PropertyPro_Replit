
import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Check, AlertCircle, ThumbsUp, Download, Shield, Info, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock document for example
const mockDocument = {
  id: 1,
  title: "Sunset Heights Lease Agreement",
  documentType: "Lease",
  status: "pending",
  sentDate: "2023-05-15",
  expiresOn: "2023-05-30",
  sender: {
    name: "Property Management Inc.",
    email: "admin@propertymanagement.com"
  },
  recipient: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567" // Added phone number for communication
  },
  content: `
    <h1>RESIDENTIAL LEASE AGREEMENT</h1>
    <p>This Residential Lease Agreement ("Agreement") is made and entered into on May 15, 2023, by and between Property Management Inc. ("Landlord") and John Doe ("Tenant").</p>

    <h2>1. PROPERTY</h2>
    <p>Landlord hereby leases to Tenant and Tenant hereby leases from Landlord, solely for residential purposes, the premises located at: 123 Main St, Apt 101, Anytown, ST 12345 ("Premises").</p>

    <h2>2. TERM</h2>
    <p>The term of this Agreement shall be for a period of 12 months, commencing on June 1, 2023, and ending on May 31, 2024.</p>

    <h2>3. RENT</h2>
    <p>Tenant agrees to pay, without demand, to Landlord as rent for the Premises the sum of $1,200.00 per month in advance on the 1st day of each month.</p>

    <h2>4. SECURITY DEPOSIT</h2>
    <p>Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $1,200.00 as a security deposit.</p>

    <h2>5. UTILITIES</h2>
    <p>Tenant will be responsible for payment of all utilities and services, except for the following which shall be paid by Landlord: Water and trash collection.</p>

    <h2>6. SIGNATURES</h2>
    <p>By signing below, Tenant acknowledges having read and understood all the terms and conditions of this Agreement and agrees to be bound thereby.</p>

    <div style="margin-top: 30px;">
      <div style="display: inline-block; min-width: 200px; margin-right: 50px;">
        <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="landlord_signature"></p>
        <p>Landlord Signature</p>
      </div>

      <div style="display: inline-block; min-width: 200px;">
        <p style="border-bottom: 1px solid #000; min-height: 40px;" class="signature-field" data-field="tenant_signature"></p>
        <p>Tenant Signature</p>
      </div>
    </div>
  `,
  signingFields: [
    { id: "tenant_signature", type: "signature", label: "Signature", required: true, signed: false },
    { id: "tenant_initials_1", type: "initials", label: "Initials - Page 1", required: true, signed: false },
    { id: "tenant_initials_2", type: "initials", label: "Initials - Page 2", required: true, signed: false }
  ]
};

const ViewDocument = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/view-document/:id");
  const { toast } = useToast();

  const [document, setDocument] = useState(mockDocument);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [currentField, setCurrentField] = useState<any>(null);
  const [signature, setSignature] = useState("");
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [complianceData, setComplianceData] = useState({ipAddress: '', userAgent: ''}); //For Compliance

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");

  // For typed signature
  const [typedName, setTypedName] = useState("");
  const [signatureStyle, setSignatureStyle] = useState("style1");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the document data from API
    if (params?.id) {
      setIsLoading(true);
      setLoadError(null);
      
      fetch(`/api/document-signing/documents/${params.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Loaded document:", data);
          setDocument(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error loading document:", error);
          setLoadError("Failed to load the document. Please try again later.");
          setIsLoading(false);
        });

      // Get IP and UserAgent for compliance
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setComplianceData({...complianceData, ipAddress: data.ip}))
        .catch(err => console.error("Could not fetch IP for compliance:", err));
      
      setComplianceData({...complianceData, userAgent: navigator.userAgent});
    }
  }, [params?.id]);

  const handleStartSign = (fieldId: string) => {
    const field = document.signingFields.find(f => f.id === fieldId);
    if (field) {
      setCurrentField(field);
      setShowSignDialog(true);
    }
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    // Get correct coordinates for mouse or touch event
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get correct coordinates for mouse or touch event
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent 
      ? e.clientX - rect.left 
      : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent 
      ? e.clientY - rect.top 
      : e.touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Initialize canvas
  useEffect(() => {
    if (showSignDialog && canvasRef.current && signatureType === "draw") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
      }
    }
  }, [showSignDialog, signatureType]);

  // Placeholder for compliance logging - needs backend integration
  const logComplianceAction = (action: string) => {
    console.log(`Compliance Action Logged: ${action}, IP: ${complianceData.ipAddress}, UserAgent: ${complianceData.userAgent}`);
    // In a real app, send this data to a server for logging and audit trail.
  };

  // Handle saving the signature
  const saveSignature = () => {
    if (!currentField) return;

    // Record consent and signing action for compliance
    logComplianceAction(`field_signed:${currentField.id}`);

    // In a real app, we would:
    // 1. Send the signature data to the API
    // 2. Include IP, timestamp, device information
    // 3. Record consent for UETA/ESIGN compliance

    // Create signature audit data (would be sent to server)
    const signatureAuditData = {
      fieldId: currentField.id,
      signedAt: new Date().toISOString(),
      ipAddress: complianceData.ipAddress,
      userAgent: complianceData.userAgent,
      signatureType: signatureType,
      signatureStyle: signatureStyle,
      consentGiven: true
    };

    console.log("Signature audit data:", signatureAuditData);

    const updatedFields = document.signingFields.map(field => {
      if (field.id === currentField.id) {
        return { 
          ...field, 
          signed: true,
          signedAt: new Date().toISOString(),
          signatureData: signatureAuditData
        };
      }
      return field;
    });

    setDocument({
      ...document,
      signingFields: updatedFields
    });

    setShowSignDialog(false);

    // Check if all fields are signed
    const allSigned = updatedFields.every(field => field.signed);
    if (allSigned) {
      setShowCompletedDialog(true);
    }
  };

  const completeDocument = () => {
    // In a real app, we would submit the signed document to the API
    toast({
      title: "Document Completed",
      description: "Your signed document has been submitted successfully."
    });

    setShowCompletedDialog(false);
    navigate("/document-signing");
  };

  const sendDocument = async (method: 'email' | 'text' | 'whatsapp') => {
    try {
      const response = await fetch(`/api/sendDocument?id=${document.id}&method=${method}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast({
        title: 'Document Sent',
        description: `Document sent successfully via ${method}.`
      });
    } catch (error) {
      console.error("Error sending document:", error);
      toast({
        title: 'Error',
        description: `Failed to send document via ${method}.`
      });
    }
  };


  return (
    <div className="pb-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate("/document-signing")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        {!isLoading && !loadError && (
          <h2 className="text-2xl font-bold">{document.title}</h2>
        )}
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading document...</p>
          </div>
        </div>
      )}
      
      {loadError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Document</h2>
              <p className="text-center text-muted-foreground mb-4">{loadError}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!isLoading && !loadError && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Document Preview</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="p-6 border rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge 
                      variant="outline" 
                      className={
                        document.status === "completed" 
                          ? "text-green-500 border-green-500" 
                          : document.status === "viewed"
                          ? "text-blue-500 border-blue-500"
                          : "text-amber-500 border-amber-500"
                      }
                    >
                      {document.status === "completed"
                        ? "Completed"
                        : document.status === "viewed"
                        ? "Viewed"
                        : "Awaiting Signature"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent By</p>
                  <p className="mt-1">{document.sender.name}</p>
                  <p className="text-sm text-muted-foreground">{document.sender.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <p className="mt-1">{document.recipient.name}</p>
                  <p className="text-sm text-muted-foreground">{document.recipient.email}</p>
                  <p className="text-sm text-muted-foreground">{document.recipient.phone}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent On</p>
                  <p className="mt-1">{document.sentDate}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expires On</p>
                  <p className="mt-1">{document.expiresOn}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm font-medium mb-2">Required Fields</p>
                <div className="w-full space-y-2">
                  {document.signingFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {field.signed ? (
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                        )}
                        <span className={field.signed ? "line-through text-muted-foreground" : ""}>{field.label}</span>
                      </div>
                      {!field.signed && (
                        <Button variant="outline" size="sm" onClick={() => handleStartSign(field.id)}>
                          Sign
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
            <div className="mt-4">
              <Button onClick={() => sendDocument('email')}>Send via Email</Button>
              <Button onClick={() => sendDocument('text')}>Send via Text</Button>
              {/* WhatsApp integration requires a specific API or library */}
              <Button onClick={() => sendDocument('whatsapp')} disabled>Send via WhatsApp (Not Implemented)</Button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Signature</DialogTitle>
            <DialogDescription>
              {currentField?.type === "signature" 
                ? "Please sign below to continue." 
                : "Please provide your initials below."}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={signatureType} onValueChange={(v) => setSignatureType(v as "draw" | "type")} className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="type">Type</TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="mt-4">
              <div className="border rounded-md overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={200}
                  className="bg-white w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                />
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={clearCanvas}>
                Clear
              </Button>
            </TabsContent>

            <TabsContent value="type" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="typedName">Type your {currentField?.type === "signature" ? "name" : "initials"}</Label>
                  <Input
                    id="typedName"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder={currentField?.type === "signature" ? "Your name" : "Your initials"}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Select a style</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Button
                      type="button"
                      variant={signatureStyle === "style1" ? "default" : "outline"}
                      className={`font-signature1 h-14 text-lg ${signatureStyle === "style1" ? "" : "hover:bg-secondary"}`}
                      onClick={() => setSignatureStyle("style1")}
                    >
                      {typedName || "Your Name"}
                    </Button>
                    <Button
                      type="button"
                      variant={signatureStyle === "style2" ? "default" : "outline"}
                      className={`font-signature2 h-14 text-lg ${signatureStyle === "style2" ? "" : "hover:bg-secondary"}`}
                      onClick={() => setSignatureStyle("style2")}
                    >
                      {typedName || "Your Name"}
                    </Button>
                    <Button
                      type="button"
                      variant={signatureStyle === "style3" ? "default" : "outline"}
                      className={`font-signature3 h-14 text-lg ${signatureStyle === "style3" ? "" : "hover:bg-secondary"}`}
                      onClick={() => setSignatureStyle("style3")}
                    >
                      {typedName || "Your Name"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSignDialog(false)}>Cancel</Button>
            <Button onClick={saveSignature}>
              <Check className="mr-2 h-4 w-4" />
              {currentField?.type === "signature" ? "Sign Document" : "Add Initials"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Completed Dialog */}
      <Dialog open={showCompletedDialog} onOpenChange={setShowCompletedDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Document Completed!</DialogTitle>
            <DialogDescription>
              You have successfully signed all required fields. Would you like to submit the document now?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-6">
            <ThumbsUp className="h-16 w-16 text-green-500" />
          </div>

          <DialogFooter>
            <Button onClick={completeDocument}>
              <Send className="mr-2 h-4 w-4" />
              Submit Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewDocument;
