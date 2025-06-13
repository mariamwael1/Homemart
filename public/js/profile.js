    // Tab switching logic
  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(div => {
      div.style.display = 'none';
      div.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
  }

    // Toggle address form visibility
    function toggleAddressForm() {
      const form = document.getElementById('address-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    // Confirm reorder
    function confirmReorder(orderId) {
      if (confirm("Reorder these items again?")) {
        fetch(`/profile/reorder/${orderId}`, { method: 'POST' })
          .then(res => {
            if (res.ok) {
              window.location.href = '/cart';
            } else {
              res.text().then(msg => alert(msg));
            }
          })
          .catch(() => alert('Failed to reorder'));
      }
    }

     const form = document.getElementById('change-password-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message); // success message
        form.reset();
      } else {
        alert(result.error); // show error message
      }
    } catch (err) {
      alert('Unexpected error. Try again.');
      console.error(err);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('missingAddress') === 'true') {
    alert('Please add your address before proceeding to checkout.');
  }

   function toggleDetails(index) {
    const row = document.getElementById(`details-${index}`);
    if (row.style.display === 'none') {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }