import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { CompanionGrowthTransition } from "../components/CompanionGrowthTransition";
import { companionCatalog, type GrowthStage } from "../data/companion";
import type { CompanionState } from "../data/companion";

interface EvolutionScreenProps {
  companion: CompanionState;
  onContinue: () => void;
}

export function EvolutionScreen({ companion, onContinue }: EvolutionScreenProps) {
  const def = companionCatalog[companion.id];
  const { form } = def.stages[companion.stage];
  const ability = def.abilities[companion.stage];
  const evolvedName = companion.stage === 3 ? `Starlight ${def.name}` : companion.name;
  const fromStage = Math.max(1, companion.stage - 1) as GrowthStage;
  const [transitionDone, setTransitionDone] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 text-center">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 18 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-xs font-bold text-[#7A5A00]">
            <Sparkles size={13} />
            New form unlocked
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-3xl font-bold tracking-tight text-[#171717]"
        >
          {def.name} evolved! ✨
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-1.5 text-sm leading-relaxed text-black/40"
        >
          Your learning helped {def.name} reach a new stage.
        </motion.p>

        {/* Companion — growth transition then settled glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex justify-center"
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient glow ring — fades in after transition */}
            <motion.div
              className="pointer-events-none absolute rounded-full"
              style={{
                width: 220,
                height: 220,
                background: `radial-gradient(circle, ${def.color}22 0%, ${def.color}00 70%)`,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={transitionDone ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <CompanionGrowthTransition
              companionId={companion.id}
              fromStage={fromStage}
              toStage={companion.stage}
              isActive={true}
              size="lg"
              onComplete={() => setTransitionDone(true)}
            />
          </div>
        </motion.div>

        {/* Name + form — appears after transition settles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={transitionDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-4"
        >
          <p className="text-xl font-bold text-[#171717]">{evolvedName}</p>
          <p className="mt-0.5 text-sm text-black/40">
            {form} · Stage {companion.stage}
          </p>
        </motion.div>

        {/* Ability card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-5 rounded-[24px] bg-white p-5 text-left shadow-sm ring-1 ring-black/[0.05]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/35">
            New ability unlocked
          </p>
          <p className="mt-2.5 text-lg font-bold text-[#171717]">{ability.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-black/50">
            {ability.description}
          </p>
        </motion.div>

        {/* Next goal */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-3 rounded-[20px] border px-5 py-3.5 text-left"
          style={{ borderColor: `${def.color}40`, backgroundColor: def.colorBg }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: `${def.color}80` }}>
              Next growth
            </p>
            <span className="text-sm font-bold" style={{ color: def.color }}>240 XP</span>
          </div>
          <p className="mt-1 text-sm font-medium" style={{ color: def.color }}>
            Keep learning to reach Stage 4 ›
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-4"
      >
        <Button onClick={onContinue} className="w-full">
          See what's next
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
