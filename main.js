const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");

button.addEventListener("click", () => {
  const query = input.value.trim();

  if (!query) {
    status.textContent = "Enter a search query";
    return;
  }

  status.textContent = "Loading...";

  console.log("Searching for:", query);
});