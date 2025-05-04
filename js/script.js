// Product Database
const productsData = {
    "Seoudi": [
        { name: "Apples", price: "LE 4.99", img: "./images/Fresh Apples.jpg", supermarket: "Seoudi" },
        { name: "Milk", price: "LE 60", img: "./images/Organic Milk.jpg", supermarket: "Seoudi" },
        { name: "Olive Oil", price: "LE 45.00", img: "./images/Olive Oil.jpg", supermarket: "Seoudi" },
        { name: "Cereal", price: "LE 25.00", img: "./images/cerel.jpg", supermarket: "Seoudi" },
        { name: "Bread", price: "LE 20.00", img: "./images/Bread.jpg", supermarket: "Seoudi" },
        { name: "Water", price: "LE 5.00", img: "./images/water.jpg", supermarket: "Seoudi" },
        { name: "Redbull", price: "LE 45.00", img: "./images/redbull.jpg", supermarket: "Seoudi" }
    ],
    "Spinneys": [
        { name: "Bananas", price: "LE 2.99", img: "./images/banana.jpg", supermarket: "Spinneys" },
        { name: "Cheese", price: "LE 5.99", img: "./images/cheese.jpg", supermarket: "Spinneys" },
        { name: "Yogurt", price: "LE 4.49", img: "./images/yogurt.jpg", supermarket: "Spinneys" },
        { name: "Chicken Breast", price: "LE 40.00", img: "./images/chicken.jpg", supermarket: "Spinneys" }
    ],
    "Mahmoud Elfar": [
        { name: "Tomatoes", price: "LE 20", img: "./images/Tomatos.jpg", supermarket: "Mahmoud Elfar" },
        { name: "Bread", price: "LE 10", img: "./images/bread.jpg", supermarket: "Mahmoud Elfar" }
    ],
    "Carrefour": [
        { name: "Pasta", price: "LE 2.99", img: "./images/Spaghetti.jpg", supermarket: "Carrefour" },
        { name: "Eggs", price: "LE 3.79", img: "./images/Eggs.jpg", supermarket: "Carrefour" },
        { name: "Rice", price: "LE 12.00", img: "./images/rice.jpg", supermarket: "Carrefour" }
    ],
    "Metro Market": [
        { name: "Chicken", price: "LE 7.99", img: "./images/chicken.jpg", supermarket: "Metro Market" },
        { name: "Rice", price: "LE 4.50", img: "./images/rice.jpg", supermarket: "Metro Market" }
    ]
};

// Marketplace Navigation
function showProducts(supermarket) {
    document.getElementById('supermarket-list').classList.add('hidden');
    document.getElementById('product-list').classList.remove('hidden');
    document.getElementById('supermarket-name').textContent = supermarket;
    document.getElementById('back-button').classList.remove('hidden');

    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    productsData[supermarket].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
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
    document.getElementById('supermarket-list').classList.remove('hidden');
    document.getElementById('product-list').classList.add('hidden');
    document.getElementById('back-button').classList.add('hidden');
}

// Basket Functions
function addToBasket(name, price, img, supermarket) {
    let basket = localStorage.getItem('basket') || '';
    if (basket) basket += '|';
    basket += `${name}:${price}:${img}:${supermarket}`;
    localStorage.setItem('basket', basket);

    alert(`Added ${name} to your basket!`);
    displayBasketItems();
}

function displayBasketItems() {
    const basket = localStorage.getItem('basket');
    const basketContainer = document.getElementById('basket-items');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;

    basketContainer.innerHTML = '';

    if (!basket) {
        basketContainer.innerHTML = '<p>Your basket is empty.</p>';
        if (totalPriceElement) totalPriceElement.textContent = 'LE 0.00';
        return;
    }

    basket.split('|').forEach((item, index) => {
        const [name, price, img] = item.split(':');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'basket-item';
        itemDiv.innerHTML = `
            <img src="${img}" alt="${name}" class="basket-item-img">
            <span>${name} - ${price}</span>
            <button class="remove-btn" onclick="removeFromBasket(${index})">Remove</button>
        `;
        basketContainer.appendChild(itemDiv);

        totalPrice += parseFloat(price.replace('LE', '').trim());
    });

    if (totalPriceElement) totalPriceElement.textContent = `LE ${totalPrice.toFixed(2)}`;
}

function removeFromBasket(index) {
    let basket = localStorage.getItem('basket');
    if (!basket) return;

    const items = basket.split('|');
    items.splice(index, 1);
    localStorage.setItem('basket', items.join('|'));

    displayBasketItems();
}

function clearBasket() {
    if (confirm('Are you sure you want to clear your basket?')) {
        localStorage.removeItem('basket');
        displayBasketItems();
    }
}

// Checkout Modal
function proceedToCheckout() {
    const basket = localStorage.getItem('basket');
    if (!basket) {
        alert('Your basket is empty!');
        return;
    }
    document.getElementById('payment-modal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function processPayment() {
    const paymentMethod = [...document.getElementsByName('payment-method')].find(r => r.checked)?.value;
    const address = document.getElementById('delivery-address').value.trim();

    if (!paymentMethod || !address) {
        alert('Please complete all payment details!');
        return;
    }

    let basket = localStorage.getItem('basket');
    let orders = localStorage.getItem('orders') || '';

    const metadata = `ORDER_INFO:${new Date().toISOString()}:${paymentMethod}:${address}`;
    orders += orders ? `|${metadata}|${basket}` : `${metadata}|${basket}`;

    localStorage.setItem('orders', orders);
    localStorage.removeItem('basket');

    closePaymentModal();
    alert('Order placed successfully!');
    window.location.href = 'MyOrders.html';
}

// Orders
function loadOrders() {
    const container = document.getElementById('orders-container');
    const orders = localStorage.getItem('orders');

    if (!orders) {
        container.innerHTML = '<p class="empty-orders">No orders placed yet.</p>';
        return;
    }

    const ordersList = document.createElement('div');
    ordersList.className = 'orders-list';

    const today = new Date().toLocaleDateString();
    const orderGroup = document.createElement('div');
    orderGroup.className = 'order-group';

    const header = document.createElement('div');
    header.className = 'order-date';
    header.innerHTML = `<h3>Order placed on: ${today}</h3>`;
    orderGroup.appendChild(header);

    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'order-items';

    let total = 0;

    orders.split('|').forEach(item => {
        if (item.startsWith('ORDER_INFO')) return;

        const [name, price, img, supermarket] = item.split(':');
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${img}" alt="${name}" class="order-item-img">
            <div class="order-item-details">
                <span class="order-item-name">${name}</span>
                <span class="order-item-price">${price}</span>
                <span class="order-item-supermarket">From: ${supermarket}</span>
            </div>
        `;
        itemsDiv.appendChild(orderItem);

        total += parseFloat(price.replace('LE', '').trim());
    });

    orderGroup.appendChild(itemsDiv);

    const totalDiv = document.createElement('div');
    totalDiv.className = 'order-total';
    totalDiv.innerHTML = `<span>Total:</span> <span>LE ${total.toFixed(2)}</span>`;
    orderGroup.appendChild(totalDiv);

    ordersList.appendChild(orderGroup);
    container.appendChild(ordersList);
}

function clearOrders() {
    if (confirm('Are you sure you want to clear all orders?')) {
        localStorage.removeItem('orders');
        loadOrders();
    }
}

// Login
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === '1234') {
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials.');
            }
        });
    }

    if (document.getElementById('toggle-password')) {
        document.getElementById('toggle-password').addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        });
    }

    if (document.getElementById('contact-form')) {
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for contacting us!');
            e.target.reset();
        });
    }
});
