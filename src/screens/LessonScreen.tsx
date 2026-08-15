import { useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/Button";

interface LessonScreenProps {
  lessonNumber: number;
  onComplete: () => void;
  onExit?: () => void;
}

const lessons = [
  {
    subject: "Science",
    title: "The Solar System",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    subject: "Maths",
    title: "Multiplication",
    question: "What is 7 × 8?",
    options: ["48", "54", "56", "63"],
    answer: "56",
  },
];

type Phase = "answering" | "checked";

export function LessonScreen({ lessonNumber, onComplete, onExit }: LessonScreenProps) {
  const lesson = lessons[(lessonNumber - 1) % lessons.length];
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("answering");

  const isCorrect = selected === lesson.answer;

  const handleCta = () => {
    if (phase === "answering") {
      setPhase("checked");
    } else {
      onComplete();
    }
  };

  const getOptionStyle = (option: string) => {
    if (phase === "answering") {
      return selected === option
        ? "border-[#5B4BDB] bg-[#F3F0FF]"
        : "border-black/[0.08] bg-white hover:border-[#5B4BDB]/30 hover:bg-[#F8F7FF]";
    }
    // checked phase
    if (option === lesson.answer) {
      return "border-[#2A9D5C] bg-[#E8F7EE]";
    }
    if (option === selected) {
      return "border-[#E8935A] bg-[#FFF4EC]";
    }
    return "border-black/[0.05] bg-white opacity-40";
  };

  const getOptionTextStyle = (option: string) => {
    if (phase === "answering") {
      return selected === option ? "text-[#4E41BA]" : "text-[#171717]";
    }
    if (option === lesson.answer) return "text-[#1E7A46]";
    if (option === selected) return "text-[#B05A20]";
    return "text-[#171717]";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-black/40 transition-colors hover:bg-black/[0.08]"
          aria-label="Exit lesson"
        >
          <X size={15} />
        </button>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black/50 shadow-sm ring-1 ring-black/[0.05]">
          {lesson.subject}
        </span>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5B4BDB]">
          {lesson.title}
        </p>

        <h1 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-[#171717]">
          {lesson.question}
        </h1>

        <div className="mt-7 space-y-3">
          {lesson.options.map((option) => {
            const isAnswer = option === lesson.answer;
            const isSelected = selected === option;

            return (
              <motion.button
                key={option}
                type="button"
                onClick={() => phase === "answering" && setSelected(option)}
                whileTap={phase === "answering" ? { scale: 0.985 } : undefined}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${getOptionStyle(option)}`}
              >
                <span className={`text-sm font-semibold ${getOptionTextStyle(option)}`}>
                  {option}
                </span>

                {/* Answering phase: show dot on selected */}
                {phase === "answering" && isSelected && (
                  <div className="h-4 w-4 shrink-0 rounded-full bg-[#5B4BDB]" />
                )}

                {/* Checked phase: correct answer gets checkmark */}
                {phase === "checked" && isAnswer && (
                  <CheckCircle2 size={18} className="shrink-0 text-[#2A9D5C]" />
                )}

                {/* Checked phase: wrong selection gets soft X */}
                {phase === "checked" && isSelected && !isAnswer && (
                  <XCircle size={18} className="shrink-0 text-[#E8935A]" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback banner */}
        <AnimatePresence>
          {phase === "checked" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={`mt-5 flex items-center gap-3 rounded-2xl px-4 py-3.5 ${
                isCorrect ? "bg-[#E8F7EE]" : "bg-[#FFF4EC]"
              }`}
            >
              {isCorrect ? (
                <>
                  <span className="text-xl leading-none">🎉</span>
                  <div>
                    <p className="text-sm font-bold text-[#1E7A46]">Correct!</p>
                    <p className="text-xs text-[#1E7A46]/70">Great job — keep it up.</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xl leading-none">💡</span>
                  <div>
                    <p className="text-sm font-bold text-[#B05A20]">Not quite</p>
                    <p className="text-xs text-[#B05A20]/80">
                      The answer is <span className="font-bold">{lesson.answer}</span>.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <Button onClick={handleCta} disabled={!selected} className="w-full">
          {phase === "answering" ? "Check answer" : "Complete lesson"}
        </Button>
      </motion.div>
    </div>
  );
}
