import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/useAxios";
import ItineraryMap from "./itineraryMap";
import getWeatherForecast from "../utils/getWeather";

const TripDetails = () => {
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [openDays, setOpenDays] = useState([]);

  const labelMap = {
    accommodation: "Accommodation",
    transport: "Transport",
    food: "Food",
    misc: "Miscellaneous",
    total: "Total Cost",
    remaining_budget: "Remaining Budget",
  };

  const orderedKeys = [
    "accommodation",
    "transport",
    "food",
    "misc",
    "total",
    "remaining_budget",
  ];

  const getWeatherEmoji = (code) => {
    if ([0].includes(code)) return "☀️ Clear";
    if ([1, 2, 3].includes(code)) return "⛅ Partly Cloudy";
    if ([45, 48].includes(code)) return "🌫 Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦 Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "🌧 Rain";
    if ([71, 73, 75, 77].includes(code)) return "❄️ Snow";
    if ([80, 81, 82].includes(code)) return "🌧 Showers";
    if ([95, 96, 99].includes(code)) return "⛈ Thunderstorm";
    return "❓ Unknown";
  };

  const getWeatherBgClass = (code) => {
    if ([0].includes(code))
      return "bg-gradient-to-br from-yellow-50 to-yellow-100";
    if ([1, 2, 3].includes(code))
      return "bg-gradient-to-br from-blue-50 to-blue-100";
    if ([45, 48].includes(code))
      return "bg-gradient-to-br from-gray-100 to-gray-200";
    if ([51, 53, 55, 56, 57].includes(code))
      return "bg-gradient-to-br from-sky-100 to-sky-200";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
      return "bg-gradient-to-br from-cyan-100 to-cyan-200";
    if ([71, 73, 75, 77].includes(code))
      return "bg-gradient-to-br from-indigo-50 to-indigo-100";
    if ([95, 96, 99].includes(code))
      return "bg-gradient-to-br from-rose-100 to-rose-200";
    return "bg-gray-50";
  };

  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        const response = await axios.get(`/api/plans/${id}/`);
        setTripPlan(response.data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripPlan();
  }, [id]);

  useEffect(() => {
    if (!tripPlan) return;

    if (tripPlan.trip?.destination) {
      axios
        .get(`/api/emergency/?destination=${tripPlan.trip.destination}`)
        .then((res) => setEmergencyContacts(res.data))
        .catch((error) =>
          console.error("Error fetching emergency contacts:", error)
        );
    }

    if (tripPlan?.itinerary?.length) {
      const { lat, lng } = tripPlan.itinerary[0];
      getWeatherForecast(lat, lng).then(setWeather);
    }

    const grouped = groupItineraryByDate(tripPlan.itinerary);
    setOpenDays(grouped.map(() => true));
  }, [tripPlan]);

  const groupItineraryByDate = (itinerary) => {
    const grouped = {};
    itinerary.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = [];
      grouped[item.date].push(item);
    });
    return Object.entries(grouped).map(([date, activities]) => ({
      date,
      activities,
    }));
  };

  const toggleDay = (index) => {
    setOpenDays((prev) => prev.map((open, i) => (i === index ? !open : open)));
  };

  if (loading) return <p>Loading...</p>;
  if (!tripPlan) return <p>Trip not found.</p>;

  const today = new Date();
  const checkInDate = new Date(tripPlan.trip.check_in);
  const checkOutDate = new Date(tripPlan.trip.check_out);
  const daysUntilTrip = (checkInDate - today) / (1000 * 60 * 60 * 24);
  const isForecastAvailable = daysUntilTrip <= 16 && weather;

  const filteredForecast = isForecastAvailable
    ? weather.daily.time
        .map((date, i) => ({
          date,
          minTemp: weather.daily.temperature_2m_min[i],
          maxTemp: weather.daily.temperature_2m_max[i],
          rainChance: weather.daily.precipitation_probability_mean[i],
          weatherCode: weather.daily.weathercode[i],
        }))
        .filter((day) => {
          const dayDate = new Date(day.date);
          return dayDate >= checkInDate && dayDate <= checkOutDate;
        })
    : [];

  const groupedItinerary = groupItineraryByDate(tripPlan.itinerary);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div>
        <div
          className="h-64 w-full bg-cover bg-center rounded-lg shadow-md mb-10"
          style={{ backgroundImage: `url("/kandy.jpg")` }}
        >
          <div className="h-full w-full bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold">
              {tripPlan.trip.destination_name}
            </h1>
            <p className="text-lg mt-2">{tripPlan.trip.theme_name}</p>
          </div>
        </div>

        {/* Trip Info */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          <div className="space-y-2">
            <div>
              <strong>Check-in:</strong> {tripPlan.trip.check_in}
            </div>
            <div>
              <strong>Check-out:</strong> {tripPlan.trip.check_out}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <strong>Travelers:</strong> {tripPlan.trip.travelers}
            </div>
            <div>
              <strong>Budget:</strong> LKR {tripPlan.trip.budget}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Forecast */}
      <div>
        <h3 className="text-3xl font-semibold mb-4">🌦️ Weather Forecast</h3>
        {!isForecastAvailable ? (
          <p className="text-gray-600">
            Weather forecast is not available yet for your travel dates.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredForecast.map((day, i) => {
              const formattedDate = new Date(day.date).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }
              );
              return (
                <div
                  key={i}
                  className={`w-[200px] p-4 rounded-lg shadow-md text-gray-900 transition hover:shadow-xl ${getWeatherBgClass(
                    day.weatherCode
                  )}`}
                >
                  <div className="text-sm text-gray-500">{formattedDate}</div>
                  <div className="text-xl font-semibold">
                    {getWeatherEmoji(day.weatherCode)}
                  </div>
                  <div className="text-sm text-gray-700">
                    🌡️ {day.minTemp}°C - {day.maxTemp}°C
                  </div>

                  <div className="text-sm text-blue-800 font-semibold">
                    💧 {day.rainChance}% rain chance
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Accordion Itinerary */}
      <div>
        <h3 className="text-3xl font-semibold mb-4">🗓️ Itinerary</h3>

        <div className="space-y-4">
          {groupedItinerary.map((group, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl shadow-sm"
            >
              {/* Day header */}
              <button
                className="flex items-center justify-between w-full px-5 py-4 bg-gradient-to-r from-sky-100 to-blue-50 hover:from-sky-200 transition rounded-t-xl"
                onClick={() => toggleDay(i)}
              >
                <div className="font-semibold text-sky-900 text-lg">
                  📅 Day {i + 1} – {group.date}
                </div>
                <svg
                  className={`w-5 h-5 text-sky-700 transform transition-transform ${
                    openDays[i] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Activities */}
              {openDays[i] && (
                <div className="p-4 bg-white rounded-b-xl space-y-4">
                  {group.activities.map((item, j) => (
                    <div
                      key={j}
                      className="flex gap-4 items-start p-4 bg-gray-50 hover:bg-gray-100 border rounded-lg transition"
                    >
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.activity}
                          className="w-24 h-20 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">
                          📍 {item.activity}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <p className="text-xs text-right text-emerald-600 mt-1">
                          💰 LKR {item.budget_remaining} left
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Cost Breakdown</h3>
        <ul className="divide-y divide-base-300">
          {orderedKeys.map((key) => (
            <li key={key} className="py-3 flex justify-between">
              <span>{labelMap[key]}</span>
              <span className="badge badge-primary badge-outline">
                LKR {tripPlan.cost_breakdown[key]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Itinerary Map */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Itinerary Map</h3>
        <ItineraryMap places={tripPlan.itinerary} />
      </div>

      {/* Emergency Contacts */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Emergency Assistance</h3>
        <div className="collapse collapse-arrow border border-base-300 bg-base-100">
          <input type="checkbox" />
          <div className="collapse-title font-semibold text-center p-4">
            View Emergency Contacts for {tripPlan.trip.destination_name}
          </div>
          <div className="collapse-content space-y-4">
            {emergencyContacts.length === 0 ? (
              <p>No emergency contacts available.</p>
            ) : (
              emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border p-4 rounded-md shadow-sm"
                >
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-600">
                    {contact.service_type}
                  </p>
                  <p className="text-sm">📞 {contact.phone_number}</p>
                  {contact.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {contact.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
