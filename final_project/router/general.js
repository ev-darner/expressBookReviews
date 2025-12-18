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
    if (!isValid(username)) {
        return res.status(409).json({message: "User already exists!"});
    };
    //User does not and new user can be registered
    users.push({username, password});
    return res.status(201).json({message: "User has been successfully registered! Please login"});
  }

    return res.status(400).json({message: "Unable to register user."});
});

// Promise to get book list
const getBookList = new Promise((resolve, reject) => {
    const bookList = {books};
    if (bookList) {
        resolve(bookList);
    } else {
        reject(error);
    }

});

// Get the book list available in the shop using async/await
public_users.get('/',async (req, res) => {
    try {
        // Await the getBookList function
        const bookList = await getBookList;
        res.send(JSON.stringify({bookList}, null, 4));
    } catch (error) {
        res.send(500).json({message: "Error getting books"});
    }
});

// Get book details based on ISBN using promise
public_users.get('/isbn/:isbn',async (req, res) => {
  // Get the ISBN parameter from the URL and send book details
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        }
        if (!books[isbn]) {
            reject("No books with that ISBN are available.")
        }
    })
    .then((result) => {res.status(200).json(result)})
    .catch((error) => {res.status(404).json({message: error})});
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  // Get the author parameter from the URL
  const author = req.params.author.split("-").join(" ");

 // Iterate through the array and check the author
 new Promise((resolve, reject) => {
    const iterated_books = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
        iterated_books.push({ ...books[key] });
    }
  };
  // Send a response back to the user
  if (iterated_books.length > 0) {
        resolve(iterated_books);
    }
    if (iterated_books.length == 0) {
       reject("No books matching the search results were found." );
    }
 })
 .then((result) => {res.status(200).json(result)})
 .catch((error) => {res.status(404).json({message: error})});
  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  // Get the author parameter from the URL
  const title = req.params.title.split("-").join(" ");

  // Iterate through the array and check the title
  new Promise((resolve, reject) => {
    const iterated_books = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
        iterated_books.push({ ...books[key] });
    }
  };
  // Send a response back to the user
  if (iterated_books.length > 0) {
        resolve(iterated_books);
    }
    if (iterated_books.length == 0) {
       reject("No books matching the search results were found.");
    }
 })
 .then((result) => {res.status(200).json(result)})
 .catch((error) => {res.status(404).json({message: error})});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get isbn parameter from the URL
    const isbn = req.params.isbn;

    // Get the review from the selected book
    const review = books[isbn].reviews;

    // Send response back to user
    if (review) {
        res.status(200).json(review);
    }
    if (!review) {
        res.status(404).json({message: "There are no reviews available for this book."});
    }
 });

module.exports.general = public_users;
