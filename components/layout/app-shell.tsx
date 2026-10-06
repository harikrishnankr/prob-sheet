import type { ReactNode } from "react";
import Link from "next/link";
import { probeSheetDownload } from "@/config/downloads";
import { DownloadLink } from "./download-link";
import { MainNav } from "./main-nav";
import { ThemeSwitcher } from "./theme-switcher";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4 md:flex-nowrap md:px-10">
          <Link href="/" className="py-3 text-base font-semibold tracking-tight whitespace-nowrap">
            Interview Probe
          </Link>
          <div className="order-2 ml-auto flex items-center gap-2 py-3 md:order-3">
            <DownloadLink {...probeSheetDownload} />
            <ThemeSwitcher />
          </div>
          {/* Full-width second row on mobile; inline between brand and switcher on md+. */}
          <MainNav className="order-3 -mx-1 w-full md:order-2 md:mx-0 md:w-auto" />
        </div>
      </header>
      <main className="flex-1 px-4 py-6 md:px-10 md:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
