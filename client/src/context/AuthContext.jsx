import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for user in sessionStorage on initial load
        const storedUser = sessionStorage.getItem('AppUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user data:', error);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('AppUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('AppUser');
    };

    const updateUser = (userData) => {
        setUser(userData);
        sessionStorage.setItem('AppUser', JSON.stringify(userData));
    };

    const value = {
        user,
        setUser: updateUser,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
