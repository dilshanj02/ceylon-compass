import { useEffect, useState } from "react";
import PlanAccordion from "../components/PlanAccordion";

import planIllustration from "../assets/plan-illustration.png";

const PlanPage = () => {
  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    const tips = [
      "💡 Did you know? Ella has one of the most scenic train routes in the world!",
      "🎒 Pack light if you're planning to visit hill country!",
      "🌧️ Best time to visit the south coast is December to March.",
      "🚗 Renting a tuk-tuk can be a fun way to explore small towns.",
      "🍛 Don’t miss out on authentic rice & curry from local shops!",
    ];
    const index = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[index]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Image */}
      <div className="flex justify-center mb-8">
        <img
          src={planIllustration}
          alt="Trip planning illustration"
          className="w-full max-w-md rounded-xl shadow"
        />
      </div>

      {/* Heading */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Plan Your Perfect Trip
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Select your preferences and let us create the best travel plan for
          you!
        </p>
      </section>

      {/* How It Works */}
      <section className=" dark:bg-gray-800 p-6 rounded-xl mb-10 shadow">
        <h2 className="text-xl font-bold mb-4 text-center">🚀 How It Works</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Choose your destination, dates, and preferences.</li>
          <li>We validate and generate a personalized itinerary.</li>
          <li>Review your plan and confirm.</li>
          <li>Start packing! You're ready to explore 🇱🇰</li>
        </ol>
      </section>

      {/* Travel Tip */}
      <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md mb-6 text-center">
        {randomTip}
      </div>

      {/* Accordion */}
      <PlanAccordion />

      {/* Help Link */}
      <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-400">
        ❓ Have questions?{" "}
        <a href="/help" className="text-green-600 underline">
          Visit our Help Center
        </a>
      </p>
    </div>
  );
};

export default PlanPage;
