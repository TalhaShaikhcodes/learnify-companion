import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/Button";
import { companionCatalog, type CompanionId } from "../data/companion";

interface ChooseCompanionScreenProps {
  onChoose: (id: CompanionId) => void;
}

const FALLBACK_EMOJI: Record<CompanionId, string> = {
  nova:  "🔮",
  ember: "🔥",
  moss:  "🌿",
};

const COMPANION_ORDER: CompanionId[] = ["ember", "nova", "moss"];

export function ChooseCompanionScreen({ onChoose }: ChooseCompanionScreenProps) {
  const [selected, setSelected] = useState<CompanionId>("nova");
  const def = companionCatalog[selected];

  return (
    <div className="flex h-full flex-col items-stretch justify-center gap-7">

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          Learnify
        </p>
        <h1 className="mt-1.5 text-[28px] font-bold tracking-tight text-[#171717]">
          Choose your companion
        </h1>
        <p className="mt-1 text-sm text-black/40">Who will grow with you?</p>
      </motion.div>

      {/* ── Middle block: cards + preview ── */}
      <div className="flex flex-col gap-3">

        {/* Companion cards */}
        <div className="grid grid-cols-3 gap-3">
          {COMPANION_ORDER.map((id, i) => {
            const c = companionCatalog[id];
            const isSelected = selected === id;

            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col items-center rounded-[22px] border-2 px-2 py-4 transition-colors duration-200"
                style={{
                  borderColor: isSelected ? c.color : "transparent",
                  backgroundColor: isSelected ? c.colorBg : "#FFFFFF",
                  boxShadow: isSelected
                    ? `0 0 0 1px ${c.color}22, 0 4px 16px ${c.color}20`
                    : "0 1px 4px rgba(0,0,0,0.06)",
                }}
                aria-pressed={isSelected}
              >
                {/* Check badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: c.color }}
                    >
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image */}
                <motion.div
                  animate={{ scale: isSelected ? 1.07 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex h-16 w-16 items-center justify-center"
                >
                  <CompanionEgg id={id} color={c.color} colorBg={c.colorBg} isSelected={isSelected} />
                </motion.div>

                {/* Name */}
                <p
                  className="mt-2 text-sm font-bold leading-tight"
                  style={{ color: isSelected ? c.color : "#171717" }}
                >
                  {c.name}
                </p>

                {/* Trait */}
                <p className="mt-0.5 text-[11px] font-medium text-black/40">{c.trait}</p>
              </motion.button>
            );
          })}
        </div>

        {/* You chose card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-[20px] px-5 py-4 text-center"
            style={{ backgroundColor: def.colorBg }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: `${def.color}90` }}
            >
              You chose
            </p>
            <p className="mt-0.5 text-lg font-bold" style={{ color: def.color }}>
              {def.name}
            </p>
            <p className="text-xs font-medium" style={{ color: `${def.color}99` }}>
              {def.trait} · Stage 1 Hatchling
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA ── */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <Button
              onClick={() => onChoose(selected)}
              className="w-full"
              style={{
                backgroundColor: def.color,
                boxShadow: `0 8px 24px ${def.color}40`,
              }}
            >
              Choose {def.name}
              <ArrowRight size={17} className="ml-2" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Companion egg visual ──────────────────────────────────────

interface CompanionEggProps {
  id: CompanionId;
  color: string;
  colorBg: string;
  isSelected: boolean;
}

function CompanionEgg({ id, color, colorBg, isSelected }: CompanionEggProps) {
  const src = companionCatalog[id].stages[1].image;

  return (
    <div className="relative h-full w-full">
      <img
        src={src}
        alt={companionCatalog[id].name}
        className="h-full w-full object-contain drop-shadow-sm"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent && !parent.querySelector(".egg-fallback")) {
            const fb = document.createElement("div");
            fb.className =
              "egg-fallback flex h-full w-full items-center justify-center rounded-2xl text-3xl";
            fb.style.backgroundColor = isSelected ? `${color}22` : `${colorBg}cc`;
            fb.textContent = FALLBACK_EMOJI[id];
            parent.appendChild(fb);
          }
        }}
      />
    </div>
  );
}
