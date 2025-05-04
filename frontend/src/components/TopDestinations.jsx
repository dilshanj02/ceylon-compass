import ellaImg from "../assets/ella.jpg";
import kandyImg from "../assets/kandy.jpg";
import galleImg from "../assets/galle.jpg";
import jaffnaImg from "../assets/jaffna.jpg";

const TopDestinations = () => {
  const places = [
    { name: "Ella", image: ellaImg },
    { name: "Kandy", image: kandyImg },
    { name: "Galle", image: galleImg },
    { name: "Jaffna", image: jaffnaImg },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-12 text-gray-900">
          Explore Popular Destinations
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((p, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {p.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
