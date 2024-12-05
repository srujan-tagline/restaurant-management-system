const express = require("express");
const connectDB = require("../config/db");
const session = require("express-session");
const app = express();
const routes = require("./routes/index");
require("dotenv").config();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api", routes);

connectDB();

app.get("/", (req, res) => {
  res.send("Restaurant management system.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
