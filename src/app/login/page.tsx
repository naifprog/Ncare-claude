import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = { title: "Ncare | Login" };

/** Salon login (design 25). */
export default function LoginPage() {
  return (
    <Suspense>
      <LoginView photo="/images/login-salon.jpg" />
    </Suspense>
  );
}