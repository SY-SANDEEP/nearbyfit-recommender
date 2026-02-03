import { useState } from "react";
import axios from "axios";
import MapView from "./components/Map";
import Controls from "./components/Controls";
import PlacesList from "./components/PlacesList";

function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = async (purpose, budget) => {
    console.log("Fetching places for:", purpose, budget);
    setLoading(true);
    setError(null);

    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          
          console.log("User location:", latitude, longitude);
          
          const response = await axios.post(
            "http://localhost:5000/api/places/recommend",
            {
              lat: latitude,
              lng: longitude,
              purpose: purpose,
              budget: budget
            }
          );

          console.log("Response from backend:", response.data);
          
          if (response.data.places && response.data.places.length > 0) {
            setPlaces(response.data.places);
            setError(null);
          } else {
            setError("No places found nearby. Try a different purpose or location.");
            setPlaces([]);
          }
        } catch (err) {
          console.error("Error fetching places:", err);
          setError(`Error: ${err.message}. Make sure the backend is running on port 5000.`);
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to get your location. Please enable location permissions.");
        setLoading(false);
      }
    );
  };

  return (
  <div className="app-container">
    
    {/* HEADER */}
    <header className="app-header">
      <div className="logo">📍 NearbyFit</div>
      <p className="tagline">Smart Nearby Place Recommendations</p>
    </header>

    {/* CONTROL PANEL */}
    <section className="control-panel">
      <Controls onSearch={fetchPlaces} />
    </section>

    {/* STATUS */}
    {loading && <div className="status loading">🔍 Finding best places near you...</div>}
    {error && <div className="status error">⚠️ {error}</div>}

    {/* MAIN CONTENT */}
    <main className="main-layout">
      <section className="map-section">
        <MapView places={places} />
      </section>

      <section className="results-section">
        <PlacesList places={places} />
      </section>
    </main>

    {/* FOOTER */}
    <footer className="app-footer">
      <p>NearbyFit © 2026 • Smart Location AI</p>
    </footer>

  </div>
);

}

export default App;
