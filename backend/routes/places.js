import express from "express";
import axios from "axios";
import Place from "../models/Place.js";

const router = express.Router();

const PURPOSE_MAP = {
  workout: ["gym", "fitness_centre", "sports_centre"],
  quick_bite: ["cafe", "fast_food", "restaurant"],
  date: ["restaurant", "bar", "cafe"],
  work: ["library", "cafe"],
  budget: ["fast_food", "cafe"]
};

router.post("/recommend", async (req, res) => {
  try {
    const { lat, lng, purpose, budget } = req.body;

    console.log("Received request:", { lat, lng, purpose, budget });

    if (!lat || !lng || !purpose) {
      return res.status(400).json({ 
        message: "Missing required parameters: lat, lng, purpose" 
      });
    }

    const types = PURPOSE_MAP[purpose] || ["cafe"];
    const radius = 2000;

    // Build Overpass query - simplified for reliability
    const typeFilters = types.map(type => 
      `node["amenity"="${type}"](around:${radius},${lat},${lng});`
    ).join('\n');

    const query = `[out:json][timeout:60];(${typeFilters});out body;`;

    console.log("Calling Overpass API...");

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { 
        headers: { "Content-Type": "text/plain" },
        timeout: 60000 
      }
    );

    console.log("Overpass response received, elements:", response.data?.elements?.length);

    if (!response.data || !response.data.elements) {
      return res.json({ places: [], count: 0 });
    }

    let places = response.data.elements
      .filter(p => p.tags && p.tags.name)
      .map(p => {
        const distance = calculateDistance(lat, lng, p.lat, p.lon);
        return {
          name: p.tags.name,
          lat: p.lat,
          lng: p.lon,
          rating: generateRating(),
          price_level: mapBudgetToPriceLevel(budget),
          open_now: Math.random() > 0.2,
          type: purpose,
          address: formatAddress(p.tags),
          distance: distance,
          amenity: p.tags.amenity
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 15);

    console.log("Places found:", places.length);

    // Save to DB - wrapped in try/catch so it doesn't crash the response
    try {
      if (places.length > 0) {
        await Place.deleteMany({ type: purpose });
        await Place.insertMany(places.slice(0, 10));
      }
    } catch (dbError) {
      console.error("DB save error (non-fatal):", dbError.message);
    }

    res.json({ places, count: places.length, center: { lat, lng } });

  } catch (error) {
    console.error("FULL ERROR:", error.message);
    
    // Send more specific error messages
    if (error.code === 'ECONNABORTED') {
      return res.status(500).json({ message: "Overpass API timed out. Try again." });
    }
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ message: "Cannot reach Overpass API. Check internet." });
    }
    
    res.status(500).json({ 
      message: "Error fetching places",
      error: error.message 
    });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function generateRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1));
}

function mapBudgetToPriceLevel(budget) {
  return { low: 1, medium: 2, high: 3 }[budget] || 2;
}

function formatAddress(tags) {
  const parts = [];
  if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
  if (tags["addr:street"]) parts.push(tags["addr:street"]);
  if (tags["addr:city"]) parts.push(tags["addr:city"]);
  return parts.length > 0 ? parts.join(", ") : "Address not available";
}

export default router;