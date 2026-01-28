import { MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import kathmanduImage from "@/assets/kathmandu-temple.jpg";
import pokharaImage from "@/assets/pokhara-lake.jpg";
import chitwanImage from "@/assets/chitwan-wildlife.jpg";
import annapurnaImage from "@/assets/annapurna-trek.jpg";
import lumbiniImage from "@/assets/lumbini-temple.jpg";
import heroImage from "@/assets/hero-everest.jpg";

const destinations = [
  {
    id: 1,
    name: "Kathmandu Valley",
    tagline: "City of Temples",
    image: kathmanduImage,
    duration: "2-4 days",
    rating: 4.8,
    highlights: ["Durbar Square", "Swayambhunath", "Boudhanath"],
    category: "Culture",
  },
  {
    id: 2,
    name: "Pokhara",
    tagline: "Gateway to Annapurna",
    image: pokharaImage,
    duration: "3-5 days",
    rating: 4.9,
    highlights: ["Phewa Lake", "Sarangkot", "Peace Pagoda"],
    category: "Nature",
  },
  {
    id: 3,
    name: "Everest Region",
    tagline: "Top of the World",
    image: heroImage,
    duration: "12-16 days",
    rating: 5.0,
    highlights: ["Base Camp Trek", "Namche Bazaar", "Tengboche"],
    category: "Adventure",
  },
  {
    id: 4,
    name: "Chitwan National Park",
    tagline: "Jungle Safari",
    image: chitwanImage,
    duration: "2-3 days",
    rating: 4.7,
    highlights: ["Rhino Safari", "Elephant Rides", "Bird Watching"],
    category: "Nature",
  },
  {
    id: 5,
    name: "Annapurna Circuit",
    tagline: "Epic Mountain Trek",
    image: annapurnaImage,
    duration: "10-21 days",
    rating: 4.9,
    highlights: ["Thorong La Pass", "Muktinath", "Mountain Views"],
    category: "Adventure",
  },
  {
    id: 6,
    name: "Lumbini",
    tagline: "Birthplace of Buddha",
    image: lumbiniImage,
    duration: "1-2 days",
    rating: 4.6,
    highlights: ["Maya Devi Temple", "Peace Flame", "Monasteries"],
    category: "Spirituality",
  },
];

const Destinations = () => {
  return (
    <section id="destinations" className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">
              Popular Destinations
            </p>
            <h2 className="heading-section text-foreground">
              Where Will You <span className="italic text-accent">Go?</span>
            </h2>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            View All Destinations
          </Button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="group relative bg-card rounded-2xl overflow-hidden card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover image-zoom group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {destination.category}
                </span>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-nepal-gold text-nepal-gold" />
                  <span className="text-xs font-medium text-foreground">{destination.rating}</span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground">
                    {destination.name}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {destination.tagline}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Nepal</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button className="w-full btn-primary">
                  Explore {destination.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
