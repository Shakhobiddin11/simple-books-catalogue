// Load favorites from localStorage
export function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Save favorites array to localStorage
export function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}