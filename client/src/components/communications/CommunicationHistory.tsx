
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Mail, MessageSquare, Phone } from "lucide-react";

interface Communication {
  id: number;
  type: "email" | "sms" | "whatsapp";
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
}

interface CommunicationHistoryProps {
  communications: Communication[];
}

export function CommunicationHistory({ communications }: CommunicationHistoryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {communications.map((comm) => (
        <div key={comm.id} className="mb-4 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {getIcon(comm.type)}
            <span className="font-medium">{comm.type.toUpperCase()}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comm.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-2 text-sm">{comm.content}</p>
          <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
            <span>From: {comm.sender}</span>
            <span>To: {comm.recipient}</span>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
