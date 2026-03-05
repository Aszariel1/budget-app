import { Plus } from "lucide-react";
import { hapticImpact } from "@/lib/haptics";
import { ImpactStyle } from "@capacitor/haptics";

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  const handleClick = () => {
    hapticImpact(ImpactStyle.Medium); // Slightly stronger for the main action
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-all active:scale-90 active:brightness-90"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
