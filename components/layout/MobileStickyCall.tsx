import { siteConfig, getPhoneHref } from "@/data/siteConfig";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MobileStickyCall() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a
        href={getPhoneHref()}
        className="flex items-center justify-center gap-2 bg-cta px-4 py-3.5 text-base font-bold text-primary shadow-[0_-4px_12px_rgba(0,0,0,0.15)] transition-all active:brightness-95"
        aria-label={`Call ${siteConfig.phoneDisplay}`}
      >
        <PhoneIcon className="h-5 w-5" />
        {siteConfig.ctas.primary.label}
      </a>
    </div>
  );
}
