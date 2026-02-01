import { motion } from "framer-motion";
import { ExternalLink, Hotel, Mountain, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const airlinePartners = [
  { name: "Buddha Air", logo: "/logos/buddha-air.svg", url: "https://www.buddhaair.com/" },
  { name: "Yeti Airlines", logo: "/logos/yeti-airlines.svg", url: "https://yetiairlines.com/" },
  { name: "Tara Air", logo: "/logos/tara-air.png", url: "https://taraair.com/" },
];

const partnerCategories = [
  {
    icon: Hotel,
    title: "Hotels & Lodges",
    description: "From luxury resorts to authentic teahouses along the trekking trails.",
    partners: ["Dwarika's Hotel", "Tiger Mountain Lodge", "Yeti Mountain Home"],
    cta: "Find Accommodation",
  },
  {
    icon: Mountain,
    title: "Trekking Guides",
    description: "Licensed guides and porters for safe and memorable mountain adventures.",
    partners: ["Nepal Mountaineering", "Himalayan Guides", "Adventure Consultants"],
    cta: "Find a Guide",
  },
  {
    icon: Package,
    title: "Tour Packages",
    description: "Curated experiences combining multiple destinations and activities.",
    partners: ["Nepal Tourism Board", "Intrepid Travel", "G Adventures"],
    cta: "Browse Packages",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const Partners = () => {
  return (
    <section className="section-padding bg-background">
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
            Trusted Partners
          </p>
          <h2 className="heading-section text-foreground mb-4">
            Book With <span className="italic text-accent">Confidence</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            We've partnered with Nepal's best service providers to help you plan your perfect trip.
          </p>
        </motion.div>

        {/* Domestic Flights - Special Section with Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl p-8 border border-border mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                Domestic Flights
              </h3>
              <p className="text-muted-foreground mb-4">
                Mountain flights and connections to remote destinations.
              </p>
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                onClick={() => window.open("https://www.nepalairlines.com.np/", "_blank", "noopener,noreferrer")}
              >
                Book Flights
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Airline Logos */}
            <div className="flex flex-wrap items-center gap-6">
              {airlinePartners.map((airline, index) => (
                <motion.a
                  key={airline.name}
                  href={airline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-white rounded-xl p-4 shadow-soft hover:shadow-card transition-shadow duration-300 flex items-center justify-center min-w-[120px] h-[60px]"
                >
                  <img 
                    src={airline.logo} 
                    alt={airline.name}
                    className="max-h-10 max-w-[100px] object-contain"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Other Partner Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {partnerCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-card rounded-2xl p-8 border border-border hover:border-accent/30 hover:shadow-card transition-all duration-500"
            >
              <div className="flex flex-col">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-6"
                >
                  <category.icon className="h-8 w-8 text-accent" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                {/* Partner Names */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {category.partners.map((partner) => (
                    <span
                      key={partner}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {partner}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 mt-auto"
                >
                  {category.cta}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          * Partner links will redirect you to external booking platforms. GoNepal is not responsible for third-party services.
        </motion.p>
      </div>
    </section>
  );
};

export default Partners;
