// server/middleware/isAuth.js
import jwt from "jsonwebtoken";

export const isAuth = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Non authentifié !!!");
    }

    const token = authHeader.split(" ")[1]; // format: "Bearer token"
    if (!token || token.trim() === "") {
        throw new Error("Token manquant !");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            throw new Error("Token invalide !");
        }

        // On attache l’utilisateur au contexte
        return { userId: decodedToken.userId, userType: decodedToken.userType };
    } catch (err) {
        throw new Error("Authentification échouée !");
    }
};
