import { Mountain, Landmark, Trees, Sparkles } from "lucide-react";

const categories = [
  {
    icon: Mountain,
    title: "Adventure",
    description: "Trek to Everest Base Camp, conquer mountain passes, and experience world-class adventures.",
    color: "from-nepal-sky to-primary",
  },
  {
    icon: Landmark,
    title: "Culture",
    description: "Explore ancient temples, vibrant festivals, and centuries-old traditions.",
    color: "from-nepal-terracotta to-accent",
  },
  {
    icon: Trees,
    title: "Nature",
    description: "Discover pristine national parks, rare wildlife, and breathtaking landscapes.",
    color: "from-nepal-forest to-nepal-sky",
  },
  {
    icon: Sparkles,
    title: "Spirituality",
    description: "Find peace at sacred sites, monasteries, and the birthplace of Buddha.",
    color: "from-nepal-gold to-nepal-terracotta",
  },
];

const Categories = () => {
  return (
    <section id="categories" className="section-padding bg-secondary">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
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
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group relative bg-card rounded-2xl p-8 card-hover cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform duration-500`}>
                <category.icon className="h-8 w-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                {category.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {category.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center text-accent font-medium">
                <span className="mr-2">Explore</span>
                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
