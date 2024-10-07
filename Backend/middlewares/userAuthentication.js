import { verifyToken } from "../services/auth.service.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "user not authenticated",
                success: false,
            });
        }
        const payload = await verifyToken(token);

        if (!payload) {
            return res.status(401).json({
                message: "invalid token",
                success: false,
            });
        }
        req.payload = payload;
        next();
    } catch (error) {
        console.log(error);
    }
};

export default isAuthenticated;
