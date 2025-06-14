document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");

  toggleBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      toggleBtn.textContent = "👁";
    }
  });
});
