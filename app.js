const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const app = express();

// MongoDB connection string
const dbURI = "mongodb+srv://mariamwaelabdelaziz12:homemarketMMMSN@cluster0.1r3estf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB and then start server
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

// Set EJS as view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming JSON and urlencoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session setup
app.use(
  session({
    secret: "12341234123412341234123412341234",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

// Middleware to pass user session data to all views for dynamic nav etc
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const indexRoutes = require("./routes/index");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const marketRoutes = require("./routes/market");

app.use("/", indexRoutes);
app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", marketRoutes);

// 404 page handler (must be last)
app.use((req, res) => {
  res.status(404).render("404");
});

//marioozz
