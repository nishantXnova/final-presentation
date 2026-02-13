import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/destinations";
import BookmarkButton from "@/components/BookmarkButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const Destinations = () => {
  return (
    <section id="destinations" className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">
              Popular Destinations
            </p>
            <h2 className="heading-section text-foreground">
              Where Will You <span className="italic text-accent">Go?</span>
            </h2>
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations.map((destination) => (
            <motion.div
              key={destination.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/destination/${destination.id}`}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card block transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {destination.category}
                  </motion.span>

                  {/* Rating & Bookmark */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-nepal-gold text-nepal-gold" />
                      <span className="text-xs font-medium text-foreground">{destination.rating}</span>
                    </div>
                    <BookmarkButton
                      placeName={destination.name}
                      placeData={{
                        description: destination.description,
                        category: destination.category,
                        image_url: destination.image,
                      }}
                      variant="overlay"
                    />
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
                  <Button className="w-full btn-primary group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    Explore {destination.name}
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Destinations;
