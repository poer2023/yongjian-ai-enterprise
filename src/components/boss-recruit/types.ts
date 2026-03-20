export type AuthStatus = 'idle' | 'scanning' | 'success' | 'error' | 'expired';
export type AuthMethod = 'phone' | 'qrcode';

export interface AccountInfo {
  name: string;
  company: string;
  avatar: string;
  expiresAt?: string;
}

export interface BossAccount {
  id: string;
  name: string;
  company: string;
  avatar: string;
  expiresAt: string;
  status: 'active' | 'expired';
  followingCount: number;
  todayResumes: number;
}

export interface BossJD {
  id: number;
  jobName: string;
  salaryRange: string;
  location: string;
  experience: string;
  education: string;
  publishDate: string;
  viewCount: number;
  resumeCount: number;
  isFollowing: boolean;
  followStatus?: 'running' | 'paused';
  todayGreetings?: number;
  todayResumes?: number;
  totalResumes?: number;
  jobStatus?: 'active' | 'closed';
  closedDate?: string;
}

export interface RecentTool {
  icon: any;
  label: string;
  route?: string;
}

// Filter configuration for candidate screening
export interface CandidateFilter {
  keywords: string[];
  cities: string[];
  education: string;
  experience: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

// RPA automation strategy configuration
export interface RpaStrategy {
  startTime: string;
  endTime: string;
  dailyLimit: number;
  hourlyLimit: number;
  minInterval: number;
  maxInterval: number;
  errorHandling: 'pause' | 'skip';
  enabled: boolean;
}

// Resume interface for workbench
export interface Resume {
  id: number;
  name: string;
  position: string;
  experience: string;
  education: string;
  matchScore: number;
  status: 'pending' | 'collected' | 'interview' | 'rejected';
  salary: string;
  company: string;
  lastActive: string;
}
