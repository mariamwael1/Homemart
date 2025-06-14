document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll("#category-list li");
  const marketSelect = document.getElementById("market-filter");
  const productCards = document.querySelectorAll(".product-card");

  let selectedCategory = "all";
  let selectedMarket = "all";

  const filterProducts = () => {

    productCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category");
      const marketText = card.querySelector("small").innerText; // e.g. "From: Seoudi , Mahmoud el far"

      // Parse markets properly
      const marketList = marketText
        .replace("From:", "")
        .split(",")
        .map(m => m.trim().toLowerCase());

      const matchCategory = selectedCategory === "all" || cardCategory === selectedCategory;
      const matchMarket = selectedMarket === "all" || marketList.includes(selectedMarket.toLowerCase());
      card.style.display = (matchCategory && matchMarket) ? "block" : "none";
    });
  };

  // CATEGORY LISTENER
  if (categoryItems.length > 0) {
    categoryItems.forEach(item => {
      item.addEventListener("click", () => {
        const currentActive = document.querySelector("#category-list .active");
        if (currentActive) currentActive.classList.remove("active");

        item.classList.add("active");
        selectedCategory = item.dataset.category;
        filterProducts();
      });
    });
  }

  // MARKET SELECT LISTENER
  marketSelect.addEventListener("change", (e) => {
    selectedMarket = e.target.value.trim().toLowerCase(); // normalize
    filterProducts();
  });

});



async function addToCart(productId) {
  const qty = parseInt(document.getElementById(`qty-${productId}`).value) || 1;

  try {
    const productRes = await fetch(`/product/${productId}`);
    if (!productRes.ok) {
      alert("Failed to fetch product data.");
      return;
    }

    const product = await productRes.json();

    if (product.stockQuantity < qty) {
      alert(`Only ${product.stockQuantity} in stock. Please adjust quantity.`);
      return;
    }
    // Proceed with adding to cart
    const res = await fetch('/add-to-cart', {
      method: 'POST',
     headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'  
      },
      body: JSON.stringify({ productId, quantity: qty })
    });
     // Handle not-logged-in response BEFORE trying to parse
    if (res.status === 401) {
      const data = await res.json(); // Now it's JSON
      alert(data.message || "You are not logged in.");
      return;
    }
    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Added to cart!");
    } else {
      alert(data.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding to cart");
  }
}

