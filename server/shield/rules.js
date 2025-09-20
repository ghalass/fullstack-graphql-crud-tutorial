// server/shield/rules.js
import { rule } from "graphql-shield";

export const isAuthenticated = rule()(async (_parent, _args, ctx) => {
    return ctx.authUser !== null; // authUser est injecté via le middleware isAuth
});

export const hasRole = (roles = []) =>
    rule()(async (_parent, _args, ctx) => {
        if (!ctx.authUser) return false;
        console.log(ctx.authUser.userType);

        return roles.includes(ctx.authUser.userType);
    });

export const isOwnerOrAdmin = rule()(async (_parent, args, ctx) => {
    if (!ctx.authUser) return false;
    return ctx.authUser.userId === args.id || ["ADMIN", "SUPER_ADMIN"].includes(ctx.authUser.userType);
});
