const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.LOCAL_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define routes (to be created later)
app.get('/api', (req, res) => {
    res.send('Welcome to the Library API!');
})
app.use('/api/auth', require('./routes/auth'));
app.use('/api/librarian', require('./routes/librarian'));
app.use('/api/member', require('./routes/member'));
app.use('/api/fine', require('./routes/fineManagement'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
