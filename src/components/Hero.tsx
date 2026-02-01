import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-everest.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroImage}
          alt="Mount Everest at sunrise with prayer flags"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-foreground/80 uppercase tracking-[0.3em] text-sm md:text-base mb-6"
          >
            Discover the Land of the Himalayas
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="heading-display text-primary-foreground mb-6"
          >
            <span className="italic text-nepal-gold">Go</span>Nepal
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-body-large text-primary-foreground/90 mb-10 max-w-2xl mx-auto"
          >
            From the world's highest peaks to ancient temples and vibrant cultures. 
            Your journey to the heart of the Himalayas begins here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection("destinations")}
            >
              Explore Destinations
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection("flights")}
            >
              <Play className="mr-2 h-5 w-5" />
              Book Flights
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-3 gap-6 md:gap-12 mt-16 md:mt-24"
          >
            {[
              { value: "8", label: "of 14 Highest Peaks" },
              { value: "10+", label: "UNESCO Sites" },
              { value: "125+", label: "Ethnic Groups" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-primary-foreground/70 text-sm md:text-base mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 1.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button 
          onClick={() => scrollToSection("categories")}
          className="flex flex-col items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6" />
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
