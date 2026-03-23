// ── DOM Elements ──
const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");
const results = document.getElementById("results");

// Load favorites from localStorage or start with empty array
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Render favorites sidebar on page load
renderFavorites();

// ── Search Function ──
// Fetches books from Open Library API and renders them as cards
async function searchBooks(query) {

  // Validate input
  if (!query) {
    status.textContent = "Enter a search query";
    return;
  }

  if (query.length < 3) {
    status.textContent = "Please enter at least 3 characters";
    return;
  }

  status.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    // Show message if no results found
    if (data.docs.length === 0) {
      results.innerHTML = `<p style="font-family: 'Source Sans 3'; color: #7c736a; text-align: center; margin-top: 40px; font-size: 15px; width: 100%;">No books found for "<strong>${query}</strong>"</p>`;
      status.textContent = "";
      return;
    }

    status.textContent = "";
    results.innerHTML = "";

    // Render first 20 results as book cards
    data.docs.slice(0, 20).forEach(book => {

      // Use cover image if available, otherwise fallback to default icon
      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "./assets/book.svg";

      // Check if this book is already in favorites
      const isFav = favorites.find(b => b.key === book.key);

      const card = document.createElement("div");
      card.className = "book-card";

      // Render card HTML with heart filled if already favorited
      card.innerHTML = `
        <div class="book-img-row">
          <img 
            src="${cover}" 
            class="book-img"
            onerror="this.src='./assets/book.svg'"
          >
          <div class="js-add-favorite-btn ${isFav ? "active" : ""}">
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path 
                d="M12.6667 9.33333C13.66 8.36 14.6667 7.19333 14.6667 5.66667C14.6667 4.69421 14.2804 3.76158 13.5928 3.07394C12.9051 2.38631 11.9725 2 11 2C9.82671 2 9.00004 2.33333 8.00004 3.33333C7.00004 2.33333 6.17337 2 5.00004 2C4.02758 2 3.09495 2.38631 2.40732 3.07394C1.71968 3.76158 1.33337 4.69421 1.33337 5.66667C1.33337 7.2 2.33337 8.36667 3.33337 9.33333L8.00004 14L12.6667 9.33333Z"
                fill="${isFav ? "currentColor" : "none"}"
                stroke="currentColor"
                stroke-width="1.3"
              />
            </svg>
          </div>
        </div>

        <div class="book-info-grid">
          <p class="book-title">${book.title}</p>
          <p class="book-author">${book.author_name?.join(", ") || "Unknown"}</p>
          <p class="published-year">${book.first_publish_year || "N/A"}</p>
        </div>
      `;

      const favBtn = card.querySelector(".js-add-favorite-btn");

      // Toggle favorite on heart click — updates heart in place without re-fetching
      favBtn.addEventListener("click", () => {
        const exists = favorites.find(b => b.key === book.key);

        if (exists) {
          // Remove from favorites and reset heart to outline
          favorites = favorites.filter(b => b.key !== book.key);
          favBtn.classList.remove("active");
          favBtn.querySelector("path").setAttribute("fill", "none");
          favBtn.querySelector("path").setAttribute("stroke", "currentColor");
        } else {
          // Add to favorites and fill heart red
          favorites.push(book);
          favBtn.classList.add("active");
          favBtn.querySelector("path").setAttribute("fill", "currentColor");
          favBtn.querySelector("path").setAttribute("stroke", "currentColor");
        }

        saveFavorites();
        renderFavorites();
      });

      results.appendChild(card);
    });

  } catch {
    // Show error message if API call fails
    results.innerHTML = `<p style="font-family: 'Source Sans 3'; color: #7c736a; text-align: center; margin-top: 40px; font-size: 15px; width: 100%;">Something went wrong. Please try a more specific search.</p>`;
    status.textContent = "";
  }
}

// ── Event Listeners ──

// Search on Enter key press
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBooks(input.value.trim());
  }
});

// Search on button click
button.addEventListener("click", () => {
  searchBooks(input.value.trim());
});

// ── Helper Functions ──

// Save favorites array to localStorage
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ── Render Favorites Sidebar ──
function renderFavorites() {
  const container = document.getElementById("favorites");
  const count = document.getElementById("favoritesCount");

  container.innerHTML = "";

  // Update count text — always runs before early return
  count.textContent =
    favorites.length === 0
      ? "No books saved"
      : favorites.length === 1
      ? "1 book saved"
      : `${favorites.length} books saved`;

  // Show empty state if no favorites
  if (favorites.length === 0) {
    container.innerHTML = `<p style="font-family: 'Source Sans 3'; color: #7c736a; font-size: 13px; text-align: center; margin-top: 16px;">No favorites yet.<br>Click the heart on a book to save it.</p>`;
    return;
  }

  // Render each favorite book item
  favorites.forEach(book => {
    const div = document.createElement("div");
    div.className = "favorite-book-item";

    // Use cover image if available, otherwise fallback to default icon
    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "./assets/book.svg";

    div.innerHTML = `
      <img 
        src="${cover}" 
        class="favorite-book-img"
        onerror="this.src='./assets/book.svg'"
      >

      <div class="favorite-book-info">
        <p class="favorite-book-title">${book.title}</p>
        <p class="favorite-book-author">${book.author_name?.join(", ") || "Unknown"}</p>
        <p class="favorite-book-year">${book.first_publish_year || "N/A"}</p>
      </div>

      <div class="remove-fav">
        <svg class="favorite-book-heart" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12.6667 9.33333C13.66 8.36 14.6667 7.19333 14.6667 5.66667C14.6667 4.69421 14.2804 3.76158 13.5928 3.07394C12.9051 2.38631 11.9725 2 11 2C9.82671 2 9.00004 2.33333 8.00004 3.33333C7.00004 2.33333 6.17337 2 5.00004 2C4.02758 2 3.09495 2.38631 2.40732 3.07394C1.71968 3.76158 1.33337 4.69421 1.33337 5.66667C1.33337 7.2 2.33337 8.36667 3.33337 9.33333L8.00004 14L12.6667 9.33333Z"
            fill="currentColor"
          />
        </svg>
      </div>
    `;

    // Remove from favorites and sync heart state in search results
    div.querySelector(".remove-fav").addEventListener("click", () => {
      favorites = favorites.filter(b => b.key !== book.key);
      saveFavorites();
      renderFavorites();

      // Find matching card in search results by title and reset its heart
      const allFavBtns = document.querySelectorAll(".js-add-favorite-btn");
      allFavBtns.forEach(btn => {
        const path = btn.querySelector("path");
        const cardTitle = btn.closest(".book-card").querySelector(".book-title").textContent;
        if (cardTitle === book.title) {
          btn.classList.remove("active");
          path.setAttribute("fill", "none");
        }
      });
    });

    container.appendChild(div);
  });
}

// Load default search on page load
searchBooks("harry potter");