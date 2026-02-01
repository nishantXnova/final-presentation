import { motion } from "framer-motion";
import { Sun, Cloud, Leaf, Snowflake } from "lucide-react";

const seasons = [
  {
    name: "Spring",
    months: "March - May",
    icon: Sun,
    color: "from-pink-400 to-rose-500",
    description: "Rhododendrons bloom across the hills. Perfect trekking weather with clear mountain views.",
    highlights: ["Wildflower blooms", "Holi festival", "Clear skies"],
    bestFor: "Trekking, Photography",
  },
  {
    name: "Monsoon",
    months: "June - August",
    icon: Cloud,
    color: "from-emerald-400 to-teal-500",
    description: "Lush green landscapes and fewer tourists. Great for cultural experiences and budget travel.",
    highlights: ["Green valleys", "Lower prices", "Cultural tours"],
    bestFor: "Culture, Budget Travel",
  },
  {
    name: "Autumn",
    months: "September - November",
    icon: Leaf,
    color: "from-amber-400 to-orange-500",
    description: "Peak season with crystal-clear visibility. The best time for mountain views and festivals.",
    highlights: ["Best visibility", "Dashain festival", "Ideal weather"],
    bestFor: "Trekking, Festivals",
  },
  {
    name: "Winter",
    months: "December - February",
    icon: Snowflake,
    color: "from-sky-400 to-blue-500",
    description: "Crisp, clear days with stunning mountain views. Perfect for lower altitude treks.",
    highlights: ["Snow-capped peaks", "Wildlife spotting", "Fewer crowds"],
    bestFor: "Wildlife, Photography",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const SeasonalHighlights = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">
            Best Time to Visit
          </p>
          <h2 className="heading-section text-foreground mb-4">
            Every Season is <span className="italic text-accent">Beautiful</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Nepal offers unique experiences throughout the year. Discover what each season has to offer.
          </p>
        </motion.div>

        {/* Seasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {seasons.map((season) => (
            <motion.div
              key={season.name}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-card rounded-2xl p-6 relative overflow-hidden shadow-soft hover:shadow-card transition-shadow duration-500"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${season.color} flex items-center justify-center mb-4 shadow-soft`}
              >
                <season.icon className="h-7 w-7 text-primary-foreground" />
              </motion.div>

              {/* Season Name */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                {season.name}
              </h3>
              <p className="text-accent text-sm font-medium mb-3">{season.months}</p>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {season.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-4">
                {season.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Best For */}
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Best for:</span> {season.bestFor}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SeasonalHighlights;
