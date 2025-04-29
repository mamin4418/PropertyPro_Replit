
/**
 * Utilities for UETA/ESIGN Act compliance
 */

// Types for compliance tracking
export interface ComplianceAction {
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export interface ComplianceAuditTrail {
  documentId: string | number;
  actions: ComplianceAction[];
  startTime: string;
  completionTime?: string;
  signers: {
    id: string | number;
    name: string;
    email: string;
    consentTimestamp?: string;
    signatureTimestamp?: string;
    ipAddress?: string;
    verificationMethod?: string;
  }[];
}

// Creates a new compliance audit trail
export const createComplianceAuditTrail = (
  documentId: string | number
): ComplianceAuditTrail => {
  return {
    documentId,
    actions: [],
    startTime: new Date().toISOString(),
    signers: [],
  };
};

// Adds a signer to the audit trail
export const addSigner = (
  auditTrail: ComplianceAuditTrail,
  id: string | number,
  name: string,
  email: string
): ComplianceAuditTrail => {
  const updatedTrail = { ...auditTrail };
  updatedTrail.signers.push({
    id,
    name,
    email,
  });
  return updatedTrail;
};

// Records a compliance action
export const recordComplianceAction = (
  auditTrail: ComplianceAuditTrail,
  action: string,
  ipAddress?: string,
  userAgent?: string,
  details?: Record<string, any>
): ComplianceAuditTrail => {
  const updatedTrail = { ...auditTrail };
  updatedTrail.actions.push({
    action,
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent,
    details,
  });
  return updatedTrail;
};

// Records consent from a signer
export const recordConsent = (
  auditTrail: ComplianceAuditTrail,
  signerId: string | number,
  ipAddress?: string,
  verificationMethod: string = 'self-attestation'
): ComplianceAuditTrail => {
  const updatedTrail = { ...auditTrail };
  const signerIndex = updatedTrail.signers.findIndex(s => s.id === signerId);
  
  if (signerIndex >= 0) {
    updatedTrail.signers[signerIndex] = {
      ...updatedTrail.signers[signerIndex],
      consentTimestamp: new Date().toISOString(),
      ipAddress,
      verificationMethod,
    };
  }
  
  // Also record as an action
  updatedTrail.actions.push({
    action: 'consent_recorded',
    timestamp: new Date().toISOString(),
    ipAddress,
    details: { signerId, verificationMethod },
  });
  
  return updatedTrail;
};

// Records a signature from a signer
export const recordSignature = (
  auditTrail: ComplianceAuditTrail,
  signerId: string | number,
  ipAddress?: string,
  details?: Record<string, any>
): ComplianceAuditTrail => {
  const updatedTrail = { ...auditTrail };
  const signerIndex = updatedTrail.signers.findIndex(s => s.id === signerId);
  
  if (signerIndex >= 0) {
    updatedTrail.signers[signerIndex] = {
      ...updatedTrail.signers[signerIndex],
      signatureTimestamp: new Date().toISOString(),
      ipAddress,
    };
  }
  
  // Also record as an action
  updatedTrail.actions.push({
    action: 'signature_recorded',
    timestamp: new Date().toISOString(),
    ipAddress,
    details: { signerId, ...details },
  });
  
  return updatedTrail;
};

// Completes the audit trail
export const completeAuditTrail = (
  auditTrail: ComplianceAuditTrail
): ComplianceAuditTrail => {
  const updatedTrail = { ...auditTrail };
  updatedTrail.completionTime = new Date().toISOString();
  
  // Record completion action
  updatedTrail.actions.push({
    action: 'document_completed',
    timestamp: new Date().toISOString(),
  });
  
  return updatedTrail;
};

// Generates a human-readable verification certificate text
export const generateVerificationCertificate = (
  auditTrail: ComplianceAuditTrail,
  documentTitle: string
): string => {
  const completionDate = auditTrail.completionTime 
    ? new Date(auditTrail.completionTime).toLocaleString() 
    : 'Not completed';
  
  let certificate = `
ELECTRONIC SIGNATURE VERIFICATION CERTIFICATE

Document: ${documentTitle}
Document ID: ${auditTrail.documentId}
Completion Date: ${completionDate}

SIGNERS:
${auditTrail.signers.map(signer => `
- ${signer.name} (${signer.email})
  Consent Given: ${signer.consentTimestamp ? new Date(signer.consentTimestamp).toLocaleString() : 'No'}
  Signature Date: ${signer.signatureTimestamp ? new Date(signer.signatureTimestamp).toLocaleString() : 'Not signed'}
  Verification Method: ${signer.verificationMethod || 'N/A'}
`).join('')}

AUDIT TRAIL:
${auditTrail.actions.map(action => `
- ${new Date(action.timestamp).toLocaleString()}: ${action.action}
`).join('')}

This document was signed in compliance with:
- Uniform Electronic Transactions Act (UETA)
- Electronic Signatures in Global and National Commerce Act (ESIGN)

Certificate Generated: ${new Date().toLocaleString()}
  `;
  
  return certificate;
};
