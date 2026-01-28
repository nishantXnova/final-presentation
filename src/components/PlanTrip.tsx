import { useState } from "react";
import { Search, Calendar, Users, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const interests = ["Adventure", "Culture", "Nature", "Spirituality", "Family"];
const durations = ["3 days", "5 days", "7 days", "10+ days"];
const difficulties = ["Easy", "Moderate", "Challenging"];
const budgets = ["Budget", "Mid-range", "Luxury"];

const PlanTrip = () => {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  return (
    <section id="plan" className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-primary-foreground/70 uppercase tracking-widest text-sm font-medium mb-4">
            Trip Planner
          </p>
          <h2 className="heading-section text-primary-foreground mb-4">
            Plan Your Perfect <span className="italic text-nepal-gold">Journey</span>
          </h2>
          <p className="text-body-large text-primary-foreground/80 max-w-2xl mx-auto">
            Tell us how you want to explore, and we'll help you find the perfect itinerary.
          </p>
        </div>

        {/* Filter Card */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-elevated max-w-4xl mx-auto">
          {/* Interest Filter */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Search className="h-5 w-5 text-accent" />
              What interests you?
            </label>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => setSelectedInterest(interest === selectedInterest ? null : interest)}
                  className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                    selectedInterest === interest
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-foreground font-medium mb-4">
              <Calendar className="h-5 w-5 text-accent" />
              How long is your trip?
            </label>
            <div className="flex flex-wrap gap-3">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration === selectedDuration ? null : duration)}
                  className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                    selectedDuration === duration
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Budget */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Difficulty */}
            <div>
              <label className="flex items-center gap-2 text-foreground font-medium mb-4">
                <Filter className="h-5 w-5 text-accent" />
                Difficulty level?
              </label>
              <div className="flex flex-wrap gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
                    className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                      selectedDifficulty === difficulty
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border text-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center gap-2 text-foreground font-medium mb-4">
                <DollarSign className="h-5 w-5 text-accent" />
                What's your budget?
              </label>
              <div className="flex flex-wrap gap-3">
                {budgets.map((budget) => (
                  <button
                    key={budget}
                    onClick={() => setSelectedBudget(budget === selectedBudget ? null : budget)}
                    className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                      selectedBudget === budget
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border text-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button 
            size="lg" 
            className="w-full btn-accent text-lg py-6"
            disabled={!selectedInterest || !selectedDuration}
          >
            <Users className="mr-2 h-5 w-5" />
            Find My Perfect Trip
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlanTrip;
