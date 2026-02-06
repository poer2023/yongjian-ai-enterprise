// Types for BidSubscriptionView

export interface PolicyGroup {
  id: string;
  name: string;
  color: string;
  newCount?: number;
}

export interface DateOption {
  label: string;
  date: string;
  offset: number;
}

export interface BidHighlight {
  id: number;
  title: string;
  budget: string;
  deadline: string;
  location: string;
  matchScore: number;
  tags: string[];
}

export interface BidItem {
  id: number;
  title: string;
  budget: string;
  matchScore: number;
}

export interface DayData {
  summary: string;
  highlights: BidHighlight[];
  allBids: BidItem[];
}

export type PolicyData = Record<string, DayData>;
export type DataByPolicy = Record<string, PolicyData>;

export interface BidDetail extends BidItem {
  deadline: string;
  location: string;
  publishDate: string;
  purchaser: string;
  contact: string;
  requirements: string[];
  scope: string;
  evaluation: string;
}
