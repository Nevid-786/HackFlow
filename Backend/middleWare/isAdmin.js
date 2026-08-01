// middlewares/isAdmin.js
// Assumes your auth middleware (whatever verifies the JWT cookie) already
// ran before this and set req.user.

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};