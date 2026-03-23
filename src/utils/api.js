// Fetches books from Open Library API and returns docs array
export async function fetchBooks(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  const data = await response.json();
  return data.docs;
}