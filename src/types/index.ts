export type RequestPriority = "Normal" | "Special";

export type RequestStatus = "new" | "pending" | "completed" | "incomplete";

export interface Worker {
  id: string;
  name: string;
  avatarSeed: string;
  nationalityFlag: string;
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
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
}
