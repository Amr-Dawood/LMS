const JWT = require("jsonwebtoken");
const User = require("../models/users.model"); // Import User model
const status_code = require("../utils/httpStatus");

const verify_token = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies); // Debugging
        console.log(req.cookies);
        
        // Get token from cookies or headers
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ status: status_code.Fail_Status, message: "Token is required" });
        }

        // Verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ status: status_code.Fail_Status, message: "Invalid token structure" });
        }

        // Check if user exists
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ status: status_code.Fail_Status, message: "User not found" });
        }

        req.user = user;
        console.log(user);
        
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ status: status_code.Error_Status, message: "Invalid token", error: err.message });
    }
};

module.exports = { verify_token };
