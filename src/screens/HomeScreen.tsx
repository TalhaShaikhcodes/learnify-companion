import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Companion } from "../components/Companion";
import { ProgressBar } from "../components/ProgressBar";
import { XPBadge } from "../components/XPBadge";
import { companionCatalog } from "../data/companion";
import type { CompanionState } from "../data/companion";

interface HomeScreenProps {
  companion: CompanionState;
  onStartLesson: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function HomeScreen({ companion, onStartLesson }: HomeScreenProps) {
  const def = companionCatalog[companion.id];
  const { form } = def.stages[companion.stage];
  const xpUntilNext = companion.maxXp - companion.xp;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        {/* Name + stage */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.05 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/35">
            Your companion
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-[#171717]">
            {companion.name}
          </h1>
          <div
            className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: def.colorBg, color: def.color }}
          >
            Stage {companion.stage} · {form}
          </div>
        </motion.div>

        {/* Companion */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-5 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Companion stage={companion.stage} companionId={companion.id} size="lg" />
          </motion.div>
        </motion.div>

        {/* XP card */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.18 }}
          className="mt-5 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                Growth progress
              </p>
              <p className="mt-1.5 text-2xl font-bold text-[#171717]">
                {companion.xp}{" "}
                <span className="text-base font-semibold text-black/30">
                  / {companion.maxXp} XP
                </span>
              </p>
            </div>
            <XPBadge xp={companion.xp} showPlus={false} />
          </div>

          <ProgressBar
            value={companion.xp}
            max={companion.maxXp}
            className="mt-4"
            color={def.color}
          />

          <p className="mt-3 text-sm text-black/50">
            {xpUntilNext > 0
              ? `${xpUntilNext} XP until ${companion.name} grows.`
              : `${companion.name} is ready to evolve! ✨`}
          </p>
        </motion.div>

        {/* Next action hint */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.24 }}
          className="mt-4 text-center text-sm text-black/40"
        >
          Complete a lesson to help {companion.name} grow.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button onClick={onStartLesson} className="w-full">
          Start lesson
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
