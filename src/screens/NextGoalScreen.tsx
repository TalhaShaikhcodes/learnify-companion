import { ArrowRight, BookOpen, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Companion } from "../components/Companion";
import { ProgressBar } from "../components/ProgressBar";
import type { CompanionState } from "../data/companion";

interface NextGoalScreenProps {
  companion: CompanionState;
  onRestart: () => void;
}

const upcomingMilestones = [
  { xp: 140, label: "Unlock Starfire ability" },
  { xp: 180, label: "Stage 4 — Luminary form" },
  { xp: 240, label: "Final evolution unlocked" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
});

export function NextGoalScreen({ companion, onRestart }: NextGoalScreenProps) {
  const nextMilestone = upcomingMilestones[0];
  const xpToNext = nextMilestone.xp - companion.xp;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        {/* Header */}
        <motion.div {...fadeUp(0.05)} className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F7EE] px-3 py-1.5 text-xs font-bold text-[#237A48]">
            <Star size={12} fill="currentColor" />
            Journey continues
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#171717]">
            What's next for Nova
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-black/45">
            Nova has more to discover. Keep learning to unlock new forms.
          </p>
        </motion.div>

        {/* Companion */}
        <motion.div {...fadeUp(0.12)} className="mt-5 flex justify-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Companion stage={companion.stage} size="md" animate={false} />
          </motion.div>
        </motion.div>

        {/* Current XP */}
        <motion.div
          {...fadeUp(0.2)}
          className="mt-5 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                Current XP
              </p>
              <p className="mt-1.5 text-2xl font-bold text-[#171717]">
                {companion.xp}{" "}
                <span className="text-sm text-black/30">/ 240 XP total</span>
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[#FFF3C4] px-3 py-1.5">
              <Zap size={13} className="text-[#D4A017]" strokeWidth={2.5} />
              <span className="text-xs font-bold text-[#7A5A00]">{xpToNext} to next</span>
            </div>
          </div>
          <ProgressBar value={companion.xp} max={240} className="mt-4" />
          <p className="mt-2 text-sm text-black/45">
            Next: {nextMilestone.label}
          </p>
        </motion.div>

        {/* Upcoming milestones */}
        <motion.div {...fadeUp(0.3)} className="mt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-black/35">
            Upcoming milestones
          </p>
          <div className="space-y-2.5 pb-1">
            {upcomingMilestones.map((m, i) => (
              <motion.div
                key={m.xp}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.05]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF]">
                  <BookOpen size={14} className="text-[#5B4BDB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#171717]">
                    {m.label}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-black/35">
                  {m.xp} XP
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Button always pinned at bottom, never buried */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="shrink-0"
      >
        <Button onClick={onRestart} className="w-full">
          Continue learning
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
