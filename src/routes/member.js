const express = require('express');
const { 
    viewAllMembers, 
    viewAvailableBooks, 
    viewBorrowedBooks,
    borrowBook, 
    returnBook,
    updateMember, 
    whoBorrowedBook,
    deleteAccount 
} = require('../controllers/memberController');
const {  authLibrarian, authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// View All Members
router.get('/', authLibrarian, viewAllMembers);

// View Available Books
router.get('/books', authenticateJWT, viewAvailableBooks);

// Borrow Book
router.post('/book/borrow/:bookId', authenticateJWT, borrowBook);

// Return Book
router.post('/book/return/:bookId', authenticateJWT, returnBook);

// Book Boorowed By User
router.get('/books/borrowed', authenticateJWT, viewBorrowedBooks);

// find the user who borrowed the book
router.get('/book/borrowed/:bookId', authLibrarian, whoBorrowedBook);

// Update Member
router.put('/:id', authenticateJWT, updateMember);

// Delete Account
router.delete('/me', authLibrarian, deleteAccount);

module.exports = router;
