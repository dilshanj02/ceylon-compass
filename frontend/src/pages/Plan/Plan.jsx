import PlanForm from "./PlanForm";
import RecommendedDestinations from "./RecommendedDestinations";
import ThemeCards from "./ThemeCards";

export default function Plan() {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Plan Your Perfect Trip
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Select your preferences and let us create the best travel plan for
          you!
        </p>
      </section>

      {/* Form Section */}
      <PlanForm />

      {/* Theme Cards */}
      <ThemeCards />

      {/* Recommended Destinations */}
      <RecommendedDestinations />
    </>
  );
}
