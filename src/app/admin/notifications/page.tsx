import type { Metadata } from "next";
import { NotificationsPage } from "@/components/admin/NotificationsPage";

export const metadata: Metadata = { title: "Ncare | Notifications" };

/** Notifications + Add Notification (designs 85, 86). */
export default function AdminNotificationsPage() {
  return <NotificationsPage />;
}