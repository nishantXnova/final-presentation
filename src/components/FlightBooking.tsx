import { motion } from "framer-motion";
import { Plane, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularRoutes = [
  { from: "Kathmandu", to: "Pokhara", duration: "25 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Lukla", duration: "35 min", frequency: "Daily (weather permitting)" },
  { from: "Pokhara", to: "Jomsom", duration: "20 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Bharatpur", duration: "25 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Biratnagar", duration: "35 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Nepalgunj", duration: "1 hr", frequency: "Daily" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const FlightBooking = () => {
  const handleBookFlight = () => {
    window.open("https://www.nepalairlines.com.np/", "_blank", "noopener,noreferrer");
  };

  return (
    <section id="flights" className="section-padding bg-gradient-to-br from-nepal-sky/10 via-background to-accent/5">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4"
          >
            <Plane className="h-4 w-4" />
            <span className="text-sm font-medium">Flight Booking</span>
          </motion.div>
          <h2 className="heading-section text-foreground mb-4">
            Book Your <span className="italic text-accent">Flights</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Reach Nepal's remote destinations quickly with domestic flights. From scenic mountain flights to essential connections.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl p-8 shadow-card border border-border"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center"
              >
                <Plane className="h-8 w-8 text-accent" />
              </motion.div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Nepal Airlines</h3>
                <p className="text-muted-foreground">Official National Flag Carrier</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Nepal Airlines operates domestic and international flights connecting major cities and remote mountain destinations. 
              Book directly through their official website for the best rates and schedules.
            </p>

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <h4 className="font-medium text-foreground mb-3">Why Book with Nepal Airlines?</h4>
              <ul className="space-y-2">
                {[
                  "Nepal's national flag carrier with wide route network",
                  "Direct flights to mountain destinations like Lukla",
                  "International connections to major Asian cities",
                  "Flexible booking and rebooking options",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleBookFlight}
                className="w-full btn-accent text-lg py-6 gap-2"
              >
                <Plane className="h-5 w-5" />
                Book on Nepal Airlines
                <ExternalLink className="h-4 w-4" />
              </Button>
            </motion.div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              You'll be redirected to nepalairlines.com.np to complete your booking
            </p>
          </motion.div>

          {/* Right - Popular Routes */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-xl font-semibold text-foreground mb-6"
            >
              Popular Domestic Routes
            </motion.h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              {popularRoutes.map((route, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5, borderColor: "hsl(var(--accent) / 0.5)" }}
                  className="bg-card rounded-xl p-4 border border-border cursor-pointer transition-colors duration-300"
                  onClick={handleBookFlight}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">{route.from}</span>
                      </div>
                      <div className="w-8 h-px bg-border relative">
                        <Plane className="h-3 w-3 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">{route.to}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {route.frequency}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-secondary/50 rounded-xl p-4 mt-6"
            >
              <h4 className="font-medium text-foreground mb-2">✈️ Mountain Flight Tip</h4>
              <p className="text-sm text-muted-foreground">
                The Kathmandu to Lukla flight is one of the world's most scenic and thrilling flights, 
                offering close-up views of Everest. Book early during peak trekking season!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightBooking;
