import { redirect } from "next/navigation";

/** Settings only contains "Change password" for this role. */
export default function MainSettingsPage() {
  redirect("/main/settings/password");
}