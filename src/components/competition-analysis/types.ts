export interface CompetitorCompany {
  id: string;
  name: string;
  industry: string;
  region: string;
  addedAt: string;
}

export interface BiddingUnit {
  id: string;
  name: string;
  type: string;
  region: string;
  addedAt: string;
}

export interface AnalysisStrategy {
  id: string;
  name: string;
  description: string;
  industry: string;
  biddingUnitIds: string[];
  competitorIds: string[];
  timeRange: string;
  regions: string[];
  createdAt: string;
}

export interface ReportTab {
  id: string;
  label: string;
  industry: string;
  timeRange: string;
  createdAt: string;
}

export interface SelectedBidNotice {
  id: string;
  name: string;
  client: string;
  budget: number;
  bidDate: string;
  category: string;
}

export type ReportDimension = 'overview' | 'biddingUnit' | 'competitor' | 'project' | 'action';

export interface NarrativeParagraph {
  type: 'text' | 'highlight-box' | 'numbered-list' | 'quote';
  content: string;           // HTML string, supports <strong>, <em>
  items?: string[];           // for numbered-list type
  boxType?: 'positive' | 'negative' | 'warning'; // for highlight-box
}

export interface NarrativeSection {
  id: ReportDimension;
  title: string;
  paragraphs: NarrativeParagraph[];
}
