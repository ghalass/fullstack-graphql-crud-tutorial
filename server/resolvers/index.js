import { mergeResolvers } from "@graphql-tools/merge";
import { authResolvers } from "./auth.resolvers.js";

export const resolvers = mergeResolvers([
    authResolvers,
]);