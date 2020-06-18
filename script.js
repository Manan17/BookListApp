class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static addBook() {
    const books = Store.getBooks();
    UI.displayBooks(books);
  }

  static displayBooks(books) {
    document.getElementById("book-list").innerHTML = ``;

    books.forEach((book) => UI.displayBook(book));
  }

  static displayBook(book) {
    const html = `<tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href = "#" class="btn btn-danger btn-sm delete">X</td>
      </tr>`;
    document.getElementById("book-list").insertAdjacentHTML("beforeend", html);
  }

  static deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentNode.parentNode.remove();
    }
  }

  static clearFields() {
    document.getElementById("title").value = ``;
    document.getElementById("author").value = ``;
    document.getElementById("isbn").value = ``;
  }

  static alertMessage(mssg, className) {
    const alertMssg = `
        <div class = "text-center alert alert-${className}">
        ${mssg}
        </div>
      `;

    document
      .getElementById("book-form")
      .insertAdjacentHTML("afterbegin", alertMssg);

    setInterval(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

//Store

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    let books = Store.getBooks();
    const newBooks = books.filter((el) => el.isbn !== isbn);
    localStorage.setItem("books", JSON.stringify(newBooks));
  }
}

//Load Books
document.addEventListener("DOMContentLoaded", UI.addBook);

//Event for adding book
document.querySelector(".add-book").addEventListener("click", () => {
  let title, author, isbn;
  title = document.getElementById("title").value;
  author = document.getElementById("author").value;
  isbn = document.getElementById("isbn").value;

  //Validate the fields
  if (title === "" || author === "" || isbn === "") {
    UI.alertMessage("Please fill all the details", "danger");
  } else {
    //Book Object
    const book = new Book(title, author, isbn);

    UI.alertMessage("The book is entered successfully!!", "success");

    //Display Book
    UI.displayBook(book);

    //Add book store
    Store.addBook(book);

    //Clear Fields
    UI.clearFields();
  }
});

//Event for deleting book
document.getElementById("book-list").addEventListener("click", (event) => {
  //Delete book from UI
  UI.deleteBook(event.target);

  //Alert Message for book deleted
  UI.alertMessage("The book is deleted successfully!!", "success");

  //Removing book from the Store
  Store.removeBook(event.target.parentNode.previousElementSibling.textContent);
});
