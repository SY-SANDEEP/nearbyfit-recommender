import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  rating: Number,
  price_level: Number,
  open_now: Boolean,
  type: String,
  address: String,
  last_updated: { type: Date, default: Date.now }
});

export default mongoose.model("Place", placeSchema);
