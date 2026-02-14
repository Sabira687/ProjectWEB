const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({message: 'No token provided'});

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Unauthorized'});
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

exports.isCreator = (req, res, next) => {
    if (req.userRole === 'Creator' || req.userRole === 'Admin') {
        next();
    } else {
        res.status(403).json({message: 'Require Creator Role!'});
    }
};