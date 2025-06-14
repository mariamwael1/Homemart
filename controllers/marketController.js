// controllers/marketController.js
const Market = require("../models/Market");
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');


const addToCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);

    const existingItem = user.cart.find(item => item.productId.equals(product._id));
    if (!product || product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }
if(quantity<1){
  return res.status(400).json({ message: "Quantity must be more than" });
}
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      user.cart.push({
        productId: product._id,
        name: product.name,
        quantity: parseInt(quantity),
        priceAtAddTime: product.price
      });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const user = await User.findById(req.session.user._id);

    const item = user.cart.find(ci => ci.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stockQuantity < quantity) {
        return res.status(400).json({
          message: `Only ${product.stockQuantity} in stock for ${product.name}`
        });
      }

    item.quantity = quantity;
    await user.save();

    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.cart = user.cart.filter(ci => ci.productId.toString() !== productId.toString());


    await user.save();

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const processCheckout = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!['cash_on_delivery', 'credit_card'].includes(paymentMethod)) {
      return res.status(400).send("Invalid payment method");
    }

    const user = await User.findById(req.session.user._id);
    if (!user || user.cart.length === 0) {
      return res.redirect('/cart');
    }

    // Optional: If paying with credit, ensure they have a card saved
    if (paymentMethod === 'credit_card') {
      if (!user.creditCard || !user.creditCard.cardNumber) {
        return res.status(400).send("No credit card on file. Please add one.");
      }
    }
    if (!user.address) {
        return res.redirect('/profile?missingAddress=true');
       }


    // Check stock availability
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).send(`Insufficient stock for ${item.name}`);
      }
    }

    // Deduct stock quantity
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const totalAmount = user.cart.reduce((sum, item) => {
      return sum + item.quantity * item.priceAtAddTime;
    }, 0);

    const newOrder = await Order.create({
      userId: user._id,
      products: user.cart.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAddTime
      })),
      totalAmount,
      paymentMethod,
      status: 'pending'
    });

    user.orders.push(newOrder._id);
    user.cart = [];
    await user.save();

    res.render('checkout-success', {
      username: user.name,
      paymentMethod
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  processCheckout,
  getProductById,
 } 
