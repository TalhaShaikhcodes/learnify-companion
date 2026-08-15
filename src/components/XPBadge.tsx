import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface XPBadgeProps {
  xp: number;
  showPlus?: boolean;
}

export function XPBadge({ xp, showPlus = true }: XPBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-sm font-bold text-[#7A5A00]"
    >
      <Zap size={14} strokeWidth={2.5} className="text-[#D4A017]" />
      {showPlus ? "+" : ""}
      {xp} XP
    </motion.div>
  );
}
