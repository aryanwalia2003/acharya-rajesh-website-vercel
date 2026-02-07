import Link from 'next/link';
import { Sparkles, ShieldCheck, Mail } from 'lucide-react';
import { signIn } from "@/lib/auth";


export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-paper">
      {/* Background Subtle Pattern (Optional) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #0a1d37 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Branding Area */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-brand-navy p-4 text-brand-gold shadow-xl">
            <Sparkles size={48} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
            ACHARYA RAJESH
          </h1>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.4em] text-brand-gold">
            Vedic Astrology Journal
          </p>
          <div className="mt-8 h-px w-16 bg-brand-gold/40"></div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md rounded-2xl border border-brand-navy/5 bg-white p-8 shadow-2xl shadow-brand-navy/5 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-brand-navy">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to book consultations and access exclusive astrological insights.
            </p>
          </div>

          {/* Google Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm font-bold text-brand-navy shadow-sm transition-all hover:bg-slate-50 hover:border-brand-gold/50 active:scale-[0.98]">
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="h-5 w-5"
              />
              Continue with Google
            </button>
          </form>

          {/* Benefits Section */}
          <div className="mt-10 space-y-4 border-t border-slate-100 pt-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-brand-gold" size={18} />
              <div>
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Secure Access</h4>
                <p className="text-[11px] text-slate-400">One-tap login via Google. No passwords to remember.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 text-brand-gold" size={18} />
              <div>
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Consultation History</h4>
                <p className="text-[11px] text-slate-400">Keep track of your scheduled readings and recordings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <Link 
          href="/" 
          className="mt-8 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-brand-gold transition-colors"
        >
          ← Back to Journal
        </Link>
      </main>

      <footer className="py-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
        © 2024 Acharya Rajesh Walia • Secure Astrology Platform
      </footer>
    </div>
  );
}