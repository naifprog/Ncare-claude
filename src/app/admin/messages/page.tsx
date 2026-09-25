import type { Metadata } from "next";
import { MessagesPage } from "@/components/admin/MessagesViews";

export const metadata: Metadata = { title: "Ncare | Messages" };

/** Messages (design 82). */
export default function AdminMessagesPage() {
  return <MessagesPage />;
}