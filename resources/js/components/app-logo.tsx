import { Link } from '@inertiajs/react';

export default function AppLogo() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
      >
        <img src="/logo.png" alt="" aria-hidden="true" className="size-8 object-contain" />
        <span>
          <span className="text-foreground">Syndic</span>
          <span className="text-[#4338CA]">Pro</span>
        </span>
      </Link>
    </>
  );
}
