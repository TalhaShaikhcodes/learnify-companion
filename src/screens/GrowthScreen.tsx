import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Companion } from "../components/Companion";
import { ProgressBar } from "../components/ProgressBar";
import { evolutionData } from "../data/companion";
import type { CompanionState } from "../data/companion";

interface GrowthScreenProps {
  companion: CompanionState;
  onContinue: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
});

export function GrowthScreen({ companion, onContinue }: GrowthScreenProps) {
  const { name, form } = evolutionData[companion.stage];
  const xpUntilNext = companion.maxXp - companion.xp;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        {/* Header */}
        <motion.div {...fadeUp(0.05)} className="text-center">
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#5B4BDB]">
            Nova is growing ✨
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            One more lesson.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-black/45">
            Keep learning to reach Nova's next evolution stage.
          </p>
        </motion.div>

        {/* Companion card */}
        <motion.div
          {...fadeUp(0.12)}
          className="mt-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]"
        >
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Companion stage={companion.stage} size="md" />
            </motion.div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
              Current stage
            </p>
            <p className="mt-1 text-lg font-bold text-[#171717]">{form}</p>
            <p className="text-sm text-black/40">{name}</p>
          </div>
        </motion.div>

        {/* Evolution progress card */}
        <motion.div
          {...fadeUp(0.2)}
          className="mt-4 rounded-[24px] border border-[#D9D2FF] bg-[#F3F0FF] p-5"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5B4BDB]/60">
                Evolution progress
              </p>
              <p className="mt-1.5 text-2xl font-bold text-[#4E41BA]">
                {companion.xp}{" "}
                <span className="text-base font-semibold text-[#5B4BDB]/50">
                  / {companion.maxXp} XP
                </span>
              </p>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#5B4BDB]">
              {xpUntilNext} XP to go
            </span>
          </div>

          <ProgressBar
            value={companion.xp}
            max={companion.maxXp}
            className="mt-4"
            color="#5B4BDB"
          />

          <p className="mt-3 text-sm font-medium text-[#514B73]">
            {xpUntilNext === 0
              ? "Nova is ready to evolve!"
              : `Complete ${Math.ceil(xpUntilNext / 20)} more lesson${xpUntilNext > 20 ? "s" : ""} to reach the next stage.`}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Button onClick={onContinue} className="w-full">
          Complete next lesson
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
