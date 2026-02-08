import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Destinations from "@/components/Destinations";
import SeasonalHighlights from "@/components/SeasonalHighlights";
import FlightBooking from "@/components/FlightBooking";
import PlanTrip from "@/components/PlanTrip";
import Partners from "@/components/Partners";
import TravelInfo from "@/components/TravelInfo";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <Destinations />
      <SeasonalHighlights />
      <FlightBooking />
      <PlanTrip />
      <Partners />
      <TravelInfo />
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
