export interface DocumentItem {
  id: string;
  type: 'report' | 'bid';
  title: string;
  status: string;
  date?: string;
  matchScore?: number;
}

export interface ReportStats {
  totalCount: number;
  highMatchCount: number;
  totalBudget: string;
  avgBudget: string;
}

export interface MarketOverview {
  title: string;
  content: string;
}

export interface KeyProject {
  id: number;
  title: string;
  budget: string;
  deadline: string;
  region: string;
  matchScore: number;
  highlight: string;
  suggestion: string;
}

export interface TrendAnalysis {
  title: string;
  content: string;
}

export interface CompetitorInsight {
  title: string;
  content: string;
}

export interface ActionPlanItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  deadline: string;
}

export interface ActionPlan {
  title: string;
  items: ActionPlanItem[];
}

export interface RiskWarning {
  title: string;
  items: string[];
}

export interface BidDetail {
  title: string;
  budget: string;
  deadline: string;
  region: string;
  publishDate: string;
  purchaser: string;
  contact: string;
  requirements: string[];
  scope: string;
  evaluation: string;
}
