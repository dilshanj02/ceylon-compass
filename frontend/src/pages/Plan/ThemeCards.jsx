import { useState } from "react";

const themes = [
  {
    name: "Adventure",
    icon: "🔥",
    description:
      "Experience thrilling activities like hiking, scuba diving, and safaris. Perfect for adrenaline seekers!",
  },
  {
    name: "Cultural",
    icon: "🏛️",
    description:
      "Explore historic sites, local traditions, and unique heritage experiences. Ideal for history lovers!",
  },
  {
    name: "Relaxation",
    icon: "🛀",
    description:
      "Unwind at serene beaches, spas, and quiet retreats. Best for those who need a stress-free getaway.",
  },
];

export default function ThemeSelection({ theme, setTheme }) {
  return (
    <div className="max-w-6xl mx-auto mt-20">
      <h2 className="text-xl font-semibold text-center mb-4">
        Choose Your Theme
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {themes.map((item) => (
          <div
            key={item.name}
            className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
              theme === item.name
                ? "border-blue-500 shadow-lg"
                : "border-gray-300"
            } hover:shadow-md hover:border-blue-400`}
            onClick={() => setTheme(item.name)}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
