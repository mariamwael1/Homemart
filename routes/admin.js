const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const User = require("../models/User");
const Product = require("../models/Product");
const Supermarket = require("../models/Market");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

router.get("/admin",auth.isAdmin, async (req, res) => {
	try {
		const productsPage = parseInt(req.query.productsPage) || 1;
		const supermarketsPage = parseInt(req.query.supermarketsPage) || 1;
		const usersPage = parseInt(req.query.usersPage) || 1;
		const ordersPage = parseInt(req.query.ordersPage) || 1;  // New for orders
		const limit = 5;

		const [products, totalProducts] = await Promise.all([
			Product.find()
				.populate("markets")
				.skip((productsPage - 1) * limit)
				.limit(limit)
				.lean(),
			Product.countDocuments()
		]);

		const [supermarkets, totalSupermarkets] = await Promise.all([
			Supermarket.find()
				.skip((supermarketsPage - 1) * limit)
				.limit(limit)
				.lean(),
			Supermarket.countDocuments()
		]);

		const [users, totalUsers] = await Promise.all([
			User.find()
				.skip((usersPage - 1) * limit)
				.limit(limit)
				.lean(),
			User.countDocuments()
		]);

			const [orders, totalOrders] = await Promise.all([
			Order.find()
			.populate("userId", "username email")
			.skip((ordersPage - 1) * limit)
			.limit(limit)
			.lean(),
		Order.countDocuments()
		]);
		const error = req.session.error;
		const success = req.session.success;
		delete req.session.error;
		delete req.session.success;
		res.render("admin", {
			user: req.session.user, // for role-based checks
			products,
			supermarkets,
			users,
			orders,
			productsPage,
			supermarketsPage,
			usersPage,
			ordersPage,        
			totalProductsPages: Math.ceil(totalProducts / limit),
			totalSupermarketsPages: Math.ceil(totalSupermarkets / limit),
			totalUsersPages: Math.ceil(totalUsers / limit),
			totalOrdersPages: Math.ceil(totalOrders / limit),
			error,
			success
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});



router.delete("/admin/users/:id",auth.isAdmin, adminController.removeUser);
router.post("/admin/users",auth.isAdmin, adminController.AddUser);
router.get("/admin/users/:id",auth.isAdmin, adminController.getUserById); 
router.put("/admin/users/:id",auth.isAdmin, adminController.editUser);  // For submitting update

router.post("/admin/supermarkets",auth.isAdmin, adminController.upload.single("image"), adminController.addMarket);
router.get('/admin/supermarkets/:id',auth.isAdmin, adminController.getSupermarketById);
router.put('/admin/supermarkets/:id',auth.isAdmin,  adminController.upload.single('logo'), adminController.editSupermarket);
router.delete('/admin/supermarkets/:id',auth.isAdmin, adminController.deleteSupermarket);

router.post("/admin/products",auth.isAdmin, adminController.upload.single("image"), adminController.addProduct);
router.get("/admin/products/:id",auth.isAdmin, adminController.getProductById);
router.put("/admin/products/:id",auth.isAdmin, adminController.upload.single("image"), adminController.editProduct);
router.delete('/admin/products/:id',auth.isAdmin, adminController.deleteProduct);


router.get('/orders',auth.isAdmin, adminController.getAllOrders);
router.put('/admin/orders/update-status/:orderId',auth.isAdmin, adminController.updateOrderStatus);
router.delete('/admin/orders/remove/:orderId',auth.isAdmin, adminController.removeOrder);

module.exports = router;
