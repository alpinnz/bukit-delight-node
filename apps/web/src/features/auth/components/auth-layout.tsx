import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  size?: "default" | "wide";
};

const AuthLayout = ({
  title,
  description,
  children,
  size = "default",
}: AuthLayoutProps) => {
  useEffect(() => {
    document.title = `${title} | Bukit Delight`;
  }, [title]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 px-4 py-10 text-slate-900">
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full sm:h-44"
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
    >
      <path
        d="M0 86C190 155 354 60 560 82c203 22 292 92 472 42 175-49 261-46 408-8v64H0V86Z"
        className="fill-brand-teal"
      />
      <path
        d="M0 133c174-78 310-51 475-8 121 32 221 35 348-4 185-56 345-43 617 37v22H0v-47Z"
        className="fill-brand-primary"
        opacity=".92"
      />
      <path
        d="M0 155C200 95 310 145 470 165c170 19 310-59 480-45 160 13 310 58 490 25v35H0v-25Z"
        className="fill-brand-brown"
        opacity=".92"
      />
    </svg>

    <div
      className={`relative z-10 w-full ${size === "wide" ? "max-w-[640px]" : "max-w-xl"}`}
    >
      <Link
        to="/"
        aria-label="Bukit Delight beranda"
        className="mb-7 flex justify-center text-2xl font-extrabold tracking-tight text-brand-brown"
      >
        Bukit <span className="ml-1 text-brand-primary">Delight</span>
      </Link>

      <section
        className={`rounded-2xl bg-white px-6 py-8 shadow-xl shadow-slate-900/5 ring-1 ring-black/5 sm:py-10 ${size === "wide" ? "sm:px-[60px]" : "sm:px-12"}`}
      >
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </header>

        {children}

        <footer className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:text-sm">
          <span>Powered by Bukit Delight</span>
          <span className="h-6 w-px bg-slate-300" aria-hidden="true" />
          <span className="text-right font-semibold text-brand-brown">
            Butuh bantuan? Hubungi administrator.
          </span>
        </footer>
      </section>
    </div>
    </main>
  );
};

export default AuthLayout;
