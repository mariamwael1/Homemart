
function showTab(tabName, element) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    element.classList.add('active');

}
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get("tab") || "products"; // default tab fallback

  // Hide all tabs
  document.querySelectorAll(".admin-tab").forEach(tab => tab.classList.add("hidden"));

  // Show the tab that matches the ?tab=... query
  const selectedTab = document.getElementById(`${activeTab}-tab`);
  if (selectedTab) {
    selectedTab.classList.remove("hidden");
  }

  // Optional: if you have active tab button classes, update them too
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.tab === activeTab) btn.classList.add("active");
  });
});


function switchTab(tabName) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabName);
    window.location.href = url.toString();
}

document.getElementById("addUserForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("User added successfully!");
            location.reload(); // or dynamically update table
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
});


function showUserForm() {
  const form = document.getElementById("addUserForm");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";  // Show the form
  } else {
    form.style.display = "none";   // Hide the form if already visible (optional toggle behavior)
  }
}


async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "User deleted successfully");
      // Optionally, remove the user row from the DOM or reload the page:
      location.reload();
    } else {
      alert(result.message || "Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("An error occurred. Please try again.");
  }
}


    function editUser(id) {
  const form = document.getElementById("editUserForm");

  if (form.style.display === "block") {
    // If form is already visible, hide it (toggle off)
    form.style.display = "none";
    form.reset(); // Optional: clear the form inputs when hiding
  } else {
    // If form is hidden, fetch user data and show form
    fetch(`/admin/users/${id}`)
      .then(res => res.json())
      .then(user => {
        form.style.display = "block";
        form.id.value = user._id;
        form.name.value = user.name || "";
        form.email.value = user.email || "";
        form.password.value = ""; // leave blank for security
        form.role.value = user.role || "client";
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        alert("Failed to load user data.");
      });
  }
}


    document.getElementById("editUserForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const form = e.target;
        const id = form.id.value;

        // Build updatedUser with only non-empty fields
        const updatedUser = {};
        if (form.name.value !== "") updatedUser.name = form.name.value;
        if (form.email.value !== "") updatedUser.email = form.email.value;
        if (form.password.value !== "") updatedUser.password = form.password.value;
        if (form.role.value !== "") updatedUser.role = form.role.value;

        const response = await fetch(`/admin/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        });
    console.log("Updated user front end :", updatedUser);
        const data = await response.json();
        alert(data.message);
        location.reload();
    });




    function showAddMarketForm() {
    const form = document.getElementById("addMarketForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
}


function editSupermarket(id) {
    const form = document.getElementById("editSupermarketForm");

  if (form.style.display === "block") {
    // If form is already visible, hide it (toggle off)
    form.style.display = "none";
    form.reset(); // Optional: clear the form inputs when hiding
  } else {
  fetch(`/admin/supermarkets/${id}`)
    .then(res => res.json())
    .then(market => {
      const form = document.getElementById("editSupermarketForm");
      form.style.display = "block";
      form.id.value = market._id;
      form.name.value = market.name || "";
      form.logo.value = ""; // Clear file input for new upload
    })
    .catch(err => alert("Failed to fetch supermarket data"));
}
}

// Submit edited supermarket
document.getElementById("editSupermarketForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const id = form.id.value;

  const formData = new FormData();
  formData.append("name", form.name.value);
  if (form.logo.files[0]) {
    formData.append("logo", form.logo.files[0]);
  }

  const response = await fetch(`/admin/supermarkets/${id}`, {
    method: "PUT",
    body: formData
  });

  const data = await response.json();
  alert(data.message);
  location.reload();
});

// Delete supermarket
function deleteSupermarket(id) {
  if (!confirm("Are you sure you want to delete this supermarket?")) return;

  fetch(`/admin/supermarkets/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  })
  .catch(() => alert("Failed to delete supermarket"));
}

function toggleProductForm() {
  const form = document.getElementById("addProductForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

 document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    // Append basic fields
    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("price", form.price.value);
    formData.append("category", form.category.value);
    formData.append("stockQuantity", form.stockQuantity.value);

    // Append image
    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]);
    }

    // Append markets (multiple checkboxes)
    const selectedMarkets = Array.from(form.querySelectorAll('input[name="markets"]:checked'))
      .map(checkbox => checkbox.value);
    selectedMarkets.forEach(id => formData.append("markets", id));

    try {
      const response = await fetch("/admin/products", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        location.reload();
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    }
  });

  function editProduct(id) {
  fetch(`/admin/products/${id}`)
    .then(res => res.json())
    .then(product => {
      const form = document.getElementById("editProductForm");
      form.style.display = form.style.display === "block" ? "none" : "block";
      form.id.value = product._id;
      form.name.value = product.name;
      form.description.value = product.description || "";
      form.price.value = product.price;
      form.category.value = product.category || "";
      form.stockQuantity.value = product.stockQuantity || 0;

      const marketSelect = form.markets;
      [...marketSelect.options].forEach(option => {
        option.selected = product.markets.some(m => m._id === option.value);
      });
    })
    .catch(() => alert("Failed to load product data"));
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  fetch(`/admin/products/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(() => alert("Error deleting product"));
}

document.getElementById("editProductForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  // Add only non-empty values
  if (form.name.value) formData.append("name", form.name.value);
  if (form.description.value) formData.append("description", form.description.value);
  if (form.price.value) formData.append("price", form.price.value);
  if (form.category.value) formData.append("category", form.category.value);
  if (form.stockQuantity.value) formData.append("stockQuantity", form.stockQuantity.value);
  if (form.image.files[0]) formData.append("image", form.image.files[0]); // image input

  // Append selected markets (multi-select)
  const selectedMarkets = Array.from(form.markets.selectedOptions).map(opt => opt.value);
  selectedMarkets.forEach(marketId => formData.append("markets", marketId));

  const id = form.id.value;

  const response = await fetch(`/admin/products/${id}`, {
    method: "PUT",
    body: formData
  });

  const data = await response.json();
  alert(data.message);
  location.reload();
});


 async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/admin/orders/update-status/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      location.reload();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Network error');
  }
}

async function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete this order?')) return;

  try {
    const res = await fetch(`/admin/orders/remove/${orderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      location.reload();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Network error');
  }
}

