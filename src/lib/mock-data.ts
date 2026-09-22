import type {
  MessageItem,
  NotificationItem,
  SalonRequest,
  ServiceRow,
  StatItem,
  Worker,
} from "@/types";

export const dashboardStats: StatItem[] = [
  { id: "requests", label: "Requests", value: "241" },
  { id: "services", label: "Services", value: "45" },
  { id: "workers", label: "Workers", value: "26" },
  { id: "revenue", label: "SAR", value: "2500" },
];

export const workers: Worker[] = [
  {
    id: "w1",
    name: "Hani Hamdy",
    avatarSeed: "Hani Hamdy",
    nationalityFlag: "🇵🇸",
    role: "Hairdresser",
    earnings: 1440,
    currency: "SAR",
  },
  {
    id: "w2",
    name: "Hani Hamdy",
    avatarSeed: "Hani Hamdy 2",
    nationalityFlag: "🇵🇸",
    role: "Hairdresser",
    earnings: 1440,
    currency: "SAR",
  },
  {
    id: "w3",
    name: "Hani Hamdy",
    avatarSeed: "Hani Hamdy 3",
    nationalityFlag: "🇵🇸",
    role: "Hairdresser",
    earnings: 1440,
    currency: "SAR",
  },
  {
    id: "w4",
    name: "Hani Hamdy",
    avatarSeed: "Hani Hamdy 4",
    nationalityFlag: "🇵🇸",
    role: "Hairdresser",
    earnings: 1440,
    currency: "SAR",
    disabled: true,
  },
];

export const mostRequestedServices: ServiceRow[] = [
  {
    id: "s1",
    name: "Hair cat",
    workerAvatars: ["Hani Hamdy"],
    category: "Hair",
    priority: "Normal",
    price: 1440,
  },
  {
    id: "s2",
    name: "Hair cat",
    workerAvatars: ["Worker A", "Worker B", "Worker C", "Worker D"],
    category: "Hair",
    priority: "Special",
    price: 1440,
  },
  {
    id: "s3",
    name: "Hair cat",
    workerAvatars: ["Worker A", "Worker B", "Worker C"],
    category: "Hair",
    priority: "Normal",
    price: 1440,
  },
  {
    id: "s4",
    name: "Hair cat",
    workerAvatars: ["Hani Hamdy"],
    category: "Hair",
    priority: "Normal",
    price: 1440,
    disabled: true,
  },
];

function buildRequests(status: SalonRequest["status"], startNum: number, count: number): SalonRequest[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${status}-${startNum + i}`,
    num: startNum + i,
    workerName: "Hani hamdy",
    avatarSeed: `Hani hamdy ${startNum + i}`,
    service: "Hair cat",
    priority: i % 3 === 0 ? "Special" : "Normal",
    date: "15/12/2022",
    time: "5:00am",
    status,
    disabled: status === "new" && i === count - 1,
  }));
}

export const newRequests: SalonRequest[] = buildRequests("new", 451, 4);
export const pendingRequests: SalonRequest[] = buildRequests("pending", 451, 9);
export const completedRequests: SalonRequest[] = buildRequests("completed", 301, 9);
export const incompleteRequests: SalonRequest[] = buildRequests("incomplete", 201, 9);

export const messages: MessageItem[] = [
  { id: "m1", name: "Salim Salama", avatarSeed: "Salim Salama", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m2", name: "Mahmoud Ashraf", avatarSeed: "Mahmoud Ashraf", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m3", name: "Mahdi Sisi", avatarSeed: "Mahdi Sisi", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m4", name: "Sami Kaloka", avatarSeed: "Sami Kaloka", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m5", name: "Khalid Hamdy", avatarSeed: "Khalid Hamdy", preview: "What do you think?", time: "4:30 PM", unread: 0 },
  { id: "m6", name: "Rafiq Nader", avatarSeed: "Rafiq Nader", preview: "What do you think?", time: "4:30 PM", unread: 0 },
];

export const notifications: NotificationItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: `n${i + 1}`,
  message: "A reminder of your booking today at the Peace Salon at 5:00am",
  time: "12:00 am",
}));

export const currentUser = {
  name: "Bryan Salon",
  role: "Manager",
};
