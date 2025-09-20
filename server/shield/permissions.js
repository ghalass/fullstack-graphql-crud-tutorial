// server/shield/permissions.js
import { shield, and } from "graphql-shield";
import { isAuthenticated, hasRole, isOwnerOrAdmin } from "./rules.js";

export const permissions = shield(
    {
        Query: {
            getUsers: isAuthenticated,
            getUserById: isOwnerOrAdmin,
        },
        Mutation: {
            createUser: hasRole(["ADMIN", "SUPER_ADMIN"]),
            login: () => true, // login est public
        },
    },
    {
        allowExternalErrors: true, // pour que tes erreurs personnalisées s’affichent
    }
);
