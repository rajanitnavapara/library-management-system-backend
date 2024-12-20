const Book = require('../models/BookModel');
const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');

exports.viewAllMembers = async (req, res) => {
    try {
        const members = await User.find({ role: 'MEMBER' });
        res.json(members);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching members' });
    }
};

// View Available Books
exports.viewAvailableBooks = async (req, res) => {
    try {
        const books = await Book.find({ status: 'AVAILABLE' });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
};

// View Borrowed Books By userId
exports.viewBorrowedBooks = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id, action: 'BORROW', returnDate: null });
        const borrowedBooks = await Promise.all(
            transactions.map(async (transaction) => {
                const book = await Book.findById(transaction
                    .bookId);
                return book;
            }
        ));
        res.json(borrowedBooks);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching borrowed books' });
    }
};

// Borrow Book
exports.borrowBook = async (req, res) => {
    const { bookId } = req.params;
    // console.log("req.user: ",req.user);

    try {
        const book = await Book.findById(bookId);

        if (!book || book.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Book not available for borrowing' });
        }

        // Update book status
        book.status = 'BORROWED';
        book.borrowedBy = {
            userId: req.user.id,
            borrowDate: new Date()
        };
        await book.save();

        // Create a transaction record
        const transaction = new Transaction({
            userId: req.user.id,
            bookId: bookId,
            action: 'BORROW'
        });

        await transaction.save();

        res.status(200).json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ error: 'Error borrowing book' });
    }
};

// Return Book
exports.returnBook = async (req, res) => {
    const { bookId } = req.params;

    try {

        // Find the latest borrow transaction for this book by the user
        const transaction = await Transaction.findOneAndUpdate(
            { userId: req.user.id, bookId, action: 'BORROW', returnDate: null },
            { returnDate: new Date() }, // Set return date to now
            { new: true }
        );

        if (!transaction) {
            return res.status(400).json({ message: 'No active borrow record found for this book' });
        }

        const book = await Book.findById(bookId);

        if (!book || book.status !== 'BORROWED') {
            return res.status(400).json({ message: 'Book not borrowed' });
        }

        // Update book status
        book.status = 'AVAILABLE';
        book.borrowedBy = null;
        await book.save();

        res.status(200).json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ error: 'Error returning book' });
    }
};

// Find the user who borrowed the book
exports.whoBorrowedBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const transaction = await Transaction.findOne({ bookId, action: 'BORROW', returnDate: null });
        if (!transaction) {
            return res.status(404).json({ message: 'Book not borrowed' });
        }

        const user = await User.findById(transaction.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Update Member
exports.updateMember = async (req,res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        const updatedMember = await User.findByIdAndUpdate
        (id, { username}, { new: true });
        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
        res.json(updatedMember);
    }
    catch (error) {
        res.status(400).json({ error: 'Error updating member' });
    }
};


// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
};
