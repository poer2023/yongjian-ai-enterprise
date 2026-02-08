// Types for BidDocSmartFormView

export interface Enterprise {
  id: number;
  name: string;
  certCount: number;
  caseCount: number;
  teamCount: number;
  recentCerts: string[];
}

export interface ScoringItem {
  name: string;
  score: number;
  key: string;
}

export interface Qualification {
  name: string;
  status: string;
  matched: string;
}

export interface TimelineItem {
  event: string;
  date: string;
  urgent: boolean;
}

export interface RiskItem {
  level: 'high' | 'medium' | 'low';
  desc: string;
}

export interface ParsedAnalysis {
  scoringItems: ScoringItem[];
  qualifications: Qualification[];
  timeline: TimelineItem[];
  risks: RiskItem[];
}

export interface BidDocType {
  key: string;
  icon: string;
  label: string;
}

export interface RecentTool {
  icon: any;
  label: string;
  active: boolean;
  route?: string;
}

export interface OutlineMode {
  key: string;
  label: string;
  desc: string;
}

export interface MatchedTemplate {
  id: string;
  name: string;
  projectName: string;
  matchScore: number;
  pages: number;
}
