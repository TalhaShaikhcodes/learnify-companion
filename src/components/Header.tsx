import { Flame } from "lucide-react";

interface HeaderProps {
  streak?: number;
}

export function Header({ streak = 3 }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 pb-3 pt-5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
          Learnify
        </div>
        <div className="mt-0.5 text-sm font-bold text-[#171717]">
          Companion journey
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/[0.05]">
        <Flame size={14} className="text-orange-500" />
        <span className="text-xs font-bold text-[#171717]">
          {streak} day streak
        </span>
      </div>
    </header>
  );
}
