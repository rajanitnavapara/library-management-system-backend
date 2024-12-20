const express = require('express');
const { addMember, updateMember, viewMembers, removeMember } = require('../controllers/memberManagementController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Add Member
router.post('/add', authenticateJWT, addMember);

// Update Member
router.put('/update/:id', authenticateJWT, updateMember);

// View Members
router.get('/', authenticateJWT, viewMembers);

// Remove Member
router.delete('/:id', authenticateJWT, removeMember);

module.exports = router;
