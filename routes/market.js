// routes/marketRoutes.js
const express = require("express");
const router = express.Router();
const Supermarket = require("../models/Market");
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const marketController = require("../controllers/marketController");

router.get("/shop", async (req, res) => {
  try {
    const { market, category } = req.query;

    let query = {};
    if (market) {
      query.markets = market;
    }
    if (category && category !== "all") {
      query.category = category;
    }

    const products = await Product.find(query).populate("markets");
    const allMarkets = await Supermarket.find({});
    const categories = await Product.distinct("category");

    res.render("products", {
      products,
      markets: allMarkets,
      categories,
      selectedMarket: market || "",
      selectedCategory: category || "all"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/cart', auth.isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('cart.productId');

    // Filter out cart items where the product no longer exists (i.e., null after populate)
    const cleanedCart = user.cart.filter(item => item.productId !== null);

    // If cleanup happened, save the user document
    if (cleanedCart.length !== user.cart.length) {
      user.cart = cleanedCart;
      await user.save();
    }

    res.render('cart', { cartItems: cleanedCart });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/checkout',  auth.isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).lean();
    const cartItems = user.cart || [];

    const total = cartItems.reduce((acc, item) => {
      return acc + item.quantity * item.priceAtAddTime;
    }, 0);

    res.render('checkout', {user, cartItems, total });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.post('/checkout',  auth.isLoggedIn, marketController.processCheckout);
router.post('/add-to-cart', auth.isLoggedIn, marketController.addToCart);
router.post('/update-quantity', auth.isLoggedIn, marketController.updateCartQuantity);
router.post('/remove', auth.isLoggedIn, marketController.removeFromCart);
router.get('/product/:id', marketController.getProductById);
module.exports = router;
