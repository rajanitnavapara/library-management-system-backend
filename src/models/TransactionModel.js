const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    action: { type: String, enum: ['BORROW', 'RETURN'], required: true },
    date: { type: Date, default: Date.now }, // New field for the borrow timestamp
    returnDate: { type: Date } // New field for the return timestamp
});

module.exports = mongoose.model('Transaction', transactionSchema);
