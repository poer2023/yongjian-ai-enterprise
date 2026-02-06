// Types for ResumeAnalysisFormView

export interface JobDescription {
  id: number;
  jobName: string;
  salaryRange: string;
  location: string;
  education: string;
  experience: string;
  skills: string[];
  createdAt: string;
  responsibilities: string[];    // 岗位职责
  requirements: string[];        // 任职要求
  hardRequirements: string[];    // 硬性门槛
  bonusPoints: string[];         // 加分项
}

export interface NewJdForm {
  jobName: string;
  salaryRange: string;
  location: string;
  education: string;
  experience: string;
  skills: string;
  responsibilities: string;      // 岗位职责
  requirements: string;          // 任职要求
  hardRequirements: string;      // 硬性门槛
  bonusPoints: string;           // 加分项
}

export interface RecentTool {
  icon: any;
  label: string;
}
