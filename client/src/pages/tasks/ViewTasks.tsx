
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FilterX } from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { Link } from "wouter";

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Change Locks on New Unit",
    priority: "High",
    date: "Feb 28",
    status: "todo"
  },
  {
    id: 2,
    title: "Check Gutters at 1 Main St",
    priority: "Medium",
    date: "Feb 18",
    status: "todo"
  },
  {
    id: 3,
    title: "Clean Front Yard",
    priority: "Low",
    date: "Jan 07",
    status: "todo"
  },
  {
    id: 4,
    title: "Replace HVAC Filter",
    priority: "Medium",
    date: "Jan 02",
    status: "completed"
  }
];

export default function ViewTasks() {
  const [activeTab, setActiveTab] = useState("todo");
  const [filter, setFilter] = useState("");
  
  const todoTasks = mockTasks.filter(task => task.status === "todo");
  const completedTasks = mockTasks.filter(task => task.status === "completed");
  
  const filteredTodoTasks = todoTasks.filter(task => 
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.priority.toLowerCase().includes(filter.toLowerCase()) ||
    task.date.toLowerCase().includes(filter.toLowerCase())
  );
  
  const filteredCompletedTasks = completedTasks.filter(task => 
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.priority.toLowerCase().includes(filter.toLowerCase()) ||
    task.date.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <PageBreadcrumb items={[{ label: "Tasks", href: "/tasks" }, { label: "View All Tasks" }]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/tasks/add">
          <Button>Add Task</Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <Tabs defaultValue="todo" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="todo">
                To Do <Badge className="ml-2 bg-primary">{todoTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed Tasks <Badge className="ml-2 bg-muted">{completedTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-between items-center mb-4">
              <Input 
                placeholder="Filter tasks..." 
                className="max-w-sm" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setFilter("")}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
            
            <TabsContent value="todo">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Action</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTodoTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="outline" 
                          className={
                            task.priority === "High" ? "text-red-500 border-red-500" : 
                            task.priority === "Medium" ? "text-blue-500 border-blue-500" : 
                            "text-green-500 border-green-500"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{task.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="completed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Action</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompletedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox checked={true} />
                      </TableCell>
                      <TableCell className="line-through text-muted-foreground">{task.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-muted-foreground">
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{task.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
