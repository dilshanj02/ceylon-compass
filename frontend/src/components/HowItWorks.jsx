const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Choose Your Destination",
      desc: "Pick your favorite place in Sri Lanka — from mountains to beaches.",
    },
    {
      step: "2",
      title: "Customize Your Trip",
      desc: "Set your budget, trip length, and preferences.",
    },
    {
      step: "3",
      title: "Get Your Itinerary",
      desc: "Get a full plan with places to visit, stay, and more.",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-12 text-gray-900 dark:text-white">
          How Ceylon Compass Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 shadow rounded-xl"
            >
              <div className="text-4xl font-bold text-green-600 mb-4">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
