// utils/hidePassword.js
export const hidePassword = (user) => {
    if (!user) return null; // ✅ éviter le crash
    const { password, ...rest } = user;
    return rest;
};