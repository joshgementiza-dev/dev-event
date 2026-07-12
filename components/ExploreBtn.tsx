"use client";

import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <Link
      href="/events"
      className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
    >
      Explore Events
      <Image
        src="/icons/arrow-down.svg"
        alt=""
        width={16}
        height={16}
        className="opacity-75 transition-transform duration-200 group-hover:translate-y-0.5"
      />
    </Link>
  );
};

export default ExploreBtn;
