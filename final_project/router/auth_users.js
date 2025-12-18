const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return false if a user with the same name is found, otherwise it is valid and return true
if (userswithsamename.length > 0) {
    return false;
} else {
    return true;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
// Return true if it is a valid user
if (validusers.length > 0) {
    return true;
} else {
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if either the username or password is missing
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in. Username and password required."});
  }

  // Authenticate the user
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  if (!authenticatedUser(username, password)) {
    return res.status(208).json({message:"Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  // Check to see if user is authenticated
  if (!username) {
    return res.status(401).json({message: "Please login before using this feature"});
  }

  // Check to se if isbn is valid
  if (!books[isbn]) {
    return res.status(404).json({message: "Please enter a valid book isbn"});
  }

  // Submit the user's review
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review submitted successfully"});

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    // Check to see if user is authenticated
  if (!username) {
    return res.status(401).json({message: "Please login before using this feature"});
  }
  // Check to se if isbn is valid
  if (!books[isbn]) {
    return res.status(404).json({message: "Please enter a valid book isbn"});
  }

  // Check if there is a review under the selected book and username
  if(!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review found"})
  }

  // Delete the user's review
   delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
