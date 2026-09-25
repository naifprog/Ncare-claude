export type RequestPriority = "Normal" | "Special";

export type RequestStatus = "new" | "pending" | "completed" | "incomplete";

export interface Worker {
  id: string;
  name: string;
  avatarSeed: string;
  nationalityFlag: string;
  nationality?: string;
  role: string;
  earnings: number;
  currency: "SAR";
  disabled?: boolean;
}

export interface ServiceRow {
  id: string;
  name: string;
  workerAvatars: string[];
  category: string;
  priority: RequestPriority;
  price: number;
  disabled?: boolean;
}

export interface SalonRequest {
  id: string;
  num: number;
  workerName: string;
  avatarSeed: string;
  service: string;
  priority: RequestPriority;
  date: string;
  time: string;
  status: RequestStatus;
  disabled?: boolean;
  /** Owning branch (multi-branch owner role). */
  branch?: string;
}

export interface WorkerDocument {
  id: string;
  name: string;
  fileName: string;
  fileType: "PDF" | "Word" | "Image";
}

export interface WorkerProfile extends Worker {
  idNumber: string;
  nationality: string;
  joinDate: string;
  type: RequestPriority;
  earningsTrend: "up" | "down";
  documents: WorkerDocument[];
  /** Colored ring + dot shown on the avatar in the design (meaning not specified there). */
  status?: "brand" | "orange";
}

export interface SalonService {
  id: string;
  num: number;
  name: string;
  category: string;
  price: number;
  workerIds: string[];
  imageUrl?: string;
}

export interface RequestLine {
  id: string;
  service: string;
  category: string;
  workerName: string;
  avatarSeed: string;
  price: number;
}

export interface RequestDetails extends SalonRequest {
  customer: {
    name: string;
    avatarSeed: string;
    phone: string;
    address?: string;
  };
  lines: RequestLine[];
  paymentMethod: "VISA" | "Cash";
}

export type WeekDay =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface SalonReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

export interface SalonProfile {
  name: string;
  address: string;
  workDays: WeekDay[];
  openFrom: string;
  openTo: string;
  ratingCount: number;
  reviews: SalonReview[];
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
}

export interface MessageItem {
  id: string;
  name: string;
  avatarSeed: string;
  preview: string;
  time: string;
  unread: number;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  unread?: boolean;
}
