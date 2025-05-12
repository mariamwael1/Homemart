let products = [
    { id: 1, name: "Organic Bananas", category: "Fruits & Vegetables", price: 15.99, stock: 50, supermarket: "Seoudi", image: "banana.jpg", description: "Fresh organic bananas" },
    { id: 2, name: "Fresh Milk", category: "Dairy & Eggs", price: 20.50, stock: 30, supermarket: "Spinneys", image: "milk.jpg", description: "Pasteurized fresh milk" },
    { id: 3, name: "Whole Wheat Bread", category: "Bakery", price: 12.75, stock: 15, supermarket: "Metro Market", image: "bread.jpg", description: "Freshly baked whole wheat bread" }
];

let supermarkets = [
    { id: 1, name: "Seoudi", address: "123 Main St, Cairo", deliveryFee: 15.00, logo: "saudi.jpg", description: "Local supermarket with fresh products", productCount: 120 },
    { id: 2, name: "Spinneys", address: "456 Park Ave, Cairo", deliveryFee: 20.00, logo: "spinneys.jpg", description: "Premium supermarket with imported goods", productCount: 200 },
    { id: 3, name: "Metro Market", address: "789 Central Rd, Cairo", deliveryFee: 10.00, logo: "metro.jpg", description: "Affordable supermarket for everyday needs", productCount: 150 },
    { id: 4, name: "Carrefour", address: "101 Main Mall, Cairo", deliveryFee: 25.00, logo: "carrefoure.jpg", description: "International hypermarket chain", productCount: 300 },
    { id: 5, name: "Mahmoud Elfar", address: "202 Local St, Cairo", deliveryFee: 12.00, logo: "mahmoud.jpg.webp", description: "Family-owned grocery store", productCount: 80 }
];

let logs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProductsTable();
    loadSupermarketsTable();
    loadLogsTable();
    loadSupermarketDropdown();
    updateStats();

    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('supermarket-form').addEventListener('submit', saveSupermarket);
});

function showTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    event.target.classList.add('active');
}

function loadProductsTable() {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${product.supermarket}</td>
                <td>
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="delete-button">Delete</button>
                </td>
            </tr>
        `;
    });
}

function showProductForm(isEdit = false) {
    document.getElementById('product-form-container').classList.remove('hidden');
    document.getElementById('product-form-title').textContent = isEdit ? 'Edit Product' : 'Add New Product';
    if (!isEdit) document.getElementById('product-form').reset();
}

function cancelProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
    document.getElementById('product-form').reset();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        Object.keys(product).forEach(key => {
            const element = document.getElementById(`product-${key}`);
            if (element) element.value = product[key];
        });
        showProductForm(true);
    }
}

function saveProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value;
    const newProduct = {
        id: productId ? parseInt(productId) : products.length + 1,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        supermarket: document.getElementById('product-supermarket').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
    };

    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        products[index] = newProduct;
        logAction(`Updated product '${newProduct.name}'`);
    } else {
        products.push(newProduct);
        logAction(`Added new product '${newProduct.name}'`);
    }

    loadProductsTable();
    cancelProductForm();
    showSuccessMessage(productId ? 'Product updated successfully!' : 'Product added successfully!');
    updateStats();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        loadProductsTable();
        showSuccessMessage('Product deleted successfully!');
        updateStats();
    }
}

function loadSupermarketsTable() {
    const tbody = document.querySelector('#supermarkets-table tbody');
    tbody.innerHTML = '';
    supermarkets.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.address}</td>
                <td>${s.deliveryFee.toFixed(2)}</td>
                <td>${s.productCount}</td>
                <td>
                    <button onclick="editSupermarket(${s.id})">Edit</button>
                    <button onclick="deleteSupermarket(${s.id})" class="delete-button">Delete</button>
                </td>
            </tr>
        `;
    });
}

function showSupermarketForm(isEdit = false) {
    document.getElementById('supermarket-form-container').classList.remove('hidden');
    document.getElementById('supermarket-form-title').textContent = isEdit ? 'Edit Supermarket' : 'Add New Supermarket';
    if (!isEdit) document.getElementById('supermarket-form').reset();
}

function cancelSupermarketForm() {
    document.getElementById('supermarket-form-container').classList.add('hidden');
    document.getElementById('supermarket-form').reset();
}

function editSupermarket(id) {
    const sm = supermarkets.find(s => s.id === id);
    if (sm) {
        Object.keys(sm).forEach(key => {
            const element = document.getElementById(`supermarket-${key}`);
            if (element) element.value = sm[key];
        });
        showSupermarketForm(true);
    }
}

function saveSupermarket(event) {
    event.preventDefault();
    const id = document.getElementById('supermarket-id').value;
    const newSupermarket = {
        id: id ? parseInt(id) : supermarkets.length + 1,
        name: document.getElementById('supermarket-name').value,
        address: document.getElementById('supermarket-address').value,
        logo: document.getElementById('supermarket-logo').value,
        deliveryFee: parseFloat(document.getElementById('supermarket-delivery-fee').value),
        description: document.getElementById('supermarket-description').value,
        productCount: id ? supermarkets.find(s => s.id === parseInt(id)).productCount : 0
    };

    if (id) {
        const index = supermarkets.findIndex(s => s.id === parseInt(id));
        supermarkets[index] = newSupermarket;
        logAction(`Updated supermarket '${newSupermarket.name}'`);
    } else {
        supermarkets.push(newSupermarket);
        logAction(`Added new supermarket '${newSupermarket.name}'`);
    }

    loadSupermarketsTable();
    loadSupermarketDropdown();
    cancelSupermarketForm();
    showSuccessMessage(id ? 'Supermarket updated successfully!' : 'Supermarket added successfully!');
    updateStats();
}

function deleteSupermarket(id) {
    if (confirm('Are you sure you want to delete this supermarket?')) {
        supermarkets = supermarkets.filter(s => s.id !== id);
        loadSupermarketsTable();
        loadProductsTable();
        showSuccessMessage('Supermarket deleted successfully!');
        updateStats();
    }
}

function logAction(details) {
    const now = new Date();
    logs.unshift({
        timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
        user: "admin@homemarket.com",
        action: "Admin Action",
        details
    });
    loadLogsTable();
}

function loadLogsTable() {
    const tbody = document.querySelector('#logs-table tbody');
    tbody.innerHTML = '';
    logs.forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
            </tr>
        `;
    });
}

function showSuccessMessage(msg) {
    const el = document.getElementById('success-message');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 3000);
}

function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-supermarkets').textContent = supermarkets.length;
    document.getElementById('low-stock').textContent = products.filter(p => p.stock < 20).length;
    document.getElementById('active-orders').textContent = '3';
}

function loadSupermarketDropdown() {
    const select = document.getElementById('product-supermarket');
    select.innerHTML = '<option value="">Select a supermarket</option>';
    supermarkets.forEach(s => {
        const option = document.createElement('option');
        option.value = s.name;
        option.textContent = s.name;
        select.appendChild(option);
    });
}
