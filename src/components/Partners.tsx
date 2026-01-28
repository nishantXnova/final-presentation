import { ExternalLink, Hotel, Mountain, Plane, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    icon: Plane,
    title: "Domestic Flights",
    description: "Mountain flights and connections to remote destinations.",
    partners: ["Buddha Air", "Yeti Airlines", "Tara Air"],
    cta: "Book Flights",
  },
  {
    icon: Package,
    title: "Tour Packages",
    description: "Curated experiences combining multiple destinations and activities.",
    partners: ["Nepal Tourism Board", "Intrepid Travel", "G Adventures"],
    cta: "Browse Packages",
  },
];

const Partners = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent uppercase tracking-widest text-sm font-medium mb-4">
            Trusted Partners
          </p>
          <h2 className="heading-section text-foreground mb-4">
            Book With <span className="italic text-accent">Confidence</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            We've partnered with Nepal's best service providers to help you plan your perfect trip.
          </p>
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerCategories.map((category, index) => (
            <div
              key={category.title}
              className="bg-card rounded-2xl p-8 border border-border card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <category.icon className="h-8 w-8 text-accent" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>

                  {/* Partner Logos/Names */}
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
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.cta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-muted-foreground text-sm mt-12">
          * Partner links will redirect you to external booking platforms. myNepal.com is not responsible for third-party services.
        </p>
      </div>
    </section>
  );
};

export default Partners;
