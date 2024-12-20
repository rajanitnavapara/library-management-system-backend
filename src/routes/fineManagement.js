const express = require('express');
const { payFine, getFines } = require('../controllers/fineController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Pay Fine
router.post('/pay', authenticateJWT, payFine);

// Get Fines
router.get('/', authenticateJWT, getFines);

module.exports = router;
