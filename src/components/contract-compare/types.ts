export type ChangeStatus = 'pending' | 'accepted' | 'rejected';
export type DiffLevel = 'high' | 'medium' | 'low';

export interface Difference {
  id: string;
  clauseId: string;
  baseText: string;
  compareText: string;
  diffNote: string;
  diffLevel: DiffLevel;
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
  differences: Difference[];
  clauseContents: Record<string, string>;
}
