import Link from 'next/link';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-paper flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert size={48} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-4xl font-bold text-brand-navy">
          Access Denied
        </h1>

        {/* Message */}
        <p className="mb-8 text-lg text-brand-ink/70">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-gold shadow-lg hover:bg-brand-navy/90 transition-all"
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center gap-2 rounded-full border-2 border-brand-navy/20 px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy/5 transition-all"
          >
            <LogIn size={18} />
            Sign Out
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-xs text-slate-400">
          If you believe this is an error, please contact the administrator.
        </p>
      </div>
    </div>
  );
}
