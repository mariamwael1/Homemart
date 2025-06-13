document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const currentMode = localStorage.getItem("darkMode");

  if (currentMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
