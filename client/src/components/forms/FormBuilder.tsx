import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Grip,
  Plus,
  Trash2,
  Copy,
  Settings,
  CheckSquare,
  Calendar,
  Type,
  Hash,
  List,
  FileText,
} from "lucide-react";

// Field types supported by the form builder
const FIELD_TYPES = [
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "textarea", label: "Text Area", icon: <FileText className="h-4 w-4" /> },
  { id: "number", label: "Number", icon: <Hash className="h-4 w-4" /> },
  { id: "checkbox", label: "Checkbox", icon: <CheckSquare className="h-4 w-4" /> },
  { id: "select", label: "Dropdown", icon: <List className="h-4 w-4" /> },
  { id: "date", label: "Date", icon: <Calendar className="h-4 w-4" /> },
];

// Interfaces
interface FieldOption {
  id: string;
  label: string;
  value: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FieldOption[];
  section?: string;
  validation?: any;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
}

interface FormBuilderProps {
  initialFields?: FormField[];
  initialSections?: FormSection[];
  onChange?: (fields: FormField[], sections: FormSection[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialFields = [],
  initialSections = [{ id: "default", title: "General Information" }],
  onChange,
}) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [sections, setSections] = useState<FormSection[]>(initialSections);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [editingSection, setEditingSection] = useState<FormSection | null>(null);

  // Notify parent component of changes
  const handleChange = () => {
    if (onChange) {
      onChange(fields, sections);
    }
  };

  // Add a new field
  const addField = (type: string, sectionId: string = "default") => {
    const newId = `field-${Date.now()}`;
    const newField: FormField = {
      id: newId,
      type,
      label: getDefaultLabel(type),
      placeholder: "",
      helpText: "",
      required: false,
      section: sectionId,
      ...(type === "select" ? { options: [{ id: `option-${Date.now()}`, label: "Option 1", value: "option1" }] } : {}),
    };
    
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    setEditingField(newField);
    
    if (onChange) {
      onChange(updatedFields, sections);
    }
  };

  // Get default label based on field type
  const getDefaultLabel = (type: string): string => {
    switch (type) {
      case "text": return "Text Field";
      case "textarea": return "Text Area";
      case "number": return "Number Field";
      case "checkbox": return "Checkbox";
      case "select": return "Dropdown";
      case "date": return "Date";
      default: return "New Field";
    }
  };

  // Add a new section
  const addSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection: FormSection = {
      id: newId,
      title: `Section ${sections.length + 1}`,
      description: "",
    };
    
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setEditingSection(newSection);
    
    if (onChange) {
      onChange(fields, updatedSections);
    }
  };

  // Remove a field
  const removeField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    
    if (editingField?.id === id) {
      setEditingField(null);
    }
    
    if (onChange) {
      onChange(updatedFields, sections);
    }
  };

  // Remove a section
  const removeSection = (id: string) => {
    // Don't remove the last section
    if (sections.length <= 1) return;
    
    // Move fields from this section to default section
    const updatedFields = fields.map(field => 
      field.section === id ? { ...field, section: "default" } : field
    );
    
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
    setFields(updatedFields);
    
    if (editingSection?.id === id) {
      setEditingSection(null);
    }
    
    if (onChange) {
      onChange(updatedFields, updatedSections);
    }
  };

  // Duplicate a field
  const duplicateField = (field: FormField) => {
    const newId = `field-${Date.now()}`;
    const newField = {
      ...field,
      id: newId,
      label: `${field.label} (Copy)`,
    };
    
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    
    if (onChange) {
      onChange(updatedFields, sections);
    }
  };

  // Move field up or down
  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFields = [...fields];
    const field = newFields[index];
    newFields.splice(index, 1);
    newFields.splice(newIndex, 0, field);
    
    setFields(newFields);
    
    if (onChange) {
      onChange(newFields, sections);
    }
  };

  // Update a field property
  const updateField = (id: string, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    
    setFields(updatedFields);
    
    if (editingField?.id === id) {
      setEditingField({ ...editingField, ...updates });
    }
    
    if (onChange) {
      onChange(updatedFields, sections);
    }
  };

  // Update a section
  const updateSection = (id: string, updates: Partial<FormSection>) => {
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, ...updates } : section
    );
    
    setSections(updatedSections);
    
    if (editingSection?.id === id) {
      setEditingSection({ ...editingSection, ...updates });
    }
    
    if (onChange) {
      onChange(fields, updatedSections);
    }
  };

  // Add option to select field
  const addOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    
    const newOption: FieldOption = {
      id: `option-${Date.now()}`,
      label: `Option ${field.options.length + 1}`,
      value: `option${field.options.length + 1}`,
    };
    
    const updatedOptions = [...field.options, newOption];
    updateField(fieldId, { options: updatedOptions });
  };

  // Remove option from select field
  const removeOption = (fieldId: string, optionId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    
    // Don't remove the last option
    if (field.options.length <= 1) return;
    
    const updatedOptions = field.options.filter(opt => opt.id !== optionId);
    updateField(fieldId, { options: updatedOptions });
  };

  // Update option
  const updateOption = (fieldId: string, optionId: string, updates: Partial<FieldOption>) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    
    const updatedOptions = field.options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    
    updateField(fieldId, { options: updatedOptions });
  };

  // Get section fields
  const getSectionFields = (sectionId: string) => {
    return fields.filter(field => field.section === sectionId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Field Types Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Field Types</CardTitle>
            <CardDescription>
              Click to add fields to your form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {FIELD_TYPES.map((fieldType) => (
                <Button
                  key={fieldType.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => addField(fieldType.id)}
                >
                  {fieldType.icon}
                  <span className="mt-2">{fieldType.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={addSection}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Field Properties Panel */}
        {editingField && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Field Properties</CardTitle>
              <CardDescription>
                Configure the selected field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  value={editingField.label}
                  onChange={(e) => updateField(editingField.id, { label: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={editingField.placeholder || ""}
                  onChange={(e) => updateField(editingField.id, { placeholder: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="field-help">Help Text</Label>
                <Input
                  id="field-help"
                  value={editingField.helpText || ""}
                  onChange={(e) => updateField(editingField.id, { helpText: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="field-section">Section</Label>
                <Select
                  value={editingField.section || "default"}
                  onValueChange={(value) => updateField(editingField.id, { section: value })}
                >
                  <SelectTrigger id="field-section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={editingField.required}
                  onCheckedChange={(checked) => updateField(editingField.id, { required: checked })}
                />
                <Label htmlFor="field-required">Required Field</Label>
              </div>
              
              {editingField.type === "select" && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {editingField.options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Input
                        value={option.label}
                        onChange={(e) => 
                          updateOption(editingField.id, option.id, { 
                            label: e.target.value,
                            value: e.target.value.toLowerCase().replace(/\s+/g, '_')
                          })
                        }
                        placeholder="Option label"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(editingField.id, option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(editingField.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Section Properties Panel */}
        {editingSection && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Section Properties</CardTitle>
              <CardDescription>
                Configure the selected section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={editingSection.title}
                  onChange={(e) => updateSection(editingSection.id, { title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  value={editingSection.description || ""}
                  onChange={(e) => updateSection(editingSection.id, { description: e.target.value })}
                  rows={3}
                />
              </div>
              
              {sections.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSection(editingSection.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Section
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Form Preview Panel */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>
              Preview and organize your application form
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sections.map((section) => {
              const sectionFields = getSectionFields(section.id);
              
              return (
                <div 
                  key={section.id} 
                  className="mb-8 border rounded-lg p-4"
                  onClick={() => setEditingSection(section)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{section.title}</h3>
                      {section.description && (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingSection(section)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {sectionFields.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                        <p>Add fields to this section</p>
                      </div>
                    ) : (
                      sectionFields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`border rounded-lg p-3 ${
                            editingField?.id === field.id
                              ? "border-primary"
                              : "border-border"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingField(field);
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div 
                                className="mr-2 cursor-move text-muted-foreground flex"
                              >
                                <Grip className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{field.label}</span>
                              {field.required && (
                                <span className="ml-1 text-destructive">*</span>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveField(field.id, 'up');
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveField(field.id, 'down');
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="m12 5 7 7-7 7"/><path d="M5 12h14"/></svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateField(field);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Field preview */}
                          <div className="pl-6">
                            {renderFieldPreview(field)}
                            {field.helpText && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {FIELD_TYPES.map((type) => (
                        <Button
                          key={type.id}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addField(type.id, section.id);
                          }}
                        >
                          {type.icon}
                          <span className="ml-2">Add {type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {fields.length === 0 && sections.length === 1 && (
              <div className="text-center p-10 border border-dashed rounded-lg text-muted-foreground">
                <p className="mb-4">Your form is empty. Add fields from the panel on the left.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {FIELD_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(type.id)}
                    >
                      {type.icon}
                      <span className="ml-2">Add {type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => {
                setFields([]);
                setSections([{ id: "default", title: "General Information" }]);
                if (onChange) {
                  onChange([], [{ id: "default", title: "General Information" }]);
                }
              }}
            >
              Reset Form
            </Button>
            <Button onClick={handleChange}>
              Save Template
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Render field preview based on type
const renderFieldPreview = (field: FormField) => {
  switch (field.type) {
    case "text":
      return (
        <Input
          placeholder={field.placeholder || "Text input"}
          disabled
        />
      );
    case "textarea":
      return (
        <Textarea
          placeholder={field.placeholder || "Text area"}
          disabled
        />
      );
    case "number":
      return (
        <Input
          type="number"
          placeholder={field.placeholder || "Numeric input"}
          disabled
        />
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Switch id={`preview-${field.id}`} disabled />
          <Label htmlFor={`preview-${field.id}`}>{field.placeholder || "Checkbox option"}</Label>
        </div>
      );
    case "select":
      return (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "date":
      return (
        <Input
          type="date"
          disabled
        />
      );
    default:
      return (
        <Input
          placeholder="Field preview"
          disabled
        />
      );
  }
};

export default FormBuilder;