
import { toast } from "@/hooks/use-toast";

/**
 * Handles sending documents via different communication methods
 */
export const sendDocumentViaCommunication = async (
  documentId: number,
  method: string,
  recipient: string,
  message: string = ""
): Promise<void> => {
  try {
    const response = await fetch(`/api/document-signing/documents/${documentId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method,
        recipient,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send document');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending document:', error);
    toast({
      variant: "destructive",
      title: "Failed to Send Document",
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};

/**
 * Verifies if a communication method is valid for a given recipient
 * Used for validation before sending
 */
export const validateCommunicationMethod = (
  method: string,
  recipient: string
): { valid: boolean; message?: string } => {
  switch (method) {
    case 'email':
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient)) {
        return { valid: false, message: 'Please enter a valid email address' };
      }
      break;
    case 'sms':
    case 'whatsapp':
      // Basic phone validation - adjust based on your requirements
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(recipient.replace(/\s+/g, ''))) {
        return { valid: false, message: 'Please enter a valid phone number' };
      }
      break;
    default:
      return { valid: false, message: 'Unsupported communication method' };
  }

  return { valid: true };
};

/**
 * Generates a compliance-ready audit trail for document communications
 */
export const generateCommunicationAuditTrail = (
  documentId: number,
  method: string,
  recipient: string,
  timestamp: string,
  ipAddress: string,
  userAgent: string
): Record<string, any> => {
  return {
    documentId,
    communicationMethod: method,
    recipient,
    timestamp,
    senderIpAddress: ipAddress,
    userAgent,
    // Additional UETA/ESIGN required data
    uetaCompliant: true,
    esignCompliant: true,
    retentionPeriod: '7 years', // Example retention period
  };
};
