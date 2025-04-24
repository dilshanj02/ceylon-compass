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
      const { lat, lng } = tripPlan.itinerary[0].activities[0];
      getWeatherForecast(lat, lng).then(setWeather);
    }

    setOpenDays(tripPlan.itinerary.map(() => true));
  }, [tripPlan]);

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
        <h3 className="text-3xl font-semibold mb-4 text-sky-800">
          🌦️ Weather Forecast
        </h3>
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

      {/* Modern Itinerary Redesign */}
      <div className="space-y-10">
        <h3 className="text-3xl font-semibold text-sky-800">
          Your Personalized Itinerary
        </h3>

        {tripPlan.itinerary.map((group, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-cyan-50 to-blue-100 px-6 py-5">
              <div className="text-lg md:text-xl font-semibold text-gray-800">
                <span className="text-blue-600">Day {i + 1}</span> —{" "}
                {group.date}
              </div>
              <span className="text-xs text-gray-500">
                {group.activities.length}{" "}
                {group.activities.length > 1 ? "activities" : "activity"}
              </span>
            </div>

            {/* Timeline layout for activities */}
            <div className="divide-y divide-gray-100">
              {group.activities.map((item, j) => (
                <div
                  key={j}
                  className="flex flex-col md:flex-row gap-4 p-6 hover:bg-gray-50 transition-all"
                >
                  {/* Place image */}
                  {item.photo && (
                    <div className="w-full md:w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden border">
                      <img
                        src={item.photo}
                        alt={item.activity}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Place info */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        📍 {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>💰 LKR {group.budget_remaining}</span>
                      {item.duration && (
                        <span>⏱️ {item.duration} min visit</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
        <ItineraryMap
          places={tripPlan.itinerary.flatMap((day) => day.activities)}
        />
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
