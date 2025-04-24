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

const GoogleMapView = ({ places }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use .env file
  });

  const center = places.length
    ? { lat: places[0].lat, lng: places[0].lng }
    : defaultCenter;

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {places.map((place, index) => (
        <Marker
          position={{ lat: place.lat, lng: place.lng }}
          icon={{
            url: "/icons/place.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default GoogleMapView;
