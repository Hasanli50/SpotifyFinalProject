//rest operator
const verifyRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Unauthorized!" });
    }
    next();
};

module.exports = verifyRoles;