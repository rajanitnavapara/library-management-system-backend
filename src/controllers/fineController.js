const Transaction = require('../models/TransactionModel');

// Pay Fine
exports.payFine = async (req, res) => {
    const { transactionId } = req.body;

    try {
        // Logic to process fine payment based on the transactionId
        // This could involve updating a field in the Transaction model or another related model

        // For demonstration purposes:
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Assume we mark it as paid for this example
        transaction.paid = true; // You might have a field for tracking fine payment
        await transaction.save();

        res.json({ message: 'Fine paid successfully', transaction });
    } catch (error) {
        res.status(500).json({ error: 'Error paying fine' });
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
