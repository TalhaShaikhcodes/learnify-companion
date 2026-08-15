import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./components/Header";
import { ChooseCompanionScreen } from "./screens/ChooseCompanionScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LessonScreen } from "./screens/LessonScreen";
import { LessonCompleteScreen } from "./screens/LessonCompleteScreen";
import { EvolutionScreen } from "./screens/EvolutionScreen";
import { NextGoalScreen } from "./screens/NextGoalScreen";
import {
  makeInitialCompanion,
  stageFromXp,
  type CompanionId,
  type CompanionState,
} from "./data/companion";

type Screen =
  | "choose-companion"
  | "home"
  | "lesson"
  | "lesson-complete"
  | "evolution"
  | "next-goal";

const XP_PER_LESSON = 20;

// Screens that should NOT show the Header + streak bar
const SCREENS_WITHOUT_HEADER: Screen[] = ["choose-companion"];

function App() {
  const [screen, setScreen] = useState<Screen>("choose-companion");
  const [companion, setCompanion] = useState<CompanionState>(
    makeInitialCompanion("nova")
  );
  const [xpBefore, setXpBefore] = useState(60);
  const [lessonNumber, setLessonNumber] = useState(1);

  // ── Transitions ──────────────────────────────────────────────

  const handleChooseCompanion = (id: CompanionId) => {
    setCompanion(makeInitialCompanion(id));
    setXpBefore(makeInitialCompanion(id).xp);
    setLessonNumber(1);
    setScreen("home");
  };

  const handleStartLesson = () => setScreen("lesson");

  const handleLessonComplete = () => {
    const prevXp = companion.xp;
    const newXp = Math.min(companion.xp + XP_PER_LESSON, companion.maxXp);
    const newStage = stageFromXp(newXp);
    setXpBefore(prevXp);
    setCompanion((prev) => ({ ...prev, xp: newXp, stage: newStage }));
    setScreen("lesson-complete");
  };

  const handleAfterLessonComplete = () => {
    if (companion.xp >= companion.maxXp) {
      setScreen("evolution");
    } else {
      setLessonNumber((n) => n + 1);
      setScreen("lesson");
    }
  };

  const handleEvolutionContinue = () => setScreen("next-goal");

  const handleRestart = () => {
    // Return to companion selection for a clean demo loop
    setScreen("choose-companion");
  };

  // ── Screen content ────────────────────────────────────────────

  const renderScreen = () => {
    switch (screen) {
      case "choose-companion":
        return <ChooseCompanionScreen onChoose={handleChooseCompanion} />;

      case "home":
        return (
          <HomeScreen companion={companion} onStartLesson={handleStartLesson} />
        );

      case "lesson":
        return (
          <LessonScreen
            lessonNumber={lessonNumber}
            onComplete={handleLessonComplete}
            onExit={() => setScreen("home")}
          />
        );

      case "lesson-complete":
        return (
          <LessonCompleteScreen
            companion={{ ...companion, xp: xpBefore }}
            xpGained={XP_PER_LESSON}
            onContinue={handleAfterLessonComplete}
            onHome={() => setScreen("home")}
          />
        );

      case "evolution":
        return (
          <EvolutionScreen
            companion={companion}
            onContinue={handleEvolutionContinue}
          />
        );

      case "next-goal":
        return (
          <NextGoalScreen companion={companion} onRestart={handleRestart} />
        );
    }
  };

  const showHeader = !SCREENS_WITHOUT_HEADER.includes(screen);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EDEAE4] p-4 sm:p-8">
      <div className="relative flex h-[852px] w-full max-w-[393px] flex-col overflow-hidden rounded-[40px] bg-[#F8F7F4] shadow-[0_32px_80px_rgba(0,0,0,0.18)]">

        {/* Status bar mock */}
        <div className="flex items-center justify-between px-7 pt-3 pb-0">
          <span className="text-[11px] font-semibold text-black/40">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[3, 4, 5].map((h) => (
                <div key={h} className="w-1 rounded-sm bg-black/40" style={{ height: h }} />
              ))}
            </div>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <path
                d="M1 3.5C3.33333 1.16667 6.33333 0 8 0C9.66667 0 12.6667 1.16667 15 3.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className="text-black/40"
              />
              <path
                d="M3.5 6C5 4.5 6.5 3.75 8 3.75C9.5 3.75 11 4.5 12.5 6"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className="text-black/40"
              />
              <circle cx="8" cy="9" r="1.5" fill="currentColor" className="text-black/40" />
            </svg>
            <div className="flex items-center gap-0.5 rounded-sm">
              <div className="h-2.5 w-5 rounded-[3px] border border-black/40 p-px">
                <div className="h-full w-3/4 rounded-[2px] bg-black/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Header — hidden on choose-companion */}
        <AnimatePresence>
          {showHeader && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Header streak={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen content */}
        <div className="flex min-h-0 flex-1 flex-col px-6 pb-7 pt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="h-1 w-28 rounded-full bg-black/20" />
        </div>
      </div>
    </main>
  );
}

export default App;
