/**
 * Mock data for the "Super Admin" dashboard (design screens 49–91).
 */
import type { StatItem } from "@/types";

export const adminStats: StatItem[] = [
  { id: "salons", label: "Salon", value: "62" },
  { id: "branches", label: "Branch", value: "115" },
  { id: "requests", label: "Request", value: "45" },
  { id: "workers", label: "Worker", value: "260" },
  { id: "services", label: "Service", value: "45" },
  { id: "special", label: "Special", value: "8" },
  { id: "users", label: "User", value: "1455" },
];

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** "Subscriptions chart" (design 49): number of subscriptions per month. */
export const subscriptionsChart = [450, 720, 610, 610, 480, 830, 890, 410, 860, 760, 980, 1040].map((value, i) => ({
  month: MONTHS[i],
  value,
}));

/** "Yearly entries chart" (designs 49, 69), in thousands. */
export const yearlyEntriesChart = [
  [1.25, 1.55],
  [1.35, 1.6],
  [0.75, 1.45],
  [0.9, 1.5],
  [3.4, 2.3],
  [2.7, 1.4],
  [2.8, 1.5],
  [4.6, 3.1],
  [3.7, 3.0],
  [3.8, 3.7],
  [4.55, 5.1],
  [4.7, 5.2],
].map(([subscriptions, requests], i) => ({ month: MONTHS[i], subscriptions, requests }));

export interface Bill {
  id: string;
  num: number;
  salon: string;
  manager: string;
  username: string;
  date: string;
  paymentMethod: string;
  earning: number;
  service: string;
  status: string;
  price: number;
  requestDate: string;
}

export const bills: Bill[] = Array.from({ length: 9 }, (_, i) => ({
  id: `bill-${i + 1}`,
  num: 741,
  salon: "Baym Salon",
  manager: "Hamdy almuzeny",
  username: "Hamdy almuzeny",
  date: "05 Jan 2023",
  paymentMethod: "Bank transfer",
  earning: 500,
  service: "Hair cat",
  status: "Complete",
  price: 500,
  requestDate: "05 / 1 / 2023",
}));

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const ACCOUNT_TYPES = ["Admin", "Salon", "Branch", "Data entry", "Marketer", "Worker", "Customer"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export interface AdminUser {
  id: string;
  num: number;
  name: string;
  joinDate: string;
  accountType: AccountType;
}

const USER_TYPES: AccountType[] = ["Admin", "Salon", "Branch", "Customer", "Data entry", "Marketer", "Customer", "Worker", "Customer"];

export const adminUsers: AdminUser[] = USER_TYPES.map((accountType, i) => ({
  id: `user-${i + 1}`,
  num: 741,
  name: "Ahmed Salama",
  joinDate: "15 Dec 2022",
  accountType,
}));

export function getAdminUser(id: string) {
  return adminUsers.find((u) => u.id === id);
}

/** Account types that carry editable powers (the blue action in design 51). */
export const TYPES_WITH_POWERS: AccountType[] = ["Admin", "Salon", "Branch", "Data entry", "Marketer"];

export const accountTypeRows = ["Admin", "Salon", "Branch", "Worker", "Data Entry", "Marketer"].map((name, i) => ({
  id: `type-${i + 1}`,
  num: 450,
  name,
}));

// ---------------------------------------------------------------------------
// Salons & branches
// ---------------------------------------------------------------------------

export interface AdminSalon {
  id: string;
  num: number;
  name: string;
  manager: string;
  branchCount: number;
  region: string;
  earnings: number;
}

export const adminSalons: AdminSalon[] = Array.from({ length: 9 }, (_, i) => ({
  id: `salon-${i + 1}`,
  num: 741,
  name: "Bryan Salon",
  manager: "Ahmed Salama",
  branchCount: 5,
  region: "Riyadh",
  earnings: 1440,
}));

export const adminBranches = Array.from({ length: 9 }, (_, i) => ({
  id: `abranch-${i + 1}`,
  num: 741,
  salon: "Bayem Salon",
  name: "Bayem Salon Branch 1",
  region: "Riyadh",
  earnings: 1440,
}));

export const SALON_FILTERS = ["Salon1", "Salon2", "Salon3", "Salon4", "Salon5", "Salon2", "Salon3", "Salon4", "Salon5", "Salon6"];
export const BRANCH_FILTERS = ["Branch1", "Branch2", "Branch3", "Branch4", "Branch5"];

/** Branches of a salon user (design 59). */
export const salonUserBranches = Array.from({ length: 5 }, (_, i) => ({
  id: `sb-${i + 1}`,
  num: 741 + i,
  name: `Bryan Salon branch ${i + 1}`,
  manager: "Ahmed Salama",
  region: "Riyadh",
  earnings: 1440,
}));

// ---------------------------------------------------------------------------
// Accounting
// ---------------------------------------------------------------------------

export const monthlyEntries = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month) => ({ month, amount: "1,4200" }));

export const walletRows = (["Salon", "Salon", "Branch", "Worker", "Customer", "Customer", "Customer", "Salon", "Branch"] as const).map(
  (type, i) => ({ id: `wallet-${i + 1}`, num: 741, name: "Ahmed Salama", balance: 500, accountType: type }),
);

export interface DiscountCode {
  id: string;
  name: string;
  value: string;
  type: "Referral" | "Discount";
  username: string;
  start: string;
  end: string;
}

export const discountCodes: DiscountCode[] = (
  ["Referral", "Discount", "Discount", "Discount", "Discount", "Referral", "Referral", "Referral", "Referral"] as const
).map((type, i) => ({
  id: `code-${i + 1}`,
  name: "QQQ",
  value: "30%",
  type,
  username: type === "Referral" ? "QQQAbd" : "",
  start: "15 Jan 2023",
  end: "15 Feb 2023",
}));

// ---------------------------------------------------------------------------
// Ads, reports, powers
// ---------------------------------------------------------------------------

export const ads = [
  { id: "ad-1", image: "/images/ad-1.jpg", duration: "5 sec", from: "8/1/2023", to: "12/1/2023" },
  { id: "ad-2", image: "/images/ad-2.jpg", duration: "5 sec", from: "8/1/2023", to: "12/1/2023" },
  { id: "ad-3", image: "/images/ad-3.jpg", duration: "5 sec", from: "8/1/2023", to: "12/1/2023" },
  { id: "ad-4", image: "/images/ad-4.jpg", duration: "5 sec", from: "8/1/2023", to: "12/1/2023" },
];

export const reports = Array.from({ length: 6 }, (_, i) => ({
  id: `report-${i + 1}`,
  num: 741,
  name: "report2323334354445",
  format: "Pdf",
}));

export const REPORT_FILTERS = ["All Reports", "Salons", "Branches", "Requests", "Accounting"];

export const adminPowers = (
  [
    ["Admin", "Ahmed Salama"],
    ["Salon", "Baym Salon"],
    ["Salon", "Soahd Salon"],
    ["Salon", "TeasnemSalon"],
    ["Marketer", "Ahmed Salama"],
    ["Marketer", "Ahmed Salama"],
    ["Data entry", "Ahmed Salama"],
    ["Data entry", "Ahmed Salama"],
    ["Branch", "Soahd Salon Branch 1"],
  ] as const
).map(([accountType, name], i) => ({ id: `power-${i + 1}`, num: 741, accountType: accountType as AccountType, name }));

// ---------------------------------------------------------------------------
// Messages & notifications pages
// ---------------------------------------------------------------------------

const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam velit dolor, ultricies sed dignissim ut, porta aliquet sem. Nullam pulvinar nisl pretium elit efficitur sollicitudin. Quisque ultrices justo at ex mollis consectetur";

/** Conversation of the admin messages page (design 82). */
export const adminChatThread = [
  { id: "p1", from: "them" as const, kind: "time" as const, text: "Today 8:43 AM" },
  {
    id: "p2",
    from: "them" as const,
    kind: "image" as const,
    imageUrl: "/images/ad-4.jpg",
    title: "Antelope Canyon guide tour",
    subtitle: "airbnb.com",
  },
  { id: "p3", from: "them" as const, kind: "text" as const, text: LOREM_SHORT },
  { id: "p4", from: "me" as const, kind: "text" as const, text: "Lorem ipsum dolor sit amet." },
  { id: "p5", from: "them" as const, kind: "text" as const, text: LOREM_LONG },
  { id: "p6", from: "me" as const, kind: "text" as const, text: LOREM_SHORT },
];

export const adminNotifications = Array.from({ length: 11 }, (_, i) => ({
  id: `an-${i + 1}`,
  title: "Remember!",
  body: "A reminder of your booking today at the Peace Salon.",
  time: "12:41 am",
  sentAt: "12:41 am, 12 Jan 2023",
  from: "Ahmed Alwaly(Admin)",
  to: "Salon, Branch, Worker.",
}));
