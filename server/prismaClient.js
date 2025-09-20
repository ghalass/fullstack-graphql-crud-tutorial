// prismaClient.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
    // En production, une seule instance
    prisma = new PrismaClient();
} else {
    // En développement, on utilise une instance globale pour éviter les connexions multiples
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma; // ✅ export ESM
