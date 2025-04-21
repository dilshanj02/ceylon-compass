const AboutUsPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Heading */}
      <div className="text-center flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-10 shadow-md">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-800">
          About Ceylon Compass
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl">
          <span className="italic">Ceylon Compass</span> is your smart travel
          companion — helping you plan personalized trips across Sri Lanka with
          ease, safety, and budget in mind.
        </p>
      </div>

      {/* Mission */}
      <section className="bg-base-100 p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-3 text-blue-700">Our Mission</h2>
        <p className="text-gray-700 text-md leading-relaxed">
          Our mission is to simplify travel planning for everyone by combining
          smart budgeting, tailored recommendations, and safety-first features —
          all in one place.
        </p>
      </section>

      {/* Core Features */}
      <section className="bg-base-100 p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Core Features</h2>
        <ul className="grid md:grid-cols-2 gap-4 text-gray-800 text-base">
          <li className="bg-blue-50 p-3 rounded-md shadow-sm">
            Smart Itinerary Planner with Budget-based Recommendations
          </li>
          <li className="bg-blue-50 p-3 rounded-md shadow-sm">
            Personalized Travel Suggestions based on themes
          </li>
          <li className="bg-blue-50 p-3 rounded-md shadow-sm">
            Emergency Assistance with Local Contact Info
          </li>
          <li className="bg-blue-50 p-3 rounded-md shadow-sm">
            Community Reviews to build trust and share experiences
          </li>
        </ul>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Dilshan Jayamanna</h3>
            <p className="text-sm text-gray-600">Backend & Logic</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Thashmika Chamath</h3>
            <p className="text-sm text-gray-600">Frontend Design</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Nipun Anuhas</h3>
            <p className="text-sm text-gray-600">Frontend Design</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Poornima Edirisinghe</h3>
            <p className="text-sm text-gray-600">Backend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Don Chanuja</h3>
            <p className="text-sm text-gray-600">Frontend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Chathuli Amaraweera</h3>
            <p className="text-sm text-gray-600">Frontend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Sadini Navodya</h3>
            <p className="text-sm text-gray-600">Frontend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Batarenage Sathsarani</h3>
            <p className="text-sm text-gray-600">Backend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Sehansi Dinuradee</h3>
            <p className="text-sm text-gray-600">Frontend</p>
          </div>
          <div className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">Manuthi Gamlath</h3>
            <p className="text-sm text-gray-600">Frontend</p>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="text-sm text-gray-500 text-center border-t pt-4">
        <p>Built with ❤️ by the Ceylon Compass Group</p>
        <p>University Group Project – Jan 2025 to April 2025</p>
        <p>Stack: React, Django, PostgreSQL, Tailwind CSS</p>
      </section>
    </div>
  );
};

export default AboutUsPage;
