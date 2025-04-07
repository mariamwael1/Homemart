const productsData = {
    "Seoudi": [
        { name: "Apples", price: "LE 4.99", img: "Fresh Apples.jpg", supermarket: "Seoudi" },
        { name: "Milk", price: "LE 60", img: "Organic Milk.jpg", supermarket: "Seoudi" },
        { name: "Olive Oil", price: "LE 45.00", img: "Olive Oil.jpg", supermarket: "Seoudi" },
        { name: "Cereal", price: "LE 25.00", img: "cerel.jpg", supermarket: "Seoudi" },
        { name: "Bread", price: "LE 20.00", img: "Bread.jpg", supermarket: "Seoudi" },
        { name: "water", price: "5.00", img: "water.jpg", supermarket: "Seoudi" },
        { name: "Redbull", price: "LE 45.00", img: "redbull.jpg", supermarket: "Seoudi" },
   ],
    "Spinneys": [
        { name: "Bananas", price: "LE 2.99", img: "banana.jpg", supermarket: "Spinneys" },
        { name: "Cheese", price: "LE 5.99", img: "cheese.jpg", supermarket: "Spinneys" },
        { name: "Yogurt", price: "LE 4.49", img: "yogurt.jpg", supermarket: "Spinneys" },
        { name: "Chicken Breast", price: "LE 40.00", img: "chicken.jpg", supermarket: "Spinneys" },
        { name: "water", price: "5.00", img: "water.jpg", supermarket: "Spinneys" },
        { name: "redbull", price: "45.00", img: "redbull.jpg", supermarket: "Spinneys" },
        { name: "Milk", price: "LE 25.00", img: "Organic milk.jpg", supermarket: "Spinneys" }
    ],
    "Mahmoud Elfar": 
    [
        { name: "Tomatoes", price: "LE 20", img: "Tomatos.jpg", supermarket: "Mahmoud Elfar" },
        { name: "Bread", price: "LE 10", img: "bread.jpg", supermarket: "Mahmoud Elfar" },
        { name: "Cucumber", price: "LE 15", img: "cucumber.jpg", supermarket: "Mahmoud Elfar" },
        { name: "Milk", price: "LE 25", img: "Organic milk.jpg", supermarket: "Mahmoud Elfar" },
        { name: "water", price: "5.00", img: "water.jpg", supermarket: "Spinneys" },
    ],
    "Carrefour": [
        { name: "Pasta", price: "LE 2.99", img: "Spaghetti.jpg", supermarket: "Carrefour" },
        { name: "Eggs", price: "LE 3.79", img: "Eggs.jpg", supermarket: "Carrefour" },
        { name: "Rice", price: "LE 12.00", img: "rice.jpg", supermarket: "Carrefour" },
        { name: "Juice", price: "LE 10.00", img: "Juice.jpg", supermarket: "Carrefour" },
        { name: "water", price: "5.00", img: "water.jpg", supermarket: "Carrefour" },
    ],
    "Metro Market": [
        { name: "Chicken", price: "LE 7.99", img: "chicken.jpg", supermarket: "Metro Market" },
        { name: "Rice", price: "LE 4.50", img: "rice.jpg", supermarket: "Metro Market" },
        { name: "Pineapple", price: "LE 8.00", img: "pineapples.jpg", supermarket: "Metro Market" },
        { name: "Frozen Vegetables", price: "LE 15.00", img: "frozen vegetables.jpg", supermarket: "Metro Market" },
        { name: "water", price: "5.00", img: "water.jpg", supermarket: "Metro Market" },
    ]
};
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

function showSupermarkets() {
    document.getElementById("supermarket-list").style.display = "block";
    document.getElementById("product-list").style.display = "none";
    document.getElementById("back-button").style.display = "none";
}

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

function displayBasketItems() {
    let basket = localStorage.getItem("basket");
    let basketContainer = document.getElementById("basket-items");
    let totalPrice = 0;

    basketContainer.innerHTML = "";

    if (!basket || basket === "") {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
        document.getElementById("total-price").textContent = "LE 0.00";
        return;
    }
    basket = basket.split('|');
    basket.forEach((item, index) => {
        let [name, price, img, supermarket] = item.split(':');
        let itemDiv = document.createElement("div");
        itemDiv.className = "basket-item";
        itemDiv.innerHTML = `
            <img src="${img}" alt="${name}" class="basket-item-img">
            <span>${name} - ${price}</span>
            <button class="remove-btn" onclick="removeFromBasket(${index})">Remove</button>
        `;
        basketContainer.appendChild(itemDiv);

        totalPrice += parseFloat(price.replace("LE", "").trim());
    });

    document.getElementById("total-price").textContent = `LE ${totalPrice.toFixed(2)}`;
}

function removeFromBasket(index) {
    let basket = localStorage.getItem("basket");

    if (!basket || basket === "") return;

   
    basket = basket.split('|');

    basket.splice(index, 1);

    localStorage.setItem("basket", basket.join('|'));

    displayBasketItems();
}


function clearBasket() {
    if (confirm("Are you sure you want to clear your basket?")) {
        localStorage.removeItem("basket");
        displayBasketItems();  
    }
}

document.getElementById("checkout-btn").addEventListener("click", function () {
    let basket = localStorage.getItem("basket");

    if (!basket || basket === "") {
        alert("Your basket is empty!");
        return;
    }

    localStorage.setItem("orders", basket);
    localStorage.removeItem("basket");

    alert("Order placed successfully!");
    window.location.href = "MyOrders.html";  
});


  
    document.getElementById("clear-basket-btn").addEventListener("click", clearBasket);

let orders = [];

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = "";
  
    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders placed yet.</p>";
    } else {
      orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item");
        orderDiv.innerHTML = `
          <img src="${order.img}" alt="${order.name}" width="50">
          <span>${order.name}</span>
          <span>${order.price}</span>
          <small>From: ${order.supermarket}</small>
        `;
        ordersContainer.appendChild(orderDiv);
      });
    }
  }
  
  function clearOrders() {
    if (confirm("Are you sure you want to clear all orders?")) {
      localStorage.removeItem("orders");
      loadOrders();
    }
  }
  
  window.onload = loadOrders;


 
function showLocationInput() {
    document.getElementById('location-input').style.display = 'block';
}

function saveLocation() {
    const address = document.getElementById('address-input').value;

    if (address) {
        document.getElementById('location').innerText = address;
        document.getElementById('location-input').style.display = 'none';
        alert('Location saved successfully!');
    } else {
        alert('Please enter a valid address.');
    }
}


function searchItems() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    let productsContainer = document.getElementById("products-container");
    let supermarketList = document.getElementById("supermarket-list");
    let productList = document.getElementById("product-list");
    let supermarketName = document.getElementById("supermarket-name");

    if (query.trim() === "") {
        supermarketList.style.display = "block";
        productList.style.display = "none";
        return;
    }

 
    productsContainer.innerHTML = "";
    let foundProducts = false;

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


    if (foundProducts) {
        supermarketList.style.display = "none"; 
        productList.style.display = "block"; 
        supermarketName.textContent = "Search Results"; 
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
    event.preventDefault(); 

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") { 
        alert("Login successful!");
        window.location.href = "index.html"; 
    } else {
        alert("Invalid credentials. Try again!");
    }
});
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    this.reset();
});

document.addEventListener("DOMContentLoaded", function () {
    displayBasketItems();
});
function displayBasketItems() {
    let basket = localStorage.getItem("basket");
    let basketContainer = document.getElementById("basket-items");
    let totalPrice = 0;

    basketContainer.innerHTML = "";
    if (!basket || basket === "") {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
        document.getElementById("total-price").textContent = "LE 0.00";
        return;
    }
    basket = basket.split('|');
    basket.forEach((item, index) => {
        let [name, price, img] = item.split(':');
        let itemDiv = document.createElement("div");
        itemDiv.className = "basket-item";
        itemDiv.innerHTML = `
            <img src="${img}" alt="${name}" class="basket-item-img">
            <span>${name} - ${price}</span>
            <button class="remove-btn" onclick="removeFromBasket(${index})">Remove</button>
        `;
        basketContainer.appendChild(itemDiv);

        totalPrice += parseFloat(price.replace("LE", "").trim());
    });
    document.getElementById("total-price").textContent = `LE ${totalPrice.toFixed(2)}`;
}
function removeFromBasket(index) {
    let basket = localStorage.getItem("basket");

    if (!basket || basket === "") return;
    basket = basket.split('|');

    
    basket.splice(index, 1);

    
    localStorage.setItem("basket", basket.join('|'));

   
    displayBasketItems();
}


function clearBasket() {
    if (confirm("Are you sure you want to clear your basket?")) {
        localStorage.removeItem("basket");
        displayBasketItems();  
    }
}


document.getElementById("checkout-btn").addEventListener("click", function () {
    let basket = localStorage.getItem("basket");

    if (!basket || basket === "") {
        alert("Your basket is empty!");
        return;
    }

 
    localStorage.setItem("orders", basket);
    localStorage.removeItem("basket");

    alert("Order placed successfully!");
    window.location.href = "MyOrders.html";  
});

