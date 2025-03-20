import { DollarSign, MapPin, Star, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <DollarSign className="w-12 h-12 text-green-600 mb-4" />,
      title: "Budget-Friendly Planning",
      description:
        "Generate personalized trip plans tailored to fit your budget effortlessly.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-green-600 mb-4" />,
      title: "Local Recommendations",
      description:
        "Discover authentic local experiences and hidden gems curated just for you.",
    },
    {
      icon: <Star className="w-12 h-12 text-green-600 mb-4" />,
      title: "Sri Lanka Focused",
      description:
        "Designed specifically to help you explore the best of Sri Lanka.",
    },
    {
      icon: <Users className="w-12 h-12 text-green-600 mb-4" />,
      title: "Community Driven",
      description:
        "Continuously improving with feedback and contributions from travelers like you.",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-20">
          Why Choose Ceylon Compass?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          {/* <button className="text-white bg-green-600 hover:bg-green-700 text-lg px-6 py-3 rounded-2xl">
            Start Planning Now
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
