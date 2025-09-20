// server/server.js

import dotenv from 'dotenv';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { isAuth } from './middleware/Auth.js';

import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./shield/permissions.js";

import prisma from "./prismaClient.js";
dotenv.config();

// Création du schema avec Shield
const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, permissions);

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const server = new ApolloServer({
    schema: schemaWithMiddleware,
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      let authUser = null;
      try {
        authUser = isAuth(req);
      } catch (err) {
        authUser = null;
      }
      return {
        prisma,
        authUser,
      };
    },
    listen: { port: PORT },
  });

  console.log(`🚀 Server ready at ${url}`);
}

bootstrap().catch((err) => {
  console.error("Erreur serveur:", err);
});