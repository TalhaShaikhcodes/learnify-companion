import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/Button";
import { CompanionGrowthTransition } from "../components/CompanionGrowthTransition";
import { ProgressBar } from "../components/ProgressBar";
import { stageFromXp, companionCatalog } from "../data/companion";
import type { CompanionState } from "../data/companion";

interface LessonCompleteScreenProps {
  /** Companion state BEFORE this lesson's XP was awarded */
  companion: CompanionState;
  xpGained: number;
  onContinue: () => void;
  onHome: () => void;
}

// Badge shared between the floating "launch" position and the card "landing" position.
// Using the same layoutId lets Framer Motion tween between the two positions automatically.
const XP_BADGE_LAYOUT_ID = "xp-badge";

export function LessonCompleteScreen({
  companion,
  xpGained,
  onContinue,
  onHome,
}: LessonCompleteScreenProps) {
  const startXp = companion.xp;
  const endXp = Math.min(companion.xp + xpGained, companion.maxXp);
  const newStage = stageFromXp(endXp);
  const stageChanged = newStage > companion.stage;
  const xpUntilNext = companion.maxXp - endXp;
  const def = companionCatalog[companion.id];
  const { form } = def.stages[newStage];

  // "float"  — badge sits big and centered above the companion
  // "travel" — badge flies toward the card (layoutId tween handles this)
  // "landed" — badge is in the card; count-up runs
  type BadgePhase = "float" | "landed";
  const [badgePhase, setBadgePhase] = useState<BadgePhase>("float");
  const [displayXp, setDisplayXp] = useState(startXp);
  const hasLanded = useRef(false);
  // Growth transition state — only relevant when stageChanged
  const [growthDone, setGrowthDone] = useState(!stageChanged);

  const runCountUp = useCallback(() => {
    if (hasLanded.current) return;
    hasLanded.current = true;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayXp(Math.round(startXp + (endXp - startXp) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [startXp, endXp]);

  useEffect(() => {
    // After 1.1s: badge "travels" to the card (phase change triggers layoutId tween)
    const t = setTimeout(() => {
      setBadgePhase("landed");
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F7EE] px-3 py-1.5 text-xs font-bold text-[#237A48]">
          ✓ Lesson complete
        </span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-3xl font-bold tracking-tight text-[#171717]"
        >
          Nice work! 🎉
        </motion.h1>
      </motion.div>

      {/* ── Floating XP badge — big, centered, above companion ── */}
      {/* Reserves its space so layout doesn't jump when it disappears */}
      <div className="flex justify-center">
        <AnimatePresence>
          {badgePhase === "float" && (
            <motion.div
              layoutId={XP_BADGE_LAYOUT_ID}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.28, type: "spring", stiffness: 260, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFF3C4] px-5 py-2.5 text-base font-bold text-[#7A5A00] shadow-md shadow-[#D4A017]/15"
            >
              <Zap size={16} strokeWidth={2.5} className="text-[#D4A017]" />
              +{xpGained} XP
            </motion.div>
          )}
        </AnimatePresence>
        {/* Invisible placeholder so layout height is stable when badge moves */}
        {badgePhase === "landed" && <div className="h-[40px] w-[100px]" />}
      </div>

      {/* ── Companion + stage label ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        {/* Always play the transition — "growth" when stage changes, "celebrate" otherwise */}
        <CompanionGrowthTransition
          companionId={companion.id}
          fromStage={companion.stage}
          toStage={newStage}
          isActive={true}
          size="lg"
          onComplete={() => setGrowthDone(true)}
        />

        {stageChanged && growthDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: def.colorBg, color: def.color }}
          >
            ✨ {def.name} grew into {form}!
          </motion.div>
        )}
      </motion.div>

      {/* ── XP progress card ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
              {def.name}'s progress
            </p>
            <p className="mt-1.5 text-2xl font-bold text-[#171717]">
              {displayXp}{" "}
              <span className="text-sm font-semibold text-black/30">
                / {companion.maxXp} XP
              </span>
            </p>
          </div>

          {/* Badge lands here — layoutId tween flies it from above into this spot */}
          <AnimatePresence>
            {badgePhase === "landed" && (
              <motion.div
                layoutId={XP_BADGE_LAYOUT_ID}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onAnimationStart={runCountUp}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3C4] px-3 py-1.5 text-sm font-bold text-[#7A5A00]"
              >
                <Zap size={14} strokeWidth={2.5} className="text-[#D4A017]" />
                +{xpGained} XP
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ProgressBar value={displayXp} max={companion.maxXp} className="mt-4" color={def.color} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="mt-3 text-sm text-black/50"
        >
          {xpUntilNext === 0
            ? `${def.name} is ready to evolve! ✨`
            : `${xpUntilNext} XP until ${def.name}'s next stage.`}
        </motion.p>
      </motion.div>

      {/* ── Next goal hint ── */}
      {xpUntilNext > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="rounded-[20px] border px-5 py-3.5"
          style={{
            borderColor: `${def.color}40`,
            backgroundColor: def.colorBg,
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: `${def.color}80` }}>
            Next goal
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: def.color }}>
            Complete 1 more lesson to evolve {def.name} ›
          </p>
        </motion.div>
      )}

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-auto flex flex-col items-center gap-3"
      >
        <Button onClick={onContinue} className="w-full">
          Continue learning
          <ArrowRight size={17} className="ml-2" />
        </Button>
        <button
          type="button"
          onClick={onHome}
          className="text-sm font-medium text-black/40 transition-colors hover:text-black/60"
        >
          ← Home
        </button>
      </motion.div>
    </div>
  );
}
