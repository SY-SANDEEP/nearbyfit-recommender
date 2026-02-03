import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Simple fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to update map center
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function MapView({ places }) {
  const [center, setCenter] = useState([19.076, 72.8777]); // Default: Mumbai
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = [pos.coords.latitude, pos.coords.longitude];
          setCenter(location);
          setUserLocation(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Update center when places are loaded
  useEffect(() => {
    if (places.length > 0 && userLocation) {
      setCenter(userLocation);
    }
  }, [places, userLocation]);

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <strong>📍 You are here</strong>
            </Popup>
          </Marker>
        )}

        {places && places.map((place, idx) => (
          place.lat && place.lng && (
            <Marker key={idx} position={[place.lat, place.lng]}>
              <Popup>
                <div style={{ minWidth: '150px' }}>
                  <strong>{place.name || 'Unknown Place'}</strong>
                  <br />
                  {place.rating && `⭐ ${place.rating.toFixed(1)}`}
                  <br />
                  {place.open_now ? "🟢 Open" : "🔴 Closed"}
                  <br />
                  {place.distance && `📏 ${place.distance.toFixed(2)} km`}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
