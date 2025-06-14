const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// GET login page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  const error = req.session.error;
  delete req.session.error;
  res.render("login", {
    loggedInUser: null,
    isLoggedIn: false,
    title: "Login",
    error 
  });
});


// GET register page
router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/profile"); // Already logged in, redirect to profile
  }
  res.render("register", {
    loggedInUser: null,
    isLoggedIn: false,
    title: "Register",
  });
});


router.post("/register", userController.signup);
router.post("/login", userController.login);
router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

router.get('/add-card', auth.isLoggedIn, (req, res) => {
  res.render('add-card', { session: req.session });
});
router.post('/add-card', auth.isLoggedIn, userController.addCreditCardInfo);
router.get('/profile', auth.isLoggedIn,userController.getProfile);

router.post('/profile/update-info',auth.isLoggedIn, userController.updateProfile);
router.post('/profile/reorder/:orderId',auth.isLoggedIn, userController.reorder);
router.post('/profile/update-credit-card', auth.isLoggedIn,userController.updateCreditCard);
router.post('/profile/update-address', auth.isLoggedIn,userController.updateAddress);
router.post('/profile/change-password', auth.isLoggedIn,userController.changePassword);
router.post('/profile/remove-address', auth.isLoggedIn, userController.removeAddress);
router.post('/profile/remove-card', auth.isLoggedIn, userController.removeCreditCard);
router.post('/orders/:orderId/cancel', auth.isLoggedIn, userController.cancelOrder);

module.exports = router;
