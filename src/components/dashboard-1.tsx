import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Filter, Users, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10); // Format to one decimal place

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

export function Dashboard1({ className }: { className?: string }) {
  const title = "Team Activity Radar";

  // Dummy data to make the component fully standalone
  const teamActivities = {
    totalHours: 128.5,
    stats: [
      { label: "Product", value: 40, color: "bg-emerald-400" },
      { label: "Growth", value: 32, color: "bg-blue-400" },
      { label: "Ops", value: 18, color: "bg-sky-400" },
      { label: "Advisory", value: 10, color: "bg-purple-400" },
    ],
  };

  const team = {
    memberCount: 14,
    members: [
      { id: "1", name: "SC", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SC" },
      { id: "2", name: "MR", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MR" },
      { id: "3", name: "EZ", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=EZ" },
      { id: "4", name: "DP", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DP" },
    ],
  };

  const cta = {
    text: "Live activity stream is synchronized with the NEFRA graph.",
    buttonText: "Open Ops Console",
    onButtonClick: () => {
      // eslint-disable-next-line no-console
      console.log("Ops console opened");
    },
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const hoverTransition = { type: "spring", stiffness: 300, damping: 15 };

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-slate-100 shadow-xl backdrop-blur-xl",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 21st.dev Glowing border effect */}
      

      <div className="relative z-10">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.2em] text-blue-300">
            TEAM_ACTIVITY_MATRIX
          </span>
          <h2 className="text-lg font-semibold text-slate-50 md:text-2xl">{title}</h2>
        </div>
        <Button variant="ghost" size="icon" aria-label="Filter activities">
          <Filter className="w-5 h-5 text-slate-400" />
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Team Activities Card */}
        <motion.div 
          variants={itemVariants} 
          whileHover={{ scale: 1.03, y: -5 }} // Added for hover effect
          transition={hoverTransition as any} // Added for hover effect
        >
          <Card className="h-full rounded-2xl border-white/10 bg-slate-900/70 p-4 shadow-inner">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-slate-300">Team Activities</p>
                <Clock className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-50">
                  <AnimatedNumber value={teamActivities.totalHours} />
                </span>
                <span className="ml-1 text-slate-500">hours</span>
              </div>
              {/* Progress Bar */}
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
                {teamActivities.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={cn("h-full", stat.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                {teamActivities.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", stat.color)}></span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
          transition={hoverTransition as any}
        >
          <Card className="h-full rounded-2xl border-emerald-500/30 bg-emerald-500/5 p-4">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-emerald-200">Team</p>
                <Users className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-emerald-100">
                   <AnimatedNumber value={team.memberCount} />
                </span>
                <span className="ml-1 text-emerald-300">members</span>
              </div>
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.2, zIndex: 10, y: -2 }}
                  >
                    <Avatar className="border-2 border-emerald-300/40">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Banner */}
      <motion.div 
        variants={itemVariants} 
        whileHover={{ scale: 1.02 }}
        transition={hoverTransition as any}
        className="mt-4"
      >
        <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-950 p-2">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">{cta.text}</p>
          </div>
          <Button onClick={cta.onButtonClick} className="shrink-0 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
            {cta.buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}