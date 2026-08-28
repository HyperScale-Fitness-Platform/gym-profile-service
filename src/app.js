const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profile.routes");
const errorHandler = require("./middleware/errorHandler.middleware");
const notFound = require("./middleware/notFound.middleware");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use("/api/profiles", profileRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;