"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  const createSearchUrl = useCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
      params.delete("type");
      params.delete("sort");
    } else {
      params.delete("q");
    }
    
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [searchParams, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(createSearchUrl(term));
    });
  };

  const handleClear = () => {
    setTerm("");
    startTransition(() => {
      router.push(createSearchUrl(""));
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div className={cn(
        "relative flex items-center transition-all duration-300",
        isFocused ? "w-[260px] md:w-[300px] lg:w-[380px]" : "w-[180px] md:w-[220px] lg:w-[280px]"
      )}>
        <SearchIcon className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 pointer-events-none",
          isFocused ? "text-red-500" : "text-gray-500"
        )} />
        
        <Input
          type="search"
          placeholder="Search movies, shows..."
          className={cn(
            "w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500",
            "pl-10 pr-3 py-2 h-10 rounded-full",
            "focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30",
            "hover:bg-white/10",
            "transition-all duration-300",
            isPending && "opacity-70"
          )}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </form>
  );
}
