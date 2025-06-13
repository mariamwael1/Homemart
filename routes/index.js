const express = require("express");
const router = express.Router();
const Supermarket = require("../models/Market");

// GET login page
router.get("/home", (req, res) => {
    const loggedInUser = req.session.user;
  res.render("homepage", {
    loggedInUser: loggedInUser,
    title: "Home",
  });
});
router.get("/", async (req, res) => {
  try {
    const supermarkets = await Supermarket.find().lean();
    const loggedInUser = req.session.user;
    const error = req.session.error;
    delete req.session.error;
    res.render("index", { supermarkets, loggedInUser: loggedInUser,
    title: "Home",  error });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});




module.exports = router;
