// Types for BidInfoDailyView

export interface HistoryReport {
  date: string;
  weekday: string;
  total: number;
  highMatch: number;
  mediumMatch: number;
  lowMatch: number;
  summary: string;
}

export interface BidInfo {
  id: number;
  title: string;
  publisher: string;
  budget: number;
  deadline: string;
  matchLevel: 'high' | 'medium' | 'low';
  matchScore: number;
  matchReason: string;
  status?: string;
  type: string;
  region: string;
}

export interface AiSummary {
  keyFocus: string;
  bidSuggestion: string;
  riskAlert: string;
}

export interface FilterCounts {
  match: { high: number; medium: number; low: number };
  type: { service: number; goods: number; engineering: number };
  region: Record<string, number>;
}

export interface ExpandedGroups {
  match: boolean;
  type: boolean;
  region: boolean;
}
