// togglemenu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// slideshow
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 3 seconds
}

// Library functions

function getId() {
  return JSON.parse(localStorage.getItem("id"));
}
function setId(id) {
  localStorage.setItem("id", JSON.stringify(id));
}
if (getId() === null) {
  setId(13120);
}
let id = getId();

// remove items
// localStorage.removeItem("library");

// local storage functions

if (getStorage() === null) {
  let Book1 = new Book(id++, "Atomic Habits", "James Clear");
  let Book2 = new Book(id++, "King of Greed", "Ana Huang", false);
  let Book3 = new Book(id++, "It Ends with Us", "Colleen Hoover", false);
  let Book4 = new Book(id++, "Mathematics", "R.D. Sharma");
  let Library = [Book1, Book2, Book3, Book4];
  updateStorage(Library);
}
function updateStorage(Library) {
  localStorage.setItem("library", JSON.stringify(Library));
}

function getStorage() {
  return JSON.parse(localStorage.getItem("library"));
}

// constructor function
function Book(id, title, author, borrowed = true) {
  this.id = id;
  this.title = title;
  this.author = author;
  if (borrowed) {
    this.isBorrowed = false;
  } else {
    this.isBorrowed = true;
  }
}

// add book function
function handleAddBook(event) {
  event.preventDefault();
  let data = new FormData(event.target);
  let title = data.get("title");
  let author = data.get("author");
  let library = getStorage();
  if (title != "" && author != "") {
    let book = new Book(id++, title, author);
    library.push(book);
    updateStorage(library);
    addResult.innerHTML = `<em><p style='color: #28a745;'>Congratulations!! ID: ${book.id}, ${title} by ${author} Book is added to the Library.</em></p>`;
    console.log(library);
    availableBooks();
  } else {
    addResult.innerHTML =
      "<em><p style='color: #dc3545;'>Please enter author of the Book</p></em>";
  }
  setId(id);
}

// search functions
function search(op, value) {
  let isBook = false;
  let library = getStorage();
  switch (op) {
    case "id":
      value = parseInt(value);
      for (let book of library) {
        if (book.id === value) {
          isBook = true;
          searchResult.innerHTML = `<em><h3>Results</h3> <p style='color: #28a745;'>Here is the Book you searched for: <br>ID: ${book.id}, ${book.title} By ${book.author}</p></em>`;
        }
      }
      if (!isBook) {
        searchResult.innerHTML =
          "<em><h3>Results</h3> <p style='color: #dc3545;'>Sorry!! This Book is not available.</p></em>";
      }
      break;

    case "title":
      for (let book of library) {
        if (book.title === value) {
          isBook = true;
          searchResult.innerHTML = `<em><h3>Results</h3> <p style='color: #28a745;'>
            Here is the Book you searched for: <br>ID: ${book.id}, ${book.title} By ${book.author}</p></em>`;
        }
      }
      if (!isBook) {
        searchResult.innerHTML = `<em><h3>Results</h3> <p style='color: #dc3545;'>Sorry!! This Book is not available.</p></em>`;
      }
      break;

    case "author":
      for (let book of library) {
        if (book.author === value) {
          isBook = true;
          searchResult.innerHTML = `<em><h3>Results</h3> <p style='color: #28a745;'>Here is the Book you searched for: <br>ID: ${book.id}, ${book.title} By ${book.author}</p></em>`;
        }
      }
      if (!isBook) {
        searchResult.innerHTML = `<em><h3>Results</h3> <p style='color: #dc3545;'>Sorry!! This Book is not available.</p></em>`;
      }
      break;

    default:
      searchResult.innerHTML =
        "<p style='color: #dc3545;'><em>Please select a search parameter</em></p>";
      break;
  }
  updateStorage(library);
}

function handleSearch(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const searchBy = data.get("search-by");
  let value = data.get("search");
  search(searchBy, value);
  clearInputs();
}

// list all books
function availableBooks() {
  // Get the table and insert a new row at the end
  let table = document.getElementById("books-table");
  table.innerHTML =
    "<tr><th>ID</th><th>Book's Title</th><th>Book's Author</th><th>Status</th><th>Borrow / Return</th></tr>";

  let library = getStorage();
  // Insert data into cells of the new row
  for (let book of library) {
    var newRow = table.insertRow(table.rows.length);
    newRow.insertCell(0).innerHTML = book.id;
    newRow.insertCell(1).innerHTML = book.title;
    newRow.insertCell(2).innerHTML = book.author;
    if (!book.isBorrowed) {
      newRow.insertCell(3).innerHTML = "Available";
      newRow.insertCell(4).innerHTML =
        "<button type='submit' class='btn tab-btn' onclick='update(this)' >Borrow</button>";
    } else {
      newRow.insertCell(3).innerHTML = "Borrowed";
      newRow.insertCell(4).innerHTML =
        "<button type='submit' class='btn tab-btn' onclick='update(this)'>Return</button>";
    }
  }
  clearInput();
}

// update status of books
function update(button) {
  // Get the parent row of the clicked button
  let row = button.parentNode.parentNode;

  let id = parseInt(row.cells[0].innerText);

  let title, author;
  let library = getStorage();

  for (let book of library) {
    if (book.id === id && book.isBorrowed === false) {
      book.isBorrowed = true;
      title = book.title;
      author = book.author;
      bookResult.innerHTML = `<em ><p style='color: #28a745;'>${title} By ${author} has been borrowed!!</p></em>`;
    } else if (book.id === id && book.isBorrowed === true) {
      book.isBorrowed = false;
      title = book.title;
      author = book.author;
      bookResult.innerHTML = `<em><p style='color: #28a745;'>${title} By ${author} has been returned!!</p></em>`;
    }
  }
  updateStorage(library);
  availableBooks();
}

// clear inputs
function clearInputs() {
  document.querySelector("input").value = "";
  document.querySelector("select").value = "";
}
function clearInput() {
  document.getElementById("name-input").value = "";
  document.getElementById("author-input").value = "";
}

// handle submit buttons

document.querySelector(".search-form").addEventListener("submit", handleSearch);
document.querySelector(".add-form").addEventListener("submit", handleAddBook);

var searchResult = document.querySelector(".search-results");
var addResult = document.querySelector(".add-results");
var bookResult = document.querySelector(".results");
availableBooks();
