import { LogoCloud } from "@/components/logo-cloud-3";

export default function Footer() {
  return (
    // THE FIX: bg-slate-950 is GONE. Replaced with bg-transparent and z-10.
    <footer className="relative z-10 border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h2 className="text-center font-medium text-lg text-slate-300 tracking-tight md:text-xl">
            Trusted by <span className="text-white">experts</span>
          </h2>
          <div className="relative z-10 mx-auto max-w-4xl">
            <LogoCloud logos={logos} />
          </div>
          <div className="pt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} NEFRA. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

const logos = [
  {
    src: "https://storage.efferd.com/logo/nvidia-wordmark.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://storage.efferd.com/logo/supabase-wordmark.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://storage.efferd.com/logo/openai-wordmark.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://storage.efferd.com/logo/turso-wordmark.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://storage.efferd.com/logo/vercel-wordmark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://storage.efferd.com/logo/github-wordmark.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://storage.efferd.com/logo/claude-wordmark.svg",
    alt: "Claude AI Logo",
  },
  {
    src: "https://storage.efferd.com/logo/clerk-wordmark.svg",
    alt: "Clerk Logo",
  },
];