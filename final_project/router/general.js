const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
  return users.some(user => user.username === username);
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Function to simulate fetching book data with a Promise
const fetchBooks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate a delay
  });
};

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const booksList = await fetchBooks();
    res.status(200).json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});
// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4));

// });


// Function to simulate fetching a book by ISBN with a Promise
const fetchBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulate a delay
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await fetchBookByISBN(isbn);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });


const fetchBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = [];
      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 1000); // Simulate a delay
  });
};

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await fetchBooksByAuthor(author);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   let booksByAuthor = [];
//   for (let key in books) {
//     if (books[key].author === author) {
//       booksByAuthor.push(books[key]);
//     }
//   }
//   if (booksByAuthor.length > 0) {
//     return res.status(200).json(booksByAuthor);
//   } else {
//     return res.status(404).json({ message: "No books found by this author" });
//   }
// });

const fetchBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksWithTitle = [];
      for (let key in books) {
        if (books[key].title === title) {
          booksWithTitle.push(books[key]);
        }
      }
      if (booksWithTitle.length > 0) {
        resolve(booksWithTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 1000); // Simulate a delay
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksWithTitle = await fetchBooksByTitle(title);
    res.status(200).json(booksWithTitle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   let booksWithTitle = [];

//   for (let key in books) {
//     if (books[key].title === title) {
//       booksWithTitle.push(books[key]);
//     }
//   }
//   if (booksWithTitle.length > 0) {
//     return res.status(200).json(booksWithTitle);
//   } else {
//     return res.status(404).json({ message: "No books found with this title" });
//   }
// });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
