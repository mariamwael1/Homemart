const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Supermarket = require("../models/Market");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
// ===== USER MANAGEMENT =====

const AddUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Validate fields
  if (
  !email?.trim() ||
  !name?.trim() ||
  !password?.trim() ||
  !role?.trim()
) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["admin", "client"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // 2. Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create and save new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in AddUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const editUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params; // <-- Make sure you’re using req.params, not req.body
 if (
  !email?.trim() ||
  !name?.trim() ||
  !password?.trim() ||
  !role?.trim()
) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(id); // <-- use req.params.id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update if fields exist
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      const saltRounds = 10;
      user.passwordHash= await bcrypt.hash(password, saltRounds);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;  // get id from URL param
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== PRODUCT MANAGEMENT =====

// Multer storage for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads"); // save all product images here
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|webp|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  }
});




const addMarket = async (req, res) => {
  try {
    const { name } = req.body;
 if (
  !name?.trim() 
) {
      req.session.error = "Market name field is required.";
      return res.redirect("/admin");
  }

    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    const newMarket = new Supermarket({
      name,
      logo: `/uploads/${req.file.filename}`,
    });

    await newMarket.save();
    res.redirect('/admin?tab=supermarkets');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while adding supermarket");
  }
};
// Get single supermarket by ID
const getSupermarketById = async (req, res) => {
  try {
    const market = await Supermarket.findById(req.params.id).lean();
    if (!market) return res.status(404).json({ message: "Supermarket not found" });
    res.json(market);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edit supermarket
const editSupermarket = async (req, res) => {
  try {
    const market = await Supermarket.findById(req.params.id);
    if (!market) return res.status(404).json({ message: "Supermarket not found" });
     if (
  !req.body.name?.trim() 
) {
    return res.status(400).json({ message: "All fields are required" });
  }

    if (req.body.name) market.name = req.body.name;

    // If image uploaded
    if (req.file) {
      market.logo = `/uploads/${req.file.filename}`;  // Assuming multer stores filename here
    }

    await market.save();
    res.json({ message: "Supermarket updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete supermarket
const deleteSupermarket = async (req, res) => {
  try {
    const market = await Supermarket.findByIdAndDelete(req.params.id);
    if (!market) return res.status(404).json({ message: "Supermarket not found" });
    res.json({ message: "Supermarket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stockQuantity, markets } = req.body;
    const imageUrl = req.file ? `/images/uploads/${req.file.filename}` : "";

if (
  !name?.trim() ||
  !description?.trim() ||
  price === undefined || isNaN(price) ||
  !category?.trim() ||
  stockQuantity === undefined || isNaN(stockQuantity)
) {
  return res.status(400).json({ message: "All fields except 'markets' are required and must be valid" });
}

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stockQuantity,
      imageUrl,
      markets: Array.isArray(markets) ? markets : [markets] // handles single/multiple markets
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};


// Update product details
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stockQuantity, markets } = req.body;
    const imageUrl = req.file ? `/images/uploads/${req.file.filename}` : undefined;
if (
  !name?.trim() ||
  !description?.trim() ||
  price === undefined || isNaN(price) ||
  !category?.trim() ||
  stockQuantity === undefined || isNaN(stockQuantity)
) {
  return res.status(400).json({ message: "All fields except 'markets' are required and must be valid" });
}
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (imageUrl) product.imageUrl = imageUrl;
    if (markets) product.markets = Array.isArray(markets) ? markets : [markets];

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove product (also delete images from disk)
const deleteProduct  = async (req, res) => {
     const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the image file
    if (product.imageUrl) {
      const filePath = path.join(__dirname, "../public", product.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    await User.updateMany(
      { 'cart.productId': productId },
      { $pull: { cart: { productId } } }
    );
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("markets").lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ===== ORDER MANAGEMENT =====

// Get all orders (with user info)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (e.g. pending → shipped)
const updateOrderStatus = async (req, res) => {
  try {
    const {  status } = req.body;
    const orderId = req.params.orderId || req.body.orderId;
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove order
const removeOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId || req.body.orderId;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order Removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  AddUser,
  editUser,
  removeUser,
  getUserById,

  upload,
  addMarket,
  getSupermarketById,
  editSupermarket,
  deleteSupermarket,

  addProduct,
  editProduct,
  deleteProduct,
  getProductById,

  getAllOrders,
  updateOrderStatus,
  removeOrder,
};
