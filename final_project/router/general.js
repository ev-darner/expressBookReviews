const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both user and pass are provided
  if (username && password) {
    // Check if the user doesn't exist yet
    const usercheck = []
    for (let key in users) {
    if (users[key].username === username) {
        usercheck.push({ ...user[key] });
    }
    }

    //User exists
    if (usercheck.length > 0) {
        return res.status(404).json({message: "User already exists!"});
    }
    //User does not and new user can be registered
    if (usercheck.length = 0) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User has been successfully registered! Please login"})
    }
  }
  if (!username || !password) { 
    return res.status(404).json({message: "Unable to register user."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Get the ISBN parameter from the URL and send book details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Get the author parameter from the URL
  const author = req.params.author.split("-").join(" ");

 // Iterate through the array and check the author
  const iterated_books = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
        iterated_books.push({ ...books[key] });
    }
  }

  // Send a response back to the user
  if (iterated_books.length > 0) {
        res.send(iterated_books);
    }
    if (iterated_books.length == 0) {
       return res.status(404).json({message: "No books matching the search results were found."});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Get the author parameter from the URL
  const title = req.params.title.split("-").join(" ");

  // Iterate through the array and check the title
  const iterated_books = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
        iterated_books.push({ ...books[key] });
    }
  }

  // Send a response back to the user
  if (iterated_books.length > 0) {
        res.send(iterated_books);
    }
    if (iterated_books.length == 0) {
        return res.status(404).json({message: "No books matching the search results were found."});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get isbn parameter from the URL
    const isbn = req.params.isbn;

    // Get the review from the selected book
    const review = books[isbn].reviews;

    // Send response back to user
    if (review) {
        res.send(review);
    }
    if (!review) {
        res.status(404).json({message: "There are no reviews available for this book."});
    }
 });

module.exports.general = public_users;
