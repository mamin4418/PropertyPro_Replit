
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";

interface TemplateSection {
  id: string;
  title: string;
  content: string;
}

const GenerateLeaseTemplate = () => {
  const [, navigate] = useLocation();
  const [templateName, setTemplateName] = useState("");
  const [sections, setSections] = useState<TemplateSection[]>([
    {
      id: "1",
      title: "Rent Details",
      content: "The monthly rent is {{RENT_AMOUNT}} payable by {{DUE_DATE}} of each month."
    }
  ]);

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
    // TODO: Implement save functionality
    console.log("Template saved:", { name: templateName, sections });
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
