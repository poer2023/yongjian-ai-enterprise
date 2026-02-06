// Types for DocumentCorrectionResultView

export type ChangeStatus = 'pending' | 'accepted' | 'rejected';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface Modification {
  id: string;
  clauseId: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  riskLevel: RiskLevel;
  status: ChangeStatus;
  expanded: boolean;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
}

export interface Sender {
  name: string;
  lawyer: string;
  phone: string;
  address: string;
}

export interface Recipient {
  name: string;
  address: string;
}

export interface DocumentContent {
  title: string;
  docNo: string;
  createDate: string;
  sender: Sender;
  recipient: Recipient;
  clauses: Clause[];
}

export interface HistoryState {
  modifications: Modification[];
  clauseContents: Record<string, string>;
}
