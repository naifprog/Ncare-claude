"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EyeSlashIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { canAccessPath, homeFor, resolveUser } from "@/lib/access/access";
import { DEMO_PASSWORD, findDemoAccount } from "@/lib/access/directory";
import { signIn, useAccessOverrides } from "@/lib/demo-state";

const FIELD =
  "h-[50px] w-full rounded-pill bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand";

/**
 * Login (design 25 for salons, 48 for the super admin): 732px photo + form.
 *
 * DEMO ONLY: there is no authentication backend. The form checks the demo accounts of
 * `src/lib/access/directory.ts` and opens the dashboard of the matching account;
 * `?next=` returns to the page that asked for a sign-in when that account may open it.
 */
export function LoginView({ photo }: { photo: string }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const overrides = useAccessOverrides();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] bg-card">
      <div className="relative hidden w-[732px] shrink-0 lg:block">
        <Image src={photo} alt="" fill sizes="732px" className="object-cover" priority />
      </div>

      <div className="flex-1 px-6 pb-16 pt-16 sm:px-[49px] lg:pt-[130px]">
        <Image src="/images/ncare-logo.png" alt="Ncare" width={221} height={58} priority className="-ml-1" />

        <form
          className="mt-[122px] max-w-[549px] sm:pl-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const account = findDemoAccount(String(data.get("username") ?? ""));
            const user = account && data.get("password") === DEMO_PASSWORD ? resolveUser(account.id, overrides) : null;
            if (!user) {
              setError("Incorrect username or password.");
              return;
            }
            setError(null);
            signIn(user.id);
            const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
            router.replace(safeNext && canAccessPath(user, safeNext) ? safeNext : homeFor(user));
          }}

        >
          <h1 className="pl-[22px] text-[28px] font-bold leading-8 text-ink">Login</h1>

          <label htmlFor="login-username" className="mt-[72px] block pl-[21px] text-lg leading-5 text-ink">
            Username
          </label>
          <input
            id="login-username"
            name="username"
            autoComplete="username"
            placeholder="Enter username"
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            onChange={() => setError(null)}
            className={`mt-[21px] ${FIELD}`}
          />

          <label htmlFor="login-password" className="mt-[31px] block pl-[21px] text-lg leading-5 text-ink">
            Password
          </label>
          <div className="relative mt-[21px]">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••••••"
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
              onChange={() => setError(null)}
              className={`${FIELD} pr-20`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-[62px] top-1/2 -translate-y-1/2 text-[#aeaeae]"
            >
              {showPassword ? <Icon name="eye" size={20} /> : <EyeSlashIcon size={20} />}
            </button>
          </div>

          {error ? (
            <p id="login-error" role="alert" className="mt-4 pl-[21px] text-sm font-semibold text-negative">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="ml-5 mt-[61px] h-[50px] w-[129px] rounded-pill bg-brand text-[15px] font-bold text-white shadow-card transition-colors hover:bg-brand/90"
          >
            Login
          </button>
          <p className="mt-6 pl-[21px] text-xs text-ink-muted">
            Demo build: sign-in uses demo accounts only (see README). There is no real authentication yet.
          </p>
        </form>
      </div>
    </div>
  );
}
