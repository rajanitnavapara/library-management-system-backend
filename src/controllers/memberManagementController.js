const User = require('../models/UserModel');

// Add Member
exports.addMember = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new User({ username, password: hashedPassword, role: 'MEMBER' });

    try {
        await newMember.save();
        res.status(201).json({ message: "Member added successfully" });
    } catch (error) {
        res.status(400).json({ error: 'Error adding member' });
    }
};

// Update Member
exports.updateMember = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    try {
        const updatedMember = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
        res.json(updatedMember);
    } catch (error) {
        res.status(400).json({ error: 'Error updating member' });
    }
};

// View Members
exports.viewMembers = async (req, res) => {
    try {
        const members = await User.find({ role: 'MEMBER' });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching members' });
    }
};

// Remove Member
exports.removeMember = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMember = await User.findByIdAndDelete(id);
        if (!deletedMember) return res.status(404).json({ message: 'Member not found' });
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing member' });
    }
};
