import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import placesRoutes from "./routes/places.js";

dotenv.config();
connectDB();

const app = express();

// Allow your Vercel frontend + local dev
const allowedOrigins = [
  process.env.FRONTEND_URL,        // e.g. https://nearbyfit.vercel.app
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

app.get("/", (req, res) => res.send("NearbyFit API is running ✅"));

app.use("/api/places", placesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));