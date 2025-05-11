import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 }; // Colombo fallback

const ItineraryMap = ({ accommodation, itinerary }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directionsList, setDirectionsList] = useState([]);

  useEffect(() => {
    if (!isLoaded || !accommodation || !itinerary) return;

    const directionsService = new window.google.maps.DirectionsService();
    const fetchRoutes = async () => {
      const results = [];

      for (const day of itinerary) {
        const waypoints = day.activities.slice(1, -1).map((act) => ({
          location: { lat: act.lat, lng: act.lng },
          stopover: true,
        }));

        const origin = {
          lat: accommodation.lat,
          lng: accommodation.lng,
        };

        const destination = {
          lat: day.activities.at(-1).lat,
          lng: day.activities.at(-1).lng,
        };

        const request = {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        try {
          const result = await directionsService.route(request);
          results.push(result);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }

      setDirectionsList(results);
    };

    fetchRoutes();
  }, [isLoaded, accommodation, itinerary]);

  const center = accommodation
    ? { lat: accommodation.lat, lng: accommodation.lng }
    : defaultCenter;

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {/* Accommodation marker */}
      <Marker
        position={{ lat: accommodation.lat, lng: accommodation.lng }}
        icon={{
          url: "/icons/accommodation.png",
          scaledSize: new window.google.maps.Size(36, 36),
        }}
      />

      {/* Activity markers */}
      {itinerary.flatMap((day) =>
        day.activities.map((place, index) => (
          <Marker
            key={`${day.date}-${index}`}
            position={{ lat: place.lat, lng: place.lng }}
            icon={{
              url: "/icons/place.png",
              scaledSize: new window.google.maps.Size(36, 36),
            }}
          />
        ))
      )}

      {/* Render routes */}
      {directionsList.map((dir, i) => (
        <DirectionsRenderer
          key={i}
          directions={dir}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][i % 4],
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default ItineraryMap;
