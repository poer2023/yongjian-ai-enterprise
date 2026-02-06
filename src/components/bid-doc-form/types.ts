// Types for BidDocFormView

export interface CompanyOption {
  key: string;
  label: string;
}

export interface BidDocType {
  key: string;
  icon: string;
  label: string;
}

export interface OutlineMode {
  key: string;
  label: string;
  desc: string;
}

export interface WritingStyle {
  key: string;
  label: string;
  desc: string;
}

export interface LayoutTemplate {
  key: string;
  label: string;
  preview: string;
}

export interface ConfigOption {
  key: string;
  label: string;
}

export interface FocusMode {
  key: string;
  label: string;
}

export interface MockCase {
  id: string;
  name: string;
  amount: string;
  year: string;
}

export interface MockMember {
  id: string;
  name: string;
  role: string;
  cert: string;
}

export interface MockCertificate {
  id: string;
  name: string;
  validUntil: string;
}

export interface RecentTool {
  icon: any;
  label: string;
  active: boolean;
}
