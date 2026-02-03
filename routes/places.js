import express from "express";
import axios from "axios";
import Place from "../models/Place.js";

const router = express.Router();

const PURPOSE_MAP = {
  workout: ["gym", "fitness_centre", "sports_centre", "pitch"],
  quick_bite: ["cafe", "fast_food", "restaurant"],
  date: ["restaurant", "bar", "pub", "cafe"],
  work: ["library", "coworking_space", "cafe"],
  budget: ["fast_food", "cafe", "food_court"]
};

router.post("/recommend", async (req, res) => {
  try {
    const { lat, lng, purpose, budget } = req.body;

    if (!lat || !lng || !purpose) {
      return res.status(400).json({ 
        message: "Missing required parameters: lat, lng, purpose" 
      });
    }

    const types = PURPOSE_MAP[purpose] || ["cafe"];
    const radius = 2000; // 2km radius

    // Build Overpass query
    const queries = types.map(type => 
      `node["amenity"="${type}"](around:${radius},${lat},${lng});`
    ).join('\n');

    const query = `
      [out:json][timeout:25];
      (
        ${queries}
      );
      out body;
      >;
      out skel qt;
    `;

    console.log("Fetching places from Overpass API...");

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { 
        headers: { "Content-Type": "text/plain" },
        timeout: 30000 
      }
    );

    if (!response.data || !response.data.elements) {
      return res.json({ places: [] });
    }

    // Process and filter places
    let places = response.data.elements
      .filter(p => p.tags && p.tags.name) // Only places with names
      .map(p => {
        // Calculate distance
        const distance = calculateDistance(lat, lng, p.lat, p.lon);
        
        return {
          name: p.tags.name,
          lat: p.lat,
          lng: p.lon,
          rating: generateRating(),
          price_level: mapBudgetToPriceLevel(budget),
          open_now: Math.random() > 0.2, // 80% chance of being open
          type: purpose,
          address: formatAddress(p.tags),
          distance: distance,
          amenity: p.tags.amenity
        };
      })
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 15); // Limit to 15 results

    // Save to database (optional - can remove if not needed)
    try {
      if (places.length > 0) {
        await Place.deleteMany({ type: purpose }); // Clear old entries
        await Place.insertMany(places.slice(0, 10));
      }
    } catch (dbError) {
      console.error("Database save error:", dbError);
      // Continue even if DB save fails
    }

    res.json({ 
      places,
      count: places.length,
      center: { lat, lng }
    });

  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ 
      message: "Error fetching places",
      error: error.message 
    });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function generateRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5 to 5.0
}

function mapBudgetToPriceLevel(budget) {
  const budgetMap = {
    low: 1,
    medium: 2,
    high: 3
  };
  return budgetMap[budget] || 2;
}

function formatAddress(tags) {
  const parts = [];
  
  if (tags["addr:street"]) parts.push(tags["addr:street"]);
  if (tags["addr:housenumber"]) parts.unshift(tags["addr:housenumber"]);
  if (tags["addr:city"]) parts.push(tags["addr:city"]);
  if (tags["addr:postcode"]) parts.push(tags["addr:postcode"]);
  
  return parts.length > 0 ? parts.join(", ") : "Address not available";
}

export default router;
