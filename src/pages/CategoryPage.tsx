import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug } from "@/data/categoryPlaces";
import BookmarkButton from "@/components/BookmarkButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we couldn't find this experience category.</p>
          <Link to="/">
            <Button className="btn-accent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={category.heroImage}
            alt={category.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="container-wide pb-12">
            <Link to="/">
              <Button variant="outline" className="mb-6 border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                {category.title} Experiences
              </span>
              <h1 className="heading-display text-primary-foreground mb-2">{category.tagline}</h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">
              {category.places.length} Places to Explore
            </p>
            <h2 className="heading-section text-foreground">
              Top <span className="italic text-accent">{category.title}</span> Destinations
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {category.places.map((place) => (
              <motion.div
                key={place.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {place.category}
                  </span>

                  {/* Bookmark */}
                  <div className="absolute top-4 right-12">
                    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-nepal-gold text-nepal-gold" />
                      <span className="text-xs font-medium text-foreground">{place.rating}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-2">
                    <BookmarkButton
                      placeName={place.name}
                      placeData={{
                        description: place.description,
                        category: place.category,
                        image_url: place.image,
                        location: place.location,
                      }}
                      variant="overlay"
                    />
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl font-semibold text-primary-foreground">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-1">
                      <MapPin className="h-3 w-3" />
                      {place.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {place.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {place.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default CategoryPage;
