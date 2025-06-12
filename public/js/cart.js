async function updateQuantity(productId, quantity) {
  const res = await fetch('/update-quantity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  });
  const data = await res.json();
  alert(data.message || "Updated");
  location.reload();
}

async function removeFromCart(productId) {
  const res = await fetch('/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });
  const data = await res.json();
  alert(data.message || "Removed");
  location.reload();
}

