import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612, // Colombo fallback
};

const getIconForType = (type) => {
  if (type === "accommodation") {
    return {
      url: "/icons/accommodation.png",
      scaledSize: new window.google.maps.Size(36, 36),
    };
  }
  if (type === "emergency") {
    return {
      url: "/icons/emergency.png",
      scaledSize: new window.google.maps.Size(36, 36),
    };
  }
  return {
    url: "/icons/place.png",
    scaledSize: new window.google.maps.Size(36, 36),
  };
};

const ItineraryMap = ({ places }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = places.length
    ? { lat: places[0].lat, lng: places[0].lng }
    : defaultCenter;

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {places.map((place, index) => (
        <Marker
          key={index}
          position={{ lat: place.lat, lng: place.lng }}
          icon={getIconForType(place.type)}
        />
      ))}
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default ItineraryMap;
