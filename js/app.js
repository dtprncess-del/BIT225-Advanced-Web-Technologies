// BlueLib Catalogue - BIT225 Assignment 2
// All books are stored in this array. The cards on the page are built from it.
const books = [
    { title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "IT", copies: 4 },
    { title: "Learning Web Design", author: "Jennifer Robbins", category: "IT", copies: 3 },
    { title: "Principles of Management", author: "Stephen Robbins", category: "Business", copies: 5 },
    { title: "The Lean Startup", author: "Eric Ries", category: "Business", copies: 2 },
    { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 3 },
    { title: "The Selfish Gene", author: "Richard Dawkins", category: "Science", copies: 1 },
    { title: "The Story of Art", author: "E. H. Gombrich", category: "Arts", copies: 2 },
    { title: "Things Fall Apart", author: "Chinua Achebe", category: "Arts", copies: 6 }
];

// Get the page elements we need to work with
const bookList = document.getElementById("book-list");
const noResultsMessage = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const addBookForm = document.getElementById("add-book-form");
const formMessage = document.getElementById("form-message");

/**
 * Creates one book card element.
 * bookIndex is the position of the book in the books array,
 * so the Borrow button knows which book to update.
 */
function createBookCard(book, bookIndex) {
    const card = document.createElement("article");
    card.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = "Author: " + book.author;

    const category = document.createElement("p");
    category.textContent = "Category: " + book.category;

    // Show "Out of stock" when no copies are left
    const copies = document.createElement("p");
    if (book.copies > 0) {
        copies.className = "copies";
        copies.textContent = "Copies available: " + book.copies;
    } else {
        copies.className = "out-of-stock";
        copies.textContent = "Out of stock";
    }

    const borrowButton = document.createElement("button");
    borrowButton.type = "button";
    borrowButton.className = "btn borrow-btn";
    borrowButton.textContent = "Borrow";
    borrowButton.dataset.index = bookIndex;
    borrowButton.disabled = book.copies === 0;

    card.append(title, author, category, copies, borrowButton);
    return card;
}

/**
 * Returns the books that match the search text AND the selected category.
 * Each result keeps its original index from the books array.
 */
function getFilteredBooks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const results = [];

    books.forEach(function (book, index) {
        const matchesTitle = book.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;

        if (matchesTitle && matchesCategory) {
            results.push({ book: book, index: index });
        }
    });

    return results;
}

/**
 * Clears the book list and draws a card for every matching book.
 * Shows "No books found." when nothing matches.
 */
function renderBooks() {
    const matchingBooks = getFilteredBooks();

    bookList.innerHTML = "";

    matchingBooks.forEach(function (item) {
        bookList.appendChild(createBookCard(item.book, item.index));
    });

    noResultsMessage.hidden = matchingBooks.length > 0;
}

/**
 * Reduces the copies of one book by 1 (never below 0), then redraws the cards.
 */
function borrowBook(bookIndex) {
    const book = books[bookIndex];

    if (book && book.copies > 0) {
        book.copies = book.copies - 1;
    }

    renderBooks();
}

/**
 * Shows a message under the Add Book form.
 * type is "error" or "success" and controls the colour.
 */
function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "message " + type;
}

/**
 * Handles the Add Book form: validates input, adds the book, redraws the list.
 */
function handleAddBook(event) {
    event.preventDefault(); // stop the page from reloading

    const title = addBookForm.elements["title"].value.trim();
    const author = addBookForm.elements["author"].value.trim();
    const category = addBookForm.elements["category"].value;
    const copiesText = addBookForm.elements["copies"].value.trim();

    // Check that every field is filled in
    if (title === "" || author === "" || category === "" || copiesText === "") {
        showFormMessage("Please fill in all fields.", "error");
        return;
    }

    // Copies must be a whole number that is 0 or greater
    const copies = Number(copiesText);
    if (!Number.isInteger(copies) || copies < 0) {
        showFormMessage("Copies must be a whole number of 0 or more.", "error");
        return;
    }

    books.push({ title: title, author: author, category: category, copies: copies });

    // Clear the filters so the new book is visible straight away
    searchInput.value = "";
    categoryFilter.value = "All";
    renderBooks();

    addBookForm.reset();
    showFormMessage('"' + title + '" was added to the catalogue.', "success");
}

// ---------- Event listeners ----------

// Filter again every time the user types or changes the category
searchInput.addEventListener("input", renderBooks);
categoryFilter.addEventListener("change", renderBooks);

// One listener on the list handles Borrow clicks for every card (including new ones)
bookList.addEventListener("click", function (event) {
    if (event.target.classList.contains("borrow-btn")) {
        borrowBook(Number(event.target.dataset.index));
    }
});

addBookForm.addEventListener("submit", handleAddBook);

// Show the books when the page first loads
renderBooks();
