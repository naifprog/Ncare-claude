import type {
  MessageItem,
  NotificationItem,
  RequestDetails,
  SalonProfile,
  SalonRequest,
  SalonService,
  ServiceRow,
  StatItem,
  Worker,
  WorkerProfile,
} from "@/types";

export const dashboardStats: StatItem[] = [
  { id: "requests", label: "Requests", value: "241" },
  { id: "services", label: "Services", value: "45" },
  { id: "workers", label: "Workers", value: "26" },
  { id: "revenue", label: "SAR", value: "2500" },
];

export const workers: Worker[] = Array.from({ length: 4 }, (_, i): Worker => ({
  id: `w${i + 1}`,
  name: "Hani hamdy",
  avatarSeed: `Hani hamdy ${i + 1}`,
  nationalityFlag: "🇵🇸",
  nationality: "Palestinian",
  role: "Hairdresser",
  earnings: 1440,
  currency: "SAR",
}));

// Mirrors the dashboard reference: single-worker rows show the worker's name,
// multi-worker rows show a stack of five avatars.
const SINGLE_WORKER = ["Hani hamdy"];
const FIVE_WORKERS = ["Worker A", "Worker B", "Worker C", "Worker D", "Worker E"];

export const mostRequestedServices: ServiceRow[] = [
  { id: "s1", name: "Hair cat", workerAvatars: SINGLE_WORKER, category: "Hair", priority: "Normal", price: 1440 },
  { id: "s2", name: "Hair cat", workerAvatars: FIVE_WORKERS, category: "Hair", priority: "Special", price: 1440 },
  { id: "s3", name: "Hair cat", workerAvatars: FIVE_WORKERS, category: "Hair", priority: "Normal", price: 1440 },
  { id: "s4", name: "Hair cat", workerAvatars: SINGLE_WORKER, category: "Hair", priority: "Normal", price: 1440 },
  { id: "s5", name: "Hair cat", workerAvatars: FIVE_WORKERS, category: "Hair", priority: "Special", price: 1440 },
];

function buildRequests(
  status: SalonRequest["status"],
  startNum: number,
  priorities: SalonRequest["priority"][],
): SalonRequest[] {
  return priorities.map((priority, i) => ({
    id: `${status}-${startNum + i}`,
    num: startNum + i,
    workerName: "Hani hamdy",
    avatarSeed: `Hani hamdy ${startNum + i}`,
    service: "Hair cat",
    priority,
    date: "15/12/2022",
    time: "5:00am",
    status,
  }));
}

const N = "Normal" as const;
const S = "Special" as const;

// Request-type pattern of the "New Requests" tab in the design (rows 451–459).
export const newRequests: SalonRequest[] = buildRequests("new", 451, [N, N, N, S, N, S, S, N, N]);
export const pendingRequests: SalonRequest[] = buildRequests("pending", 451, [N, N, N, N, N, N, N, N, N]);
export const completedRequests: SalonRequest[] = buildRequests("completed", 301, [N, N, N, N, N, N, N, N, N]);
export const incompleteRequests: SalonRequest[] = buildRequests("incomplete", 201, [N, N, N, N, N, N, N, N, N]);

/** Service names offered by the Requests "Services" column filter (design frame 30355). */
export const requestServiceFilters = ["Hair cat", "Service1", "Service2", "Service3", "Service4", "Service5", "Service6"];

export const messages: MessageItem[] = [
  { id: "m1", name: "Salim Salama", avatarSeed: "Salim Salama", avatarUrl: "/images/message-avatar-1.png", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m2", name: "Mahmoud Ashraf", avatarSeed: "Mahmoud Ashraf", avatarUrl: "/images/message-avatar-2.png", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m3", name: "Mahdi Sisi", avatarSeed: "Mahdi Sisi", avatarUrl: "/images/message-avatar-3.png", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m4", name: "Sami Kaloka", avatarSeed: "Sami Kaloka", avatarUrl: "/images/message-avatar-4.png", preview: "What do you think?", time: "4:30 PM", unread: 2 },
  { id: "m5", name: "Khalid hamdy", avatarSeed: "Khalid hamdy", avatarUrl: "/images/message-avatar-5.png", preview: "What do you think?", time: "4:30 PM", unread: 0 },
  { id: "m6", name: "Rafiq Nader", avatarSeed: "Rafiq Nader", avatarUrl: "/images/message-avatar-6.png", preview: "What do you think?", time: "4:30 PM", unread: 0 },
];

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  kind: "text" | "image" | "time";
  text?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

// Conversation shown in the "One message" frame (design frame 30309).
export const chatThread: ChatMessage[] = [
  { id: "c1", from: "them", kind: "text", text: "Looking forward to the trip." },
  { id: "c2", from: "me", kind: "text", text: "Same! Can’t wait." },
  { id: "c3", from: "them", kind: "time", text: "Today 8:43 AM" },
  {
    id: "c4",
    from: "them",
    kind: "image",
    imageUrl: "/images/chat-antelope-canyon.jpg",
    title: "Antelope Canyon guide tour",
    subtitle: "airbnb.com",
  },
  { id: "c5", from: "them", kind: "text", text: "What do you think?" },
  { id: "c6", from: "me", kind: "text", text: "Oh yes this looks great!" },
];

// Notifications popover of design screen 3; the header bell shows the unread count (2 in design 1).
export const notifications: NotificationItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `n${i + 1}`,
  message: "A reminder of your booking today at the Peace Salon at 5:00am",
  time: "12:41 am",
  unread: i < 2,
}));

// "Salon status" panel of the user menu (design screen 4 / SalonStatus frame).
export const salonStatus = {
  open: true,
  dailyProfit: "140,500 SAR",
  fromNormalRequests: "500 SAR",
  fromSpecialRequests: "140,000 SAR",
};

// ---------------------------------------------------------------------------
// Request details
// ---------------------------------------------------------------------------

const allRequests: SalonRequest[] = [
  ...newRequests,
  ...pendingRequests,
  ...completedRequests,
  ...incompleteRequests,
];

export function getRequestDetails(id: string): RequestDetails | undefined {
  const request = allRequests.find((r) => r.id === id);
  if (!request) return undefined;

  const lines = Array.from({ length: 3 }, (_, i) => ({
    id: `${id}-line-${i + 1}`,
    service: request.service,
    category: "Hair",
    workerName: request.workerName,
    avatarSeed: request.avatarSeed,
    price: 60,
  }));

  return {
    ...request,
    customer: {
      name: "Hani hamdy",
      avatarSeed: "Hani hamdy customer",
      phone: "+972 595 23 5592",
      // Special (home-visit) requests also carry the customer's address.
      address:
        request.priority === "Special"
          ? "3297 Anas Bin Malek - Al Malqa, Riyadh, Saudi Arabia."
          : undefined,
    },
    lines,
    paymentMethod: "VISA",
  };
}

// ---------------------------------------------------------------------------
// Workers
// ---------------------------------------------------------------------------

export const nationalities = [
  { name: "Palestinian", flag: "🇵🇸" },
  { name: "Saudi", flag: "🇸🇦" },
  { name: "Egyptian", flag: "🇪🇬" },
  { name: "Jordanian", flag: "🇯🇴" },
];

export const positions = ["Hairdresser", "Barber", "Makeup artist", "Nail technician"];

const WORKER_SEED: { name: string; earnings: number; trend: "up" | "down" }[] = [
  { name: "Hani hamdy", earnings: 1440, trend: "up" },
  { name: "Salem Ahmed", earnings: 1440, trend: "up" },
  { name: "Mohammed Ashraf", earnings: 255, trend: "down" },
  { name: "Mahmoud Ashraf", earnings: 1440, trend: "up" },
  { name: "Salim Salama", earnings: 351, trend: "down" },
  { name: "Mahdi Sisi", earnings: 1440, trend: "up" },
  { name: "Sami Kaloka", earnings: 1440, trend: "up" },
  { name: "Khalid Hamdy", earnings: 250, trend: "down" },
  { name: "Rafiq Nader", earnings: 1440, trend: "up" },
];

export const workerProfiles: WorkerProfile[] = WORKER_SEED.map(({ name, earnings, trend }, i): WorkerProfile => ({
  id: `worker-${i + 1}`,
  name,
  avatarSeed: name,
  nationalityFlag: "🇵🇸",
  nationality: "Palestinian",
  role: "Hairdresser",
  earnings,
  earningsTrend: trend,
  currency: "SAR",
  idNumber: "4052454141",
  joinDate: "15/5/2022",
  type: i === 1 ? "Special" : "Normal",
  // Rows 2 and 5 of design screen 15 carry the navy / orange avatar marker.
  status: i === 1 ? "brand" : i === 4 ? "orange" : undefined,
  documents: [
    { id: "doc-1", name: "Employment contract", fileName: "contract.pdf", fileType: "PDF" },
    { id: "doc-2", name: "Passport", fileName: "pass-port.pdf", fileType: "PDF" },
  ],
}));

export function getWorkerProfile(id: string) {
  return workerProfiles.find((w) => w.id === id);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

// Category list of design frame 30357.
export const serviceCategories = ["Hair", "Chin", "Category1", "Category2", "Category3", "Category4", "Category5"];

const SERVICE_WORKER_SETS: string[][] = [
  ["worker-1"],
  ["worker-1", "worker-2", "worker-3", "worker-4", "worker-5"],
  ["worker-1"],
  ["worker-1"],
  ["worker-1"],
  ["worker-1"],
  ["worker-1", "worker-2", "worker-3", "worker-4", "worker-5"],
  ["worker-1", "worker-2", "worker-3", "worker-4", "worker-5"],
  ["worker-1"],
];

export const salonServices: SalonService[] = SERVICE_WORKER_SETS.map((workerIds, i) => ({
  id: `service-${i + 1}`,
  num: 451,
  name: "Hair cat",
  category: "Hair",
  price: 1440,
  workerIds,
  imageUrl: "/images/service-haircut.jpg",
}));

export function getSalonService(id: string) {
  return salonServices.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Salon settings
// ---------------------------------------------------------------------------

export const salonProfile: SalonProfile = {
  name: "Bryan Salon",
  address: "3297 Anas Bin Malek - Al Malqa, Riyadh, Saudi Arabia.",
  workDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  openFrom: "6:00",
  openTo: "24:00",
  ratingCount: 142,
  reviews: Array.from({ length: 8 }, (_, i) => ({
    id: `review-${i + 1}`,
    author: "Mahoud saleem",
    rating: 5,
    comment:
      "Great service, distinctive and fast, and most importantly, the quiet atmosphere and the cleanliness of the place",
  })),
};

export const currentUser = {
  name: "Bryan Salon",
  role: "Manager",
};
