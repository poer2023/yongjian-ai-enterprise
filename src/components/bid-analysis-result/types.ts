export interface ProjectInfo {
  name: string;
  purchaser: string;
  budget: number;
  deadline: string;
  openTime: string;
  projectType: string;
  bidMethod: string;
}

export interface Qualification {
  id: number;
  requirement: string;
  status: 'match' | 'partial' | 'nomatch';
  detail: string;
  targetSection: string;
  searchText: string;
}

export interface ScoreStandard {
  item: string;
  score: number;
  points: string;
  strategy: string;
}

export interface TimelineItem {
  date: string;
  event: string;
  urgent: boolean;
  targetSection: string;
  searchText: string;
}

export interface MatchAssessment {
  score: number;
  recommendation: string;
  reasons: string[];
}

export interface PerformanceRequirement {
  requirement: string;
  value: string;
  status: 'match' | 'partial' | 'nomatch';
  detail: string;
  targetSection: string;
  searchText: string;
}

export interface TeamRequirement {
  role: string;
  count: string;
  requirement: string;
  status: 'match' | 'partial' | 'nomatch';
  detail: string;
  targetSection: string;
  searchText: string;
}

export interface CommitmentRequirement {
  item: string;
  requirement: string;
  canMeet: boolean;
  targetSection: string;
  searchText: string;
}

export interface DisqualificationItem {
  item: string;
  risk: 'high' | 'medium' | 'low';
  note: string;
  targetSection: string;
  searchText: string;
}

export interface ActionPlanItem {
  action: string;
  responsible: string;
  deadline: string;
}

export interface DocumentSubsection {
  id: string;
  title: string;
  content: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  subsections: DocumentSubsection[];
}
