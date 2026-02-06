export type ChangeStatus = 'pending' | 'accepted' | 'rejected';
export type ChangeType = 'add' | 'del' | 'mod';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface DiffItem {
  id: string;
  type: ChangeType;
  location: string;
  originalText: string;
  newText: string;
  description: string;
  riskLevel: RiskLevel;
  status: ChangeStatus;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
}

export interface Contract {
  title: string;
  version: string;
  date: string;
  partyA: string;
  partyB: string;
  clauses: ContractClause[];
}

export interface ComparisonStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  highRisk: number;
}
