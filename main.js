const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");
const results = document.getElementById("results");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

renderFavorites();


const defaultBooks = [
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", year: 2008 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", year: 2018 },
  { title: "You Don’t Know JS", author: "Kyle Simpson", year: 2015 },
  { title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999 }
];

function renderDefaultBooks() {
  results.innerHTML = "";

  defaultBooks.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-img-row">
        <img src="./assets/book.svg" class="book-img">

        <div class="js-add-favorite-btn">
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path 
              d="M12.6667 9.33333C13.66 8.36 14.6667 7.19333 14.6667 5.66667C14.6667 4.69421 14.2804 3.76158 13.5928 3.07394C12.9051 2.38631 11.9725 2 11 2C9.82671 2 9.00004 2.33333 8.00004 3.33333C7.00004 2.33333 6.17337 2 5.00004 2C4.02758 2 3.09495 2.38631 2.40732 3.07394C1.71968 3.76158 1.33337 4.69421 1.33337 5.66667C1.33337 7.2 2.33337 8.36667 3.33337 9.33333L8.00004 14L12.6667 9.33333Z"
              fill="none"
              stroke="currentColor"
            />
          </svg>
        </div>
      </div>

      <div class="book-info-grid">
        <p class="book-title">${book.title}</p>
        <p class="book-author">${book.author}</p>
        <p class="published-year">${book.year}</p>
      </div>
    `;

    results.appendChild(card);
  });
}



async function searchBooks(query) {
  if (!query) {
    status.textContent = "Enter a search query";
    return;
  }

  status.textContent = "Loading...";
  results.innerHTML = "<p>Loading books...</p>";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    if (data.docs.length === 0) {
      results.innerHTML = "<p>No books found...</p>";
      status.textContent = "";
      return;
    }

    status.textContent = "";
    results.innerHTML = "";

    data.docs.slice(0, 20).forEach(book => {
      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "./assets/book.svg";

      const isFav = favorites.find(b => b.key === book.key);

      const card = document.createElement("div");
      card.className = "book-card";

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

      favBtn.addEventListener("click", () => {
        const exists = favorites.find(b => b.key === book.key);

        if (exists) {
          favorites = favorites.filter(b => b.key !== book.key);
        } else {
          favorites.push(book);
        }

        saveFavorites();
        renderFavorites();
        searchBooks(query); // re-render
      });

      results.appendChild(card);
    });

  } catch {
    results.innerHTML = "<p>Server busy. Try again.</p>";
    status.textContent = "";
  }
}



input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBooks(input.value.trim());
  }
});

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const container = document.getElementById("favorites");
  const count = document.getElementById("favoritesCount");

  container.innerHTML = "";

  favorites.forEach(book => {
    const div = document.createElement("div");
    div.className = "favorite-book-item";

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

    div.querySelector(".remove-fav").addEventListener("click", () => {
      favorites = favorites.filter(b => b.key !== book.key);
      saveFavorites();
      renderFavorites();
    });

    container.appendChild(div);
  });

  count.textContent =
  favorites.length === 1
    ? "1 book saved"
    : `${favorites.length} books saved`;
}
searchBooks("harry potter")