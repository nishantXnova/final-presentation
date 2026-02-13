import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Landmark, Trees, Sparkles } from "lucide-react";

const categories = [
  {
    icon: Mountain,
    title: "Adventure",
    slug: "adventure",
    description: "Trek to Everest Base Camp, conquer mountain passes, and experience world-class adventures.",
    color: "from-nepal-sky to-primary",
  },
  {
    icon: Landmark,
    title: "Culture",
    slug: "culture",
    description: "Explore ancient temples, vibrant festivals, and centuries-old traditions.",
    color: "from-nepal-terracotta to-accent",
  },
  {
    icon: Trees,
    title: "Nature",
    slug: "nature",
    description: "Discover pristine national parks, rare wildlife, and breathtaking landscapes.",
    color: "from-nepal-forest to-nepal-sky",
  },
  {
    icon: Sparkles,
    title: "Spirituality",
    slug: "spirituality",
    description: "Find peace at sacred sites, monasteries, and the birthplace of Buddha.",
    color: "from-nepal-gold to-nepal-terracotta",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const Categories = () => {
  return (
    <section id="categories" className="section-padding bg-secondary">
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
            Find Your Experience
          </p>
          <h2 className="heading-section text-foreground mb-4">
            How Do You Want to <span className="italic text-accent">Explore?</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Whether you seek adventure, culture, nature, or spiritual awakening, 
            Nepal offers experiences that will transform your journey.
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <Link key={category.title} to={`/category/${category.slug}`}>
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative bg-card rounded-2xl p-8 cursor-pointer overflow-hidden shadow-soft hover:shadow-card transition-shadow duration-500 h-full"
            >
              {/* Gradient Background on Hover */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} 
              />
              
              {/* Icon */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-soft`}
              >
                <category.icon className="h-8 w-8 text-primary-foreground" />
              </motion.div>

              {/* Content */}
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                {category.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {category.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center text-accent font-medium">
                <span className="mr-2">Explore</span>
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="transform group-hover:translate-x-2 transition-transform duration-300"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
