"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/Search";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
        isActive 
          ? "text-white" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Active indicator */}
      {isActive && (
        <>
          <span className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/20 rounded-lg" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
        </>
      )}
      
      {/* Hover underline effect */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 group-hover:w-4/5" />
    </Link>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");
  const query = searchParams.get("q");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getActiveSection = () => {
    if (query) return "search";
    if (type === "series") return "series";
    if (type === "movie") return "movies";
    if (sort === "popular") return "popular";
    if (pathname === "/" && !type && !sort && !query) return "home";
    return null;
  };

  const activeSection = getActiveSection();

  const navItems = [
    { href: "/", label: "Home", id: "home" },
    { href: "/?type=movie", label: "Movies", id: "movies" },
    { href: "/?type=series", label: "TV Shows", id: "series" },
    { href: "/?sort=popular", label: "Popular", id: "popular" },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          isScrolled 
            ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="container flex h-16 md:h-20 items-center px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="mr-8 flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.id}
                href={item.href} 
                isActive={activeSection === item.id}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <Search />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-black/95 border-b border-white/10 p-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-red-600/20 to-orange-500/20 text-white border-l-2 border-red-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container flex h-16 md:h-20 items-center px-4 lg:px-8">
          <div className="mr-8">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
