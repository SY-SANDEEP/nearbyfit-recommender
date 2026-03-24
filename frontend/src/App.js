import { useState } from "react";
import axios from "axios";
import MapView from "./components/Map";
import Controls from "./components/Controls";
import PlacesList from "./components/PlacesList";

// Use env variable — falls back to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = async (purpose, budget) => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const response = await axios.post(
            `${API_BASE}/api/places/recommend`,
            {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              purpose,
              budget
            }
          );

          if (response.data.places && response.data.places.length > 0) {
            setPlaces(response.data.places);
            setError(null);
          } else {
            setError("No places found nearby. Try a different purpose or location.");
            setPlaces([]);
          }
        } catch (err) {
          setError(`Error: ${err.message}`);
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Unable to get your location. Please enable location permissions.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">📍 NearbyFit</div>
        <p className="tagline">Smart Nearby Place Recommendations</p>
      </header>

      <section className="control-panel">
        <Controls onSearch={fetchPlaces} />
      </section>

      {loading && <div className="status loading">🔍 Finding best places near you...</div>}
      {error && <div className="status error">⚠️ {error}</div>}

      <main className="main-layout">
        <section className="map-section">
          <MapView places={places} />
        </section>
        <section className="results-section">
          <PlacesList places={places} />
        </section>
      </main>

      <footer className="app-footer">
        <p>NearbyFit © 2026 • Smart Location AI</p>
      </footer>
    </div>
  );
}

export default App;