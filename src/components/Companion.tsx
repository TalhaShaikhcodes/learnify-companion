import { motion, AnimatePresence } from "framer-motion";
import { companionCatalog, type GrowthStage, type CompanionId } from "../data/companion";

interface CompanionProps {
  stage: GrowthStage;
  companionId?: CompanionId;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

// Base display sizes
const sizeClasses = {
  sm: "h-20 w-20",
  md: "h-36 w-36",
  lg: "h-52 w-52",
};

// When only one image exists for multiple stages, we scale it up per stage
// to communicate physical growth without new artwork.
const stageScale: Record<GrowthStage, number> = {
  1: 0.78,
  2: 0.90,
  3: 1.00,
};

// Fallback emoji per companion × stage
const FALLBACK: Record<CompanionId, Record<GrowthStage, string>> = {
  nova:  { 1: "🔮", 2: "💜", 3: "⭐" },
  ember: { 1: "🔥", 2: "🌋", 3: "☀️" },
  moss:  { 1: "🌱", 2: "🌿", 3: "🌳" },
};

export function Companion({
  stage,
  companionId = "nova",
  size = "md",
  animate = true,
}: CompanionProps) {
  const def = companionCatalog[companionId];
  const stageData = def.stages[stage];
  const scale = stageScale[stage];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`companion-${companionId}-${stage}`}
        initial={animate ? { opacity: 0, scale: scale * 0.82, y: 10 } : false}
        animate={{ opacity: 1, scale, y: 0 }}
        exit={{ opacity: 0, scale: scale * 1.08, y: -6 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`flex ${sizeClasses[size]} items-center justify-center`}
      >
        <img
          src={stageData.image}
          alt={`${def.name} — ${stageData.form}`}
          className="h-full w-full object-contain drop-shadow-[0_16px_30px_rgba(91,75,219,0.18)]"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".companion-fallback")) {
              const fb = document.createElement("div");
              fb.className =
                "companion-fallback flex h-full w-full items-center justify-center rounded-full";
              fb.style.background = `linear-gradient(135deg, ${def.colorBg}, ${def.color}66)`;
              const emoji = FALLBACK[companionId][stage];
              const emojiSize =
                stage === 1 ? "text-5xl" : stage === 2 ? "text-6xl" : "text-7xl";
              fb.innerHTML = `<span class="${emojiSize}">${emoji}</span>`;
              parent.appendChild(fb);
            }
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
