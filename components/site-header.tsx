"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/articles";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-serif tracking-tight text-primary">
            Latest Khabar
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
