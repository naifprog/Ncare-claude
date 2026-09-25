import type { Metadata } from "next";
import { NewMessagePage } from "@/components/admin/MessagesViews";

export const metadata: Metadata = { title: "Ncare | New message" };

/** New message (design 83). */
export default function AdminNewMessagePage() {
  return <NewMessagePage />;
}