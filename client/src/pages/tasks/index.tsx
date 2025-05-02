
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardList, Clock, Plus } from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

export default function Tasks() {
  return (
    <div className="container mx-auto py-6">
      <PageBreadcrumb items={[{ label: "Tasks" }]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/tasks/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-primary/10 border-b">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" /> 
              Task Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">Manage all your property-related tasks in one place.</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>Track deadlines and priorities</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Mark tasks as complete</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-center">
            <Link href="/tasks/all">
              <Button variant="outline">View All Tasks</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="bg-primary/10 border-b">
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" /> 
              Create New Task
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">Quickly add new tasks to your property management workflow.</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>Set due dates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Assign priority levels</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-center">
            <Link href="/tasks/add">
              <Button variant="outline">Add New Task</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="bg-primary/10 border-b">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" /> 
              Task Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Open Tasks</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-muted-foreground">1</div>
                <div className="text-sm text-muted-foreground">Completed Tasks</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-center">
            <Link href="/tasks/all">
              <Button variant="outline">View Task Stats</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
