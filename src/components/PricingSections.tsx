"use client";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Star, Zap, Shield } from "lucide-react";

const plans = [
  {
    name: "Founder",
    description: "Ideal for individual founders looking to validate their vision.",
    price: 19,
    yearlyPrice: 190,
    buttonText: "Initialize Node",
    icon: <Zap className="h-5 w-5 text-blue-400" />,
    includes: [
      "1 Verified Venture Profile",
      "Direct Investor Messaging",
      "Basic Signal Analytics",
      "Community Access",
    ],
  },
  {
    name: "Growth",
    description: "Engineered for scaling startups requiring high-tier visibility.",
    price: 49,
    yearlyPrice: 490,
    buttonText: "Accelerate Growth",
    popular: true,
    icon: <Star className="h-5 w-5 text-emerald-400" />,
    includes: [
      "Priority Feed Placement",
      "Advanced Capital Tracking",
      "Verified Badge Status",
      "24/7 Ecosystem Support",
    ],
  },
  {
    name: "Institutional",
    description: "Customized parameters for large investment funds and labs.",
    price: 99,
    yearlyPrice: 990,
    buttonText: "Custom Protocol",
    icon: <Shield className="h-5 w-5 text-cyan-400" />,
    includes: [
      "Multi-Entity Management",
      "API Data Stream Access",
      "Bulk Connection Credits",
      "Custom Governance Tools",
    ],
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="relative w-full py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-4">
            Subscription_Protocols
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Scale Your <span className="text-blue-500">Influence.</span>
          </h1>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mt-10">
            <div className="relative flex items-center p-1 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "relative px-6 py-2 text-sm font-bold transition-all z-10",
                  !isYearly ? "text-white" : "text-slate-500"
                )}
              >
                {!isYearly && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                MONTHLY
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "relative px-6 py-2 text-sm font-bold transition-all z-10",
                  isYearly ? "text-white" : "text-slate-500"
                )}
              >
                {isYearly && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                YEARLY
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -5 }}
              className={cn(
                "relative flex flex-col p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-300",
                plan.popular 
                  ? "bg-slate-900/60 border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/50" 
                  : "bg-slate-900/40 border-white/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                  Most_Active
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {plan.icon}
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-white font-mono tracking-tighter">
                    $<NumberFlow value={isYearly ? plan.yearlyPrice : plan.price} />
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/{isYearly ? 'YEAR' : 'MO'}</span>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.includes.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all",
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                )}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}