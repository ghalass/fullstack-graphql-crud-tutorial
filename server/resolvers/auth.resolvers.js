// server/resolvers/auth.resolvers.js

import { loginValidator, userValidator } from "../validators.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { hidePassword } from "../utils/hidePassword.js";

export const authResolvers = {
    Query: {
        getUsers: async (_, __, { prisma }) => {
            try {
                const users = await prisma.user.findMany();
                return users.map(u => hidePassword(u));
            } catch (error) {
                throw new Error(error?.message)
            }
        },
        getUserById: async (_, args) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: args.id },
                })
                return hidePassword(user)
            } catch (error) {
                throw new Error(error?.message)
            }
        },
    },
    Mutation: {
        createUser: async (_, { inputs }, { prisma }) => {
            try {
                await userValidator.validate(inputs);
                const emailAleadyUsed = await prisma.user.findFirst({ where: { email: inputs.email } })
                if (emailAleadyUsed) throw new Error("Email déjà utilisé.")
                const hashed = await bcrypt.hash(inputs.password, 10);
                const userData = { ...inputs, password: hashed }
                const createdUser = await prisma.user.create({ data: userData });
                return hidePassword(createdUser)
            } catch (error) {
                throw new Error(error?.message)
            }
        },
        login: async (_, { email, password }) => {
            try {
                await loginValidator.validate({ email, password });
                const userExist = await prisma.user.findFirst({ where: { email: email } })
                if (!userExist) throw new Error("Email ou password incorrect.")
                const match = await bcrypt.compare(password, userExist.password)
                if (!match) throw new Error("Email ou password incorrect.")
                const token = jwt.sign(
                    {
                        userId: userExist.id,
                        email: userExist.email,
                        userType: userExist.userType,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1h" }
                );
                return { userId: userExist.id, token }
            } catch (error) {
                throw new Error(error?.message)
            }
        },
    },
}