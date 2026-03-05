import { useState, useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`text-center transition-all duration-700 ease-out ${
          phase === "enter"
            ? "opacity-0 scale-90 translate-y-4"
            : phase === "hold"
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4"
        }`}
      >
        <h1 className="text-5xl font-black text-foreground tracking-tight">
          Split<span className="text-primary">It</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium tracking-wide">
          50 / 30 / 20
        </p>
      </div>
    </div>
  );
}
