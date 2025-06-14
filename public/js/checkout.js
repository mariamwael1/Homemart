document.addEventListener('DOMContentLoaded', () => {
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const creditOptions = document.getElementById('credit-options');
  const cvvInput = document.getElementById('cvv-input');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = document.querySelector('input[name="paymentMethod"]:checked').value;

      if (selectedValue === 'credit_card') {
        creditOptions.style.display = 'block';
        if (cvvInput) {
          cvvInput.setAttribute('required', 'required');
        }
      } else {
        creditOptions.style.display = 'none';
        if (cvvInput) {
          cvvInput.removeAttribute('required');
        }
      }
    });
  });

  // Trigger initial toggle on page load
  const initiallySelected = document.querySelector('input[name="paymentMethod"]:checked');
  if (initiallySelected) {
    initiallySelected.dispatchEvent(new Event('change'));
  }
});

function showAddCardModal() {
  // Open modal or new window with credit card form
  window.open('/add-card', 'AddCard', 'width=400,height=500');
}

