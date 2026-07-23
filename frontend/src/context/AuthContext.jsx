/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on startup
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({
                role: parsedUser.role,
                token: parsedUser.token,
                username: parsedUser.username,
                email: parsedUser.email,
            });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser({ role: userData.role, token: userData.token, username: userData.username, email: userData.email });
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, []);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
