import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  User, 
  ArrowLeft,
  Calendar,
  Upload,
  Home,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

const AddTenant = () => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    alternatePhone: "",
    dateOfBirth: "",
    ssn: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    employmentStatus: "",
    employerName: "",
    annualIncome: "",
    creditScore: "",
    preferredContactMethod: "email",
    property: "",
    unit: "",
    notes: ""
  });

  const [files, setFiles] = useState<{
    photo: File | null;
    idDocument: File | null;
    proofOfIncome: File | null;
    backgroundCheck: File | null;
  }>({
    photo: null,
    idDocument: null,
    proofOfIncome: null,
    backgroundCheck: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [fileType]: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the data to the backend
    console.log("Form submitted:", formData);
    console.log("Files:", files);
    navigate("/tenants");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/tenants")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
        <h2 className="text-2xl font-bold">Add New Tenant</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      className="mt-1"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      className="mt-1"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      className="mt-1"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number*</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      className="mt-1"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      name="alternatePhone"
                      placeholder="Enter alternate phone"
                      className="mt-1"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="mt-1"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ssn">SSN/Tax ID (Last 4 digits)</Label>
                    <Input
                      id="ssn"
                      name="ssn"
                      placeholder="Enter last 4 digits"
                      className="mt-1"
                      maxLength={4}
                      value={formData.ssn}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      placeholder="Enter emergency contact name"
                      className="mt-1"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      placeholder="Enter emergency contact phone"
                      className="mt-1"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employment & Financial Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Employment & Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                    >
                      <SelectTrigger id="employmentStatus" className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      name="employerName"
                      placeholder="Enter employer name"
                      className="mt-1"
                      value={formData.employerName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="annualIncome">Annual Income</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="annualIncome"
                        name="annualIncome"
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.annualIncome}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      name="creditScore"
                      type="number"
                      min="300"
                      max="850"
                      placeholder="Enter credit score (300-850)"
                      className="mt-1"
                      value={formData.creditScore}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Housing Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Housing Assignment</h3>
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
                </div>
              </div>

              <Separator />

              {/* Communication Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-4">Communication Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) => handleSelectChange("preferredContactMethod", value)}
                    >
                      <SelectTrigger id="preferredContactMethod" className="mt-1">
                        <SelectValue placeholder="Select preferred method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="mail">Mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Documents & Attachments */}
              <div>
                <h3 className="text-lg font-medium mb-4">Documents & Attachments</h3>
                <div className="w-full">
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Upload ID documents, tenant photos, proof of income and background checks
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB per file)</p>
                          <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                          {Object.values(files).some(file => file !== null) && (
                            <div className="mt-2 text-xs text-primary">
                              {Object.entries(files).map(([key, file]) => (
                                file && <p key={key}>File: {file.name}</p>
                              ))}
                            </div>
                          )}
                        </div>
                        <input 
                          id="documents" 
                          name="documents" 
                          type="file" 
                          className="hidden" 
                          accept="image/png, image/jpeg, image/jpg, application/pdf"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              // In a real application, we would handle multiple files 
                              // Here we're just showing the first file for demonstration
                              const file = e.target.files[0];
                              setFiles(prev => ({
                                ...prev,
                                photo: file
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter any additional notes or information"
                  className="mt-1"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => navigate("/tenants")}>
                Cancel
              </Button>
              <Button type="submit">
                <User className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTenant;