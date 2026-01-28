import { ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-everest.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
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
          <p className="text-primary-foreground/80 uppercase tracking-[0.3em] text-sm md:text-base mb-6 animate-fade-up">
            Discover the Land of the Himalayas
          </p>

          {/* Main Heading */}
          <h1 className="heading-display text-primary-foreground mb-6 animate-fade-up delay-100">
            Experience{" "}
            <span className="italic text-nepal-gold">Nepal</span>
          </h1>

          {/* Subheading */}
          <p className="text-body-large text-primary-foreground/90 mb-10 max-w-2xl mx-auto animate-fade-up delay-200">
            From the world's highest peaks to ancient temples and vibrant cultures. 
            Your journey to the heart of the Himalayas begins here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated text-lg px-8 py-6"
            >
              Explore Destinations
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 text-lg px-8 py-6"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Video
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 md:mt-24 animate-fade-up delay-400">
            <div className="text-center">
              <p className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">8</p>
              <p className="text-primary-foreground/70 text-sm md:text-base mt-1">of 14 Highest Peaks</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">10+</p>
              <p className="text-primary-foreground/70 text-sm md:text-base mt-1">UNESCO Sites</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">125+</p>
              <p className="text-primary-foreground/70 text-sm md:text-base mt-1">Ethnic Groups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <a href="#categories" className="flex flex-col items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
