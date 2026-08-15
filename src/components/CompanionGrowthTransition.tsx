/**
 * CompanionGrowthTransition
 *
 * Two modes:
 *
 * mode="growth" (default when fromStage !== toStage)
 *   Full 5-phase sequence: prepare → energize → peak → reveal new stage → settle
 *   Used when the companion crosses a stage threshold.
 *
 * mode="celebrate" (used when stage does NOT change)
 *   Shorter sequence: energize → peak → settle on same image
 *   Communicates "XP gained, creature getting stronger" without a stage swap.
 *
 * Phases:
 *   "idle"        – waiting / settled
 *   "preparing"   – subtle scale-up + upward drift on FROM
 *   "energizing"  – glow expands, sparkles orbit outward
 *   "peak"        – max glow + brightness, sparkles accelerate
 *   "revealing"   – FROM fades/shrinks, TO scales up from centre (growth only)
 *   "settling"    – glow fades, companion bounces to rest
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { companionCatalog, type CompanionId, type GrowthStage } from "../data/companion";

interface CompanionGrowthTransitionProps {
  companionId: CompanionId;
  fromStage: GrowthStage;
  toStage: GrowthStage;
  /** Set true to start the sequence */
  isActive: boolean;
  size?: "md" | "lg";
  /** Called when the full sequence finishes */
  onComplete?: () => void;
}

type Phase =
  | "idle"
  | "preparing"
  | "energizing"
  | "peak"
  | "revealing"
  | "settling";

const containerSize = { md: 144, lg: 208 };

const stageScale: Record<GrowthStage, number> = { 1: 0.78, 2: 0.90, 3: 1.0 };

// 8 sparkle particles arranged evenly around a circle
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * 360,
  delay: i * 0.04,
}));

export function CompanionGrowthTransition({
  companionId,
  fromStage,
  toStage,
  isActive,
  size = "lg",
  onComplete,
}: CompanionGrowthTransitionProps) {
  const stageChanged = toStage !== fromStage;
  const [phase, setPhase] = useState<Phase>("idle");

  const def = companionCatalog[companionId];
  const fromData = def.stages[fromStage];
  const toData = def.stages[toStage];
  const px = containerSize[size];
  const color = def.color;

  // ── Phase sequencer ──────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (stageChanged) {
      // Full growth sequence
      setPhase("preparing");
      at(320,  () => setPhase("energizing"));
      at(780,  () => setPhase("peak"));
      at(1080, () => setPhase("revealing"));
      at(1700, () => setPhase("settling"));
      at(2250, () => { setPhase("idle"); onComplete?.(); });
    } else {
      // Celebrate (same stage — shorter, lighter)
      setPhase("energizing");
      at(500,  () => setPhase("peak"));
      at(820,  () => setPhase("settling"));
      at(1400, () => { setPhase("idle"); onComplete?.(); });
    }

    return () => timers.forEach(clearTimeout);
  }, [isActive, stageChanged, onComplete]);

  // Visibility helpers
  const showFrom =
    phase === "idle" ||
    phase === "preparing" ||
    phase === "energizing" ||
    phase === "peak" ||
    (!stageChanged && phase === "settling");

  const showTo = stageChanged && (phase === "revealing" || phase === "settling");
  const showSettled = !stageChanged && phase === "settling";

  const showGlow =
    phase === "energizing" ||
    phase === "peak" ||
    phase === "revealing" ||
    phase === "settling";

  const showParticles = phase === "energizing" || phase === "peak";

  // Glow intensity
  const glowOpacity: Record<Phase, number> = {
    idle: 0, preparing: 0.1, energizing: 0.45, peak: 0.8, revealing: 0.55, settling: 0,
  };
  const glowScale: Record<Phase, number> = {
    idle: 0.6, preparing: 0.85, energizing: 1.05, peak: 1.3, revealing: 1.1, settling: 0.7,
  };

  // FROM image animation per phase
  const fromAnim = () => {
    if (phase === "preparing") return { scale: stageScale[fromStage] * 1.06, y: -3, opacity: 1 };
    if (phase === "energizing") return { scale: stageScale[fromStage] * 1.1, y: -5, opacity: 1 };
    if (phase === "peak") return { scale: stageScale[fromStage] * 1.18, y: -7, opacity: 1 };
    if (phase === "settling" && !stageChanged) return { scale: stageScale[fromStage], y: 0, opacity: 1 };
    return { scale: stageScale[fromStage], y: 0, opacity: 1 };
  };

  const fromFilter = () => {
    if (phase === "peak") return `drop-shadow(0 0 14px ${color}cc) brightness(1.2)`;
    if (phase === "energizing") return `drop-shadow(0 0 8px ${color}88)`;
    return "none";
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
    >
      {/* ── Primary glow ring ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: px * 1.4,
          height: px * 1.4,
          background: `radial-gradient(circle, ${color}55 0%, ${color}00 70%)`,
        }}
        animate={{
          opacity: showGlow ? glowOpacity[phase] : 0,
          scale: glowScale[phase],
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* ── Secondary outer glow (peak only) ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: px * 1.75,
          height: px * 1.75,
          background: `radial-gradient(circle, ${color}28 0%, ${color}00 65%)`,
        }}
        animate={{
          opacity: phase === "peak" ? 0.9 : phase === "energizing" ? 0.4 : 0,
          scale: phase === "peak" ? 1.05 : 0.85,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* ── Sparkle particles ── */}
      <AnimatePresence>
        {showParticles &&
          PARTICLES.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const dist = phase === "peak" ? px * 0.74 : px * 0.52;
            const tx = Math.cos(rad) * dist;
            const ty = Math.sin(rad) * dist;
            return (
              <motion.div
                key={p.id}
                className="pointer-events-none absolute"
                style={{ width: 5, height: 5 }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, tx * 0.45, tx],
                  y: [0, ty * 0.45, ty],
                  scale: [0, 1.3, 0.5],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: phase === "peak" ? 0.5 : 0.65,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              >
                <div className="h-full w-full rounded-full" style={{ backgroundColor: color }} />
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* ── FROM stage image ── */}
      <AnimatePresence>
        {showFrom && (
          <motion.div
            key="from"
            className="absolute flex items-center justify-center"
            style={{ width: px, height: px }}
            animate={fromAnim()}
            exit={
              stageChanged
                ? { scale: stageScale[fromStage] * 0.65, opacity: 0, y: 4,
                    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }
                : undefined
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={fromData.image}
              alt={`${def.name} — ${fromData.form}`}
              className="h-full w-full object-contain"
              style={{ filter: fromFilter() }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Celebrate settle (same stage, after peak) ── */}
      <AnimatePresence>
        {showSettled && (
          <motion.div
            key="settled"
            className="absolute flex items-center justify-center"
            style={{ width: px, height: px }}
            initial={{ scale: stageScale[fromStage] * 1.18, opacity: 1 }}
            animate={{ scale: stageScale[fromStage], opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <img
              src={fromData.image}
              alt={`${def.name} — ${fromData.form}`}
              className="h-full w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TO stage image (growth only) ── */}
      <AnimatePresence>
        {showTo && (
          <motion.div
            key="to"
            className="absolute flex items-center justify-center"
            style={{ width: px, height: px }}
            initial={{ scale: stageScale[toStage] * 0.7, opacity: 0, y: 10 }}
            animate={
              phase === "revealing"
                ? { scale: stageScale[toStage] * 1.06, opacity: 1, y: 0,
                    filter: `drop-shadow(0 0 12px ${color}99)` }
                : { scale: stageScale[toStage], opacity: 1, y: 0, filter: "none" }
            }
            transition={
              phase === "revealing"
                ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                : { type: "spring", stiffness: 200, damping: 16 }
            }
          >
            <img
              src={toData.image}
              alt={`${def.name} — ${toData.form}`}
              className="h-full w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
