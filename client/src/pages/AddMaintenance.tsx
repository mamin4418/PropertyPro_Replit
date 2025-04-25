import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Drill, 
  ArrowLeft,
  Calendar,
  Building,
  Home,
  User,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const AddMaintenance = () => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    title: "",
    description: "",
    priority: "normal",
    status: "open",
    reportedBy: "",
    contactInfo: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the data to the backend
    console.log("Form submitted:", formData);
    navigate("/maintenance");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/maintenance")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Maintenance
        </Button>
        <h2 className="text-2xl font-bold">New Maintenance Request</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select 
                  value={formData.property} 
                  onValueChange={(value) => handleSelectChange("property", value)}
                >
                  <SelectTrigger id="property" className="mt-1">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset Heights</SelectItem>
                    <SelectItem value="maple">Maple Gardens</SelectItem>
                    <SelectItem value="urban">Urban Lofts</SelectItem>
                    <SelectItem value="riverfront">Riverfront Condos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange("unit", value)}
                >
                  <SelectTrigger id="unit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apt101">Apt 101</SelectItem>
                    <SelectItem value="apt102">Apt 102</SelectItem>
                    <SelectItem value="apt201">Apt 201</SelectItem>
                    <SelectItem value="apt202">Apt 202</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a brief title for the issue"
                  className="mt-1"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the maintenance issue in detail"
                  className="mt-1"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Priority</Label>
                <RadioGroup 
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent" className="font-normal">Urgent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="font-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="font-normal">Low</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input
                  id="reportedBy"
                  name="reportedBy"
                  placeholder="Name of person reporting"
                  className="mt-1"
                  value={formData.reportedBy}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  placeholder="Phone or email"
                  className="mt-1"
                  value={formData.contactInfo}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="documents">Photos & Documents</Label>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upload photos of the issue, repair quotes, or other relevant documents
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, PDF (MAX. 10MB per file)</p>
                        <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                      </div>
                      <input 
                        id="documents" 
                        name="documents" 
                        type="file" 
                        className="hidden" 
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        multiple
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => navigate("/maintenance")}>
                Cancel
              </Button>
              <Button type="submit">
                <Drill className="mr-2 h-4 w-4" />
                Create Maintenance Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMaintenance;