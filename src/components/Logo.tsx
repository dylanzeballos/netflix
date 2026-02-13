import { Play } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-lg", subtext: "text-[0.5rem]" },
    md: { container: "w-10 h-10", icon: "w-6 h-6", text: "text-xl", subtext: "text-[0.6rem]" },
    lg: { container: "w-12 h-12", icon: "w-7 h-7", text: "text-2xl", subtext: "text-[0.7rem]" }
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 font-bold tracking-tighter group cursor-pointer ${className}`}>
      {/* Animated Icon Container */}
      <div className={`relative flex items-center justify-center ${s.container} bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]`}>
        <Play className={`${s.icon} text-white fill-white ml-0.5`} />
        
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-lg border-2 border-white/20 scale-110 animate-ping opacity-20" />
        <div className="absolute inset-0 rounded-lg border border-white/30 scale-125 animate-pulse" />
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <span className={`${s.subtext} text-red-400 font-mono tracking-[0.2em] uppercase font-semibold`}>
          STREAM
        </span>
        <span className={`${s.text} text-white font-black tracking-tight drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)] group-hover:text-red-400 transition-colors duration-300`}>
          VAULT
        </span>
      </div>
    </div>
  );
}
