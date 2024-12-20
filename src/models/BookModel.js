const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String, enum: ['AVAILABLE', 'BORROWED'], default: 'AVAILABLE' },
    borrowedBy : {  
        userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        borrowDate : { type: Date },
     }
});

module.exports = mongoose.model('Book', bookSchema);
