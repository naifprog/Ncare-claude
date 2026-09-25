/**
 * Mock data for the "Super Admin" dashboard (design screens 49–91).
 */
import type { Permission } from "@/lib/access/permissions";
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
  status: "Complete" | "Incomplete";
  price: number;
  requestDate: string;
  /** Subscription bills are paid by salons; request bills come from customer requests. */
  source: "subscription" | "request";
}

const BILL_SEED: [string, string, string, string, Bill["status"], number, Bill["source"]][] = [
  ["Baym Salon", "Hamdy almuzeny", "5/1/2023", "Bank transfer", "Complete", 500, "subscription"],
  ["Bryan Salon", "Ahmed Salama", "6/1/2023", "VISA", "Complete", 320, "request"],
  ["Soahd Salon", "Sami Kaloka", "8/1/2023", "Cash", "Incomplete", 180, "request"],
  ["Teasnem Salon", "Rafiq Nader", "9/1/2023", "Bank transfer", "Complete", 500, "subscription"],
  ["Peace Salon", "Mahdi Sisi", "11/1/2023", "VISA", "Complete", 260, "request"],
  ["Baym Salon", "Hamdy almuzeny", "14/1/2023", "VISA", "Complete", 140, "request"],
  ["Mairan Salon", "Ahmed Salem", "17/1/2023", "Bank transfer", "Complete", 750, "subscription"],
  ["Bryan Salon", "Ahmed Salama", "20/1/2023", "Cash", "Incomplete", 90, "request"],
  ["Soahd Salon", "Sami Kaloka", "23/1/2023", "Bank transfer", "Complete", 500, "subscription"],
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function longDate(dmy: string) {
  const [d, m, y] = dmy.split("/");
  return `${d.padStart(2, "0")} ${SHORT_MONTHS[Number(m) - 1]} ${y}`;
}

export const bills: Bill[] = BILL_SEED.map(([salon, manager, date, paymentMethod, status, amount, source], i) => ({
  id: `bill-${i + 1}`,
  num: 741 + i,
  salon,
  manager,
  username: manager,
  date: longDate(date),
  paymentMethod,
  earning: amount,
  service: "Hair cat",
  status,
  price: amount,
  requestDate: date,
  source,
}));

// ---------------------------------------------------------------------------
// Users & account types
// ---------------------------------------------------------------------------

/**
 * Account types (design 76). The first seven come from the design; custom types can
 * be added (here "Accountant" and "Staff"). `context` is the dashboard the type signs
 * into (a Salon account may also run the multi-branch dashboard), `presetId` its
 * default permissions (see `src/lib/access/permissions.ts`).
 */
export interface AccountTypeDef {
  id: string;
  num: number;
  name: string;
  context: "salon" | "main" | "admin" | null;
  presetId?: string;
}

export const ACCOUNT_TYPE_DEFS: AccountTypeDef[] = [
  { id: "type-1", num: 450, name: "Admin", context: "admin", presetId: "super-admin" },
  { id: "type-2", num: 451, name: "Salon", context: "salon", presetId: "salon-manager" },
  { id: "type-3", num: 452, name: "Branch", context: "main", presetId: "branch-manager" },
  { id: "type-4", num: 453, name: "Worker", context: null },
  { id: "type-5", num: 454, name: "Data entry", context: "admin", presetId: "data-entry" },
  { id: "type-6", num: 455, name: "Marketer", context: "admin", presetId: "marketer" },
  { id: "type-7", num: 456, name: "Customer", context: null },
  { id: "type-8", num: 457, name: "Accountant", context: "admin", presetId: "accountant" },
  { id: "type-9", num: 458, name: "Staff", context: "salon", presetId: "receptionist" },
];

export const ACCOUNT_TYPES = ACCOUNT_TYPE_DEFS.map((t) => t.name);
export type AccountType = string;

export function getAccountType(name: string | undefined) {
  return ACCOUNT_TYPE_DEFS.find((t) => t.name.toLowerCase() === name?.toLowerCase());
}

/** Account types that carry editable powers (the blue action in design 51). */
export const TYPES_WITH_POWERS: AccountType[] = ACCOUNT_TYPE_DEFS.filter((t) => t.context).map((t) => t.name);

/** Account types list of the settings screen (design 76). */
export const accountTypeRows = ACCOUNT_TYPE_DEFS.filter((t) => t.name !== "Customer").map(({ id, num, name }) => ({ id, num, name }));

export interface AdminUser {
  id: string;
  num: number;
  name: string;
  joinDate: string;
  accountType: AccountType;
  /** Sign-in name. Only the demo accounts (`src/lib/access/accounts.ts`) can sign in. */
  username?: string;
  /** Short label shown next to the name in the header (e.g. "Admin"). */
  tag?: string;
  positionId?: string;
  /** Permission preset of this user (e.g. "owner" for a multi-branch Salon account). */
  presetId?: string;
  /** Individual permissions; when absent: the user's preset, the position's, then the account type's. */
  permissions?: Permission[];
  /** Branch access: specific branch ids, or every branch of the salon. */
  branchIds?: string[] | "all";
}

const USER_SEED: [string, AccountType][] = [
  ["Ahmed Salama", "Admin"],
  ["Baym Salon", "Salon"],
  ["Soahd Salon Branch 1", "Branch"],
  ["Mona Adel", "Customer"],
  ["Khaled Omar", "Data entry"],
  ["Rami Fathi", "Marketer"],
  ["Huda Ali", "Customer"],
  ["Hani hamdy", "Worker"],
  ["Samar Nabil", "Customer"],
];

/** Sample platform users of the design's user list (designs 51, 52). */
export const sampleUsers: AdminUser[] = USER_SEED.map(([name, accountType], i) => ({
  id: `user-${i + 1}`,
  num: 741 + i,
  name,
  joinDate: "15 Dec 2022",
  accountType,
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

const SALON_SEED: [string, string, number, string, number][] = [
  ["Bryan Salon", "Ahmed Salama", 6, "Riyadh", 1440],
  ["Baym Salon", "Hamdy almuzeny", 3, "Riyadh", 1210],
  ["Soahd Salon", "Sami Kaloka", 2, "Jeddah", 980],
  ["Teasnem Salon", "Rafiq Nader", 1, "Dammam", 760],
  ["Peace Salon", "Mahdi Sisi", 2, "Makkah", 1320],
  ["Mairan Salon", "Ahmed Salem", 4, "Riyadh", 1500],
];

export const adminSalons: AdminSalon[] = SALON_SEED.map(([name, manager, branchCount, region, earnings], i) => ({
  id: `salon-${i + 1}`,
  num: 741 + i,
  name,
  manager,
  branchCount,
  region,
  earnings,
}));

export interface AdminBranch {
  id: string;
  num: number;
  salon: string;
  name: string;
  region: string;
  earnings: number;
}

export const adminBranches: AdminBranch[] = adminSalons
  .flatMap((salon) =>
    Array.from({ length: Math.min(salon.branchCount, 2) }, (_, i) => ({
      id: `abranch-${salon.id}-${i + 1}`,
      salon: salon.name,
      name: `${salon.name} Branch ${i + 1}`,
      region: salon.region,
      earnings: salon.earnings - i * 120,
    })),
  )
  .map((b, i) => ({ ...b, num: 741 + i }));

export const SALON_FILTERS = adminSalons.map((s) => s.name);
export const BRANCH_FILTERS = adminBranches.map((b) => b.name);
/** Branch field options of the super admin's request / service / worker forms. */
export const BRANCH_CHOICES = BRANCH_FILTERS.map((b) => ({ value: b, label: b }));

/**
 * Salon / branch of a sample record in the "all salons" admin lists (designs 66–68).
 * The shared sample rows are spread over the admin branches (stable per record id)
 * so the salon / branch filters and the edit forms agree.
 */
export function salonBranchOf(recordId: string) {
  let hash = 0;
  for (const ch of recordId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const branch = adminBranches[hash % adminBranches.length];
  return { salon: branch.salon, branch: branch.name };
}

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

/** Wallets of salons, branches, workers and customers (design 87). */
export const walletRows = sampleUsers
  .filter((u) => ["Salon", "Branch", "Worker", "Customer"].includes(u.accountType))
  .map((u, i) => ({ id: `wallet-${u.id}`, userId: u.id, num: u.num, name: u.name, balance: 500 - i * 45, accountType: u.accountType }));

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


export type ReportKind = "Salons" | "Branches" | "Requests" | "Accounting";
export const REPORT_FILTERS = ["All Reports", "Salons", "Branches", "Requests", "Accounting"];
export const REPORT_MONTHS = [
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
];

export interface ReportDef {
  id: string;
  num: number;
  name: string;
  kind: ReportKind;
  year: string;
  month: string;
  /** "PDF": opens the browser print dialog (Save as PDF). "CSV": downloads a .csv file. */
  format: "PDF" | "CSV";
}

const REPORT_PERIODS: [string, string][] = [
  ["2023", "January"],
  ["2022", "December"],
  ["2022", "November"],
];
const REPORT_KINDS: ReportKind[] = ["Salons", "Branches", "Requests", "Accounting"];

/** Monthly reports generated from the mock data (design 73). */
export const reports: ReportDef[] = REPORT_PERIODS.flatMap(([year, month], p) =>
  REPORT_KINDS.map((kind, k) => ({
    id: `report-${kind.toLowerCase()}-${year}-${month.toLowerCase()}`,
    num: 741 + p * REPORT_KINDS.length + k,
    name: `${kind} report ${month} ${year}`,
    kind,
    year,
    month,
    format: (k + p) % 2 === 0 ? ("PDF" as const) : ("CSV" as const),
  })),
);

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
