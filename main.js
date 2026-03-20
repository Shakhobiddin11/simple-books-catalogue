const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");
const results = document.getElementById("results");

button.addEventListener("click", async () => {
  const query = input.value.trim();

  if (!query) {
    status.textContent = "Enter a search query";
    return;
  }

  status.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    if (data.docs.length === 0) {
      status.textContent = "Nothing found";
      return;
    }

    status.textContent = "";

    const book = data.docs[0];

    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
      : "./assets/book.svg";

    results.innerHTML = `
      <div class="book-card">
        <div class="book-img-row">
          <img src="${cover}" class="book-img" alt="Book cover">
        </div>

        <div class="book-info-grid">
          <p class="book-title">${book.title}</p>
          <p class="book-author">${book.author_name?.join(", ") || "Unknown"}</p>
          <p class="published-year">${book.first_publish_year || "N/A"}</p>
        </div>
      </div>
    `;

  } catch (error) {
    status.textContent = "Error fetching data";
  }
});