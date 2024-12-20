const express = require('express');
const { 
    addBook,
    updateBook,
    removeBook,
    viewBooks,
} = require('../controllers/librarianController');
const { authLibrarian, authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Add Book Route
router.post('/books', authLibrarian, addBook);

// Update Book Route
router.put('/books/:id', authLibrarian, updateBook);

// Remove Book Route
router.delete('/books/:id', authLibrarian, removeBook);

// view All Books
router.get('/books', authenticateJWT, viewBooks);

// Additional routes for managing members can be added here

module.exports = router;
