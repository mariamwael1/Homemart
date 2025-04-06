const productsData = {
    "Seoudi": [
        { name: "Fresh Apples", price: "LE 4.99", img: "https://via.placeholder.com/150", supermarket: "Seoudi" },
        { name: "Organic Milk", price: "LE 3.49", img: "https://via.placeholder.com/150", supermarket: "Seoudi" },
        { name: "Olive Oil", price: "LE 45.00", img: "https://via.placeholder.com/150", supermarket: "Seoudi" },
        { name: "Cereal", price: "LE 25.00", img: "https://via.placeholder.com/150", supermarket: "Seoudi" }
    ],
    "Spinneys": [
        { name: "Bananas", price: "LE 2.99", img: "https://via.placeholder.com/150", supermarket: "Spinneys" },
        { name: "Cheese", price: "LE 5.99", img: "https://via.placeholder.com/150", supermarket: "Spinneys" },
        { name: "Yogurt", price: "LE 4.49", img: "https://via.placeholder.com/150", supermarket: "Spinneys" },
        { name: "Chicken Breast", price: "LE 40.00", img: "https://via.placeholder.com/150", supermarket: "Spinneys" }
    ],
    "Mahmoud Elfar": [
        { name: "Tomatoes", price: "LE 1.99", img: "https://via.placeholder.com/150", supermarket: "Mahmoud Elfar" },
        { name: "Bread", price: "LE 2.49", img: "https://via.placeholder.com/150", supermarket: "Mahmoud Elfar" },
        { name: "Cucumber", price: "LE 1.50", img: "https://via.placeholder.com/150", supermarket: "Mahmoud Elfar" },
        { name: "Milk", price: "LE 3.00", img: "https://via.placeholder.com/150", supermarket: "Mahmoud Elfar" }
    ],
    "Carrefour": [
        { name: "Pasta", price: "LE 2.99", img: "https://via.placeholder.com/150", supermarket: "Carrefour" },
        { name: "Eggs", price: "LE 3.79", img: "https://via.placeholder.com/150", supermarket: "Carrefour" },
        { name: "Rice", price: "LE 12.00", img: "https://via.placeholder.com/150", supermarket: "Carrefour" },
        { name: "Juice", price: "LE 10.00", img: "https://via.placeholder.com/150", supermarket: "Carrefour" }
    ],
    "Metro Market": [
        { name: "Chicken", price: "LE 7.99", img: "https://via.placeholder.com/150", supermarket: "Metro Market" },
        { name: "Rice", price: "LE 4.50", img: "https://via.placeholder.com/150", supermarket: "Metro Market" },
        { name: "Pineapple", price: "LE 8.00", img: "https://via.placeholder.com/150", supermarket: "Metro Market" },
        { name: "Frozen Vegetables", price: "LE 15.00", img: "https://via.placeholder.com/150", supermarket: "Metro Market" }
    ]
};

// Display products of a selected supermarket
function showProducts(supermarket) {
    document.getElementById("supermarket-list").style.display = "none";
    document.getElementById("product-list").style.display = "block";
    document.getElementById("supermarket-name").textContent = supermarket;
    document.getElementById("back-button").style.display = "block";

    let productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    productsData[supermarket].forEach(product => {
        let productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button onclick="addToBasket('${product.name}', '${product.price}', '${product.img}', '${supermarket}')">Add to Basket</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

// Show supermarkets
function showSupermarkets() {
    document.getElementById("supermarket-list").style.display = "block";
    document.getElementById("product-list").style.display = "none";
    document.getElementById("back-button").style.display = "none";
}


// Display search results
function displayFilteredProducts(filteredProducts) {
    let productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    for (let supermarket in filteredProducts) {
        filteredProducts[supermarket].forEach(product => {
            let productDiv = document.createElement("div");
            productDiv.className = "product";
            productDiv.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button onclick="addToBasket('${product.name}', '${product.price}', '${product.img}', '${supermarket}')">Add to Basket</button>
            `;
            productsContainer.appendChild(productDiv);
        });
    }
}

// Add to Basket
function addToBasket(name, price, img, supermarket) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.push({ name, price, img, supermarket });
    localStorage.setItem("basket", JSON.stringify(basket));
    alert(`${name} added to your basket!`);
}

// Load My Orders page
// Array to store orders (for the demo, these are stored locally)
let orders = [];

// Function to load orders from the basket (this can be modified for a backend)
function loadOrders() {
    // For now, we'll assume that the orders are already stored in the "orders" array.
    // Ideally, this would be done by fetching data from a server or localStorage
    let ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = '';  // Clear the container before loading

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders placed yet.</p>';
    } else {
        orders.forEach(order => {
            let orderDiv = document.createElement("div");
            orderDiv.classList.add("order-item");
            orderDiv.innerHTML = `
                <span>${order.name}</span>
                <span>${order.price}</span>
            `;
            ordersContainer.appendChild(orderDiv);
        });
    }
}

// Function to clear all orders
function clearOrders() {
    if (confirm("Are you sure you want to clear all orders?")) {
        orders = [];  // Empty the orders array
        loadOrders();  // Reload orders to reflect the changes
    }
}

// Example function to simulate adding orders
function addToOrders(name, price) {
    orders.push({ name, price });
    loadOrders();  // Reload orders after adding a new one
}

// Example of adding a couple of orders for demonstration
addToOrders("Fresh Apples", "LE 4.99");
addToOrders("Organic Milk", "LE 3.49");
addToOrders("Chicken Breast", "LE 40.00");

// Call loadOrders when the page loads to display current orders
window.onload = loadOrders;


// Initialize Google Maps
function initMap(location = "Cairo, Egypt") {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': location }, function (results, status) {
        if (status === 'OK') {
            const mapOptions = {
                zoom: 10,
                center: results[0].geometry.location
            };
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}
function searchItems() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    let productsContainer = document.getElementById("products-container");
    let supermarketList = document.getElementById("supermarket-list");
    let productList = document.getElementById("product-list");
    let supermarketName = document.getElementById("supermarket-name");

    // If the search query is empty, show supermarkets and hide products
    if (query.trim() === "") {
        supermarketList.style.display = "block";
        productList.style.display = "none";
        return;
    }

    // Clear previous results
    productsContainer.innerHTML = "";
    let foundProducts = false;

    // Search through all supermarkets
    for (let supermarket in productsData) {
        productsData[supermarket].forEach(product => {
            if (product.name.toLowerCase().includes(query)) {
                let productDiv = document.createElement("div");
                productDiv.className = "product";
                productDiv.innerHTML = `
                    <img src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <small>Available in: <b>${supermarket}</b></small>
                `;
                productsContainer.appendChild(productDiv);
                foundProducts = true;
            }
        });
    }

    // Show the product list only if there are results
    if (foundProducts) {
        supermarketList.style.display = "none"; // Hide supermarket list
        productList.style.display = "block"; // Show product list
        supermarketName.textContent = "Search Results"; // Change title
    } else {
        productsContainer.innerHTML = "<p>No products found.</p>";
        productList.style.display = "block";
        supermarketList.style.display = "none";
    }
}
document.getElementById("toggle-password").addEventListener("click", function () {
    let passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") { // Temporary check
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to homepage
    } else {
        alert("Invalid credentials. Try again!");
    }
});
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    this.reset();
});

function initMap() {
    const location = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location
    });
    new google.maps.Marker({
        position: location,
        map: map
    });
}
document.addEventListener("DOMContentLoaded", function () {
    displayBasketItems();
});

// Function to add items to the basket (called from product page)
function addToBasket(product) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.push(product);
    localStorage.setItem("basket", JSON.stringify(basket));
    alert(`${product.name} added to basket!`);
}

// Function to display basket items
function displayBasketItems() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    let basketContainer = document.getElementById("basket-items");
    let totalPrice = 0;

    basketContainer.innerHTML = "";

    if (basket.length === 0) {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
        document.getElementById("total-price").textContent = "LE 0.00";
        return;
    }

    basket.forEach((product, index) => {
        let itemDiv = document.createElement("div");
        itemDiv.className = "basket-item";
        itemDiv.innerHTML = `
            <span>${product.name} - ${product.price}</span>
            <button class="remove-btn" onclick="removeFromBasket(${index})">Remove</button>
        `;
        basketContainer.appendChild(itemDiv);

        totalPrice += parseFloat(product.price.replace("LE ", ""));
    });

    document.getElementById("total-price").textContent = `LE ${totalPrice.toFixed(2)}`;
}

// Function to remove an item from the basket
function removeFromBasket(index) {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.splice(index, 1);
    localStorage.setItem("basket", JSON.stringify(basket));
    displayBasketItems();
}

// Checkout function (redirects to orders page)
document.getElementById("checkout-btn").addEventListener("click", function () {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    if (basket.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    localStorage.setItem("orders", JSON.stringify(basket)); // Move items to "My Orders"
    localStorage.removeItem("basket"); // Clear basket
    alert("Order placed successfully!");
    window.location.href = "Myorders.html"; // Redirect to My Orders page
});

