import Image from "next/image";
import Link from "next/link";
import { siteConfig, getLocationLabel } from "@/data/siteConfig";

export function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-bottom mt-10 pt-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <Link
          href="/"
          aria-label={siteConfig.businessName}
          className="inline-flex shrink-0 items-center"
        >
          <Image
            src="/images/jdm-header-logo.png"
            alt={siteConfig.businessName}
            width={2172}
            height={724}
            unoptimized
            className="h-10 w-auto object-contain"
            style={{ width: "auto" }}
          />
        </Link>
        <p className="text-sm text-neutral-light">
          &copy; {currentYear} {siteConfig.businessName} &middot;{" "}
          {siteConfig.serviceLabel} &middot; {getLocationLabel()}
        </p>
      </div>
    </div>
  );
}
