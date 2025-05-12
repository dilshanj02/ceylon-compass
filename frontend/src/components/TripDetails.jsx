import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/useAxios";
import ItineraryMap from "./itineraryMap";
import getWeatherForecast from "../utils/getWeather";
import CurrencyContext from "../context/CurrencyContext";

const TripDetails = () => {
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [openDays, setOpenDays] = useState([]);

  const { currency, convert } = useContext(CurrencyContext);

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
      {/* Trip Header */}
      <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
        {/* Image Header */}
        <div
          className="h-64 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(/${tripPlan.trip.destination_name
              .toLowerCase()
              .replace(/\s+/g, "-")}.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-4xl font-bold drop-shadow-md">
              {tripPlan.trip.destination_name}
            </h1>
            <p className="text-lg mt-2 drop-shadow-sm">
              {tripPlan.trip.theme_name}
            </p>
          </div>
        </div>

        {/* Trip Info Section */}
        <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 text-sm text-gray-700">
          {/* Left column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium w-28">📅 Check-in:</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {tripPlan.trip.check_in}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium w-28">📅 Check-out:</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {tripPlan.trip.check_out}
              </span>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 md:justify-end">
              <span className="font-medium w-28 text-right">👥 Travelers:</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {tripPlan.trip.travelers}
              </span>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <span className="font-medium w-28 text-right">💰 Budget:</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {currency} {convert(tripPlan.trip.budget)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Forecast */}
      {isForecastAvailable && (
        <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-50 to-sky-100 px-6 py-4 text-center">
            <h3 className="text-2xl font-semibold text-sky-800 flex items-center justify-center gap-2">
              🌦️ Weather Forecast
            </h3>
          </div>

          {/* Forecast Grid */}
          <div className="flex flex-wrap justify-center gap-6 p-6 bg-white">
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
        </div>
      )}

      {/* Fallback if weather is not available */}
      {!isForecastAvailable && (
        <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-sky-50 to-sky-100 px-6 py-4 text-center">
            <h3 className="text-2xl font-semibold text-sky-800 flex items-center justify-center gap-2">
              🌦️ Weather Forecast
            </h3>
          </div>
          <div className="p-6 bg-white text-center text-gray-600">
            Weather forecast is not available yet for your travel dates.
          </div>
        </div>
      )}

      {/* Accommodation Details */}
      {tripPlan.accommodation && (
        <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-100 px-6 py-4 text-center">
            <h3 className="text-2xl font-semibold text-yellow-800 flex items-center justify-center gap-2">
              🏨 Selected Accommodation
            </h3>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white">
            {/* Image */}
            <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border flex-shrink-0 shadow-sm">
              <img
                src={tripPlan.accommodation.photo}
                alt={tripPlan.accommodation.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <h4 className="text-xl font-bold text-gray-800">
                {tripPlan.accommodation.name}
              </h4>

              {/* Tags */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                  {tripPlan.accommodation.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  {tripPlan.accommodation.tier}
                </span>
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
                  {currency}{" "}
                  {convert(tripPlan.accommodation.price_per_night_per_person)} /
                  night / person
                </span>
              </div>

              {/* Location */}
              <p className="text-sm text-gray-600">
                📍 <span className="font-medium">Coordinates:</span>{" "}
                {tripPlan.accommodation.lat}, {tripPlan.accommodation.lng}
              </p>
            </div>
          </div>
        </div>
      )}

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
                  <div className="w-full md:w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden border">
                    <img
                      src={
                        item.photo
                          ? item.photo
                          : (() => {
                              const themeMap = {
                                "Adventure & Outdoors":
                                  "fallback_adventure.png",
                                "Culture & Heritage": "fallback_culture.png",
                                "Leisure & Relaxation": "fallback_leisure.png",
                              };
                              const fallback = `/images/${
                                themeMap[tripPlan.trip.theme_name] ||
                                "fallback_generic.png"
                              }`;
                              return fallback;
                            })()
                      }
                      alt={item.name || "Place"}
                      className="w-full h-full object-cover"
                    />
                  </div>

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
                      {/* <span>💰 LKR {group.budget_remaining}</span> */}
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
      <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 text-center">
          <h3 className="text-2xl font-semibold text-indigo-800 flex items-center justify-center gap-2">
            💸 Cost Breakdown
          </h3>
        </div>

        {/* Breakdown List */}
        <div className="bg-white p-6">
          <ul className="divide-y divide-gray-200 text-sm text-gray-700">
            {orderedKeys.map((key) => (
              <li key={key} className="py-3 flex justify-between">
                <span className="font-medium">{labelMap[key]}</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                  {currency} {convert(tripPlan.cost_breakdown[key])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Itinerary Map */}
      <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 text-center">
          <h3 className="text-2xl font-semibold text-green-800 flex items-center justify-center gap-2">
            🗺️ Itinerary Map
          </h3>
        </div>

        {/* Map Container */}
        <div className="bg-white p-4">
          <ItineraryMap
            accommodation={tripPlan.accommodation}
            itinerary={tripPlan.itinerary}
          />
        </div>
      </div>

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 text-center">
            <h3 className="text-2xl font-semibold text-red-800 flex items-center justify-center gap-2">
              🚨 Emergency Assistance
            </h3>
          </div>

          {/* Scrollable Contact List */}
          <div className="p-6 bg-white space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Left Column */}
                  <div className="space-y-1 text-left">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      {contact.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      🧭 <span className="font-medium">Type:</span>{" "}
                      {contact.service_type}
                    </p>
                    {contact.description && (
                      <p className="text-sm text-gray-500">
                        📝 <span className="font-medium">Note:</span>{" "}
                        {contact.description}
                      </p>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="flex md:justify-end items-center h-full">
                    <p className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                      📞 {contact.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {emergencyContacts.length === 0 && (
        <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 text-center">
            <h3 className="text-2xl font-semibold text-red-800 flex items-center justify-center gap-2">
              🚨 Emergency Assistance
            </h3>
          </div>
          <div className="p-6 bg-white text-center text-gray-600">
            No emergency contacts available for this destination.
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
