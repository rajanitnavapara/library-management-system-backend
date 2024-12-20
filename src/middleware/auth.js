const jwt = require('jsonwebtoken');

function authMember(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.role !== 'MEMBER') return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authLibrarian(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.role !== 'LIBRARIAN') return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { authenticateJWT, authMember, authLibrarian };
