export type AuthStatus = 'idle' | 'scanning' | 'success' | 'error';
export type AuthMethod = 'phone' | 'qrcode';

export interface AccountInfo {
  name: string;
  company: string;
  avatar: string;
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
  isMonitoring: boolean;
}

export interface RecentTool {
  icon: any;
  label: string;
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
  errorHandling: 'pause' | 'skip' | 'notify';
  enabled: boolean;
}
