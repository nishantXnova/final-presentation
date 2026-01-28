import { useState, useEffect } from "react";
import { Menu, X, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#destinations", label: "Destinations" },
    { href: "#experiences", label: "Experiences" },
    { href: "#plan", label: "Plan Your Trip" },
    { href: "#about", label: "About Nepal" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-effect shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Mountain className={`h-8 w-8 transition-colors duration-300 ${
            isScrolled ? "text-accent" : "text-primary-foreground"
          }`} />
          <span className={`font-display text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            myNepal
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-medium transition-all duration-300 hover:text-accent ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button
            className={`transition-all duration-300 ${
              isScrolled
                ? "btn-accent"
                : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            }`}
          >
            Start Planning
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 transition-colors ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-effect shadow-card animate-fade-up">
          <div className="container-wide py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground font-medium py-2 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button className="btn-accent w-full mt-2">
              Start Planning
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
