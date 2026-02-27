import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try {
        // created token for 7 days 
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.log(error);
    }
}

export default genToken;