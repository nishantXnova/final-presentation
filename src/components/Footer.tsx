import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import gonepallogo from "@/assets/gonepallogo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    destinations: [
      { name: "Kathmandu Valley", href: "/destination/kathmandu-valley" },
      { name: "Pokhara", href: "/destination/pokhara" },
      { name: "Everest Region", href: "/destination/everest-region" },
      { name: "Annapurna Circuit", href: "/destination/annapurna-circuit" },
      { name: "Chitwan National Park", href: "/destination/chitwan" },
      { name: "Lumbini", href: "/destination/lumbini" },
    ],
    experiences: [
      { name: "Trekking & Hiking", section: "categories" },
      { name: "Cultural Tours", section: "categories" },
      { name: "Wildlife Safaris", section: "categories" },
      { name: "Spiritual Retreats", section: "categories" },
      { name: "Adventure Sports", section: "categories" },
      { name: "Photography Tours", section: "categories" },
    ],
    resources: [
      { name: "Travel Guide", section: "travel-info" },
      { name: "Visa Information", section: "travel-info" },
      { name: "Trekking Permits", section: "travel-info" },
      { name: "Book Flights", section: "flights" },
      { name: "Safety Tips", section: "travel-info" },
      { name: "Plan Your Trip", section: "plan" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                Get Travel Inspiration
              </h3>
              <p className="text-primary-foreground/70">
                Subscribe for updates on destinations, travel tips, and special offers.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 min-w-[250px]"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={gonepallogo} alt="GoNepal" className="h-10 w-auto" />
              <span className="font-display text-2xl font-bold">GoNepal</span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Your gateway to the Himalayas. Discover Nepal's breathtaking mountains,
              rich culture, and warm hospitality.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@gonepal.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                info@gonepal.com
              </a>
              <a href="tel:+9771234567890" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                +977 1-234567890
              </a>
              <p className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                Kathmandu, Nepal
              </p>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="font-semibold mb-4">Experiences</h4>
            <ul className="space-y-2">
              {footerLinks.experiences.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} GoNepal.com. All rights reserved.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
