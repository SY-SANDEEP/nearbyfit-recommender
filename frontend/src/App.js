import { useState } from "react";
import axios from "axios";
import MapView from "./components/Map";
import Controls from "./components/Controls";
import PlacesList from "./components/PlacesList";

<<<<<<< HEAD
// Use env variable — falls back to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

=======
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = async (purpose, budget) => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);

=======
    console.log("Fetching places for:", purpose, budget);
    setLoading(true);
    setError(null);

    // Check if geolocation is available
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
<<<<<<< HEAD
          const response = await axios.post(
            `${API_BASE}/api/places/recommend`,
            {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              purpose,
              budget
            }
          );

=======
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
          
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
          if (response.data.places && response.data.places.length > 0) {
            setPlaces(response.data.places);
            setError(null);
          } else {
            setError("No places found nearby. Try a different purpose or location.");
            setPlaces([]);
          }
        } catch (err) {
<<<<<<< HEAD
          setError(`Error: ${err.message}`);
=======
          console.error("Error fetching places:", err);
          setError(`Error: ${err.message}. Make sure the backend is running on port 5000.`);
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
          setPlaces([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
<<<<<<< HEAD
=======
        console.error("Geolocation error:", err);
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
        setError("Unable to get your location. Please enable location permissions.");
        setLoading(false);
      }
    );
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
