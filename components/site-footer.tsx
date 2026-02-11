import Link from "next/link";
import { CATEGORIES } from "@/lib/articles";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-2xl font-bold font-serif text-primary">
              Latest Khabar
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-background/70">
              Stay updated with the latest news from India and around the world.
              Breaking news, in-depth analysis, and expert opinions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              About
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-6 text-center text-sm text-background/50">
          {'© '}{new Date().getFullYear()}{' Latest Khabar. All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
