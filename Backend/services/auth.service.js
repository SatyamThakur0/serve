import jwt from "jsonwebtoken";

export const createToken = (user) => {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
    return token;
};

export const verifyToken = async (token) => {
    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    return payload;
};
