import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = { title: "Ncare | Admin login" };

/** Super admin login (design 48). */
export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginView photo="/images/login-admin.jpg" />
    </Suspense>
  );
}