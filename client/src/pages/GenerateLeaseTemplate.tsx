
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import JSZip from "jszip";

interface TemplateSection {
  id: string;
  title: string;
  content: string;
}

const GenerateLeaseTemplate = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    try {
      let text = "";
      
      // Handle different file types
      if (file.name.toLowerCase().endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } 
      else if (file.name.toLowerCase().endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        text = fullText;
      }
      else {
        throw new Error("Unsupported file format");
      }

      // Split text into sections based on common lease section headers
      const sectionHeaders = [
        "PARTIES",
        "TERM",
        "RENT",
        "SECURITY DEPOSIT",
        "UTILITIES",
        "MAINTENANCE",
        "PETS",
        "ALTERATIONS",
        "ACCESS",
        "TERMINATION"
      ];

      let currentSection = { title: "General", content: "" };
      const parsedSections: TemplateSection[] = [];
      
      const lines = text.split("\n");
      lines.forEach(line => {
        const upperLine = line.trim().toUpperCase();
        const matchedHeader = sectionHeaders.find(header => upperLine.includes(header));
        
        if (matchedHeader) {
          if (currentSection.content.trim()) {
            parsedSections.push({
              id: Date.now().toString() + parsedSections.length,
              title: currentSection.title,
              content: currentSection.content.trim()
            });
          }
          currentSection = { title: matchedHeader, content: line + "\n" };
        } else {
          currentSection.content += line + "\n";
        }
      });

      // Add the last section
      if (currentSection.content.trim()) {
        parsedSections.push({
          id: Date.now().toString() + parsedSections.length,
          title: currentSection.title,
          content: currentSection.content.trim()
        });
      }

      setSections(parsedSections);
      toast({
        title: "Document processed successfully",
        description: `Created ${parsedSections.length} sections from the document.`
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing document",
        description: "Failed to process the uploaded document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: "New Section",
        content: ""
      }
    ]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    // Save template to localStorage
    const templates = JSON.parse(localStorage.getItem('leaseTemplates') || '{}');
    templates[templateName] = sections;
    localStorage.setItem('leaseTemplates', JSON.stringify(templates));

    toast({
      title: "Template saved",
      description: "Your lease template has been saved successfully"
    });
    navigate("/leases");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate("/leases")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leases
        </Button>
        <h2 className="text-2xl font-bold">Generate Lease Template</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fileUpload">Upload Existing Lease</Label>
              <div className="mt-1">
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleFileUpload}
                  disabled={processing}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: DOCX, PDF
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mr-4">
                  <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                  <Input
                    id={`title-${section.id}`}
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeSection(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label htmlFor={`content-${section.id}`}>Content</Label>
                <Textarea
                  id={`content-${section.id}`}
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" className="w-full" onClick={addSection}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h2>{templateName || "Untitled Template"}</h2>
            {sections.map((section) => (
              <div key={section.id} className="mb-4">
                <h3>{section.title}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6 gap-3">
        <Button variant="outline" onClick={() => navigate("/leases")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <FileText className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </div>
    </div>
  );
};

export default GenerateLeaseTemplate;
