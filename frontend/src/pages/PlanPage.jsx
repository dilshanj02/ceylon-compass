import PlanAccordion from "../components/PlanAccordion";

const PlanPage = () => {
  return (
    <>
      {/* Heading */}
      <section className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Plan Your Perfect Trip
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Select your preferences and let us create the best travel plan for
          you!
        </p>
      </section>

      <PlanAccordion />
    </>
  );
};

export default PlanPage;
