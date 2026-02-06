// Types for DocumentReviewResultView

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

export interface Plaintiff {
  name: string;
  gender: string;
  birthDate: string;
  nationality: string;
  idNumber: string;
  address: string;
  phone: string;
}

export interface Defendant {
  name: string;
  legalRep: string;
  position: string;
  address: string;
  phone: string;
}

export interface DocumentContent {
  title: string;
  caseNo: string;
  createDate: string;
  plaintiff: Plaintiff;
  defendant: Defendant;
  clauses: Clause[];
}

export interface HistoryState {
  modifications: Modification[];
  clauseContents: Record<string, string>;
}
