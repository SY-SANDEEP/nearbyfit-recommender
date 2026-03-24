function PlacesList({ places }) {
  // Safety check
  if (!places || !Array.isArray(places) || places.length === 0) {
    return (
      <div className="places-list">
        <p className="no-results">
          No places found yet.<br/>
          Select a purpose and click "Find Places Near Me" to start!
        </p>
      </div>
    );
  }

  return (
    <div className="places-list">
      <h2>Found {places.length} Places</h2>
      {places.map((place, idx) => {
        // Safety checks for each place
        if (!place) return null;
        
        return (
          <div key={idx} className="place-card">
            <h3>{place.name || 'Unnamed Place'}</h3>
            <div className="place-details">
              {place.rating && (
                <p>⭐ Rating: {Number(place.rating).toFixed(1)}/5</p>
              )}
              {place.price_level && (
                <p>💰 Price: {"$".repeat(place.price_level)}</p>
              )}
              <p>
                {place.open_now ? "🟢 Open Now" : "🔴 Closed"}
              </p>
              {place.address && (
                <p className="address">📍 {place.address}</p>
              )}
              {place.distance && (
                <p className="distance">
                  📏 Distance: {Number(place.distance).toFixed(2)} km
                </p>
              )}
              {place.amenity && (
                <p style={{fontSize: '12px', color: '#999'}}>
                  Type: {place.amenity}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

<<<<<<< HEAD
export default PlacesList;
=======
export default PlacesList;
>>>>>>> fd554ea6c6bcbf047a511dff4a40da0a5171d867
