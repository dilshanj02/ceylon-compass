import { useRef } from "react";

export default function RecommendedDestinations() {
  const scrollRef = useRef(null);

  const destinations = [
    {
      name: "Ella",
      description: "Hiking & scenic views",
      image: "src/assets/ella.jpg",
    },
    {
      name: "Sigiriya",
      description: "Ancient rock fortress",
      image: "src/assets/sigiriya.jpg",
    },
    {
      name: "Mirissa",
      description: "Beach & whale watching",
      image: "src/assets/mirissa.jpg",
    },
    {
      name: "Nuwara Eliya",
      description: "Tea plantations & cool climate",
      image: "src/assets/nuwara-eliya.jpg",
    },
    {
      name: "Galle",
      description: "Colonial charm & historic fort",
      image: "src/assets/galle.jpg",
    },
  ];

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto mt-20">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Destinations for your next vacation
      </h2>

      {/* Carousel Wrapper */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
          onClick={scrollLeft}
        >
          ◀
        </button>

        {/* Scrollable Destination Cards */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-scroll scroll-smooth no-scrollbar p-2"
        >
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="min-w-[250px] bg-base-100 shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-gray-600">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
          onClick={scrollRight}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
