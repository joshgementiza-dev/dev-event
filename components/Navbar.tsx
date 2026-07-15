"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// const NAV_LINKS = [{ href: "/events", label: "Events" }];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex items-center justify-between w-full max-w-4xl px-3 py-2 rounded-xl bg-zinc-950/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_4px_24px_-8px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden bg-white/[0.07] ring-1 ring-inset ring-white/10 transition-colors duration-150 group-hover:bg-white/12">
            <Image
              src="/icons/logo.png"
              alt="DevEvents Logo"
              width={16}
              height={16}
            />
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-zinc-100 leading-none">
            Dev<span className="text-zinc-500">Events</span>
          </span>
        </Link>

        {/* CTA */}
        <Link
          href="/events/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 text-[13px] font-semibold transition-all duration-150 hover:bg-zinc-100 active:scale-[0.97] active:bg-zinc-200"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M5 1v8M1 5h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Create Event
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
