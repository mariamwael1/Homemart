const User = require("../models/User");
const Order = require("../models/Order");
const Address = require('../models/Address');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');

const getUserById = (req, res) => {
	const userId = req.params.userId;
	User.findById(userId)
		.populate("orders")
		.then((user) => {
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: "Server error" });
		});
};

const updateUserById = (req, res) => {
	const userId = req.params.userId;
	const updatedData = req.body;
	User.findByIdAndUpdate(userId, updatedData, { new: true })
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send("User not found");
			}
			console.log("User updated successfully:", updatedUser);
			res.json(updatedUser);
		})
		.catch((err) => {
			console.error("Error updating user:", err);
			res.status(500).send("Internal server error");
		});
};

const signup = async (req, res) => {
  try {
    const { name, email, password,confirm_password, role } = req.body;

     if (!name || !email || !password) {
      return res.render("register", {
        error: 'Name, email, and password are required.',
        formData: req.body
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
       if (password !== confirm_password) {
      return res.render("register", {
        error: 'Password and Confirm password must be the same.',
        formData: req.body
      });
    }
    const user = new User({
      name,
      email,
      passwordHash,
      role: role || 'customer'  // Or 'user' if you add it to enum
    });

    await user.save();
		req.session.user = user;
		res.redirect("/");

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

	
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { name: email }]
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      req.session.error = 'Invalid email/username or password';
      return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.error = 'Server error. Please try again later.';
    res.redirect('/login');
  }
};


const getSavedCardInfo = async (req, res) => {
	try {
		const userId = req.session.user._id;
		const user = await User.findById(userId, "creditCard");

		if (user && user.creditCard) {
			const last4 = user.creditCard.number.slice(-4);
			res.json({ hasSavedCard: true, cardLast4: last4 });
		} else {
			res.json({ hasSavedCard: false });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};
const addCreditCardInfo = async (req, res) => {
  try {
    const { nameOnCard, cardNumber, expiryMonth, expiryYear } = req.body;
    const userId = req.session.user._id;
    if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear) {
      req.session.error = "All credit card fields are required.";
      return res.redirect("/add-card");
    }
      cardNumber2 = cardNumber.replace(/\s+/g, ''); // Remove spaces

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameOnCard.trim())) {
      req.session.error = "Invalid name on card.";
      return res.redirect("/add-card");
    }
    
      if (!/^\d{13,16}$/.test(cardNumber2) ) {
      req.session.error = "Invalid credit card number.";
      return res.redirect("/add-card");
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expMonth = parseInt(expiryMonth);
    const expYear = parseInt(expiryYear);

    if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
      req.session.error = "Invalid expiry month.";
      return res.redirect("/add-card");
    }

    if (isNaN(expYear) || expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      req.session.error = "Card has expired.";
      return res.redirect("/add-card");
    }

    await User.findByIdAndUpdate(
      userId,
      {
        creditCard: {
          nameOnCard: nameOnCard.trim(),
          cardNumber: cardNumber2.slice(-4),
          expiryMonth: expMonth,
          expiryYear: expYear
        }
      },
      { new: true }
    );

    req.session.success = "Credit card information saved successfully.";
    res.redirect("/profile"); // or wherever makes sense
  } catch (err) {
    console.error(err);
    req.session.error = "Server error. Please try again.";
    res.redirect("/add-card");
  }
};





const getUserByIdWithOrders = async (req, res) => {
	const userId = req.params.userId;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 2;

	try {
		const user = await User.findById(userId)
			.populate({
				path: "orders",
				options: {
					skip: (page - 1) * limit,
					limit: limit,
				},
			})
			.exec();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const totalOrders = await Order.countDocuments({
			_id: { $in: user.orders },
		});
		const totalPages = Math.ceil(totalOrders / limit);

		res.json({
			user: {
				username: user.username,
				email: user.email,
				birthyear: user.birthyear,
				Address: user.Address,
				State: user.State,
				City: user.City,
				ZipCode: user.ZipCode,
				cardNumber: user.cardNumber,
				ExpiryDate: user.ExpiryDate,
			},
			orders: user.orders,
			pagination: {
				totalOrders: totalOrders,
				totalPages: totalPages,
				currentPage: page,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
	  .populate('address')
      .populate({
        path: 'orders',
        populate: { path: 'products.productId' }
      })
      .lean();
	    const orders2 = await Order.find({ user: user._id }).lean();
		const error = req.session.error;
		const success = req.session.success;
		delete req.session.error;
		delete req.session.success;
    res.render('profile', {
      user,
      orders: user.orders || [],
	  orders2,
	  error,
	  success
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
 	req.session.success = "Profile updated successfully";
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
	req.session.error = "Failed to update profile";
    res.status(500).send("Failed to update profile");
  }
};

const reorder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await User.findById(req.session.user._id).populate({
      path: 'orders',
      populate: { path: 'products.productId' }
    });

    const order = user.orders.find(o => o._id.toString() === orderId);
    if (!order) return res.status(404).send("Order not found");

    // Check stock availability
    const outOfStockItems = order.products.filter(p => {
      const prod = p.productId;
      return !prod || prod.stockQuantity < p.quantity;
    });

    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map(p => p.name).join(', ');
      return res.status(400).send(`Cannot reorder. Out of stock: ${names}`);
    }

    // Add to cart
    for (const item of order.products) {
      const alreadyInCart = user.cart.find(ci => ci.productId.toString() === item.productId._id.toString());
      if (alreadyInCart) {
        alreadyInCart.quantity += item.quantity;
      } else {
        user.cart.push({
          productId: item.productId._id,
          name: item.name,
          quantity: item.quantity,
          priceAtAddTime: item.priceAtPurchase
        });
      }
    }

    await user.save();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reordering");
  }
};

const updateCreditCard = async (req, res) => {
  const { nameOnCard, cardNumber, expiryMonth, expiryYear } = req.body;

  if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear) {
       req.session.error = "All credit card fields are required."
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameOnCard.trim())) {
     req.session.error = "All credit card fields are required.";
      return res.redirect("/profile");
  }


  if (!/^\d{13,16}$/.test(cardNumber) ) {
          req.session.error = "Invalid credit card number.";
      return res.redirect("/profile");
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const expMonth = parseInt(expiryMonth);
  const expYear = parseInt(expiryYear);

  if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
      req.session.error = "Invalid expiry month.";
      return res.redirect("/profile");
  }

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      req.session.error = "Card has expired.";
      return res.redirect("/profile");
  }

  try {
    const user = await User.findById(req.session.user._id);

    user.creditCard = {
      nameOnCard: nameOnCard.trim(),
      cardNumber: cardNumber.slice(-4), // Store only last 4 digits
      expiryMonth: expMonth,
      expiryYear: expYear
    };

    await user.save();
    req.session.success = 'Credit card updated successfully.';
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to update credit card.';
    res.status(500).send("Failed to update credit card.");
  }
};

const updateAddress = async (req, res) => {
  const { Streetadd, City, State, Zipcode } = req.body;

  if (!Streetadd || !City || !State || !Zipcode ) {
    return res.status(400).send("All address fields are required.");
  }

  try {
    const user = await User.findById(req.session.user._id);

    if (user.address) {
      // Update existing address
      await Address.findByIdAndUpdate(user.address, {
        Streetadd, City, State, Zipcode
      });
    } else {
      // Create and assign new address
      const newAddress = await Address.create({
          Streetadd, City, State, Zipcode
      });
      user.address = newAddress._id;
    }

    await user.save();
	req.session.success = 'Address Updated Successfully.';	
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
	req.session.error = 'Failed to Update Address.';	
    res.status(500).send("Failed to update address.");
  }
};

const changePassword = async (req, res) => {
 try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Please fill all password fields.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.passwordHash) {
      return res.status(400).json({ error: 'User has no password set.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).send('Order not found');

    if (order.status !== 'pending') {
      return res.status(400).send('Only pending orders can be cancelled');
    }

    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.quantity }
      });
    }

    await order.deleteOne();
	req.session.success = 'Order deleted successfully.';
    res.redirect('/profile?cancelled=1');
  } catch (err) {
    console.error(err);
	req.session.error = 'Failed to remove Order.';	
    res.status(500).send('Server error');
  }
};

const removeAddress = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        address: ''
      }
    });
	req.session.success = 'Address removed successfully.';
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
	req.session.error = 'Failed to remove address.';
    res.status(500).send('Failed to remove address.');
  }
};

const removeCreditCard = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        creditCard: ''
      }
    });
	req.session.success = 'Creditcard removed successfully.';
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
	req.session.error = 'Failed to remove Creditcard.';	
    res.status(500).send('Failed to remove credit card.');
  }
};

module.exports = {
	getUserById,
	updateUserById,
	signup,
	login,
	getSavedCardInfo,
	addCreditCardInfo,
	cancelOrder,
	getUserByIdWithOrders,
	getProfile,
	updateProfile,
	reorder,
	updateCreditCard,
	updateAddress,
	changePassword,
	removeAddress,
	removeCreditCard,

};
