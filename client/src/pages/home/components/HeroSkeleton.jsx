import React from "react";
import { Skeleton } from "../../../components/Skeleton";

const HeroSkeleton = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0b10] text-white md:py-10 xs:py-20">
      {/* ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.14),transparent_50%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-8">
          {/* badge */}
          <Skeleton className="h-8 w-56 rounded-full" />

          {/* title */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-[88%] rounded-xl" />
            <Skeleton className="h-12 w-[68%] rounded-xl" />
          </div>

          {/* paragraph */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[82%]" />
            <Skeleton className="h-5 w-[65%]" />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          {/* ring placeholder */}
          <div className="absolute h-[420px] w-[420px] rounded-full border border-white/6" />

          {/* glow placeholder */}
          <div className="absolute h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[110px]" />

          {/* image card */}
          <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <Skeleton className="h-[260px] w-[260px] rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
