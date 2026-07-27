import jwt from "jsonwebtoken"
const VerifyJWT = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ errors: "No access token provided" });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ errors: "Invalid access token" });
        }
        req.user = decoded; // Attach decoded user info to the request object
        next();
    });
}

export default VerifyJWT;