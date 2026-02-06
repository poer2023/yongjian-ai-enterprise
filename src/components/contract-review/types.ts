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

export interface PartyInfo {
  name: string;
  address: string;
  legalRep: string;
  contact: string;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
}

export interface ContractContent {
  title: string;
  contractNo: string;
  signDate: string;
  partyA: PartyInfo;
  partyB: PartyInfo;
  clauses: Clause[];
}

export interface HistoryState {
  modifications: Modification[];
  clauseContents: Record<string, string>;
}
