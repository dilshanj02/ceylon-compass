import axios from "axios";

const getOpenMeteoForecast = async (lat, lng) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const url = "https://api.open-meteo.com/v1/forecast";

  const params = {
    latitude: lat,
    longitude: lng,
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_mean",
      "weathercode",
    ].join(","),
    timezone,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Open-Meteo API error:", error.response?.data || error);
    return null;
  }
};

export default getOpenMeteoForecast;
