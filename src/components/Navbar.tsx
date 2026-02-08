import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Mountain, User, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#destinations", label: "Destinations" },
    { href: "/#experiences", label: "Experiences" },
    { href: "/#flights", label: "Flights" },
    { href: "/#plan", label: "Plan Your Trip" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      if (isHomePage) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = href;
      }
    }
  };

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
        <Link to="/" className="flex items-center gap-2 group">
          <Mountain className={`h-8 w-8 transition-colors duration-300 ${
            isScrolled ? "text-accent" : "text-primary-foreground"
          }`} />
          <span className={`font-display text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            GoNepal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`font-medium transition-all duration-300 hover:text-accent cursor-pointer ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          
          {/* Auth Button */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="ghost"
                    size="icon"
                    className={`rounded-full transition-all duration-300 ${
                      isScrolled
                        ? "text-foreground hover:bg-muted"
                        : "text-primary-foreground hover:bg-primary-foreground/20"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/profile")}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-all duration-300 ${
                    isScrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-primary-foreground hover:bg-primary-foreground/20"
                  }`}
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "btn-primary"
                    : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                }`}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )
          )}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-foreground font-medium py-2 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            {!loading && (
              user ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/admin");
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    className="btn-primary w-full mt-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Button>
                </>
              ) : (
                <Button 
                  className="btn-primary w-full mt-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
