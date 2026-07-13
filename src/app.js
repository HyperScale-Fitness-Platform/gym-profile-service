const express = require("express");
const profileRoutes = require("./routes/profile.routes");
const auth = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/errorHandler.middleware");
const notFound = require("./middleware/notFound.middleware");

const app = express();

app.use(express.json());
app.use(auth);
app.use("/api/profiles", profileRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
