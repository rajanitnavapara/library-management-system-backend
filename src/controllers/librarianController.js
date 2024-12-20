const Book = require('../models/BookModel');
const User = require('../models/UserModel');


// View Books
exports.viewBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
};

// Add Book
exports.addBook = async (req, res) => {
    const { title, author } = req.body;

    const newBook = new Book({ title, author });

    try {
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: 'Error adding book' });
    }
};

// Update Book
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, status, borrowedByUserId } = req.body;
    const borrowedBy = null;
    // if (!status) status = 'AVAILABLE';
   if (borrowedByUserId) {
        borrowedBy = { userId: borrowedByUserId, borrowDate: new Date() };
        status = 'BORROWED';
    }
    try {
        // Update the book in the database
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, status, borrowedBy },
            { new: true }
        );

        // Check if the book was found and updated
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Create a transaction record only if the book is being borrowed
        if (borrowedByUserId) {
            const transaction = new Transaction({
                userId: req.user.id,
                bookId: id,  // Use 'id' from params instead of 'bookId'
                action: 'BORROW'
            });

            await transaction.save();
        }

        // Send the updated book information in the response
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: 'Error updating book' });
    }
};

// View Book
exports.viewBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching book' });
    }
};

// // Issue Book
// exports.issueBook = async (req, res) => {
//     const { bookId, userId } = req.body;

//     try {
//         // Logic to issue book to user
//         // This could involve updating a field in the Book model or another related model

//         // For demonstration purposes:
//         const book = await Book.findById(bookId);
//         if (!book) return res.status(404).json({ message: 'Book not found' });

//         if (book.status !== 'AVAILABLE') {
//             return res.status(400).json({ message: 'Book is not available' });
//         }

//         book.status = 'BORROWED'; // You might have a field for tracking book status
//         await book.save();

//         res.json({ message: 'Book issued successfully', book });
//     } catch (error) {
//         res.status(500).json({ error: 'Error issuing book' });
//     }
// }

// Remove Book
exports.removeBook = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing book' });
    }
};


// Get Fines
exports.getFines = async (req, res) => {
    try {
        // Logic to fetch fines for the user based on their transactions
        const fines = await Transaction.find({ userId: req.user.id, paid: false }); // Example condition
        res.json(fines);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fines' });
    }
};

// View Transactions
exports.viewTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// View Profile
exports.viewProfile = async (req, res) => {
    res.json(req.user);
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { username, password } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Error updating profile' });
    }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Profile deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting profile' });
    }
}


